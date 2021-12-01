import "react-bootstrap-typeahead/css/Typeahead.css";
import "./style.scss";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    API_URL_AUTO_COMPLETE,
} from "../../Common/APIUtils/Yahoo/ApiParameter";
import { AsyncTypeahead } from "react-bootstrap-typeahead";
import { addStock } from "../../../actions/stock";
import apiKeyProvider from "./../../Common/APIUtils/apiKeyProvider";
import { setSelectedStock } from "../../../actions/selectedStock";
import useAPI from "./../../Common/APIUtils/useAPI";

function SearchBar() {
    const { allStocks } = useSelector((state) => state.stock);
    const [symbolSelected, setSymbolSelected] = useState([]);
    const dispatch = useDispatch();
    const [isLoading, data, callAPI] = useAPI({
        noRun: "yes",
    });

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
        const handleParsingAndFiltering = ({ rawData }) => {
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

        const handleSaving = ({ data }) => {
            dispatch(addStock(data));
        };

        const handleSelecting = () => {
            for (let item of allStocks) {
                if (
                    item.stockName.toLowerCase().includes(query.toLowerCase())
                ) {
                    return allStocks;
                }
            }
            return null;
        };

        callAPI({
            url: API_URL_AUTO_COMPLETE,
            queryString: query,
            apiKey: apiKeyProvider("YahooAPI"),
            onParsingAnFiltering: handleParsingAndFiltering,
            onSaving: handleSaving,
            onSelecting: handleSelecting,
        });
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
                options={data !== null ? data : allStocks}
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
