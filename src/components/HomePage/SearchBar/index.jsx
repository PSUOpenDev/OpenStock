import React, { useState } from "react";
import { AsyncTypeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import { useSelector, useDispatch } from "react-redux";
import { addStock } from "../../../actions/stock";
import { setSelectedStock } from "../../../actions/selectedStock";
import {
    API_STOCK_QUOTE_KEY,
    API_URL_AUTO_COMPLETE,
<<<<<<< HEAD
} from "../../Common/APIUtils/Yahoo/ApiParameter";
import useAPI from "./../../Common/APIUtils/useAPI";
=======
} from "../../common/APIUtils/Yahoo/ApiParameter";
>>>>>>> 426cc1a152de2b60d7994479f4bf482b3dc0cc67
import "./style.scss";

function SearchBar() {
    const { allStocks } = useSelector((state) => state.stock);
    const [symbolSelected, setSymbolSelected] = useState([]);
    const dispatch = useDispatch();

    const [apiParam, setApiParam] = useState({
        noRun: "yes",
    });
    const [isLoading, data] = useAPI(apiParam);

    const renderMenuItemChildren = (option, index) => {
        return (
            <div className="auto-complete">
                <div key={index}>
                    <strong>{option.stockName}</strong>
                    <div>
                        <small>Symbol: {option.symbol}</small>
                    </div>
                    <div>
                        <small>Exchange: {option.exchange}</small>
                    </div>
                </div>
            </div>
        );
    };

    const handleSearch = async (query) => {
        const handleParsingAndFiltering = (rawData) => {
            console.log(rawData);
            let dataFound = rawData.ResultSet.Result.map(
                ({ exch, name, symbol }) => {
                    return {
                        symbol,
                        exchange: exch,
                        stockName: name,
                    };
                }
            );
            return dataFound;
        };

        const handleSaving = (dataFound) => {
            dispatch(addStock(dataFound));
        };

        const handleSelecting = () => {
            for (let item of allStocks) {
                if (
                    item.stockName.toLowerCase().includes(query.toLowerCase())
                ) {
                    console.log("Stock is in the cache");
                    return allStocks;
                }
            }
            console.log("Stock is not in the cache.Call API");
            return null;
        };

        console.log("CALL SELECTED");
        setApiParam({
            url: API_URL_AUTO_COMPLETE,
            queryString: query,
            apiKey: API_STOCK_QUOTE_KEY,
            onParsingAnFiltering: handleParsingAndFiltering,
            onSaving: handleSaving,
            onSelecting: handleSelecting,
        });
        // const fetchAPI = (URL, API_STOCK_CONFIG) => {
        //     const URL_PARSED = encodeURI(URL + query);
        //     setIsLoading(true);
        //     axios
        //         .get(URL_PARSED, API_STOCK_CONFIG)
        //         .then((res) => {
        //             if (res.result !== null) {
        //                 let dataFound = res.data.ResultSet.Result.map(
        //                     ({ exch, name, symbol }) => {
        //                         return {
        //                             symbol,
        //                             exchange: exch,
        //                             stockName: name,
        //                         };
        //                     }
        //                 );
        //                 console.log("dataFound", dataFound);
        //                 dispatch(addStock(dataFound));
        //             }
        //             setIsLoading(false);
        //         })
        //         .catch((error) => {
        //             console.log("Error: ", error);
        //         });
        // };
        // if (query === "") {
        //     console.log("Query is empty. No stock is selected!");
        //     return;
        // }
        // let found = false;
        // for (let item of allStocks) {
        //     if (item.stockName.toLowerCase().includes(query.toLowerCase())) {
        //         found = true;
        //         console.log("Stock is in the cache");
        //         break;
        //     }
        // }
        // if (found === false) {
        //     console.log("Stock is not in the cache.Call API");
        //     fetchAPI(API_URL_AUTO_COMPLETE, {
        //         method: "GET",
        //         headers: {
        //             accept: "application/json",
        //             "X-API-KEY": API_STOCK_QUOTE_KEY,
        //         },
        //     });
        // }
    };
    const handleSelectedStock = (e) => {
        dispatch(setSelectedStock(e[0]));
        setSymbolSelected(e);
    };

    return (
        <div className="search-bar">
            <AsyncTypeahead
                id="stock-search"
                onSearch={handleSearch}
                options={data !==null ? data:allStocks}
                onChange={handleSelectedStock}
                selected={symbolSelected}
                isLoading={isLoading}
                labelKey="stockName"
                placeholder="Choose a stock..."
                renderMenuItemChildren={renderMenuItemChildren}
            />
        </div>
    );
}

export default SearchBar;
