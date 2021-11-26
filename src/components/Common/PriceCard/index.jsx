import "./style.scss";
import ChartBoard from "../../Common/ChartBoard"
import { 
    Card,
    Badge,
    Row,
    Col
} from "react-bootstrap";
import PropTypes from "prop-types";
import React from "react";

PriceCard.propTypes = {
    stockSymbol: PropTypes.object.isRequired,
};

const up = { color: "green" };
const down = { color: "red" };
const badge_up = { bg: "success" };
const badge_down = { bg: "danger" };

function PriceCard({ stockSymbol }) {
    return (
        <Row>
            <Col md={8}>
                <Card className="price-card">
                    <Card.Title className="fs-4">
                        { stockSymbol.shortName }
                    </Card.Title>
                    <Card.Text className="price-card-value fw-bold fs-5">
                        { stockSymbol.currentValue.toLocaleString() }
                    </Card.Text>
                    <Card.Text
                        style={ stockSymbol.currentValueChange > 0 ? up : down }
                        className="price-card-change"
                    >
                        {(stockSymbol.currentValueChange > 0) ? 
                            "+" + stockSymbol.currentValueChange.toFixed(3) :
                            stockSymbol.currentValueChange.toFixed(3)
                        }
                        <span className="ms-2">
                            <Badge bg={ stockSymbol.currentValueChange > 0 ? badge_up.bg : badge_down.bg } className="fs-6">
                                {(stockSymbol.currentValueChange > 0) ? 
                                    "+" + stockSymbol.currentValueChangePercent.toFixed(3) + "%" :
                                    stockSymbol.currentValueChangePercent.toFixed(3) + "%"
                                }
                            </Badge>
                        </span>
                    </Card.Text>
                </Card>
            </Col>
                { /*stockSymbol.symbol !== undefined && <ChartBoard selectedStock={stockSymbol}  chartType="AreaChart" showStockName= {false} /> */}
            <Col md={4}>
            </Col>
        </Row>
    );
}

export default PriceCard;
