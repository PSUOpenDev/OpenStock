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
                        <Col sm={2}>
                            <div className="index-header  fw-bold fs-5 ">
                                {stockSymbol.shortName}
                            </div>
                            <div className="fw-bold fs-6">
                                {stockSymbol.currentValue.toLocaleString()}
                            </div>
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
                            </div>
                            <div>
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
                        </Col>
                        <Col sm={10}>
                            <div
                                className={
                                    stockSymbol.currentValueChange > 0
                                        ? "chart-index chart-up"
                                        : "chart-index chart-down"
                                }
                            >
                                {stockSymbol !== null &&
                                    stockSymbol.symbol !== undefined && (
                                        <ChartBoard
                                            selectedStock={stockSymbol}
                                            chartType="AreaChart"
                                            showStockName={false}
                                            range="1m"
                                            updown={
                                                stockSymbol.currentValueChange >
                                                0
                                                    ? 1
                                                    : stockSymbol.currentValueChange ===
                                                      0
                                                    ? 0
                                                    : -1
                                            }
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
