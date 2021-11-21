import React from "react";
import { CardGroup, Card } from "react-bootstrap";
import './style.scss';
function BriefBoard(props) {
    return (
        <div className="brief-board">
            <CardGroup>
                <Card style={{ width: "18rem" }}>
                    <Card.Body>
                        <Card.Title>APPLE</Card.Title>
                        <Card.Text>100.3 +3%</Card.Text>
                    </Card.Body>
                </Card>
                <Card>
                    <Card.Body>
                        <Card.Title> Tesla</Card.Title>
                        <Card.Text>50.5 +3%</Card.Text>
                    </Card.Body>
                </Card>
            </CardGroup>
        </div>
    );
}

export default BriefBoard;
