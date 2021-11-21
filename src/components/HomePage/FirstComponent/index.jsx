import React from "react";
import { useDispatch } from "react-redux";
import { ACTION_ONE } from "../../../actions/firstObject";

function FirstComponent(props) {
    const dispatch = useDispatch();
    const handleAddNewList = () => {
        const newItem = "Item";

        //Change the state
        dispatch({
            type: ACTION_ONE,
            payload: newItem,
        });
    };

    return (
        <div>
            <button onClick={handleAddNewList}>Test</button>
        </div>
    );
}

export default FirstComponent;
