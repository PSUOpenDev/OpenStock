import "./style.scss";

import { Accordion, Alert, Badge } from "react-bootstrap";

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
                <Alert variant={"secondary"}>
                    <Badge bg="success"> {label}</Badge>
                    {"    " + data}
                </Alert>
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
