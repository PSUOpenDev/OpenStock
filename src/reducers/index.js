import firstObjectReducer from "./firstObject";
import secondObjectReducer from "./secondObject";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
    firstObject: firstObjectReducer,
    secondObject: secondObjectReducer,
});

export default rootReducer;
