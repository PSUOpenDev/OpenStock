import { SET_SELECTED_STOCK } from "../actions/selectedStock";

const initState = null;

const selectedStockReducer = (state = initState, action) => {
    switch (action.type) {
        case SET_SELECTED_STOCK: {
            return {
                ...action.payLoad,
            };
        }

        default:
            return state;
    }
};

export default selectedStockReducer;
