import React, { useEffect, useState } from "react";
import axios from "axios";

/* EXAMPLE OF FETCHING API COMPONENTS */
export const StockQuoteAPIComponent = () => {
    const [data, setData] = useState([]);

    const API_STOCK_QUOTE_KEY = "pc48d4pb9NG6pzf22DWl7zBJ2ijSHAcaVg7eFaRg"
    const STOCK_QUOTE_URL = "https://yfapi.net/v6/finance/quote?region=US&lang=en&symbols=AAPL%2CBTC-USD%2CEURUSD%3DX"


    const fetchAPI = (URL, API_STOCK_CONFIG) => {
        axios.get(URL, API_STOCK_CONFIG)
            .then((res) => {
                console.log(res.data)
                setData(res.data)
            })
            .catch((error) => {
                console.log("Error: ", error)
            })
    }

    useEffect(() => {
        fetchAPI(STOCK_QUOTE_URL, 
            {
                method: "GET",
                headers: {
                    "accept": "application/json",
                    "X-API-KEY": API_STOCK_QUOTE_KEY,
                }
            }
        )
    }, [])
    

    return (
        <React.Fragment>
            <div>Render API</div>
            <div>
                <pre>
                    <code>{ JSON.stringify(data, null, 2) }</code>
                </pre>
            </div>
        </React.Fragment>
    )
}