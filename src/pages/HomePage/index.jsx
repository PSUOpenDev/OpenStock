import { Container, Row, Col } from "react-bootstrap";
import BriefBoard from "../../components/HomePage/BriefBoard";
import ChartBoard from "../../components/HomePage/ChartBoard";
import NewsTimeline from "../../components/HomePage/NewsTimeline";
import SearchBar from "../../components/HomePage/SearchBar";
/* TEST API COMPONENTS */
function HomePage() {
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
                    <ChartBoard />
                </Col>
                <Col>
                    <NewsTimeline />
                </Col>
            </Row>
            <Row></Row>
        </Container>
    );
}

export default HomePage;
