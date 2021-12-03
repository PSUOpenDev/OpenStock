// Source: https://codesandbox.io/s/github/rrag/react-stockcharts-examples2/tree/master/examples/AreaChart
// More references: https://github.com/rrag/react-stockcharts-examples2

import React from "react";
import PropTypes from "prop-types";
import {
    createVerticalLinearGradient,
    hexToRGBA,
} from "react-stockcharts/lib/utils";
import { 
    Chart, 
    ChartCanvas 
} from "react-stockcharts";
import { AreaSeries } from "react-stockcharts/lib/series";
import { fitWidth } from "react-stockcharts/lib/helper";
import { curveMonotoneX } from "d3-shape";
import { scaleTime } from "d3-scale";

const canvasGradientNone = createVerticalLinearGradient([
    { stop: 0, color: hexToRGBA("#b5d0ff", 0.2) },
    { stop: 0.7, color: hexToRGBA("#6fa4fc", 0.4) },
    { stop: 1, color: hexToRGBA("#4286f4", 0.8) },
]);
const canvasGradientUp = createVerticalLinearGradient([
    { stop: 0, color: hexToRGBA("#99CC66f", 0.2) },
    { stop: 0.7, color: hexToRGBA("#99CC66", 0.4) },
    { stop: 1, color: hexToRGBA("#99CC66", 0.8) },
]);
const canvasGradientDown = createVerticalLinearGradient([
    { stop: 0, color: hexToRGBA("#F07470", 0.2) },
    { stop: 0.7, color: hexToRGBA("#EA4C46", 0.4) },
    { stop: 1, color: hexToRGBA("#DC1C13", 0.8) },
]);


class AreaChart extends React.Component {
    render() {
        const { 
            data, 
            type, 
            width, 
            ratio, 
            updown 
        } = this.props;
        return (
            <ChartCanvas
                ratio={ratio}
                width={width}
                height={60}
                margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
                seriesName="MSFT"
                data={data}
                type={type}
                xAccessor={(d) => d.date}
                xScale={scaleTime()}
            >
                <Chart id={0} yExtents={(d) => d.close}>
                    <defs>
                        <linearGradient
                            id="MyGradient"
                            x1="0"
                            y1="100%"
                            x2="0"
                            y2="0%"
                        >
                            <stop
                                offset="0%"
                                stopColor="#b5d0ff"
                                stopOpacity={0.2}
                            />
                            <stop
                                offset="70%"
                                stopColor="#6fa4fc"
                                stopOpacity={0.4}
                            />
                            <stop
                                offset="100%"
                                stopColor="#4286f4"
                                stopOpacity={0.8}
                            />
                        </linearGradient>
                    </defs>
                    <AreaSeries
                        yAccessor={(d) => d.close}
                        fill="url(#MyGradient)"
                        strokeWidth={2}
                        interpolation={curveMonotoneX}
                        canvasGradient={
                            updown === 1
                                ? canvasGradientUp
                                : updown === 0
                                ? canvasGradientNone
                                : canvasGradientDown
                        }
                    />
                </Chart>
            </ChartCanvas>
        );
    }
}

AreaChart.propTypes = {
    data: PropTypes.array.isRequired,
    width: PropTypes.number.isRequired,
    ratio: PropTypes.number.isRequired,
    type: PropTypes.oneOf(["svg", "hybrid"]).isRequired,
    updown: PropTypes.number,
};

AreaChart.defaultProps = {
    type: "svg",
    updown: 0,
};

AreaChart = fitWidth(AreaChart);

export default AreaChart;
