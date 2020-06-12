import React from 'react';

import classes from './Footer.css';

import Copyright from './Copyright/Copyright';
import Donate from './Donate/Donate'
import Contact from './Contact/Contact';

/*
Static Footer Wrapper
*/
const footer = () => {
    return (
        <div className={classes.Footer}>
            <Contact/>
            <Donate/>
            <Copyright/>
        </div>
    );
};

export default footer;