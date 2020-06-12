import React from 'react';

import classes from './ArrElement.css';

//Single line in array.Pass id and body. props.clicked = Clicked handler
// firstTag = text for id (store, barcode etc)
//secondTag = text for body (address, name etc)
const arrElement = (props) => {
    return (
        <div className={classes.Element} onClick={props.clicked}>
            <div>
                {props.firstTag}: {props.id}
            </div>
            <div>
                {props.secondTag}: {props.body}
            </div>
        </div>
    );
}

export default arrElement;