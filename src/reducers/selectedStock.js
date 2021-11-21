import { ADD_SELECTED_STOCK as SET_SELECTED_STOCK } from "../actions/selectedStock";


const initState ={ };

const stockReducer = (state = initState, action) => {
    switch (action.type) {
        case SET_SELECTED_STOCK: {      
            return {
                ...action.payLoad
            };
        }

        default:
            return state;
    }
};

export default stockReducer;
