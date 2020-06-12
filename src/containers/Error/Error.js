import React, { Component } from 'react';

import classes from './Error.css';

//Starting page of the application
class HomePage extends Component {

    backHandler = () => {
        this.props.history.goBack();
    }

    render() {
        return (
            <div className={classes.Content}>
                <div className={classes.Message}> Oops! Something went terribly wrong! </div>
                <button className={classes.Back} onClick={this.backHandler} > Back </button>
            </div>
        );
    }
}

export default HomePage;