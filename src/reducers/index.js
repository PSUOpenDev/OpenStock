import { combineReducers } from "redux";
import selectedStockReducer from "./selectedStock";
import stockHistoryReducer from "./stockHistory";
import stockIndexReducer from "./stockIndex";
import stockInfoReducer from "./stockInfo";
import stockReducer from "./stocks";

const rootReducer = combineReducers({
    stock: stockReducer,
    selectedStock: selectedStockReducer,
    stockHistory: stockHistoryReducer,
    stockIndex: stockIndexReducer,
    stockInfo: stockInfoReducer,
});

export default rootReducer;
