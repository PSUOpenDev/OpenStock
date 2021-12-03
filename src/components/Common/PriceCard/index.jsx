import "./style.scss";

import {
    Badge,
    Col,
    Container,
    Row
} from "react-bootstrap";

import ChartBoard from "../../Common/ChartBoard";
import PropTypes from "prop-types";
import React from "react";

const badge_up = { bg: "success" };
const badge_down = { bg: "danger" };
const up = { color: "green" };
const down = { color: "red" };

PriceCard.propTypes = {
    stockSymbol: PropTypes.object.isRequired,
};

function PriceCard({ stockSymbol }) {
    return (
        <div className="index-component">
            <div className="card-index">
                <Container>
                    <Row>
                        <div className="index-header fw-bold fs-5 ">
                            {stockSymbol.shortName}
                        </div>
                    </Row>
                    <Row>
                        <Col sm={2}>
                            <div className="fw-bold fs-6">
                                { stockSymbol.currentValue.toLocaleString() }
                            </div>
                            <div
                                className="price-card-change fw-bold fs-6"
                                style={
                                    stockSymbol.currentValueChange > 0 ? up : down
                                }
                                
                            >
                                {
                                    stockSymbol.currentValueChange > 0 ? "+" + stockSymbol.currentValueChange.toFixed(3) : stockSymbol.currentValueChange.toFixed(3)
                                }
                            </div>
                            <div>
                                <Badge
                                    className="fs-7"
                                    bg={
                                        stockSymbol.currentValueChange > 0 ? badge_up.bg : badge_down.bg
                                    }
                                >
                                    { 
                                        stockSymbol.currentValueChange > 0 ? "+" +
                                        stockSymbol.currentValueChangePercent.toFixed(3) + "%" : 
                                        stockSymbol.currentValueChangePercent.toFixed(3) + "%"
                                    }
                                </Badge>
                            </div>
                        </Col>
                        <Col sm={9}>
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
                                            range="1d"
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
