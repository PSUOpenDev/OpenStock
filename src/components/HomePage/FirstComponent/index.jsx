import React from "react";
import { useDispatch } from "react-redux";
import { actionOne } from "../../../actions/firstObject";

function FirstComponent(props) {
    const dispatch = useDispatch();
    const handleAddNewList = () => {
        const newItem = "Item";

        //Change the state
        dispatch(actionOne(newItem));
    };

    return (
        <div>
            <button onClick={handleAddNewList}>Test</button>
        </div>
    );
}

export default FirstComponent;
