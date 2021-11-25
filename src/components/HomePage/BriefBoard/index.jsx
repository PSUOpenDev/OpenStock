import React, {  useEffect } from "react";
import { CardGroup } from "react-bootstrap";
import PriceCard from "../../Common/PriceCard";
import "./style.scss";
import useAPI from "./../../Common/APIUtils/useAPI";
import {
    API_URL_MARKET_SUMMARY,
    API_STOCK_QUOTE_KEY,
} from "./../../Common/APIUtils/Yahoo/ApiParameter";
import { updateStockIndex } from "./../../../actions/stockIndex";
import { useSelector, useDispatch } from "react-redux";
import {
    isExpired,
    durationInMilliseconds,
    timestampToDate,
    dateToTimestamp,
} from "./../../Common/utils";
import './style.scss';

function BriefBoard(props) {
    const stockIndex = useSelector((state) => state.stockIndex);
    const dispatch = useDispatch();
    const [isLoading, data,setApiParam ] = useAPI({
        noRun: "yes",
    });
    useEffect(() => {
        console.log("run2");
        //parsing data from api
        const handleParsingAndFiltering = (rawData) => {
            let result = [];
            console.log("handleParsingAndFiltering rawData", rawData);
            console.log(
                "handleParsingAndFiltering stockIndex.allAllIndexes",
                stockIndex.allAllIndexes
            );
            const currentTimeStamp = dateToTimestamp(new Date());
            const arrayIndex = rawData.marketSummaryResponse.result;
            const hashIndex = {};
            for (const dataItem of stockIndex.allAllIndexes) {
                hashIndex[dataItem.shortName] = dataItem;
                result.push(dataItem);
            }
            for (const item of arrayIndex) {
                if (item.shortName !== undefined) {
                    console.log(
                        " hashIndex[item.shortName] ",
                        hashIndex[item.shortName]
                    );
                    if (hashIndex[item.shortName] !== undefined) {
                        hashIndex[item.shortName].shortName = item.shortName;
                        hashIndex[item.shortName].currentValue =
                            item.regularMarketPrice.raw;
                        hashIndex[item.shortName].currentValueChange =
                            item.regularMarketChange.raw;
                        hashIndex[item.shortName].currentValueChangePercent =
                            item.regularMarketChangePercent.raw;
                        hashIndex[item.shortName].apiTime = currentTimeStamp;
                    }
                }
            }
            for (const item of result) {
                item.apiTime = currentTimeStamp;
            }
            console.log("result = ", result);
            return result;
        };
        const handleSelecting = () => {
            const currentTime = new Date();
            console.log(
                "handleSelecting stockIndex.allAllIndexes = ",
                stockIndex.allAllIndexes
            );
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
        const handleSaving = (newData) => {
            console.log("newData = ", newData);
            dispatch(updateStockIndex(newData));
            console.log(
                "handleSaving stockIndex.allAllIndexes = ",
                stockIndex.allAllIndexes
            );
            return stockIndex.allAllIndexes;
        };
        setApiParam({
            url: API_URL_MARKET_SUMMARY,
            queryString: "",
            apiKey: API_STOCK_QUOTE_KEY,
            onParsingAnFiltering: handleParsingAndFiltering,
            onSaving: handleSaving,
            onSelecting: handleSelecting,
        });
        console.log("hey api ...run")
    }, [dispatch,setApiParam,stockIndex]);

    return (
        <CardGroup>
            {isLoading === false &&
                data &&
                data.map((symbol, index) => (
                    <PriceCard key={index} symbol={symbol}></PriceCard>
                ))}
        </CardGroup>
    );
}

export default BriefBoard;
