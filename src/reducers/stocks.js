import { ADD_STOCK } from "../actions/stock";

const item = localStorage.getItem("stock");

const initState = item === null ? {
    stockDic: {},
    allStocks: [],
}: JSON.parse(item);
console.log(initState);
const stockReducer = (state = initState, action) => {
    switch (action.type) {
        case ADD_STOCK: {
            const newAllStocks = [...state.allStocks];
            const newStockDic = { ...state.stockDic };
            console.log("payLoad",action);
            for(let item of action.payLoad) {
                if (newStockDic[item.symbol] === undefined) {
                    newStockDic[item.symbol] = action.payLoad;
                    newAllStocks.push(item);
                }
            }
            
            localStorage.setItem("stock", JSON.stringify({
                stockDic: newStockDic,
                allStocks: newAllStocks,
            }));
            
            return {
                stockDic: newStockDic,
                allStocks: newAllStocks,
            };
        }

        default:
            return state;
    }
};

export default stockReducer;
