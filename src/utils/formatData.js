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
