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
        
    }, [callAPI, dispatch, stockIndex.allAllIndexes, stockIndex.indexDic]);

    return (
        <Container className="dark-bg mt-4 mb-3" fluid>
            <Row>
                {isLoading === false &&
                    data &&
                    data.map((symbol, index) => (
                        <Col key={index} xs={12} sm={6} lg={4}>
                            <PriceCard
                                key={index}
                                stockSymbol={symbol}
                            ></PriceCard>
                        </Col>
                    ))}
            </Row>
        </Container>
    );
}

export default BriefBoard;
