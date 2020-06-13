import React, { Component } from 'react';
import axios from '../../axios.js';

import classes from './StatisticsPage.css';

//Page of all stores in database
class StatisticsPage extends Component {

    state = {
        selectedTab: "select1",
        tabData: null
    }

    componentDidMount() {
        axios.get('/postsss')
            .then(res =>
                this.setState({ tabData: res.data[1].body })
            )
            .catch(err => {
                this.props.history.push("/aWildErrorHasAppeared/" + err.message);
            })
    }

    changeTabHandler = (link, number, event) => {
        let tab = event.target.value;
        axios.get(link)
            .then(res => {
                this.setState({tabData: res.data[number].body, selectedTab: tab})
            })
            .catch(err => {
                console.log(err);
                this.props.history.push("/aWildErrorHasAppeared");
            })
    }

    render() {

        let output = <div> Loading... </div>;
        output = <div> {this.state.tabData} </div>
        
        return (
            <div className={classes.Content}>
                <button value={"select1"} onClick={this.changeTabHandler.bind(this, "/posts", 1)} className = { (this.state.selectedTab==="select1") ? classes.active : null }> select1 </button>
                <button value={"select2"} onClick={this.changeTabHandler.bind(this, "/posts", 2)} className = { (this.state.selectedTab==="select2") ? classes.active : null }> select2 </button>
                <button value={"select3"} onClick={this.changeTabHandler.bind(this, "/posts", 3)} className = { (this.state.selectedTab==="select3") ? classes.active : null }> select3 </button>
                <button value={"select4"} onClick={this.changeTabHandler.bind(this, "/posts", 4)} className = { (this.state.selectedTab==="select4") ? classes.active : null }> select4 </button>
                <button value={"select5"} onClick={this.changeTabHandler.bind(this, "/posts", 5)} className = { (this.state.selectedTab==="select5") ? classes.active : null }> select5 </button>
                <button value={"select6"} onClick={this.changeTabHandler.bind(this, "/posts", 6)} className = { (this.state.selectedTab==="select6") ? classes.active : null }> select6 </button>
                <button value={"select7"} onClick={this.changeTabHandler.bind(this, "/posts", 7)} className = { (this.state.selectedTab==="select7") ? classes.active : null }> select7 </button>

                <br/>
                <br/>
                <br/>
                <br/>
                <div> {output} </div>
            </div>
        );

    }
}

export default StatisticsPage;