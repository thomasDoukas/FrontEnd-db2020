import React from 'react';
import { NavLink } from 'react-router-dom';

import classes from './Logo.css';

import dbLogo from '../../assets/images/logo.svg';

//Display the application logo in Toolbar
const logo = (props) => (
    <div className={classes.Logo} style={{height: props.height}}>
        <NavLink
            to='/'
        >
            <img src={dbLogo} className="Logo" alt="logo" />
        </NavLink>
    </div>
);

export default logo;