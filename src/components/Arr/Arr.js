import React from 'react';

import classes from './Arr.css';

//Single line in array.Pass id and body.
const arr = (props) => (
    <div className={classes.Array}>
        {props.children}
    </div>
)

export default arr;