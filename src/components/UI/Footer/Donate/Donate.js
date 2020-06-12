import React from 'react';

import classes from './Donate.css';

const donate = () => {

    const clickedHandler = () => {
        alert("You sir, are awesome");
    }

    return (
        <div className={classes.Donate}>
            <div className={classes.Text} >
                <p>
                    We can do this without you!
                    <br/>
                    But it would be nice to have at least some support.
                    <br/>
                    We only accept bitcoin.
                </p>
            </div>

            <button onClick={clickedHandler}> Donate! Pls </button>
        </div>
    );
};

export default donate;