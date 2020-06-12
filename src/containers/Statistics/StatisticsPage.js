import React, { Component } from 'react';
import axios from '../../axios.js';

import classes from './StatisticsPage.css';

//Page of all stores in database
class StatisticsPage extends Component {

    state = {
        selectedTab: "select1",
        statistics: null
    }

    //Set URL /stores/getStoreList
    componentDidMount() {
        axios.get('/posts')
            .then(res =>
                this.setState({ stores: res.data })
            )
            .catch(err => {
                console.log(err);
                this.props.history.push("/aWildErrorHasAppeared");
            })
    }

    changeTabHandler = ( event ) => {
        this.setState({ selectedTab: event.target.value });
    }

    

    render() {

        let output = <div> Loading... </div>;
        switch (this.state.selectedTab) {
            case "select1":
                output = <div>
                    select1
                </div>;
                break;
            case "select2":
                output = <div>
                    select2
                </div>;
                break;
            case "select3":
                output = <div>
                    select3
                </div>;
                break;
            case "select4":
                output = <div>
                    select4
                </div>;
                break;
            case "select5":
                output = <div>
                    select5
                </div>;
                break;
            case "select6":
                output = <div>
                    select6
                </div>;
                break;
            case "select7":
                output = <div>
                    select7
                </div>;
                break;
            case "select8":
                output = <div>
                    select8
                </div>;
                break;
            default:
                output = <div>
                    default
                </div>;
        }

                return (
                    <div className={classes.Content}>
                        <button value={("select1")} onClick={this.changeTabHandler} activeClassName={classes.active} > select1 </button>
                        <button value={("select2")} onClick={this.changeTabHandler} activeClassName={classes.active} > select2 </button>
                        <button value={("select3")} onClick={this.changeTabHandler} activeClassName={classes.active} > select3 </button>
                        <button value={("select4")} onClick={this.changeTabHandler} activeClassName={classes.active} > select4 </button>
                        <button value={("select5")} onClick={this.changeTabHandler} activeClassName={classes.active} > select5 </button>
                        <button value={("select6")} onClick={this.changeTabHandler} activeClassName={classes.active} > select6 </button>
                        <button value={("select7")} onClick={this.changeTabHandler} activeClassName={classes.active} > select7 </button>

                        <div> {output} </div>
                    </div>
                );

        }
    }

    export default StatisticsPage;