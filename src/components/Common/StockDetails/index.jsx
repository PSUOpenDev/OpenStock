import "./style.scss";

import {
    API_STOCK_QUOTE_KEY,
    API_URI_STOCK_QUOTE,
    API_URL_STOCK_SUMMARY,
} from "./../../Common/APIUtils/Yahoo/ApiParameter";
import React, { useEffect } from "react";
import { Spinner, Tab, Tabs } from "react-bootstrap";
import {
    dateToTimestamp,
    durationInMilliseconds,
    isExpired,
    timestampToDate,
} from "../../../utils/timeStamp";
import { useDispatch, useSelector } from "react-redux";

import PropTypes from "prop-types";
import TreePanelToggle from "../TreePanelToggle";
import { addStockInfo } from "./../../../actions/stockInfo";
import useAPI from "./../../Common/APIUtils/useAPI";

StockDetails.propTypes = {};

function StockDetails({ selectedStock }) {
    const stockInfo = useSelector((state) => state.stockInfo);
    const dispatch = useDispatch();
    const [isLoading, data, callAPI] = useAPI({
        noRun: "yes",
    });

    useEffect(() => {
        const handleParsingAndFiltering = ({ rawData }) => {
            let childKey = 0;

            const convertLabel = (label) => {
                const isUpperCase = (string) => /^[A-Z]*$/.test(string);
                const isDigit = (string) => /^[0-9]*$/.test(string);
                let len = label.length;

                for (let i = 0; i < len; i++) {
                    if (
                        i > 0 &&
                        ((isUpperCase(label.charAt(i)) &&
                            isUpperCase(label.charAt(i - 1)) === false) ||
                            (isDigit(label.charAt(i)) &&
                                isDigit(label.charAt(i - 1)) === false &&
                                isUpperCase(label.charAt(i - 1)) === false))
                    ) {
                        //insert at i
                        label =
                            label.substring(0, i) +
                            " " +
                            label.substring(i, len);
                        len = label.length;
                        i = i + 1;
                    }
                }

                //capitalize the first letter
                len = label.length;
                if (len > 1) {
                    label =
                        label.charAt(0).toUpperCase() + label.substring(1, len);
                }

                return label;
            };

            const convert = (result, rawData) => {
                while (true) {
                    if (Array.isArray(rawData)) {
                        for (const item of rawData) {
                            childKey = childKey + 1;
                            if (item != null)
                                result.nodes.push(
                                    convert(
                                        {
                                            id: childKey,
                                            label: "#",
                                            data: "",
                                            nodes: [],
                                        },
                                        item
                                    )
                                );
                        }
                        break;
                    }

                    if (typeof rawData === "object") {
                        if (rawData["fmt"] !== undefined) {
                            result.data = rawData["fmt"];
                            return result;
                        }
                        const listKey = Object.keys(rawData);
                        const ignoreList = [
                            "maxAge",
                            "language",
                            "region",
                            "triggerable",
                            "currency",
                            "tradeable",
                            "exchange",
                            "messageBoardId",
                            "market",
                            "sourceInterval",
                            "quoteSourceName",
                            "quoteType",
                            "priceHint",
                            "firstTradeDateMilliseconds",
                        ];
                        for (const item of ignoreList) {
                            const result = listKey.indexOf(item);
                            if (result >= 0) listKey.splice(result, 1);
                        }

                        if (listKey.length === 0) {
                            result.data = "N/A";
                            return result;
                        }
                        childKey = childKey + 2;
                        const drawChart = {
                            id: childKey - 1,
                            label: "##drawChart##",
                            data: "##drawChart##",
                            nodes: [
                                {
                                    id: childKey,
                                    label: "Other",
                                    data: 0,
                                    nodes: [],
                                },
                            ],
                        };
                        for (const item of listKey) {
                            if (
                                item === "sharesPercentSharesOut" ||
                                item === "heldPercentInsiders" ||
                                item === "heldPercentInstitutions"
                            ) {
                                childKey = childKey + 1;
                                drawChart.nodes.push(
                                    convert(
                                        {
                                            id: childKey,
                                            label: convertLabel(item),
                                            data: "Share Percentage",
                                            nodes: [],
                                        },
                                        rawData[item]
                                    )
                                );
                                continue;
                            }

                            if (item === "name" && result.label === "#") {
                                result.label = rawData[item];
                            }

                            if (rawData[item] != null) {
                                childKey = childKey + 1;
                                result.nodes.push(
                                    convert(
                                        {
                                            id: childKey,
                                            label: convertLabel(item),
                                            data: "",
                                            nodes: [],
                                        },
                                        rawData[item]
                                    )
                                );
                            }
                        }

                        if (drawChart.nodes.length > 1) {
                            let total = 0;
                            for (const node of drawChart.nodes) {
                                if (node.data !== 0)
                                    node.data = parseFloat(
                                        node.data.slice(0, -1)
                                    );
                                total = total + node.data;
                            }
                            drawChart.nodes[0].data = 100 - total;
                            result.nodes.push(drawChart);
                        }

                        break;
                    }

                    result.data = rawData === null ? "N/A" : rawData;

                    break;
                }

                return result;
            };

            let data;
            if (
                rawData.quoteSummary !== undefined &&
                rawData.quoteSummary.result[0] !== undefined
            )
                data = convert(
                    { id: 0, label: "#", data: "", nodes: [] },
                    rawData.quoteSummary.result[0]
                );
            else
                data = convert(
                    { id: 0, label: "#", data: "", nodes: [] },
                    rawData.quoteResponse.result[0]
                );

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
                console.log(
                    "1=>",
                    selectedStock.symbol,
                    stockInfo.stockInfoDic[selectedStock.symbol]
                );
                if (
                    stockInfo.stockInfoDic[selectedStock.symbol] ===
                        undefined &&
                    data === null
                ) {
                    return null;
                }
                if (
                    stockInfo.stockInfoDic[selectedStock.symbol] !== undefined
                ) {
                    const dataDate = timestampToDate(
                        stockInfo.stockInfoDic[selectedStock.symbol].date
                    );

                    console.log("dataDate = ", dataDate);
                    if (
                        isExpired(
                            dataDate,
                            new Date(),
                            durationInMilliseconds(0, 1, 0, 0)
                        )
                    ) {
                        console.log("expired!!!!");
                        return null;
                    }

                    console.log("return data from cache!!!");
                    return stockInfo.stockInfoDic[selectedStock.symbol]
                        .stockInfo;
                }
                console.log("Still undefined");
            }
            console.log("return from api, data =", data);
            return data;
        };

        const handleError = ({ setData }) => {
            if (stockInfo.stockInfoDic[selectedStock.symbol] !== undefined) {
                setData(stockInfo.stockInfoDic[selectedStock.symbol].stockInfo);
            }
        };
        console.log("selectedStock =", selectedStock);
        if (selectedStock !== null)
            if (selectedStock.symbol === "^DJI") {
                callAPI({
                    url: API_URI_STOCK_QUOTE,
                    queryString: selectedStock.symbol,
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
    console.log(" data[0].label ", data!== null ?  data[0].label:"null" );
    return (
        <div className="stock-details border-radius-20">
            <div className="fs-4 fw-bold text-center clear-yellow ms-5">
                ALL DETAILED INFORMATIONS
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
                    defaultActiveKey={data.length < 7 ? data[0].label : "Home Page"}
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
                        <Tab eventKey="Home Page" title="Home Page">
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
