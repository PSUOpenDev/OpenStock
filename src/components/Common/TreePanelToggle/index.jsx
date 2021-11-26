import "./style.scss";

import { Accordion, Alert, Badge, ListGroup } from "react-bootstrap";

import PropTypes from "prop-types";
import React from "react";

TreePanelToggle.propTypes = {
    id: PropTypes.number,
    label: PropTypes.string,
    data: PropTypes.any,
    nodes: PropTypes.array,
};

function TreePanelToggle({ id, label, data, nodes }) {
    return (
        <>
            {nodes !== undefined && nodes.length === 0 && (
                <ListGroup.Item className="bg-transparent text-white">
                    <span className="clear-yellow fw-bold me-2">{label}: </span>
                    {data}
                </ListGroup.Item>
            )}
            {nodes !== undefined && nodes.length > 0 && (
                <Accordion defaultActiveKey={id} style={{ margin: "1em" }}>
                    <Accordion.Item eventKey={"0"}>
                        <Accordion.Header>{label}</Accordion.Header>
                        <Accordion.Body>
                            {nodes.map((item) => (
                                <TreePanelToggle
                                    key={item.id}
                                    {...item}
                                ></TreePanelToggle>
                            ))}
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            )}
        </>
    );
}

export default TreePanelToggle;
