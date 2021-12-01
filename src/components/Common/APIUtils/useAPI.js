import { useEffect, useState } from "react";

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
const useAPI = (initialParam = initialState) => {
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState(null);
    const [parameter, setParameter] = useState(initialParam);
    useEffect(() => {
        const dispatchAxios = async () => {
            try {
                if (parameter.noRun !== undefined) {
                    setIsLoading(false);

                    return;
                }
                setIsLoading(true);
                let tempData = null;
                if (parameter.onSelecting !== undefined) {
                    tempData = parameter.onSelecting({
                        apiParameter: parameter,
                        data: tempData,
                    });
                  
                }
                
                if (tempData === undefined) {
                    return;
                }
                if (tempData === null) {
                    console.log(
                        "Call API(" +
                            encodeURI(parameter.url + parameter.queryString) +
                            ")"
                    );
                    let response = null;
                    if (parameter.apiKey !== "") {
                        response = await axios.get(
                            encodeURI(parameter.url + parameter.queryString),
                            {
                                method: "GET",
                                headers: {
                                    accept: "application/json",
                                    "X-API-KEY": parameter.apiKey,
                                },
                            }
                        );
                    } else {
                        response = await axios.get(
                            encodeURI(parameter.url + parameter.queryString)
                        );
                    }

                    tempData = response.data;

                    if (tempData === null) {
                        throw new Error("No data return from API!");
                    }

                    if (parameter.onParsingAnFiltering !== undefined) {
                        tempData = parameter.onParsingAnFiltering({
                            rawData: tempData,
                        });
                    }
                    if (parameter.onSaving !== undefined) {
                        parameter.onSaving({ data: tempData });
                    }
                    if (
                        parameter.onSaving !== undefined &&
                        parameter.onSelecting !== undefined
                    ) {
                        tempData = parameter.onSelecting({
                            apiParameter: parameter,
                            data: tempData,
                        });
                    }
                }

                setData(tempData);
                setIsLoading(false);
            } catch (error) {
                if (parameter.onError !== undefined) {
                    parameter.onError({
                        apiParameter: parameter,
                        error,
                        setData,
                    });
                }
                setIsLoading(false);
            }
        };
        dispatchAxios();
    }, [parameter]);

    return [isLoading, data, setParameter];
};

export default useAPI;
