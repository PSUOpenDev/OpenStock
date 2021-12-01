import "./style.scss";

import {
    API_STOCK_QUOTE_KEY,
    API_URL_STOCK_CHART,
    TIME_TO_REFRESH_CHART_IN_CALL,
    TIME_TO_REFRESH_CHART_OVER_DATE,
} from "./../../Common/APIUtils/Yahoo/ApiParameter";
import { Button, ButtonGroup, ButtonToolbar, Spinner } from "react-bootstrap";
import React, { useEffect, useRef, useState } from "react";
import {
    getDateOfDurationString,
    getStringOfDurationFromCurrentTo,
    isExpired,
    timestampToDate,
} from "./../../../utils/timeStamp";
import { useDispatch, useSelector } from "react-redux";

import AreaChart from "../Charts/AreaChart";
import HeikinAshi from "../Charts/HeikinAshi";
import PropTypes from "prop-types";
import { convertData } from "./../../../utils/formatData";
import { updateStockHistory } from "../../../actions/stockHistory";
import { updateStockHistoryInMinute } from "../../../actions/stockHistoryInMinute";
import useAPI from "./../../Common/APIUtils/useAPI";

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
    const stockHistoryInMinute = useSelector(
        (state) => state.stockHistoryInMinute
    );
    const dispatch = useDispatch();

    const [isLoading, data, callAPI] = useAPI({
        noRun: "yes",
    });

    useEffect(() => {
        const handleSelecting = ({ apiParameter, data }) => {
            if (selectedStock !== null && selectedStock.symbol !== undefined) {
                let cache;
                let choosePeriod = "";
                let chooseInterval = "";
                let timeRefresh = 0;

                if (range === "1d") {
                    choosePeriod = "1d";
                    chooseInterval = "1m";
                    cache = stockHistoryInMinute[selectedStock.symbol];
                    timeRefresh = TIME_TO_REFRESH_CHART_OVER_DATE;
                } else {
                    choosePeriod = "10y";
                    chooseInterval = "1d";
                    cache = stockHistory[selectedStock.symbol];
                    timeRefresh = TIME_TO_REFRESH_CHART_IN_CALL;
                }

                if (data === null) {
                    if (cache === undefined) {
                        apiParameter.queryString =
                            selectedStock.symbol +
                            "?range=" +
                            choosePeriod +
                            "&region=US&interval=" +
                            chooseInterval +
                            "&lang=en&events=div%2Csplit";
                        console.log("call api in chartboard");
                        return null;
                    }
                    const lastDate = timestampToDate(cache.lastDate);
                    if (isExpired(lastDate, new Date(), timeRefresh)) {
                        if (range !== "1d")
                            choosePeriod = getStringOfDurationFromCurrentTo(
                                cache.lastDate
                            );
                      
                        if (choosePeriod !== "") {
                            apiParameter.queryString =
                                selectedStock.symbol +
                                "?range=" +
                                choosePeriod +
                                "&region=US&interval=" +
                                chooseInterval +
                                "&lang=en&events=div%2Csplit";
                            console.log("call api in chartboard");
                            return null;
                        } else {
                            const returnValue = convertData(
                                cache,
                                getDateOfDurationString(range)
                            );

                            return returnValue;
                        }
                    }
                }

                const returnValue = convertData(
                    cache,
                    getDateOfDurationString(range)
                );

                return returnValue;
            }

            //Return undefine means it will not get from API
            // and will not get from cache
            return undefined;
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
            if (selectedStock === null) {
                return null;
            }

            const caching = stockHistoryInMinute[selectedStock.symbol];
            if (caching === undefined) {
                return null;
            }

            if (range === "1d") {
                setData(
                    convertData(
                        stockHistoryInMinute[selectedStock.symbol],
                        null
                    )
                );
            } else {
                const fromDate = getDateOfDurationString(range);
                setData(
                    convertData(stockHistory[selectedStock.symbol], fromDate)
                );
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
    }, [selectedStock, range]);

    return (
        <>
            <div
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
                                <div>
                                    <ButtonToolbar
                                        variant="outline-primary"
                                        size={"sm"}
                                    >
                                        <ButtonGroup size={"sm"}>
                                            <Button
                                                variant="secondary"
                                                onClick={() => {
                                                    setRange("1d");
                                                }}
                                            >
                                                1d
                                            </Button>{" "}
                                            <Button
                                                variant="secondary"
                                                onClick={() => {
                                                    setRange("1mo");
                                                }}
                                            >
                                                1mo
                                            </Button>{" "}
                                            <Button
                                                variant="secondary"
                                                onClick={() => {
                                                    setRange("3mo");
                                                }}
                                            >
                                                3mo
                                            </Button>{" "}
                                            <Button
                                                variant="secondary"
                                                onClick={() => {
                                                    setRange("6mo");
                                                }}
                                            >
                                                6mo
                                            </Button>{" "}
                                            <Button
                                                variant="secondary"
                                                onClick={() => {
                                                    setRange("1y");
                                                }}
                                            >
                                                1y
                                            </Button>{" "}
                                            <Button
                                                variant="secondary"
                                                onClick={() => {
                                                    setRange("5y");
                                                }}
                                            >
                                                5y
                                            </Button>{" "}
                                            <Button
                                                variant="secondary"
                                                onClick={() => {
                                                    setRange("10y");
                                                }}
                                            >
                                                10y
                                            </Button>{" "}
                                        </ButtonGroup>{" "}
                                    </ButtonToolbar>
                                    <HeikinAshi data={data} range={range} />
                                </div>
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
