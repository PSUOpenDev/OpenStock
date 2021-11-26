import "./style.scss";

import {
    API_STOCK_QUOTE_KEY,
    API_URI_STOCK_QUOTE,
    API_URL_STOCK_SUMMARY,
} from "./../../Common/APIUtils/Yahoo/ApiParameter";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import PropTypes from "prop-types";
import { Spinner } from "react-bootstrap";
import TreePanelToggle from "../TreePanelToggle";
import { addStockInfo } from "./../../../actions/stockInfo";
import { dateToTimestamp } from "../../../utils/timeStamp";
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

                let len = label.length;

                for (let i = 0; i < len; i++) {
                    if (isUpperCase(label.charAt(i)) && i > 0) {
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

                        //remove some fields that not need
                        const listKey = Object.keys(rawData);
                        const indexOfMaxAge = listKey.indexOf("maxAge");

                        if (indexOfMaxAge >= 0)
                            listKey.splice(indexOfMaxAge, 1);

                        if (listKey.length === 0) {
                            result.data = ": N/A";
                            return result;
                        }

                        for (const item of listKey) {
                            childKey = childKey + 1;

                            if (item === "name" && result.label === "#") {
                                result.label = rawData[item];
                            }

                            if (rawData[item] != null) {
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
                        break;
                    }

                    result.data =
                        rawData === null || rawData === "null"
                            ? "N/A"
                            : rawData;

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
                if (
                    stockInfo.stockInfoDic[selectedStock.symbol] ===
                        undefined &&
                    data === null
                ) {
                    return null;
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
                        "?lang=en&region=US&modules=defaultKeyStatistics%2CassetProfile",
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
                ALL DETAILED INFORMATIONS
                <span className="ms-2 pb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" 
                        width="30" 
                        height="30" 
                        fill="currentColor" 
                        className="bi bi-caret-down-fill" 
                        viewBox="0 0 16 16"
                    >
                        <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                    </svg>
                </span>
            </div>
            {isLoading && <Spinner animation="border" />}
            {isLoading === false &&
                Array.isArray(data) &&
                data.map((item) => (
                    <TreePanelToggle key={item.id} {...item}></TreePanelToggle>
                ))}
        </div>
    );
}

StockDetails.propTypes = {
    selectedStock: PropTypes.object,
};

export default StockDetails;
