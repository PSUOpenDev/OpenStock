import "./style.scss";
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

function BriefBoard(props) {
    const stockIndex = useSelector((state) => state.stockIndex);
    const dispatch = useDispatch();
    const [isLoading, data, callAPI] = useAPI({
        noRun: "yes",
    });
    useEffect(() => {
        const handleParsingAndFiltering = ({ rawData }) => {
            let result = [];

            const currentTimeStamp = dateToTimestamp(new Date());
            const arrayIndex = rawData.marketSummaryResponse.result;
            const hashIndex = {};

            for (const dataItem of stockIndex.allAllIndexes) {
                hashIndex[dataItem.shortName] = dataItem;
                result.push(dataItem);
            }

            for (const item of arrayIndex) {
                if (item.shortName !== undefined) {
                    if (hashIndex[item.shortName] !== undefined) {
                        hashIndex[item.shortName].shortName = item.shortName;
                        hashIndex[item.shortName].currentValue =
                            item.regularMarketPrice.raw;
                        hashIndex[item.shortName].currentValueChange =
                            item.regularMarketChange.raw;
                        hashIndex[item.shortName].currentValueChangePercent =
                            item.regularMarketChangePercent.raw;
                        console.log(
                            "item.regularMarketChangePercent.symbol",
                            item.regularMarketChangePercent.symbol
                        );
                       
                        hashIndex[item.shortName].apiTime = currentTimeStamp;
                    }
                }
            }

            for (const item of result) {
                item.apiTime = currentTimeStamp;
            }

            return result;
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
