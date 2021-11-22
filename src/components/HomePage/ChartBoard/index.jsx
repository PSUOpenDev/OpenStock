import React, { useState, useEffect } from "react";
import HeikinAshi from "./../../common/OurStockChart";
import { getData } from "./utils";
import { TypeChooser } from "react-stockcharts/lib/helper";

function ChartBoard(props) {
    const [data, setData] = useState(null);
    useEffect(() => {
        getData().then((newData) => {
            setData(newData);
        });
    }, []);

    return (
        <>
            {data === null ? (
                <div>Loading...</div>
            ) : (
                <TypeChooser>
                    {(type) => <HeikinAshi type={type} data={data} />}
                </TypeChooser>
            )}
        </>
    );
}

export default ChartBoard;
