import { combineReducers } from "redux";
import stockReducer from "./stocks";
import selectedStockReducer from "./selectedStock";
import stockHistoryReducer from "./stockHistory";
import stockIndexReducer from "./stockIndex";
import stockInfoReducer from "./stockInfo";
const rootReducer = combineReducers({
    stock: stockReducer,
    selectedStock: selectedStockReducer,
    stockHistory: stockHistoryReducer,
    stockIndex: stockIndexReducer,
    stockInfo: stockInfoReducer,
});

export default rootReducer;
