import React from 'react';

import classes from './NavigationItems.css';

import NavigationItem from './NavigationItem/NavigationItem';

//Unordered List of navigation items of toolbar
const navigationItems = () => (
    <ul className={classes.NavigationItems}>
        <NavigationItem link='/Stores'> Stores </NavigationItem>
        <NavigationItem link='/Products'> Products </NavigationItem>
        <NavigationItem link='/Clients'> Clients </NavigationItem>
        <NavigationItem link='/Transactions'> Transactions </NavigationItem>
        <NavigationItem link='/Statistics'> Statistics </NavigationItem>
    </ul>
);

export default navigationItems;