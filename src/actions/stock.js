import nextAction from './nextAction';

export const ADD_STOCK = nextAction();


export const addStock = (dataForAction)  => {
    return {
        type : ADD_STOCK,
        payLoad: dataForAction
    }
}

