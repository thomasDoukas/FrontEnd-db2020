import React from 'react';

import classes from './ArrElement.css';

//Single line in array.Pass id and body. props.clicked = Clicked handler
// firstTag = text for id (store, barcode etc)
//secondTag = text for body (address, name etc)
const arrElement = (props) => {

    let output = null;
    let extraInfo, moreExtraInfo, evenMoreExtraInfo = null;
    if (props.thirdTag && props.secondaryBody) {
        extraInfo = <div> {props.thirdTag}: {props.secondaryBody} </div>
    }
    if (props.fourthTag && props.tertiaryBody) {
        moreExtraInfo = <div> {props.fourthTag}: {props.tertiaryBody} </div>
    }
    if (props.fifthTag && props.quaternaryBody) {
        evenMoreExtraInfo = <div> {props.fifthTag}: {props.quaternaryBody} </div>
    }

    output =
        <div className={classes.Element} onClick={props.clicked}>
            <div>
                {props.firstTag}: {props.id}
            </div>

            <div>
                {props.secondTag}: {props.body}
            </div>

            {extraInfo}

            {moreExtraInfo}

            {evenMoreExtraInfo}

            <div>
                {props.children}
            </div>
        </div>

    return (
        output
    );
}

export default arrElement;