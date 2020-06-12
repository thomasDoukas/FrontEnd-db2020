import React from 'react';

import classes from './Contact.css';

const contact = () => {

    const clickedHandler = () => {
        alert("As i said... We will not get right back at you!");
    }

    return (
        <div className={classes.Contact}>
            <div className={classes.Text}>
                <p>
                    Please feel free to reach out to us!
                    <br />
                    It's highly unlikely that anyone will respond.
                </p>
            </div>

            <div>
                <input type="text" id="email" name="email" placeholder="Your Email" className={classes.Email} />
            </div>

            <div>
                <textarea id="message" name="message" placeholder="Your Message" className={classes.Message} ></textarea>
            </div>

            <button onClick={clickedHandler}> Send </button>
        </div>
    );
};

export default contact;