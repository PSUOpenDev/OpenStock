import "./style.scss";

import {
    API_STOCK_QUOTE_KEY,
    API_URL_STOCK_CHART,
} from "./../../Common/APIUtils/Yahoo/ApiParameter";
import React, { useEffect, useRef, useState } from "react";
import {
    getDateOfDurationString,
    getStringOfDurationFromCurrentTo,
} from "./../../../utils/timeStamp";
import { useDispatch, useSelector } from "react-redux";

import AreaChart from "../Charts/AreaChart";
import HeikinAshi from "../Charts/HeikinAshi";
import PropTypes from "prop-types";
import { Spinner } from "react-bootstrap";
import { updateStockHistory } from "../../../actions/stockHistory";
import { updateStockHistoryInMinute } from "../../../actions/stockHistoryInMinute";
import useAPI from "./../../Common/APIUtils/useAPI";

const convertData = (arr, fromDate) => {
    if (arr !== null) {
        const result = [];
        const length = arr.length;
        for (let i = 0; i < length; i++) {
            if (
                arr[i].close !== null &&
                arr[i].date !== null &&
                arr[i].open !== null &&
                arr[i].high !== null &&
                arr[i].low !== null &&
                arr[i].volume !== null
            ) {
                const newDate = new Date(arr[i].date * 1000);

                if (fromDate !== null && newDate < fromDate) continue;
                result.push({
                    close: arr[i].close,
                    open: arr[i].open,
                    high: arr[i].high,
                    low: arr[i].low,
                    volume: arr[i].volume,
                    date: newDate,
                });
            }
        }
        return result;
    }
    return null;
};
ChartBoard.propTypes = {
    selectedStock: PropTypes.object.isRequired,
    chartType: PropTypes.string,
    showStockName: PropTypes.bool,
    dataRange: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
};
ChartBoard.defaultProps = {
    chartType: "AreaChart",
    showStockName: false,
    dataRange: "1d",
};

function ChartBoard({
    selectedStock,
    showStockName,
    chartType,
    dataRange,
    width,
    height,
}) {
    const [range, setRange] = useState(dataRange);
    const stockHistory = useSelector((state) => state.stockHistory);
    const chartRef = useRef(null);
    const stockHistoryInMinute = useSelector(
        (state) => state.stockHistoryInMinute
    );
    const dispatch = useDispatch();

    const [isLoading, data, callAPI] = useAPI({
        noRun: "yes",
    });

    useEffect(() => {
        const handleSelecting = ({ apiParameter, data }) => {
            let choosePeriod;
            let chooseInterval;

            if (selectedStock.symbol === undefined) {
                return undefined;
            }
            console.log("selected stock",selectedStock.symbol);
            if (range === "1d") {
                choosePeriod = "1d";
                chooseInterval = "1m";
            } else {
                choosePeriod = "5y";
                chooseInterval = "1d";
            }
            if (
                (range !== "1d" &&
                    stockHistory[selectedStock.symbol] === undefined) ||
                (range === "1d" && data === null)
            ) {
                apiParameter.queryString =
                    selectedStock.symbol +
                    "?range=" +
                    choosePeriod +
                    "&region=US&interval=" +
                    chooseInterval +
                    "&lang=en&events=div%2Csplit";
                return null;
            }

            if (range !== "1d") {
                choosePeriod = getStringOfDurationFromCurrentTo(
                    stockHistory[selectedStock.symbol].lastDate
                );
                chooseInterval = "1d";
            }

            if (range !== "1d" && choosePeriod !== "") {
                apiParameter.queryString =
                    selectedStock.symbol +
                    "?range=" +
                    choosePeriod +
                    "&region=US&interval=" +
                    chooseInterval +
                    "&lang=en&events=div%2Csplit";
                return null;
            }
            let returnValue;

            if (range !== "1d") {
                const fromDate = getDateOfDurationString(range);

                returnValue = convertData(
                    stockHistory[selectedStock.symbol],
                    fromDate
                );
            } else {
                returnValue = convertData(
                    stockHistoryInMinute[selectedStock.symbol],
                    null
                );
            }
            console.log("returnValue=", returnValue);
            return returnValue;
        };

        const handleParsingAndFiltering = ({ rawData }) => {
            if (rawData !== null) {
                const symbol = rawData.chart.result[0].meta.symbol;
                const timeStamp = rawData.chart.result[0].timestamp;
                const theQuote = rawData.chart.result[0].indicators.quote[0];
                const high = theQuote.high;
                const low = theQuote.low;
                const open = theQuote.open;
                const volume = theQuote.volume;
                const close = theQuote.close;
                const length = timeStamp.length;
                const firstDate = timeStamp[0];
                const lastDate = timeStamp[length - 1];
                const result = [];

                for (let i = 0; i < length; i++) {
                    result.push({
                        symbol,
                        date: timeStamp[i],
                        open: open[i],
                        close: close[i],
                        volume: volume[i],
                        high: high[i],
                        low: low[i],
                    });
                }
                console.log("result = ", result);
                return {
                    symbol: selectedStock.symbol,
                    history: result,
                    firstDate,
                    lastDate,
                };
            }
            return null;
        };

        const handleSaving = ({ data }) => {
            if (range === "1d") dispatch(updateStockHistoryInMinute(data));
            else dispatch(updateStockHistory(data));
        };

        const handleError = ({ setData }) => {
            if (range === "1d") {
                if (
                    selectedStock !== null &&
                    stockHistoryInMinute[selectedStock.symbol] !== undefined
                )
                    setData(
                        convertData(
                            stockHistoryInMinute[selectedStock.symbol],
                            null
                        )
                    );
            } else {
                if (
                    selectedStock !== null &&
                    stockHistoryInMinute[selectedStock.symbol] !== undefined
                ) {
                    const fromDate = getDateOfDurationString(range);
                    setData(
                        convertData(
                            stockHistory[selectedStock.symbol],
                            fromDate
                        )
                    );
                }
            }
        };

        callAPI({
            url: API_URL_STOCK_CHART,
            queryString: "",
            apiKey: API_STOCK_QUOTE_KEY,
            onParsingAnFiltering: handleParsingAndFiltering,
            onSaving: handleSaving,
            onSelecting: handleSelecting,
            onError: handleError,
        });
    }, [selectedStock, dispatch, callAPI, stockHistory]);

    return (
        <>
            <div
                ref={chartRef}
                style={width !== null ? { width, height } : null}
                className="chart border-radius-20"
            >
                {isLoading && <Spinner animation="border" />}

                {isLoading === false && data != null && (
                    <div>
                        {selectedStock && showStockName && (
                            <h6>
                                {" "}
                                {selectedStock.stockName +
                                    " (" +
                                    selectedStock.symbol +
                                    ")"}
                            </h6>
                        )}
                        <div>
                            {chartType === "HeikinAshi" && (
                                <HeikinAshi data={data} />
                            )}
                            {chartType === "AreaChart" && (
                                <AreaChart data={data} />
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default ChartBoard;
