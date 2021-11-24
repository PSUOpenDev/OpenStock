import { Container, Row, Col } from "react-bootstrap";
import BriefBoard from "../../components/HomePage/BriefBoard";
import ChartBoard from "../../components/Common/ChartBoard";
import NewsTimeline from "../../components/HomePage/NewsTimeline";
import SearchBar from "../../components/HomePage/SearchBar";
import { useSelector } from "react-redux";
import React, { useState, useEffect } from "react";
/* TEST API COMPONENTS */
function HomePage() {
    const selectedStock = useSelector((state) => state.selectedStock);
    const [stock, setstock] = useState(selectedStock);
    useEffect(() => {
        setstock(selectedStock);
        console.log("Change select stock to", selectedStock);
    }, [selectedStock]);
    return (
        <Container fluid>
            <Row>
                <Col md={3}>Logo Here</Col>
                <Col md={6}>
                    <SearchBar />
                </Col>
                <Col md={3}>Clock</Col>
            </Row>
            <Row>
                <BriefBoard />
            </Row>
            <Row>
                <Col md={8}>
                    {stock != null && <ChartBoard selectedStock={stock}  chartType="HeikinAshi" showStockName= {true} />}
                </Col>
                <Col md={4}>{/* <NewsTimeline /> */}</Col>
            </Row>
            <Row></Row>
        </Container>
    );
}

export default HomePage;
