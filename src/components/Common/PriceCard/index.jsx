import "./style.scss";

import { Badge, Col, Container, Row } from "react-bootstrap";

import ChartBoard from "../../Common/ChartBoard";
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
        <div className="index-component">
            <div className="card-index">
                <Container>
                    <Row>
                        <Col className="index-score-col">
                            <Row className="index-header  fw-bold fs-5 ">
                                {stockSymbol.shortName}
                            </Row>
                            <Row className="price-card-value fw-bold fs-6">
                                {stockSymbol.currentValue.toLocaleString()}
                            </Row>
                            <Row>
                            <div
                                style={
                                    stockSymbol.currentValueChange > 0
                                        ? up
                                        : down
                                }
                                className="price-card-change fw-bold fs-6"
                            >
                                {stockSymbol.currentValueChange > 0
                                    ? "+" +
                                      stockSymbol.currentValueChange.toFixed(3)
                                    : stockSymbol.currentValueChange.toFixed(3)}
                                <br/>
                                <Badge
                                    bg={
                                        stockSymbol.currentValueChange > 0
                                            ? badge_up.bg
                                            : badge_down.bg
                                    }
                                    className="fs-7"
                                >
                                    {stockSymbol.currentValueChange > 0
                                        ? "+" +
                                          stockSymbol.currentValueChangePercent.toFixed(
                                              3
                                          ) +
                                          "%"
                                        : stockSymbol.currentValueChangePercent.toFixed(
                                              3
                                          ) + "%"}
                                </Badge>
                            </div>
                            </Row>
                            
                        </Col>
                        <Col className = "chart-index-col">
                            <div className="chart-index">
                                {stockSymbol !== null &&
                                    stockSymbol.symbol !== undefined && (
                                        <ChartBoard
                                            style={{ margin: 0, padding: 0 }}
                                            selectedStock={stockSymbol}
                                            chartType="AreaChart"
                                            showStockName={false}
                                        />
                                    )}
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    );
}

export default PriceCard;
