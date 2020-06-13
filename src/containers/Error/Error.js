import React, { Component } from 'react';

import classes from './Error.css';

//Starting page of the application
class HomePage extends Component {

    backHandler = () => {
        this.props.history.goBack();
    }

    render() {
        let message = this.props.match.params.errorMessage;
        return (
            <div className={classes.Content}>
                <div className={classes.Message}> Oops! Something went terribly wrong! </div>
                <div className={classes.Message}> {message} </div>
                <button className={classes.Back} onClick={this.backHandler} > Back </button>
            </div>
        );
    }
}

export default HomePage;