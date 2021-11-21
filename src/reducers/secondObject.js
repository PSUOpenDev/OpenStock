const initState = {
    firstProperty: "Test",
    secondProperty: 10,
};

const secondObjectReducer = (state = initState, action) => {
    switch (action.type) {
        case "ACTION_ONE": {
            if (state.firstProperty === "Ok") state.firstProperty = "Yes";
            return state;
        }

        default:
            return state;
    }
};

export default secondObjectReducer;
