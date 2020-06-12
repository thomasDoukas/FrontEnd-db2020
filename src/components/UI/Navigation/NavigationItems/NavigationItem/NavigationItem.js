import React from 'react';
import { NavLink } from 'react-router-dom';

import classes from './NavigationItem.css';

/*
List Item = navigation item of toolbar (Button).
props:
    link
    active (boolean)
    children (text)
*/ 

const navigationItem = (props) => {
    return (    
        <li className={classes.NavigationItem}>
            <NavLink
                to={props.link}
                activeClassName={classes.active}
            >
                {props.children}
            </NavLink>
        </li>
    );
};

export default navigationItem;