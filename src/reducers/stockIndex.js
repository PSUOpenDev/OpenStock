import { UPDATE_STOCK_INDEX } from "../actions/stockIndex";

//Load initial State from local storage
const item = localStorage.getItem("stockIndex");

const initState =
    item === null
        ? {
              indexDic: {},
              allAllIndexes: [
                  {
                      shortName: "S&P 500",
                      currentValue: 4668.03,
                      currentValueChange: 14.91,
                      currentValueChangePercent: -0.32,
                      apiTime: 0,
                      symbol: '^GSPC'
                  },
                  {
                      shortName: "Down 30",
                      currentValue: 35636.32,
                      currentValueChange: 17.07,
                      currentValueChangePercent: 0.05,
                      apiTime: 0,
                      symbol: '^DJI'
                  },
                  {
                      shortName: "Nasdaq",
                      currentValue: 15696.77,
                      currentValueChange: -14.91,
                      currentValueChangePercent: -1.0,
                      apiTime: 0,
                      symbol:'^IXIC'
                  },
                  {
                      shortName: "Cruid Oil",
                      currentValue: 77.81,
                      currentValueChange: 1.06,
                      currentValueChangePercent: +1.38,
                      apiTime: 0,
                      symbol:'CL=F'
                  },
                  {
                      shortName: "Gold",
                      currentValue: 1784.9,
                      currentValueChange: -21.4,
                      currentValueChangePercent: -1.18,
                      apiTime: 0,
                      symbol: 'GC=F'
                  },
              ],
          }
        : JSON.parse(item);

const stockIndexReducer = (state = initState, action) => {
    switch (action.type) {
        case UPDATE_STOCK_INDEX: {
            console.log("action = ", action);
            if (action.payLoad !== undefined) {
                const newAllIndexes = [...action.payLoad];
                const newIndexDic = {};
                for (let item of newAllIndexes) {
                    if (newIndexDic[item.shortName] === undefined) {
                        newIndexDic[item.shortName] = item;
                    }
                }
                const newState = {
                    indexDic: newIndexDic,
                    allAllIndexes: newAllIndexes,
                };
                localStorage.setItem("stockIndex", JSON.stringify(newState));

                return newState;
            }
            break;
        }

        default:
            return state;
    }
};

export default stockIndexReducer;
