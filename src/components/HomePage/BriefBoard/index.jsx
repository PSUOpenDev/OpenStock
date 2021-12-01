import "./style.scss";

import {
    API_STOCK_QUOTE_KEY,
    API_URL_MARKET_SUMMARY,
    TIME_TO_REFRESH_INDEXES
} from "./../../Common/APIUtils/Yahoo/ApiParameter";
import {
    Col,
    Container,
    Row
} from "react-bootstrap";
import React, {
    useEffect
} from "react";
import {
    dateToTimestamp,
    isExpired,
    timestampToDate,
} from "../../../utils/timeStamp";
import { useDispatch, useSelector } from "react-redux";

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
                        TIME_TO_REFRESH_INDEXES
                    )
                ) {
                    console.log("call api in breafboard");
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
        <Container className="dark-bg mt-4 mb-3">
            <Row>
                {
                    isLoading === false &&
                    data &&
                    data.map((symbol, index) => (
                        <Col xs={12} sm={6} lg={4}>
                            <PriceCard key={index} stockSymbol={symbol}></PriceCard>
                        </Col>
                    ))
                }
            </Row>
        </Container>
    );
}

export default BriefBoard;
