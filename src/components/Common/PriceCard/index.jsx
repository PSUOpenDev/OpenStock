import React from "react";
import PropTypes from "prop-types";
import { Card } from "react-bootstrap";

import "./style.scss";

PriceCard.propTypes = {
    symbol: PropTypes.object.isRequired,
};
const up = {
    color: "green",
};
const down = {
    color: "red",
};

function PriceCard({ symbol }) {
    //console.log("PriceCard symbol", symbol);

    return (
        <Card className="price-card">
            <Card.Title>{symbol.shortName}</Card.Title>
            <Card.Text className="price-card-value">
                {symbol.currentValue}
            </Card.Text>
            <Card.Text
                style={symbol.currentValueChange > 0 ? up : down}
                className="price-card-change"
            >
                {symbol.currentValueChange +
                    " (" +
                    symbol.currentValueChangePercent +
                    "%)"}
            </Card.Text>
        </Card>
    );
}

export default PriceCard;
