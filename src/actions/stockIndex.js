import nextAction from './nextAction';

export const UPDATE_STOCK_INDEX = nextAction();


export const updateStockIndex = (dataForAction)  => {
    return {
        type : UPDATE_STOCK_INDEX,
        payLoad: dataForAction
    }
}

