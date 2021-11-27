import nextAction from "./nextAction";

export const ADD_NEW_HIS_DATA_IN_MINUTE = nextAction();

export const UPDATE_HIS_DATA_IN_MINUTE = nextAction();

export const addStockHistoryInMinute = (dataForAction) => {
    return {
        type: ADD_NEW_HIS_DATA_IN_MINUTE,
        payLoad: dataForAction,
    };
};

export const updateStockHistoryInMinute = (dataForAction) => {
    return {
        type: UPDATE_HIS_DATA_IN_MINUTE,
        payLoad: dataForAction,
    };
};
