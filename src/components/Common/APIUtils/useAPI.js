import { useState, useEffect } from "react";
import axios from "axios";
const initialState = {
    url: "",
    queryString: "",
    apiKey: "",
    noRun: undefined,
    onParsingAnFiltering: undefined,
    onSaving: undefined,
    onSelecting: undefined,
    onError: undefined,
};
const useAPI = (parameters = initialState) => {
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState(null);

    useEffect(() => {
        async function dispatchAxios() {
            try {
                if (parameters.noRun !== undefined) {
                    setIsLoading(false);
                    return;
                }
                setIsLoading(true);
                let tempData = null;
                if (parameters.onSelecting !== undefined) {
                    tempData = parameters.onSelecting(parameters);
                    console.log("tempdata =", tempData);
                }
                if (tempData === undefined) {
                    return;
                }
                if (tempData === null) {
                    console.log(
                        "Call API(" +
                            encodeURI(parameters.url + parameters.queryString) +
                            ")"
                    );
                    let response = null;
                    if (parameters.apiKey !== "") {
                        response = await axios.get(
                            encodeURI(parameters.url + parameters.queryString),
                            {
                                method: "GET",
                                headers: {
                                    accept: "application/json",
                                    "X-API-KEY": parameters.apiKey,
                                },
                            }
                        );
                    } else {
                        response = await axios.get(
                            encodeURI(parameters.url + parameters.queryString)
                        );
                    }

                    tempData = response.data;

                    if (tempData === null) {
                        throw new Error("No data return from API!");
                    }

                    if (parameters.onParsingAnFiltering !== undefined) {
                        tempData = parameters.onParsingAnFiltering(tempData);
                    }
                    if (parameters.onSaving !== undefined) {
                        parameters.onSaving(tempData);
                    }
                    if (
                        parameters.onSaving !== undefined &&
                        parameters.onSelecting !== undefined
                    ) {
                        tempData = parameters.onSelecting(parameters);
                    }
                }
                console.log("set Data = ", tempData);
                setData(tempData);
                setIsLoading(false);
            } catch (error) {
                console.log(error);
                if (parameters.onError !== undefined) {
                    parameters.onError(error);
                }
                setIsLoading(false);
            }
        }
        dispatchAxios();
    }, [parameters]);

    return [isLoading, data];
};

export default useAPI;
