import { combineReducers } from "redux";
import selectedStockReducer from "./selectedStock";
import stockHistoryReducer from "./stockHistory";
import stockHistoryInMinuteReducer from "./stockHistoryInMinute";
import stockIndexReducer from "./stockIndex";
import stockInfoReducer from "./stockInfo";
import stockReducer from "./stocks";

const rootReducer = combineReducers({
    stock: stockReducer,
    selectedStock: selectedStockReducer,
    stockHistory: stockHistoryReducer,
    stockHistoryInMinute: stockHistoryInMinuteReducer,
    stockIndex: stockIndexReducer,
    stockInfo: stockInfoReducer,
});

export default rootReducer;
