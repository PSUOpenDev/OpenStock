import { ADD_STOCK } from "../actions/stock";

//Load initial State from local storage
const item = localStorage.getItem("stock");

const initState =
    item === null
        ? {
              stockDic: {},
              allStocks: [],
          }
        : JSON.parse(item);

const stockReducer = (state = initState, action) => {
    console.log(action);
    switch (action.type) {
        case ADD_STOCK: {
            if (action.payLoad !== undefined) {
                const newAllStocks = [...state.allStocks];
                const newStockDic = { ...state.stockDic };
                console.log("payLoad", action);
                for (let item of action.payLoad) {
                    if (newStockDic[item.symbol] === undefined) {
                        newStockDic[item.symbol] = item.symbol;
                        newAllStocks.push(item);
                    }
                }

                localStorage.setItem(
                    "stock",
                    JSON.stringify({
                        stockDic: newStockDic,
                        allStocks: newAllStocks,
                    })
                );

                return {
                    stockDic: newStockDic,
                    allStocks: newAllStocks,
                };
            }
            break;
        }

        default:
            return state;
    }
};

export default stockReducer;
