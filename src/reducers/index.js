import { combineReducers } from "redux";
import stockReducer from "./stocks";
import selectedStockReducer from "./selectedStock";
import stockHistoryReducer from "./stockHistory";
const rootReducer = combineReducers({
    stock: stockReducer,
    selectedStock:selectedStockReducer,
    stockHistory:stockHistoryReducer
});

export default rootReducer;
