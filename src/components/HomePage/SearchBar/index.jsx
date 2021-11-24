import React, { useState } from "react";
import { AsyncTypeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import { useSelector, useDispatch } from "react-redux";
import { addStock } from "../../../actions/stock";
import { setSelectedStock } from "../../../actions/selectedStock";
import axios from "axios";
import {
    API_STOCK_QUOTE_KEY,
    API_URL_AUTO_COMPLETE,
} from "../../Common/APIUtils/Yahoo/ApiParameter";

function SearchBar() {
    const [isLoading, setIsLoading] = useState(false);
    const { allStocks } = useSelector((state) => state.stock);
    const [symbolSelected, setSymbolSelected] = useState([]);
    const dispatch = useDispatch();

    const renderMenuItemChildren = (option, index) => {
        return (
            <div key={index}>
                <div>{option.stockName}</div>
                <div>
                    <small>Symbol: {option.symbol}</small>
                </div>
                <div>
                    <small>Exchange: {option.exchange}</small>
                </div>
            </div>
        );
    };

    const handleSearch = (query) => {
        const fetchAPI = (URL, API_STOCK_CONFIG) => {
            const URL_PARSED = encodeURI(URL + query);
            setIsLoading(true);
            axios
                .get(URL_PARSED, API_STOCK_CONFIG)
                .then((res) => {
                    if (res.result !== null) {
                        let dataFound = res.data.ResultSet.Result.map(
                            ({ exch, name, symbol }) => {
                                return {
                                    symbol,
                                    exchange: exch,
                                    stockName: name,
                                };
                            }
                        );
                        dispatch(addStock(dataFound));
                    }

                    setIsLoading(false);
                })
                .catch((error) => {
                    console.log("Error: ", error);
                });
        };
        let found = false;
        console.log("query=",query);

        if (query ==="") {
            dispatch(setSelectedStock(null));
            return;
        }
        for (let item of allStocks) {
            console.log("query=",query);
            console.log(item.stockName.toLowerCase().includes(query.toLowerCase));
            if (item.stockName.toLowerCase().includes(query.toLowerCase())) {
                console.log("The stock is caching!");
                found = true;
                break;
            }
        }
        if (found === false) {
            console.log("Call API to get the stock!");
            fetchAPI(API_URL_AUTO_COMPLETE, {
                method: "GET",
                headers: {
                    accept: "application/json",
                    "X-API-KEY": API_STOCK_QUOTE_KEY,
                },
            });
        }
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
                options={allStocks}
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
