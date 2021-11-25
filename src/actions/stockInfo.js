import nextAction from "./nextAction";

export const ADD_STOCK_INFO = nextAction();

export const addStockInfo = (dataForAction) => {
    return {
        type: ADD_STOCK_INFO,
        payLoad: dataForAction,
    };
};
