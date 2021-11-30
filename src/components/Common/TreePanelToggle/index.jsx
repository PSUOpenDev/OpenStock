import "./style.scss";

import { Accordion, ListGroup, Tab } from "react-bootstrap";
import { Col, Container, Row } from "react-bootstrap";

import { Doughnut } from "react-chartjs-2";
import PropTypes from "prop-types";
import React from "react";
import { formatData } from "./../../../utils/formatData";

TreePanelToggle.propTypes = {
    id: PropTypes.number,
    label: PropTypes.string,
    data: PropTypes.any,
    nodes: PropTypes.array,
    tab:PropTypes.string
};

const backgroundColors = [
    "rgba(54, 162, 235, 0.8)",
    "rgba(255, 206, 86, 0.8)",
    "rgba(255, 99, 132, 0.8)",
    "rgba(75, 192, 192, 0.8)",
    "rgba(153, 102, 255, 0.8)",
    "rgba(255, 159, 64, 0.8)",
    "rgba(199, 199, 199, 0.8)",
    "rgba(83, 102, 255, 0.8)",
    "rgba(40, 159, 64, 0.8)",
    "rgba(210, 199, 199, 0.8)",
    "rgba(78, 52, 199, 0.8)",
];

const borderColors = [
    "rgba(54, 162, 235, 1)",
    "rgba(255, 206, 86, 1)",
    "rgba(255, 99, 132, 1)",
    "rgba(75, 192, 192, 1)",
    "rgba(153, 102, 255, 1)",
    "rgba(255, 159, 64, 1)",
    "rgba(159, 159, 159, 1)",
    "rgba(83, 102, 255, 1)",
    "rgba(40, 159, 64, 1)",
    "rgba(210, 199, 199, 1)",
    "rgba(78, 52, 199, 1)",
];

function TreePanelToggle({ id, label, data, nodes,tab }) {
 
    return (
        <div className="tree-panel-toggle">
            {nodes !== undefined &&
                nodes.length === 0 &&
                data !== null &&
                data !== "N/A" && (
                    <ListGroup.Item className="bg-transparent text-white">
                        <span className="clear-yellow fw-bold me-2">
                            {label + ": "}
                        </span>
                        {formatData(data, label)}
                    </ListGroup.Item>
                )}
            {label === "##drawChart##" && (
                <Accordion
                    defaultActiveKey={id === 0 ? 0 : null}
                    style={{ margin: "1em" }}
                >
                    <Accordion.Item eventKey={"0"}>
                        <Accordion.Header>{"Share Ratio"}</Accordion.Header>
                        <Accordion.Body>
                            <Doughnut
                                data={{
                                    labels: nodes.map((item) => {
                                        return item.label;
                                    }),
                                    datasets: [
                                        {
                                            label: "",
                                            backgroundColor: nodes.map(
                                                (item, index) =>
                                                    backgroundColors[index]
                                            ),
                                            borderColor: nodes.map(
                                                (item, index) =>
                                                    borderColors[index]
                                            ),
                                            borderWidth: 1,
                                            data: nodes.map((item) => {
                                                return item.data;
                                            }),
                                        },
                                    ],
                                }}
                            />
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            )}
            {nodes !== undefined &&
                nodes.length > 0 &&
                label !== "##drawChart##" &&
                (tab ==="true" ? (
                    nodes.map((item) => {
                        console.log("LET RUN");
                        return (
                            <TreePanelToggle
                                key={item.id}
                               
                                {...item}
                            ></TreePanelToggle>
                        )
                    })
                ) : (
                    <Accordion
                        defaultActiveKey={id === 0 ? 0 : null}
                        style={{ margin: "1em" }}
                    >
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
                ))}
        </div>
    );
}

export default TreePanelToggle;
