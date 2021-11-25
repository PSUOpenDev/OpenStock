import "./style.scss";

import {
    API_STOCK_QUOTE_KEY,
    API_URL_STOCK_CHART,
} from "./../../Common/APIUtils/Yahoo/ApiParameter";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import AreaChart from "../Charts/AreaChart";
import HeikinAshi from "../Charts/HeikinAshi";
import PropTypes from "prop-types";
import { Spinner } from "react-bootstrap";
import { updateStockHistory } from "../../../actions/stockHistory";
import useAPI from "./../../Common/APIUtils/useAPI";

const convertData = (arr) => {
    if (arr !== null) {
        const result = [];
        const length = arr.length;
        for (let i = 0; i < length; i++) {
            result.push({ ...arr[i], date: new Date(arr[i].date * 1000) });
        }
        return result;
    }
    return null;
};
ChartBoard.propTypes = {
    selectedStock: PropTypes.object.isRequired,
    chartType: PropTypes.string,
    showStockName: PropTypes.bool,
};
ChartBoard.defaultProps = {
    chartType: "AreaChart",
    showStockName: false,
};

function ChartBoard({ selectedStock, showStockName, chartType }) {
    const stockHistory = useSelector((state) => state.stockHistory);
    const dispatch = useDispatch();

    const [isLoading, data, callAPI] = useAPI({
        noRun: "yes",
    });

    useEffect(() => {
        const handleSelecting = ({ apiParameter }) => {
            if (selectedStock.symbol === undefined) {
                return undefined;
            }

            if (stockHistory[selectedStock.symbol] === undefined) {
                apiParameter.queryString =
                    selectedStock.symbol +
                    "?range=max&region=US&interval=1d&lang=en&events=div%2Csplit";
                return null;
            }

            const allKinds = ["1d", "5d", "1mo", "3mo", "6mo", "1y", "5y"];
            let choosePeriod = "";
            for (const period of allKinds) {
                const pastDate = new Date();
                pastDate.setTime(0, 0, 0, 0);

                switch (period) {
                    case "1d":
                        pastDate.setDate(pastDate.getDate() - 1);
                        break;
                    case "5d":
                        pastDate.setDate(pastDate.getDate() - 5);
                        break;
                    case "1mo":
                        pastDate.setMonth(pastDate.getMonth() - 1);
                        break;
                    case "3mo":
                        pastDate.setMonth(pastDate.getMonth() - 3);
                        break;
                    case "6mo":
                        pastDate.setMonth(pastDate.getMonth() - 6);
                        break;
                    case "1y":
                        pastDate.setYear(pastDate.getYear() - 1);
                        break;
                    case "5y":
                        pastDate.setYear(pastDate.getYear() - 5);
                        break;
                    default:
                        break;
                }

                if (pastDate < stockHistory[selectedStock.symbol].lastDate) {
                    choosePeriod = period;
                    break;
                }
            }

            if (choosePeriod !== "") {
                apiParameter.queryString =
                    selectedStock.symbol +
                    "?range=" +
                    choosePeriod +
                    "&region=US&interval=1d&lang=en&events=div%2Csplit";
                return null;
            }

            const returnValue = convertData(stockHistory[selectedStock.symbol]);
            return returnValue;
        };

        const handleParsingAndFiltering = ({ rawData }) => {
            if (rawData !== null) {
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
            dispatch(updateStockHistory(data));
        };

        callAPI({
            url: API_URL_STOCK_CHART,
            queryString: "",
            apiKey: API_STOCK_QUOTE_KEY,
            onParsingAnFiltering: handleParsingAndFiltering,
            onSaving: handleSaving,
            onSelecting: handleSelecting,
        });
    }, [selectedStock, dispatch, callAPI, stockHistory]);

    return (
        <>
            <div className="chart">
                {isLoading && <Spinner animation="border" />}

                {isLoading === false && (
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
