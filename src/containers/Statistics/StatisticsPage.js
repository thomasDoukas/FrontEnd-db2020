import React, { Component } from 'react';
import axios from '../../axios.js';

import classes from './StatisticsPage.css';

//Page of all stores in database
class StatisticsPage extends Component {

    state = {
        selectedTab: "productCouples",
        tabData: null
    }

    componentDidMount() {
        axios.get('/db/api/stats/hot-couples')
            .then(res => {
                console.log("get /db/api/stats/hot-couples returns: ", res.data);
                this.setState({ tabData: res.data })
            })
            .catch(err => {
                console.log("get /db/api/stats/hot-couples error:", err.message);

                this.props.history.push("/aWildErrorHasAppeared/" + err.message);
            })
    }

    changeTabHandler = (link, event) => {
        let tab = event.target.value;
        axios.get('/db/api/stats' + link)
            .then(res => {
                console.log("get /db/api/stats", link, " returns: ", res.data);
                this.setState({ tabData: res.data, selectedTab: tab })
            })
            .catch(err => {
                console.log("get /db/api/stats", link, " error: ", err.message);
                this.props.history.push("/aWildErrorHasAppeared/" + err.message);
            })
    }

    render() {

        let output = <div> Loading... </div>;
        // output = <div> {this.state.tabData} </div>

        if (this.state.tabData) {
            switch (this.state.selectedTab) {
                case "productCouples":
                    output = <div> productCouples </div>
                    break;
                case "famousLocations":
                    output = <div> famousLocations </div>
                    break;
                case "houseProducts":
                    output = <div> houseProducts </div>
                    break;
                case "fruitfulTimes":
                    output = <div> fruitfulTimes </div>
                    break;
                case "ageGroupPerHour":
                    output = <div> ageGroupPerHour </div>
                    break;
                case "SpecialStats1":
                    output = <div> SpecialStats1 </div>
                    break;
                case "SpecialStats2":
                    output = <div> SpecialStats2 </div>
                    break;
                default:
                    output = <div> You again? There is NOTHING here. </div>
            }
        }

        return (
            <div className={classes.Content}>
                <button
                    value={"productCouples"}
                    onClick={this.changeTabHandler.bind(this, "/hot-couples")}
                    className={(this.state.selectedTab === "productCouples") ? classes.active : null}
                >
                    Famous Product Couples
                </button>

                <button
                    value={"famousLocations"}
                    onClick={this.changeTabHandler.bind(this, "/location")}
                    className={(this.state.selectedTab === "famousLocations") ? classes.active : null}
                >
                    Famous Store Locations
                </button>

                <button
                    value={"houseProducts"}
                    onClick={this.changeTabHandler.bind(this, "/house")}
                    className={(this.state.selectedTab === "houseProducts") ? classes.active : null}
                >
                    House Products
                </button>

                <button
                    value={"fruitfulTimes"}
                    onClick={this.changeTabHandler.bind(this, "/rush-hour")}
                    className={(this.state.selectedTab === "fruitfulTimes") ? classes.active : null}
                >
                    Fruitful Times
                </button>

                <button
                    value={"ageGroupPerHour"}
                    onClick={this.changeTabHandler.bind(this, "/age-time")}
                    className={(this.state.selectedTab === "ageGroupPerHour") ? classes.active : null}
                >
                    Age Group per Hour
                </button>

                <button
                    value={"SpecialStats1"}
                    onClick={this.changeTabHandler.bind(this, "/special1")}
                    className={(this.state.selectedTab === "SpecialStats1") ? classes.active : null}
                >
                    select6
                </button>

                <button
                    value={"SpecialStats2"}
                    onClick={this.changeTabHandler.bind(this, "/special2")}
                    className={(this.state.selectedTab === "SpecialStats2") ? classes.active : null}
                >
                    select7
                </button>


                <br />
                <br />
                <br />
                <br />
                <div> {output} </div>
            </div>
        );

    }
}

export default StatisticsPage;