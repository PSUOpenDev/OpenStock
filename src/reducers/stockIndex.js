import { UPDATE_STOCK_INDEX } from "../actions/stockIndex";

//Load initial State from local storage
const item = localStorage.getItem("stockIndex");
const sAndP = {
    shortName: "S&P 500",
    currentValue: 4668.03,
    currentValueChange: 14.91,
    currentValueChangePercent: -0.32,
    apiTime: 0,
    symbol: "^GSPC",
};
const down30 = {
    shortName: "Down 30",
    currentValue: 35636.32,
    currentValueChange: 17.07,
    currentValueChangePercent: 0.05,
    apiTime: 0,
    symbol: "^DJI",
};
const nasdaq = {
    shortName: "Nasdaq",
    currentValue: 15696.77,
    currentValueChange: -14.91,
    currentValueChangePercent: -1.0,
    apiTime: 0,
    symbol: "^IXIC",
};
const bitcoin = {
    shortName: "Bitcoin",
    currentValue: 54937.332,
    currentValueChange: 619.53125,
    currentValueChangePercent: +1.1405708,
    apiTime: 0,
    symbol: "BTC-USD",
};
const crudeOil = {
    shortName: "Crude Oil",
    currentValue: 77.81,
    currentValueChange: 1.06,
    currentValueChangePercent: +1.38,
    apiTime: 0,
    symbol: "CL=F",
};
const gold = {
    shortName: "Gold",
    currentValue: 1784.9,
    currentValueChange: -21.4,
    currentValueChangePercent: -1.18,
    apiTime: 0,
    symbol: "GC=F",
};
const initState =
    item === null
        ? {
              indexDic: {
                  "^GSPC": sAndP,
                  "^DJI": down30,
                  "^IXIC": nasdaq,
                  "CL=F": crudeOil,
                  "GC=F": gold,
                  "BTC-USD": bitcoin,
              },
              allAllIndexes: [sAndP, down30, nasdaq, crudeOil, gold, bitcoin],
          }
        : JSON.parse(item);

const stockIndexReducer = (state = initState, action) => {
    switch (action.type) {
        case UPDATE_STOCK_INDEX: {
            // if (action.payLoad !== undefined) {
            //     for (let item of action.payLoad) {
            //         if (state.indexDic[item.symbol] === undefined) {
            //             state.indexDic[item.symbol] = item;
            //         }
            //     }
            //     localStorage.setItem("stockIndex", JSON.stringify(state));

            //     return state;
            // }
            // break;
            return state;
        }

        default:
            return state;
    }
};

export default stockIndexReducer;
