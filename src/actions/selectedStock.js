import nextAction from "./nextAction";

export const SET_SELECTED_STOCK = nextAction();

export const setSelectedStock = (dataForAction) => {
    return {
        type: SET_SELECTED_STOCK,
        payLoad: dataForAction,
    };
};
