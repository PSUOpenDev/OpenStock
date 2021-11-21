import { ACTION_ONE, ACTION_TWO } from "../actions/firstObject";

const initState = {
    firstProperty: ["ABC", "DFE", "AFG"],
    secondProperty: null,
};

const firstObjectReducer = (state = initState, action) => {
    switch (action.type) {
        case ACTION_ONE: {
            const newList = [...state.firstProperty];
            newList.push(action.payload);
            return {
                ...state,
                firstProperty: newList,
            };
        }
        case ACTION_TWO: {
            return state;
        }

        default:
            return state;
    }
};

export default firstObjectReducer;
