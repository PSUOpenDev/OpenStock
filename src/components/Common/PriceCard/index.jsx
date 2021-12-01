import "./style.scss";

import {
    Badge,
    Card,
} from "react-bootstrap";
import React, {
    useRef
} from "react";

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
            <div ref = {priceCarRef} className="card-index">
                <Card className="price-card">
                    <Card.Title className="fs-4 text-white fw-bold ms-3 mt-2">
                        {stockSymbol.shortName}
                    </Card.Title>
                    <Card.Text className="price-card-value fw-bold fs-5 ms-3">
                        {stockSymbol.currentValue.toLocaleString()}
                    </Card.Text>
                    <Card.Text
                        style={stockSymbol.currentValueChange > 0 ? up : down}
                        className="price-card-change fw-bold ms-3"
                    >
                        {stockSymbol.currentValueChange > 0
                            ? "+" + stockSymbol.currentValueChange.toFixed(3)
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
                    </Card.Text>
                    <div className ="chart-index">
                        {stockSymbol !== null && stockSymbol.symbol !== undefined && (
                            <ChartBoard
                                selectedStock={stockSymbol}
                                chartType="AreaChart"
                                showStockName={false}
                            />
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
}

export default PriceCard;
