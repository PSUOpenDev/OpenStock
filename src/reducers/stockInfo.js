import { ADD_STOCK_INFO } from "../actions/stockInfo";

//Load initial State from local storage
const item = localStorage.getItem("stockInfo");

const initState =
    item === null
        ? {
              stockInfoDic: {},
          }
        : JSON.parse(item);

const stockInfoReducer = (state = initState, action) => {
    switch (action.type) {
        case ADD_STOCK_INFO: {
            if (action.payLoad !== undefined) {
                state.stockInfoDic[action.payLoad.symbol] = {
                    ...action.payLoad,
                };

                localStorage.setItem("stockInfo", JSON.stringify(state));
                return state;
            }
            break;
        }

        default:
            return state;
    }
};

export default stockInfoReducer;
