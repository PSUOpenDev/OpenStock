import "./style.scss";

import { B, Badge, Card, Col, Container, Row } from "react-bootstrap";
import React, { useRef } from "react";

import ChartBoard from "../../Common/ChartBoard";
import PropTypes from "prop-types";

PriceCard.propTypes = {
    stockSymbol: PropTypes.object.isRequired,
};

const up = { color: "green" };
const down = { color: "red" };
const badge_up = { bg: "success" };
const badge_down = { bg: "danger" };

function PriceCard({ stockSymbol }) {
    const priceCarRef = useRef(null);
    return (
        <div className="index-component">
            <div ref={priceCarRef} className="card-index">
                <Container>
                    <Row>
                        <Col className = "index-score">
                            <div className="index-header  fw-bold fs-4 " >
                                {stockSymbol.shortName}
                            </div>
                            <div className="price-card-value fw-bold fs-5">
                                {stockSymbol.currentValue.toLocaleString()}
                            </div>
                            <div
                                style={
                                    stockSymbol.currentValueChange > 0
                                        ? up
                                        : down
                                }
                                className="price-card-change fw-bold fs-5"
                            >
                                {stockSymbol.currentValueChange > 0
                                    ? "+" +
                                      stockSymbol.currentValueChange.toFixed(3)
                                    : stockSymbol.currentValueChange.toFixed(3)}
                                <span className="ms-2">
                                    <Badge
                                        bg={
                                            stockSymbol.currentValueChange > 0
                                                ? badge_up.bg
                                                : badge_down.bg
                                        }
                                        className="fs-6"
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
                                </span>
                            </div>
                        </Col>
                        <Col>
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
