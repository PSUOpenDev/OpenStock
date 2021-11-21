import firstObjectReducer from "./firstObject";
import secondObjectReducer from "./secondObject";
import { combineReducers } from "redux";
import stockReducer from "./stocks";

const rootReducer = combineReducers({
    firstObject: firstObjectReducer,
    secondObject: secondObjectReducer,
    stock:stockReducer,
});

export default rootReducer;
