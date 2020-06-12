import React from 'react';

import classes from './Toolbar.css';

import NavigationItems from '../NavigationItems/NavigationItems';
import Logo from '../../../Logo/Logo';

/*
Toolbar component
Contains Logo and Navigation buttons 
*/
const toolbar = () => {
    return (
        <header className={classes.Toolbar}>
            <div className={classes.Logo}>
                <Logo />
            </div>
            
            <nav>
                <NavigationItems/>
            </nav>
        </header>
    );
};

export default toolbar;