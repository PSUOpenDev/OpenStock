import "./style.scss";

import { Accordion, Col, Row } from "react-bootstrap";
import {
    ArcElement,
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    Title,
    Tooltip,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { convertStringToNumber, formatData } from "./../../../utils/formatData";

import PropTypes from "prop-types";
import React from "react";

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
    Title
);

TreePanelToggle.propTypes = {
    id: PropTypes.number,
    label: PropTypes.string,
    data: PropTypes.any,
    nodes: PropTypes.array,
    tab: PropTypes.string,
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

function TreePanelToggle({ id, label, data, nodes, tab }) {
    return (
        <div className="tree-panel-toggle">
            {nodes !== undefined &&
                nodes.length === 0 &&
                data !== null &&
                data !== "N/A" && (
                    <Row className="data-entry bg-transparent">
                        <Col className="d-flex justify-content-between">
                            <span className="text-warning mr-2">
                                {label + ": "}
                            </span>

                            <p className="text-secondary">
                                {formatData(data, label)}
                            </p>
                        </Col>
                    </Row>
                )}
            {label === "##drawChart##" && (
                <Accordion
                    defaultActiveKey={"Share Ratio"}
                    style={{ margin: "1em" }}
                >
                    <Accordion.Item eventKey={"Share Ratio"} expand={1}>
                        <Accordion.Header>{"Share Ratio"}</Accordion.Header>
                        <Accordion.Body>
                            <div className="chart-container">
                                <Doughnut
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: true,
                                    }}
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
                            </div>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            )}
            {label === "Quarterly" && (
                <Accordion defaultActiveKey={label} style={{ margin: "1em" }}>
                    <Accordion.Item eventKey={label} expand={1}>
                        <Accordion.Header>{label}</Accordion.Header>
                        <Accordion.Body>
                            <div className="bart-chart">
                               {
                                   nodes.length > 0 && (
                                    <Bar
                                    options={{
                                        indexAxis: "y",
                                        elements: {
                                            bar: {
                                                borderWidth: 2,
                                            },
                                        },
                                        responsive: true,
                                        plugins: {
                                            legend: {
                                                position: "right",
                                            },
                                            title: {
                                                display: true,
                                                text: label,
                                            },
                                        },
                                    }}
                                    data={{
                                        labels: nodes.map(
                                            (item) => item.nodes[0].data
                                        ),
                                        datasets: [
                                            {
                                                label: nodes[0].nodes[1].label,
                                                data: nodes.map((item) =>
                                                    convertStringToNumber(
                                                        item.nodes[1].data
                                                    )
                                                ),
                                                borderColor:
                                                    "rgb(255, 99, 132)",
                                                backgroundColor:
                                                    "rgba(255, 99, 132, 0.5)",
                                            },
                                            {
                                                label: nodes[0].nodes[2].label,
                                                data: nodes.map((item) =>
                                                    convertStringToNumber(
                                                        item.nodes[2].data
                                                    )
                                                ),
                                                borderColor:
                                                    "rgb(53, 162, 235)",
                                                backgroundColor:
                                                    "rgba(53, 162, 235, 0.5)",
                                            },
                                        ],
                                    }}
                                />
                                   )                               }
                            </div>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            )}

            {label === "Yearly" && (
                <Accordion defaultActiveKey={label} style={{ margin: "1em" }}>
                    <Accordion.Item eventKey={label} expand={1}>
                        <Accordion.Header>{label}</Accordion.Header>
                        <Accordion.Body>
                            <div className="bart-chart">
                               { nodes.length > 0 && (
                                    <Bar
                                    options={{
                                        indexAxis: "y",
                                        elements: {
                                            bar: {
                                                borderWidth: 2,
                                            },
                                        },
                                        responsive: true,
                                        plugins: {
                                            legend: {
                                                position: "right",
                                            },
                                            title: {
                                                display: true,
                                                text: label,
                                            },
                                        },
                                    }}
                                    data={{
                                        labels: nodes.map(
                                            (item) => item.nodes[0].data
                                        ),
                                        datasets: [
                                            {
                                                label: nodes[0].nodes[1].label,
                                                data: nodes.map((item) =>
                                                    convertStringToNumber(
                                                        item.nodes[1].data
                                                    )
                                                ),
                                                borderColor:
                                                    "rgb(255, 99, 132)",
                                                backgroundColor:
                                                    "rgba(255, 99, 132, 0.5)",
                                            },
                                            {
                                                label: nodes[0].nodes[2].label,
                                                data: nodes.map((item) =>
                                                    convertStringToNumber(
                                                        item.nodes[2].data
                                                    )
                                                ),
                                                borderColor:
                                                    "rgb(53, 162, 235)",
                                                backgroundColor:
                                                    "rgba(53, 162, 235, 0.5)",
                                            },
                                        ],
                                    }}
                                />
                               )}
                            </div>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            )}
            {nodes !== undefined &&
                nodes.length > 0 &&
                label !== "##drawChart##" &&
                label !== "Quarterly" &&
                label !== "Yearly" &&
                (tab === "true" ? (
                    nodes.map((item) => {
                        return (
                            <TreePanelToggle
                                key={item.id}
                                {...item}
                            ></TreePanelToggle>
                        );
                    })
                ) : (
                    <Accordion
                        defaultActiveKey={label}
                        style={{ margin: "1em" }}
                    >
                        <Accordion.Item eventKey={label} expand={1}>
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
