import "./style.scss";

import {
    API_STOCK_QUOTE_KEY,
    API_URL_MARKET_SUMMARY,
    API_URL_STOCK_SUMMARY,
    TIME_TO_REFRESH_STOCK_DETAILS,
} from "./../../Common/APIUtils/Yahoo/ApiParameter";
import React, { useEffect } from "react";
import { Spinner, Tab, Tabs } from "react-bootstrap";
import {
    dateToTimestamp,
    isExpired,
    timestampToDate,
} from "../../../utils/timeStamp";
import { useDispatch, useSelector } from "react-redux";

import PropTypes from "prop-types";
import TreePanelToggle from "../TreePanelToggle";
import { addStockInfo } from "./../../../actions/stockInfo";
import { convertJSONtoNodes } from "../../../utils/formatData";
import useAPI from "./../../Common/APIUtils/useAPI";

StockDetails.propTypes = {
    selectedStock: PropTypes.object,
};

function StockDetails({ selectedStock }) {
    const stockInfo = useSelector((state) => state.stockInfo);
    const dispatch = useDispatch();
    const [isLoading, data, callAPI] = useAPI({
        noRun: "yes",
    });

    useEffect(() => {
        //Parse data and filter data
        const handleParsingAndFiltering = ({ rawData }) => {
            let data;
            while (true) {
                if (
                    rawData.quoteSummary !== undefined &&
                    rawData.quoteSummary.result[0] !== undefined
                ) {
                    data = convertJSONtoNodes(
                        { id: 0, label: "#", data: "", nodes: [] },
                        rawData.quoteSummary.result[0]
                    );
                    break;
                }

                if (
                    rawData.quoteResponse !== undefined &&
                    rawData.quoteResponse.result[0] !== undefined
                ) {
                    data = convertJSONtoNodes(
                        { id: 0, label: "#", data: "", nodes: [] },
                        rawData.quoteResponse.result[0]
                    );
                    break;
                }

                if (
                    rawData.marketSummaryResponse !== undefined &&
                    rawData.marketSummaryResponse.result[0] !== undefined
                ) {
                    data = convertJSONtoNodes(
                        { id: 0, label: "#", data: "", nodes: [] },
                        rawData.marketSummaryResponse.result
                    );
                    break;
                }
                break;
            }

            return data.nodes;
        };

        const handleSaving = ({ data }) => {
            const saveData = {
                symbol: selectedStock.symbol,
                date: dateToTimestamp(new Date()),
                stockInfo: data,
            };
            dispatch(addStockInfo(saveData));
        };

        const handleSelecting = ({ data }) => {
            if (selectedStock.symbol !== undefined) {
                const cachingData =
                    stockInfo.stockInfoDic[selectedStock.symbol];
                if (cachingData === undefined && data === null) {
                    console.log("call api in stock detail");
                    return null;
                }
                if (cachingData !== undefined) {
                    const dataDate = timestampToDate(cachingData.date);

                    if (
                        isExpired(
                            dataDate,
                            new Date(),
                            TIME_TO_REFRESH_STOCK_DETAILS
                        )
                    ) {
                        if (data === null) {
                            console.log("call api in stock detail");
                            return null;
                        } else return data;
                    }

                    return cachingData.stockInfo;
                }
            }
            return data;
        };

        const handleError = ({ setData }) => {
            if (stockInfo.stockInfoDic[selectedStock.symbol] !== undefined) {
                setData(stockInfo.stockInfoDic[selectedStock.symbol].stockInfo);
            }
        };

        if (selectedStock !== null)
            if (selectedStock.symbol === "^DJI") {
                callAPI({
                    url: API_URL_MARKET_SUMMARY,
                    queryString: "",
                    apiKey: API_STOCK_QUOTE_KEY,
                    onParsingAnFiltering: handleParsingAndFiltering,
                    onSaving: handleSaving,
                    onSelecting: handleSelecting,
                    onError: handleError,
                });
            } else {
                callAPI({
                    url: API_URL_STOCK_SUMMARY,
                    queryString:
                        selectedStock.symbol +
                        "?lang=en&region=US&modules=summaryDetail%2CdefaultKeyStatistics%2CassetProfile%2Cprice%2Cearnings%2CcalendarEvents",
                    apiKey: API_STOCK_QUOTE_KEY,
                    onParsingAnFiltering: handleParsingAndFiltering,
                    onSaving: handleSaving,
                    onSelecting: handleSelecting,
                    onError: handleError,
                });
            }
    }, [selectedStock]);
    return (
        <div className="stock-details border-radius-20">
            <div className="fs-4 fw-bold text-center clear-yellow ms-5">
                ALL DETAILED INFORMATION
                <span className="ms-2 pb-1">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="30"
                        height="30"
                        fill="currentColor"
                        className="bi bi-caret-down-fill"
                        viewBox="0 0 16 16"
                    >
                        <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
                    </svg>
                </span>
            </div>
            {isLoading && <Spinner animation="border" />}
            {isLoading === false && Array.isArray(data) && (
                <Tabs
                    defaultActiveKey={
                        data.length < 7 ? data[0].label : "General Information"
                    }
                    id="information-tab"
                    className="mb-3"
                >
                    {data.length < 7 ? (
                        data.map((item) => {
                            return (
                                <Tab
                                    key={item.id}
                                    eventKey={item.label}
                                    title={item.label}
                                >
                                    <TreePanelToggle
                                        tab="true"
                                        {...item}
                                    ></TreePanelToggle>
                                </Tab>
                            );
                        })
                    ) : (
                        <Tab
                            eventKey="General Information"
                            title="General Information"
                        >
                            {data.map((item) => (
                                <TreePanelToggle
                                    key={item.id}
                                    tab="false"
                                    {...item}
                                ></TreePanelToggle>
                            ))}
                        </Tab>
                    )}
                </Tabs>
            )}
        </div>
    );
}

StockDetails.propTypes = {
    selectedStock: PropTypes.object,
};

export default StockDetails;
