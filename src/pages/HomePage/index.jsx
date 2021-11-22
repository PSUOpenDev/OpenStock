import { Container, Row, Col } from "react-bootstrap";
import BriefBoard from "../../components/HomePage/BriefBoard";
import ChartBoard from "../../components/HomePage/ChartBoard";
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
                <Col>Logo Here</Col>
                <Col>
                    <SearchBar />
                </Col>
                <Col>Clock</Col>
            </Row>
            <Row>
                <BriefBoard />
            </Row>
            <Row>
                <Col>
                    {stock != null && <ChartBoard selectedStock={stock} />}
                </Col>
                <Col>{/* <NewsTimeline /> */}</Col>
            </Row>
            <Row></Row>
        </Container>
    );
}

export default HomePage;
