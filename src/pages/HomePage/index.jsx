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
                <Col md={3} className="font-pacifico light-pink-color text-center fs-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#e14eca" className="bi bi-activity" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M6 2a.5.5 0 0 1 .47.33L10 12.036l1.53-4.208A.5.5 0 0 1 12 7.5h3.5a.5.5 0 0 1 0 1h-3.15l-1.88 5.17a.5.5 0 0 1-.94 0L6 3.964 4.47 8.171A.5.5 0 0 1 4 8.5H.5a.5.5 0 0 1 0-1h3.15l1.88-5.17A.5.5 0 0 1 6 2Z"/>
                    </svg>
                    <span>OpenStock</span>
                </Col>
                <Col md={6}>
                    <SearchBar />
                </Col>
                <Col md={3} className="font-pacifico light-pink-color text-center fs-6 pt-2">
                    Welcome!
                </Col>
            </Row>
            <Row>
                <BriefBoard />
            </Row>
            <Row>
                <Col md={8}>
                    {stock != null && <ChartBoard selectedStock={stock}  chartType="HeikinAshi" showStockName= {true} />}
                </Col>
                <Col md={4}> <NewsTimeline /> </Col>
            </Row>
            <Row></Row>
        </Container>
    );
}

export default HomePage;
