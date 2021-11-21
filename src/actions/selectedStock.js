import nextAction from './nextAction';

export const ADD_SELECTED_STOCK = nextAction();


export const addSelectedStock = (dataForAction)  => {
    return {
        type : ADD_SELECTED_STOCK,
        payLoad: dataForAction
    }
}

