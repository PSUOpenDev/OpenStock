import React from 'react';
import {ListGroup } from "react-bootstrap";
import { useSelector} from "react-redux";

function SecondComponent(props) {
    const firstObjectList =useSelector((state) =>state.firstObject);
    return (
       <ListGroup>
           {firstObjectList.firstProperty.map(
               (item, index) => 
                   <ListGroup.Item key = {index}> {item} </ListGroup.Item>
               
           )}
       </ListGroup>
    );
}

export default SecondComponent;