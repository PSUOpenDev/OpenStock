import React from "react";
import { render } from "react-dom";
import HeikinAshi from "./../../Common/OurStockChart";
import { getData } from "./utils";

import { TypeChooser } from "react-stockcharts/lib/helper";

class ChartBoard extends React.Component {
    componentDidMount() {
        getData().then((data) => {
            this.setState({ data });
        });
    }

    render() {
        if (this.state == null) {
            return <div>Loading...</div>;
        }
        return (
            <TypeChooser>
                {(type) => <HeikinAshi type={type} data={this.state.data} />}
            </TypeChooser>
        );
    }
}
export default ChartBoard;
