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
                const newStockDic = { ...state.stockInfoDic };
               
                newStockDic[action.payLoad.symbol] = {...action.payLoad};

                const returnValue = { stockInfoDic: newStockDic };

                localStorage.setItem("stockInfo", JSON.stringify(returnValue));
                return returnValue;
            }
            break;
        }

        default:
            return state;
    }
};

export default stockInfoReducer;
