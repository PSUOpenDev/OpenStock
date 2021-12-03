import "react-bootstrap-typeahead/css/Typeahead.css";
import "./style.scss";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { API_URL_AUTO_COMPLETE } from "../../Common/APIUtils/Yahoo/ApiParameter";
import { AsyncTypeahead } from "react-bootstrap-typeahead";
import { addStock } from "../../../actions/stock";
import apiKeyProvider from "./../../Common/APIUtils/apiKeyProvider";
import { setSelectedStock } from "../../../actions/selectedStock";
import useAPI from "./../../Common/APIUtils/useAPI";



export default SearchBar;
