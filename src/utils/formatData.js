export const formatData = (data, fieldName) => {
    //console.log(data);

    if (typeof data === "number") {
        const ignoreArr = ["Year Born", "Age", "Date"];
        for (const i of ignoreArr) {
            if (fieldName === i || fieldName.endsWith("Year")) {
                return data;
            }
        }
        if (data > 1000000000) {
            return (
                (data / 1000000000).toLocaleString(
                    undefined,
                    // locale or a string like 'en-US' to override it.
                    { minimumFractionDigits: 2 }
                ) + "B"
            );
        }

        return data.toLocaleString(
            undefined,
            // locale or a string like 'en-US' to override it.
            { minimumFractionDigits: 2 }
        );
    }

    return data;
};

export const convertStringToNumber = (dataString) => {
    if (typeof dataString === "string")
        if (dataString.endsWith("B")) {
            return parseFloat(dataString.slice(0, -1)) * 1000000000;
        } else if (dataString.endsWith("M")) {
            return parseFloat(dataString.slice(0, -1)) * 1000000;
        }
    return dataString;
};

export const convertLabel = (label) => {
    const isUpperCase = (string) => /^[A-Z]*$/.test(string);
    const isDigit = (string) => /^[0-9]*$/.test(string);
    let len = label.length;

    for (let i = 0; i < len; i++) {
        if (
            i > 0 &&
            ((isUpperCase(label.charAt(i)) &&
                isUpperCase(label.charAt(i - 1)) === false) ||
                (isDigit(label.charAt(i)) &&
                    isDigit(label.charAt(i - 1)) === false &&
                    isUpperCase(label.charAt(i - 1)) === false))
        ) {
            //insert at i
            label = label.substring(0, i) + " " + label.substring(i, len);
            len = label.length;
            i = i + 1;
        }
    }

    //capitalize the first letter
    len = label.length;
    if (len > 1) {
        label = label.charAt(0).toUpperCase() + label.substring(1, len);
    }

    return label;
};

export const convertJSONtoNodes = (result, rawData) => {
    let childKey = 0;

    const convert = (result, rawData) => {
        while (true) {
            if (Array.isArray(rawData)) {
                for (const item of rawData) {
                    childKey = childKey + 1;
                    if (item != null)
                        result.nodes.push(
                            convert(
                                {
                                    id: childKey,
                                    label: "#",
                                    data: "",
                                    nodes: [],
                                },
                                item
                            )
                        );
                }
                break;
            }

            if (typeof rawData === "object") {
                if (rawData["fmt"] !== undefined) {
                    result.data = rawData["fmt"];
                    return result;
                }
                const listKey = Object.keys(rawData);
                const ignoreList = [
                    "maxAge",
                    "language",
                    "region",
                    "triggerable",
                    "currency",
                    "tradeable",
                    "exchange",
                    "messageBoardId",
                    "market",
                    "sourceInterval",
                    "quoteSourceName",
                    "quoteType",
                    "priceHint",
                    "firstTradeDateMilliseconds",
                ];
                for (const item of ignoreList) {
                    const result = listKey.indexOf(item);
                    if (result >= 0) listKey.splice(result, 1);
                }

                if (listKey.length === 0) {
                    result.data = "N/A";
                    return result;
                }
                childKey = childKey + 2;
                const drawChart = {
                    id: childKey - 1,
                    label: "##drawChart##",
                    data: "##drawChart##",
                    nodes: [
                        {
                            id: childKey,
                            label: "Other",
                            data: 0,
                            nodes: [],
                        },
                    ],
                };
                for (const item of listKey) {
                    if (
                        item === "sharesPercentSharesOut" ||
                        item === "heldPercentInsiders" ||
                        item === "heldPercentInstitutions"
                    ) {
                        childKey = childKey + 1;
                        drawChart.nodes.push(
                            convert(
                                {
                                    id: childKey,
                                    label: convertLabel(item),
                                    data: "Share Percentage",
                                    nodes: [],
                                },
                                rawData[item]
                            )
                        );
                        continue;
                    }

                    if (item === "name" && result.label === "#") {
                        result.label = rawData[item];
                    }

                    if (rawData[item] != null) {
                        childKey = childKey + 1;
                        result.nodes.push(
                            convert(
                                {
                                    id: childKey,
                                    label: convertLabel(item),
                                    data: "",
                                    nodes: [],
                                },
                                rawData[item]
                            )
                        );
                    }
                }

                if (drawChart.nodes.length > 1) {
                    let total = 0;
                    for (const node of drawChart.nodes) {
                        if (node.data !== 0)
                            node.data = parseFloat(node.data.slice(0, -1));
                        total = total + node.data;
                    }
                    drawChart.nodes[0].data = 100 - total;
                    result.nodes.push(drawChart);
                }

                break;
            }

            result.data = rawData === null ? "N/A" : rawData;

            break;
        }

        return result;
    };
    return convert(result, rawData);
};
