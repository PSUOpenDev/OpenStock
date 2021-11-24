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
const useAPI = (initialParam = initialState) => {
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState(null); 
    const [parameter,setParameter] = useState(initialParam);
    useEffect(()=>{
        console.log("Run useEffect");
        const dispatchAxios = async () => {
            try {
                if (parameter.noRun !== undefined) {
                    setIsLoading(false);
                    console.log("Oh no you set me norun=",parameter.noRun)
                    return;
                }
                setIsLoading(true);
                let tempData = null;
                if (parameter.onSelecting !== undefined) {
                    tempData = parameter.onSelecting(parameter);
                    console.log("tempdata =", tempData);
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
                    console.log("return here");
                    tempData = response.data;
    
                    if (tempData === null) {
                        throw new Error("No data return from API!");
                    }
    
                    if (parameter.onParsingAnFiltering !== undefined) {
                        tempData = parameter.onParsingAnFiltering(tempData);
                    }
                    if (parameter.onSaving !== undefined) {
                        parameter.onSaving(tempData);
                    }
                    if (
                        parameter.onSaving !== undefined &&
                        parameter.onSelecting !== undefined
                    ) {
                        tempData = parameter.onSelecting(parameter);
                    }
                }
                console.log("set Data = ", tempData);
                setData(tempData);
                setIsLoading(false);
            } catch (error) {
                console.log(error);
                if (parameter.onError !== undefined) {
                    parameter.onError(error);
                }
                setIsLoading(false);
                console.log("lo roi ", error);
            }
        };
        dispatchAxios();
    },[parameter])
    

    return [isLoading, data,setParameter];
};

export default useAPI;
