import nextAction from './nextAction';

export const ACTION_ONE = nextAction();
export const ACTION_TWO = nextAction();

export const actionOne = (dataForAction)  => {
    return {
        type : ACTION_ONE,
        payLoad: dataForAction
    }
}

export const actionTwo = (dataForAction)  => {
    return {
        type : ACTION_TWO,
        payLoad: dataForAction
    }
}
