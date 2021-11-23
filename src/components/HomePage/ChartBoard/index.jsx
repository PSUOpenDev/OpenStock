import React, { useState, useEffect } from "react";
import HeikinAshi from "./../../common/OurStockChart";
import { useSelector, useDispatch } from "react-redux";
import { updateStockHistory } from "../../../actions/stockHistory";
import {
    API_STOCK_QUOTE_KEY,
    API_URL_STOCK_CHART,
} from "../../common/APIUtils/Yahoo/ApiParameter";
import axios from "axios";
import PropTypes from "prop-types";
import "./style.scss";
const convertData = (arr) => {
    if (arr !== null) {
        const result = [];
        const length = arr.length;
        for (let i = 0; i < length; i++) {
            result.push({ ...arr[i], date: new Date(arr[i].date * 1000) });
        }
        console.log("result =", result);
        return result;
    }
    return null;
};
ChartBoard.propTypes = {
    selectedStock: PropTypes.object.isRequired,
};

function ChartBoard({ selectedStock }) {
    const stockHistory = useSelector((state) => state.stockHistory);
    const [data, setData] = useState(null);
    const dispatch = useDispatch();

    const fetchAPI = async (URL, API_STOCK_CONFIG, symbol, period) => {
        console.log("period", period);
        const URL_PARSED = encodeURI(
            URL +
                symbol +
                "?range=" +
                period +
                "&region=US&interval=1d&lang=en&events=div%2Csplit"
        );
        axios
            .get(URL_PARSED, API_STOCK_CONFIG)
            .then((res) => {
                if (res.result !== null) {
                    console.log(
                        "res.data.chart.result[0] ",
                        res.data.chart.result[0]
                    );
                    const timeStamp = res.data.chart.result[0].timestamp;
                    console.log("timeStamp", timeStamp);
                    const theQuote =
                        res.data.chart.result[0].indicators.quote[0];
                    console.log("theQuote", theQuote);
                    const high = theQuote.high;
                    console.log("high", high);
                    const low = theQuote.low;
                    console.log("low", low);
                    const open = theQuote.open;
                    console.log("open", open);
                    const volume = theQuote.volume;
                    console.log("volume", volume);
                    const close = theQuote.close;
                    console.log("close", close);
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
                    console.log("result =", result);
                    const payLoad = {
                        symbol: selectedStock.symbol,
                        history: result,
                        firstDate,
                        lastDate,
                    };
                    dispatch(updateStockHistory(payLoad));
                    setData(convertData(stockHistory[selectedStock.symbol]));
                }
            })
            .catch((error) => {
                console.log("Error: ", error);
            });
    };

    useEffect(() => {
        setData(null);

        if (selectedStock.symbol !== undefined) {
            if (stockHistory[selectedStock.symbol] === undefined) {
                console.log("Stock data does not existed yet!");
                fetchAPI(
                    API_URL_STOCK_CHART,
                    {
                        method: "GET",
                        headers: {
                            accept: "application/json",
                            "X-API-KEY": API_STOCK_QUOTE_KEY,
                        },
                    },
                    selectedStock.symbol,
                    "max"
                );
            } else {
                console.log("Stock data  existed yet!");
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

                    if (
                        pastDate < stockHistory[selectedStock.symbol].lastDate
                    ) {
                        choosePeriod = period;
                        break;
                    }
                }
                if (choosePeriod !== "") {
                    fetchAPI(
                        API_URL_STOCK_CHART,
                        {
                            method: "GET",
                            headers: {
                                accept: "application/json",
                                "X-API-KEY": API_STOCK_QUOTE_KEY,
                            },
                        },
                        selectedStock.symbol,
                        choosePeriod
                    );
                } else {
                    console.log("No need to call API");
                    setData(convertData(stockHistory[selectedStock.symbol]));
                }
            }
        }
    }, [selectedStock]);

    return (
        <>
            <div className="chart">
                {data === null ? (
                    <div>Loading...</div>
                ) : (
                    <div>
                        selectedStock && (
                        <h6>
                            {" "}
                            {selectedStock.stockName +
                                " (" +
                                selectedStock.symbol +
                                ")"}
                        </h6>
                        )
                        <div>
                            <HeikinAshi data={data} />
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default ChartBoard;
