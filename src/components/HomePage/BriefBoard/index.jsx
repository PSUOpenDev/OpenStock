import "./style.scss";

import {
    API_URL_MARKET_SUMMARY,
    TIME_TO_REFRESH_INDEXES,
} from "./../../Common/APIUtils/Yahoo/ApiParameter";
import { Col, Container, Row } from "react-bootstrap";
import React, { useEffect } from "react";
import {
    dateToTimestamp,
    isExpired,
    timestampToDate,
} from "../../../utils/timeStamp";
import { useDispatch, useSelector } from "react-redux";

import PriceCard from "../../Common/PriceCard";
import apiKeyProvider from "./../../Common/APIUtils/apiKeyProvider";
import { updateStockIndex } from "./../../../actions/stockIndex";
import useAPI from "./../../Common/APIUtils/useAPI";

function BriefBoard() {
    const stockIndex = useSelector((state) => state.stockIndex);
    const dispatch = useDispatch();
    const [isLoading, data, callAPI] = useAPI({
        noRun: "yes",
    });
    useEffect(() => {
        const handleParsingAndFiltering = ({ rawData }) => {
            const currentTimeStamp = dateToTimestamp(new Date());
            stockIndex.allAllIndexes.splice(0, stockIndex.allAllIndexes.length);
            stockIndex.indexDic = Object.keys(stockIndex.indexDic).map(
                (key) => delete stockIndex.indexDic[key]
            );
            let count = 0;

            for (const item of rawData.marketSummaryResponse.result) {
                count = count + 1;

                if (item.symbol !== undefined) {
                    const index = {
                        shortName: item.shortName,
                        currentValue: item.regularMarketPrice.raw,
                        currentValueChange: item.regularMarketChange.raw,
                        currentValueChangePercent:
                            item.regularMarketChangePercent.raw,
                        apiTime: currentTimeStamp,
                        symbol: item.symbol,
                    };
                    stockIndex.indexDic[item.symbol] = index;
                    stockIndex.allAllIndexes.push(index);
                }
                if (count === 6) break;
            }

            return stockIndex.allAllIndexes;
        };

        const handleSelecting = () => {
            const currentTime = new Date();

            for (let item of stockIndex.allAllIndexes) {
                if (
                    isExpired(
                        timestampToDate(item.apiTime),
                        currentTime,
                        TIME_TO_REFRESH_INDEXES
                    )
                ) {
                    return null;
                }
            }

            return stockIndex.allAllIndexes;
        };

        const handleSaving = ({ data }) => {
            dispatch(updateStockIndex(data));
            return stockIndex.allAllIndexes;
        };

        const handleError = ({ setData, error }) => {
            console.log("error=", error);
            setData(stockIndex.allAllIndexes);
        };

        callAPI({
            url: API_URL_MARKET_SUMMARY,
            queryString: "",
            apiKey: apiKeyProvider("YahooAPI"),
            onParsingAnFiltering: handleParsingAndFiltering,
            onSaving: handleSaving,
            onSelecting: handleSelecting,
            onError: handleError,
        });
    }, [callAPI, dispatch, stockIndex.allAllIndexes, stockIndex.indexDic]);

    return (
        <></>
    );
}

export default BriefBoard;
