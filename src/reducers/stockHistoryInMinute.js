import { UPDATE_HIS_DATA_IN_MINUTE } from "../actions/stockHistoryInMinute";

//Load initial State from local storage
const item = localStorage.getItem("stockHistoryInMinute");

const initState = item === null ? {} : JSON.parse(item);

const stockHistoryInMinuteReducer = (state = initState, action) => {
    switch (action.type) {
        case UPDATE_HIS_DATA_IN_MINUTE: {
            if (state[action.payLoad.symbol] === undefined) {
                const symbol = action.payLoad.symbol;
                const symbolData = action.payLoad.history;
                state[symbol] = symbolData;
                const returnState = state;

                localStorage.setItem(
                    "stockHistoryInMinute",
                    JSON.stringify(returnState)
                );
                return returnState;
            } else {
                const newState = state;
                const firstDateOfNewData = action.payLoad.history.firstDate;
                const firstDateOfCurrentData =
                    state[action.payLoad.symbol].firstDate;

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
                const lastDateOfCurrentData =
                    state[action.payLoad.symbol].lastDate;

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
                localStorage.setItem(
                    "stockHistoryInMinute",
                    JSON.stringify(newState)
                );
                return newState;
            }
        }

        default:
            return state;
    }
};

export default stockHistoryInMinuteReducer;
