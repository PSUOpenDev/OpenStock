import "./style.scss";

import {
    API_STOCK_QUOTE_KEY,
    API_URL_MARKET_SUMMARY,
} from "./../../Common/APIUtils/Yahoo/ApiParameter";
import React, { useEffect } from "react";
import {
    dateToTimestamp,
    durationInMilliseconds,
    isExpired,
    timestampToDate,
} from "../../../utils/timeStamp";
import { useDispatch, useSelector } from "react-redux";

import { CardGroup } from "react-bootstrap";
import PriceCard from "../../Common/PriceCard";
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
            for (const item of rawData.marketSummaryResponse.result) {
                if (item.symbol !== undefined) {
                    if (stockIndex.indexDic[item.symbol] !== undefined) {
                        stockIndex.indexDic[item.symbol].currentValue =
                            item.regularMarketPrice.raw;
                        stockIndex.indexDic[item.symbol].currentValueChange =
                            item.regularMarketChange.raw;
                        stockIndex.indexDic[
                            item.symbol
                        ].currentValueChangePercent =
                            item.regularMarketChangePercent.raw;
                        stockIndex.indexDic[item.symbol].apiTime =
                            currentTimeStamp;
                    }
                }
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
                        durationInMilliseconds(0, 1, 0, 0, 0)
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

        const handleError = ({ setData }) => {
            setData(stockIndex.allAllIndexes);
        };

        callAPI({
            url: API_URL_MARKET_SUMMARY,
            queryString: "",
            apiKey: API_STOCK_QUOTE_KEY,
            onParsingAnFiltering: handleParsingAndFiltering,
            onSaving: handleSaving,
            onSelecting: handleSelecting,
            onError: handleError,
        });
    }, [dispatch, callAPI, stockIndex]);

    return (
        <CardGroup className="dark-bg">
            {isLoading === false &&
                data &&
                data.map((symbol, index) => (
                    <PriceCard key={index} stockSymbol={symbol}></PriceCard>
                ))}
        </CardGroup>
    );
}

export default BriefBoard;
