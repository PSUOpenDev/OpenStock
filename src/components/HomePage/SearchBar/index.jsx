import React, { useState } from "react";
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
const options = [
    {
        stockName: "APPLE",
        price: 100.12,
    },
    {
        stockName: "Tesla",
        price: 111.12,
    },
];
function SearchBar() {
    const [selected, setSelected] = useState([]);
    return (
        <div className="search-bar">
            <Typeahead
                id="stock-search"
                onChange={setSelected}
                options={options}
                selected={selected}
                labelKey="stockName"
                placeholder="Choose a stock..."
            />
        </div>
    );
}

export default SearchBar;
