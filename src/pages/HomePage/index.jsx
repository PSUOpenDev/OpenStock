import "./style.scss";

import { Col, Container, Row } from "react-bootstrap";
import React, { useEffect, useState } from "react";

import BriefBoard from "../../components/HomePage/BriefBoard";
import ChartBoard from "../../components/Common/ChartBoard";
import NewsTimeline from "../../components/HomePage/NewsTimeline";
import SearchBar from "../../components/HomePage/SearchBar";
import StockDetails from "../../components/Common/StockDetails";
import { useSelector } from "react-redux";

/* TEST API COMPONENTS */
function HomePage() {
    const selectedStock = useSelector((state) => state.selectedStock);
    const [stock, setStock] = useState(selectedStock);
    useEffect(() => {
        setStock(
            selectedStock !== null &&
                selectedStock !== undefined &&
                selectedStock.symbol !== null &&
                selectedStock.symbol !== undefined
                ? selectedStock
                : { symbol: "^DJI", stockName: "Dow Jones Industrial Average" }
        );
    }, [selectedStock]);
    return (
        <Container className="home-page-container" fluid>
            <Row>
                <Col md={3} className="font-pacifico clear-yellow text-center fs-4">OpenStock</Col>
                <Col md={6}><SearchBar /></Col>
                <Col md={3}></Col>
            </Row>
            <Row>
                <BriefBoard />
            </Row>
            <Row>
                <Col md={7} xl={9}>
                    <Row>
                        {stock != null && (
                            <ChartBoard
                                selectedStock={stock}
                                chartType="HeikinAshi"
                                showStockName={true}
                            />
                        )}
                    </Row>
                    <Row>
                        <StockDetails selectedStock={stock}> </StockDetails>
                    </Row>
                </Col>
                <Col md={5} xl={3}>
                    <NewsTimeline />
                </Col>
            </Row>
        </Container>
    );
}

export default HomePage;
