import { useSelector, useDispatch } from "react-redux";
import FirstComponent  from "../../components/HomePage/FirstComponent";
import { ACTION_ONE } from "../../actions/firstObject";

function HomePage() {
    const firstObjectList = useSelector((state) => state.firstObject.list);
    const dispatch = useDispatch();

    const handleAddListClick = () => {
        const newItem = "Items";
        firstObjectList.push(newItem);
        dispatch({
            type: ACTION_ONE,
            payload: [...firstObjectList],
        });
    };

    return (
        <div>
            <FirstComponent data={firstObjectList} />
            <button onClick = {handleAddListClick} ></button>
        </div>
    );
}

export default HomePage;
