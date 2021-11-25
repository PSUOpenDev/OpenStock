import nextAction from "./nextAction";

export const ADD_NEW_HIS_DATA = nextAction();

export const UPDATE_HIS_DATA = nextAction();

export const addStockHistory = (dataForAction) => {
    return {
        type: ADD_NEW_HIS_DATA,
        payLoad: dataForAction,
    };
};

export const updateStockHistory = (dataForAction) => {
    return {
        type: UPDATE_HIS_DATA,
        payLoad: dataForAction,
    };
};
