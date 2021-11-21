import { combineReducers } from "redux";
import stockReducer from "./stocks";

const rootReducer = combineReducers({
    stock: stockReducer,
});

export default rootReducer;
