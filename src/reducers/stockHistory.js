import { UPDATE_HIS_DATA } from "../actions/stockHistory";

//Load initial State from local storage
const item = localStorage.getItem("stockHistory");

const initState = item === null ? {} : JSON.parse(item);

const stockHistoryReducer = (state = initState, action) => {
    switch (action.type) {
        case UPDATE_HIS_DATA: {
            console.log("action ", action);
            if (state[action.payLoad.symbol] === undefined) {
                const symbol = action.payLoad.symbol;
                const symbolData = action.payLoad.history;
                state[symbol] = symbolData;
                const returnState = {
                    ...state,
                };
                console.log("stock is not exist, new state is ", returnState);
                localStorage.setItem(
                    "stockHistory",
                    JSON.stringify(returnState)
                );
                return returnState;
            } else {
                const newState = { ...state };

                const firstDateOfNewData = action.payLoad.history.firstDate;
                console.log("firstDateOfNewData", firstDateOfNewData);
                const firstDateOfCurrentData =
                    state[action.payLoad.symbol].firstDate;

                console.log("firstDateOfCurrentData", firstDateOfCurrentData);

                if (firstDateOfNewData < firstDateOfCurrentData) {
                    for (
                        let i = 0;
                        i < action.payLoad.history.history.length;
                        i++
                    ) {
                        if (
                            action.payLoad.history.history[i].date <
                            firstDateOfCurrentData
                        ) {
                            newState[action.payLoad.symbol].history.unshift(
                                action.payLoad.history.history[i]
                            );
                        } else {
                            break;
                        }
                    }
                    newState[action.payLoad.symbol].firstDate =
                        firstDateOfNewData;
                }

                const lastDateOfNewData = action.payLoad.history.lastDate;
                console.log("lastDateOfNewData", lastDateOfNewData);
                const lastDateOfCurrentData =
                    state[action.payLoad.symbol].lastDate;
                console.log("lastDateOfCurrentData", lastDateOfCurrentData);
                if (lastDateOfNewData > lastDateOfCurrentData) {
                    for (
                        let i = action.payLoad.history.history.length - 1;
                        i >= 0;
                        i--
                    ) {
                        if (
                            action.payLoad.history.history[i].date >
                            lastDateOfCurrentData
                        ) {
                            newState[action.payLoad.symbol].history.push(
                                action.payLoad.history.history[i]
                            );
                        } else {
                            break;
                        }
                    }

                    newState[action.payLoad.symbol].lastDate =
                        lastDateOfNewData;
                }
                console.log("stock is exist, new state is ", newState);
                localStorage.setItem("stockHistory", JSON.stringify(newState));
                return newState;
            }
        }

        default:
            return state;
    }
};

export default stockHistoryReducer;
