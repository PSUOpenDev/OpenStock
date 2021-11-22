import React, { useState, useEffect } from "react";
import HeikinAshi from "./../../Common/OurStockChart";
import { TypeChooser } from "react-stockcharts/lib/helper";
import { useSelector, useDispatch } from "react-redux";
import { updateStockHistory } from "../../../actions/stockHistory";
import {
    API_STOCK_QUOTE_KEY,
    API_URL_STOCK_CHART,
} from "../../Common/APIUtils/Yahoo/ApiParameter";
import axios from "axios";

function ChartBoard(props) {
    const selectedStock = useSelector((state) => state.selectedStock);
    const stockHistory = useSelector((state) => state.stockHistory);
    const [data, setData] = useState(null);
    
    const dispatch = useDispatch();
    const fetchAPI = async (
        URL,
        API_STOCK_CONFIG,
        symbol,
        period,
        callBack
    ) => {
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
                            date: new Date(timeStamp[i]*1000),
                            open: open[i],
                            close: close[i],
                            volume: volume[i],
                            high: high[i],
                            low: low[i],
                        });
                    }
                    console.log("result =", result);
                    callBack({ lastDate, firstDate, history: result });
                }
            })
            .catch((error) => {
                console.log("Error: ", error);
            });
    };
    const callBack1 = (stockHistoryData) => {
        console.log("data", stockHistoryData);
        const payLoad = {
            symbol: selectedStock.symbol,
            history: stockHistoryData,
        };
        dispatch(updateStockHistory(payLoad));
        setData(stockHistoryData.history);
    };

    useEffect(() => {
        setData(null)
        if (selectedStock !== null) {
            if (stockHistory[selectedStock.symbol] === undefined) {
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
                    "5y",
                    callBack1
                );
            } else {
                const allKinds = ["1d", "5d", "1mo", "3mo", "6mo", "1y", "5y"];
                let choosePeriod = "1d";
                for (const period of allKinds) {
                    const currentDate = new Date();
                    currentDate.setTime(0, 0, 0, 0);

                    switch (period) {
                        case "1d":
                            currentDate.setDate(currentDate.getDate() - 1);
                            break;
                        case "5d":
                            currentDate.setDate(currentDate.getDate() - 5);
                            break;
                        case "1mo":
                            currentDate.setMonth(currentDate.getMonth() - 1);

                            break;
                        case "3mo":
                            currentDate.setMonth(currentDate.getMonth() - 3);
                            break;
                        case "6mo":
                            currentDate.setMonth(currentDate.getMonth() - 6);
                            break;
                        case "1y":
                            currentDate.setYear(currentDate.getYear() - 1);
                            break;
                        case "5y":
                            currentDate.setYear(currentDate.getYear() - 5);
                            break;
                        default:
                            break;
                    }

                    if (
                        currentDate <
                        stockHistory[selectedStock.symbol].lastDate
                    ) {
                        choosePeriod = period;
                        break;
                    }
                }
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
                    choosePeriod,
                    callBack1
                );
            }
        }
    }, [selectedStock]);

    return (
        <>
            {data === null ? (
                <div>Loading...</div>
            ) : (
                <TypeChooser>
                    {(type) => <HeikinAshi type={type} data={data} />}
                </TypeChooser>
            )}
        </>
    );
}

export default ChartBoard;
