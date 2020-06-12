import React from 'react';

import classes from './Layout.css';

import Toolbar from '../../components/UI/Navigation/Toolbar/Toolbar';
import Footer from '../../components/UI/Footer/Footer';

/*
Wraps the application.
Toolbar and Footer always visible
main is HomePage, StorePage, ClientsPage etc.
*/
const layout = (props) => {
    
    return (
        <div>
            <Toolbar />

            <main className={classes.Content}>
                {props.children}
            </main>

            <Footer/>
        </div>
    );
};

export default layout;  