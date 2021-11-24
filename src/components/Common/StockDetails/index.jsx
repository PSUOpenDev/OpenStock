import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import TreeMenu from "react-simple-tree-menu";
import "./style.scss";
import useAPI from "./../../Common/APIUtils/useAPI";
import {
    API_STOCK_QUOTE_KEY,
    API_URL_STOCK_SUMMARY,
} from "./../../Common/APIUtils/Yahoo/ApiParameter";

StockDetails.propTypes = {};

function StockDetails({ selectedStock }) {
    // const [data, setData] = useState( [
    //         {
    //             key: "0",
    //             label: "Motor_+SEP+_1",
    //             nodes: [
    //                 {
    //                     key: "1",
    //                     label: 1.5,
    //                     nodes: [],
    //                 },
    //             ],
    //         },
    //         {
    //             key: "2",
    //             label: "Motor_+SEP+_2",
    //             nodes: [
    //                 {
    //                     key: "3",
    //                     label: 50,
    //                     nodes: [],
    //                 },
    //             ],
    //         },
    //         {
    //             key: "4",
    //             label: "Motor_+SEP+_3",
    //             nodes: [
    //                 {
    //                     key: "5",
    //                     label: 96,
    //                     nodes: [],
    //                 },
    //             ],
    //         },
    //         {
    //             key: "6",
    //             label: "Motor_+SEP+_4",
    //             nodes: [
    //                 {
    //                     key: "7",
    //                     label: 96,
    //                     nodes: [],
    //                 },
    //             ],
    //         },
    //         {
    //             key: "8",
    //             label: "Motor_+SEP+_5",
    //             nodes: [
    //                 {
    //                     key: "9",
    //                     label: 0,
    //                     nodes: [],
    //                 },
    //             ],
    //         },
    //         {
    //             key: "10",
    //             label: "_id",
    //             nodes: [
    //                 {
    //                     key: "11",
    //                     label: "BMW_slx_BMW_i8_jwuzbmei_data/130",
    //                     nodes: [],
    //                 },
    //             ],
    //         },
    //         {
    //             key: "12",
    //             label: "_key",
    //             nodes: [
    //                 {
    //                     key: "13",
    //                     label: "130",
    //                     nodes: [],
    //                 },
    //             ],
    //         },
    //         {
    //             key: "14",
    //             label: "_rev",
    //             nodes: [
    //                 {
    //                     key: "15",
    //                     label: "_YzGKOiy-Bf",
    //                     nodes: [],
    //                 },
    //             ],
    //         },
    //         {
    //             key: "16",
    //             label: "acceleration",
    //             nodes: [
    //                 {
    //                     key: "17",
    //                     label: 3.68038254190652,
    //                     nodes: [],
    //                 },
    //             ],
    //         },
    //         {
    //             key: "18",
    //             label: "architecture",
    //             nodes: [
    //                 {
    //                     key: "19",
    //                     label: "e16028_a1",
    //                     nodes: [],
    //                 },
    //             ],
    //         },
    //         {
    //             key: "20",
    //             label: "endsoc",
    //             nodes: [
    //                 {
    //                     key: "21",
    //                     label: 49.8844181956987,
    //                     nodes: [],
    //                 },
    //             ],
    //         },
    //         {
    //             key: "22",
    //             label: "endspeed",
    //             nodes: [
    //                 {
    //                     key: "23",
    //                     label: 27.7621100708752,
    //                     nodes: [],
    //                 },
    //             ],
    //         },
    //         {
    //             key: "24",
    //             label: "fuel_cons",
    //             nodes: [
    //                 {
    //                     key: "25",
    //                     label: 15.2124281097358,
    //                     nodes: [],
    //                 },
    //             ],
    //         },
    //     ]);
    const [initialOpen, setInitialOpen] = useState([]);

    const handleExpandTree = () => {
        setInitialOpen([
            "0",
            "0/1",
            "2",
            "2/3",
            "4",
            "4/5",
            "6",
            "6/7",
            "8",
            "8/9",
            "10",
            "10/11",
            "12",
            "12/13",
            "14",
            "14/15",
            "16",
            "16/17",
            "18",
            "18/19",
            "20",
            "20/21",
            "22",
            "22/23",
            "24",
            "24/25",
        ]);
    };

    const [isLoading, data, setApiParam] = useAPI({
        noRun: "yes",
    });

    useEffect(() => {
        const convert = (childKey, result, rawData) => {
            if (Array.isArray(rawData)) {
                for (const item of rawData) {
                    childKey = childKey + 1;
                    if (item != null)
                        result.notes.push(
                            convert(
                                childKey,
                                { key: childKey, label: "#", notes: [] },
                                item
                            )
                        );
                }
            } else {
                if (typeof rawData === "object") {
                    const listKey = Object.keys(rawData);
                    console.log("list key = ", listKey);
                    for (const item of listKey) {
                        childKey = childKey + 1;
                        if (rawData[item] != null)
                            result.notes.push(
                                convert(
                                    childKey,
                                    { key: childKey, label: item, notes: [] },
                                    rawData[item]
                                )
                            );
                    }
                } else {
                    result.label = rawData;
                }
            }
            return result;
        };

        const handleParsingAndFiltering = (rawData) => {
            console.log("==========", rawData);
            const notes = convert(
                0,
                { key: 0, label: "#", notes: [] },
                rawData.quoteSummary
            );
            console.log("notes = ", notes);
            return {};
        };

        const handleSaving = () => {};

        const handleSelecting = () => {
            return null;
        };
        console.log("THe selected stockt is ", selectedStock);

        setApiParam({
            url: API_URL_STOCK_SUMMARY,
            queryString:
                "AAPL?lang=en&region=US&modules=defaultKeyStatistics%2CassetProfile",
            apiKey: API_STOCK_QUOTE_KEY,
            onParsingAnFiltering: handleParsingAndFiltering,
            onSaving: handleSaving,
            onSelecting: handleSelecting,
        });
    }, [selectedStock]);
    return (
        <div className="stock-details">
            <TreeMenu
                data={data}
                initialOpenNodes={initialOpen}
                hasSearch={false}
            />
            <button onClick={handleExpandTree}>Expand tree</button>
        </div>
    );
}

StockDetails.propTypes = {
    selectedStock: PropTypes.object.isRequired,
};
// StockDetails.defaultProps = {

// };

export default StockDetails;
