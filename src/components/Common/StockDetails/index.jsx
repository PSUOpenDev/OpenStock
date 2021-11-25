import React, { useEffect } from "react";
import PropTypes from "prop-types";
import "./style.scss";
import useAPI from "./../../Common/APIUtils/useAPI";
import {
    API_STOCK_QUOTE_KEY,
    API_URL_STOCK_SUMMARY,
    API_URI_STOCK_QUOTE,
} from "./../../Common/APIUtils/Yahoo/ApiParameter";
import TreePanelToggle from "../TreePanelToggle";
import { useSelector, useDispatch } from "react-redux";
import { addStockInfo } from "./../../../actions/stockInfo";
import { dateToTimestamp } from "./../../Common/utils";
import { Spinner } from "react-bootstrap";

StockDetails.propTypes = {};

function StockDetails({ selectedStock }) {
    const stockInfo = useSelector((state) => state.stockInfo);
    const dispatch = useDispatch();
    const [isLoading, data, setApiParam] = useAPI({
        noRun: "yes",
    });

    useEffect(() => {
        const handleParsingAndFiltering = (rawData) => {
            console.log("handle parsing , rawData", rawData);
            const convertLabel = (label) => {
                const isUpperCase = (string) => /^[A-Z]*$/.test(string);

                let len = label.length;

                for (let i = 0; i < len; i++) {
                    if (isUpperCase(label.charAt(i)) && i > 0) {
                        label =
                            label.substring(0, i) +
                            " " +
                            label.substring(i, len);
                        len = label.length;
                        i = i + 1;
                        //console.log(label);
                    }
                }
                len = label.length;
                if (len > 1) {
                    label =
                        label.charAt(0).toUpperCase() + label.substring(1, len);
                }

                return label;
            };
            let childKey = 0;
            const convert = (result, rawData) => {
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
                } else {
                    if (typeof rawData === "object") {
                        if (rawData["fmt"] !== undefined) {
                            result.data = rawData["fmt"];
                            return result;
                        } else {
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
                                    // console.log(item);
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
                        }
                    } else {
                        result.data =
                            rawData === null || rawData === "null"
                                ? "N/A"
                                : rawData;
                    }
                }
                console.log("result of convert = ", result);
                return result;
            };
            let data;
            if ( rawData.quoteSummary !==undefined && rawData.quoteSummary.result[0] !== undefined)
                data = convert(
                    { id: 0, label: "#", data: "", nodes: [] },
                    rawData.quoteSummary.result[0]
                );
            else
                data = convert(
                    { id: 0, label: "#", data: "", nodes: [] },
                    rawData.quoteResponse.result[0]
                );
            console.log("After parse raw data =", data);

            return data.nodes;
        };

        const handleSaving = (dataFound) => {
            const saveData = {
                symbol: selectedStock.symbol,
                date: dateToTimestamp(new Date()),
                stockInfo: dataFound,
            };
            dispatch(addStockInfo(saveData));
        };

        const handleSelecting = (param, data) => {
            if (selectedStock.symbol !== undefined) {
                console.log(" stockInfo.stockInfoDic", stockInfo.stockInfoDic);
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
        console.log("THe selected stocks is ", selectedStock);

        if (selectedStock !== null)
            if (selectedStock.symbol === "^DJI") {
                setApiParam({
                    url: API_URI_STOCK_QUOTE,
                    queryString: selectedStock.symbol,
                    apiKey: API_STOCK_QUOTE_KEY,
                    onParsingAnFiltering: handleParsingAndFiltering,
                    onSaving: handleSaving,
                    onSelecting: handleSelecting,
                });
            } else {
                setApiParam({
                    url: API_URL_STOCK_SUMMARY,
                    queryString:
                        selectedStock.symbol +
                        "?lang=en&region=US&modules=defaultKeyStatistics%2CassetProfile",
                    apiKey: API_STOCK_QUOTE_KEY,
                    onParsingAnFiltering: handleParsingAndFiltering,
                    onSaving: handleSaving,
                    onSelecting: handleSelecting,
                });
            }
    }, [selectedStock]);

    return (
        <div className="stock-details">
            {data === null && <Spinner animation="border" />}
            {data !== null &&
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
