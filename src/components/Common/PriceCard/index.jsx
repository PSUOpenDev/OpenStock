import React from "react";
import PropTypes from "prop-types";
import { 
    Card,
    Badge
} from "react-bootstrap";
import "./style.scss";

PriceCard.propTypes = {
    symbol: PropTypes.object.isRequired,
};

const up = { color: "green" };
const down = { color: "red" };
const badge_up = { bg: "success" };
const badge_down = { bg: "danger" };

function PriceCard({ symbol }) {
    return (
        <Card className="price-card">
            <Card.Title className="fs-4">
                {symbol.shortName}
            </Card.Title>
            <Card.Text className="price-card-value fw-bold fs-5">
                {symbol.currentValue.toLocaleString()}
            </Card.Text>
            <Card.Text
                style={symbol.currentValueChange > 0 ? up : down}
                className="price-card-change"
            >
                {(symbol.currentValueChange > 0) ? 
                    "+" + symbol.currentValueChange.toFixed(3) :
                    symbol.currentValueChange.toFixed(3)
                }
                <span className="ms-2">
                    <Badge bg={symbol.currentValueChange > 0 ? badge_up.bg : badge_down.bg} className="fs-6">
                        {(symbol.currentValueChange > 0) ? 
                            "+" + symbol.currentValueChangePercent.toFixed(3) + "%" :
                            symbol.currentValueChangePercent.toFixed(3) + "%"
                        }
                    </Badge>
                </span>
            </Card.Text>
        </Card>
    );
}

export default PriceCard;
