import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2'

import ArrElement from '../../components/Arr/ArrElement/ArrElement.js';
import first from '../../../src/assets/images/1st.png';
import second from '../../../src/assets/images/2nd.png';
import third from '../../../src/assets/images/3rd.png';

import axios from '../../axios.js';

import classes from './StatisticsPage.css';

//Page of all stores in database
class StatisticsPage extends Component {

    state = {
        selectedTab: "productCouples",
        tabData: null
    }

    componentDidMount() {
        axios.get('/stats/hot-couples')
            .then(res => {
                console.log("get /stats/hot-couples returns: ", res.data);
                this.setState({ tabData: res.data })
            })
            .catch(err => {
                console.log("get /stats/hot-couples error:", err.message);

                this.props.history.push("/aWildErrorHasAppeared/" + err.message);
            })
    }

    changeTabHandler = (link, event) => {
        let tab = event.target.value;
        axios.get('/stats' + link)
            .then(res => {
                console.log("get /stats", link, " returns: ", res.data);
                this.setState({ tabData: res.data, selectedTab: tab })
            })
            .catch(err => {
                console.log("get /stats", link, " error: ", err.message);
                this.props.history.push("/aWildErrorHasAppeared/" + err.message);
            })
    }

    render() {

        let output = <div> Loading... </div>;

        if (this.state.tabData) {
            switch (this.state.selectedTab) {
                case "productCouples":
                    output = (
                        <div>
                            <div className={classes.Title}> Pairs of products frequently bought together. </div>
                            <br />
                            <br />
                            {
                                this.state.tabData.map((pair, index) => {
                                    return (
                                        <ArrElement
                                            key={index}
                                            firstTag={"Product 1"}
                                            id={pair.name1 + ", " + pair.brand1}
                                            secondTag={"Product 2"}
                                            body={pair.name2 + ", " + pair.brand2}
                                            thirdTag={"Times bought together"}
                                            secondaryBody={pair.times}
                                        />
                                    )
                                })
                            }
                        </div>
                    )
                    break;
                case "famousLocations":
                    output = (
                        <div>
                            <div className={classes.Title}> Famous locations of products in stores. </div>
                            <br />
                            <br />
                            {
                                this.state.tabData.map((location, index) => {
                                    return (
                                        <ArrElement
                                            key={index}
                                            firstTag={"Alley"}
                                            id={location.alley}
                                            secondTag={"Shelf"}
                                            body={location.shelf}
                                            thirdTag={"Products found in this location"}
                                            secondaryBody={location.number_of_products}
                                        />
                                    )
                                })
                            }
                        </div>
                    )
                    break;
                case "houseProducts":
                    output = (
                        <div>
                            <div className={classes.Title}> People trust us! </div>
                            <br />
                            <br />
                            <br />

                            {
                                this.state.tabData.map((prodCategory, index) => {

                                    let decDigits = 0;
                                    let percent = prodCategory.percentage;
                                    let cat = "";

                                    if (Math.floor(percent) !== percent)
                                        decDigits = percent.toString().split(".")[1].length || 0;
                                    if (decDigits >= 2)
                                        percent = percent.toFixed(2);
                                    else if (decDigits === 1)
                                        percent = percent.toString() + '0';

                                    switch (prodCategory.category_id) {
                                        case 1:
                                            cat = "Fresh";
                                            break;
                                        case 2:
                                            cat = "Dairy and Frozen";
                                            break;
                                        case 3:
                                            cat = "Drinks";
                                            break;
                                        case 4:
                                            cat = "Personal";
                                            break;
                                        case 5:
                                            cat = "Household";
                                            break;
                                        case 6:
                                            cat = "Pet";
                                            break;
                                        default:
                                            console.log("I SAID! You CAN'T be here");
                                    }

                                    return (
                                        <div key={index} >
                                            <div className={classes.Content}>
                                                <br />
                                                <br />
                                                <br />
                                                <div className={classes.NumberCircle}> {percent}% </div>
                                                <br />
                                                <div className={classes.Title} > of {cat} bought products are made from us! </div>
                                            </div>
                                            <br />
                                            <br />
                                        </div>
                                    )
                                })
                            }

                            <div style={{ fontSize: "10px" }}> Keeping it real!  </div>

                        </div>
                    )
                    break;
                case "fruitfulTimes":
                    let xAxis, yAxis = [];
                    xAxis = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"];

                    this.state.tabData.forEach(element => {
                        //Create labels
                        if (element.hour < 10)
                            xAxis[element.hour - 9] = "0" + element.hour.toString() + ":00";
                        else if (element.hour < 22)
                            xAxis[element.hour - 9] = element.hour.toString() + ":00";
                        else if (element.hour >= 22 || element.hour <= 8)
                            console.log("mex");
                        //Create dataset.data

                        yAxis[element.hour - 9] = element.amount;
                    });

                    let configGraphs = {
                        labels: xAxis,
                        datasets: [
                            {
                                label: 'Money Spent (€)',
                                backgroundColor: 'rgba(51, 51, 51, 1)',
                                borderColor: 'rgba(51, 51, 51, 1)',
                                borderWidth: 1,
                                hoverBackgroundColor: 'rgb(151, 216, 207, 1)',
                                hoverBorderColor: 'rgb(151, 216, 207, 1)',
                                data: yAxis
                            }
                        ]
                    };
                    output =
                        <div>
                            <div className={classes.Title}> Most profitable hours! </div>
                            <br />
                            <br />
                            <br />
                            <br />
                            <div>
                                <Bar
                                    data={configGraphs}
                                    width={100}
                                    height={500}
                                    options={{
                                        maintainAspectRatio: false,
                                        scales: {
                                            yAxes: [{
                                                ticks: {
                                                    beginAtZero: true
                                                }
                                            }]
                                        }
                                    }}
                                />
                            </div>
                            <br />
                            <br />
                            <br />
                            <br />
                            <div style={{ fontSize: "10px" }}> Cha Ching ;)</div>
                        </div>
                    break;
                case "ageGroupPerHour":
                    let labelArray = [];
                    xAxis = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"];
                    let dataArray = this.state.tabData.reduce((r, a) => {
                        r[a.age_group] = [...r[a.age_group] || [], a];
                        return r;
                    }, {});
                    dataArray = Object.keys(dataArray).map(i => dataArray[i]);

                    let data = [];

                    dataArray.forEach(element => {
                        let temp = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                        labelArray.push(element[0].age_group);

                        element.forEach((internalElement) => {
                            if (internalElement.hour >= 9 && internalElement.hour <= 21) {
                                temp[internalElement["hour"] - 9] = internalElement["percentage"];
                            }
                        });
                        data.push(temp);
                    });

                    console.log("xAxis", xAxis);
                    console.log("labels", labelArray);
                    console.log("data", data);

                    let colors = ["#97d8cf", "#cf97d8", "#d8cf97", "#97d8af", "#97c1d8"];

                    let datasets =
                        data.map((element, index) => {
                            return (
                                {
                                    label: labelArray[index],
                                    backgroundColor: colors[index % 5],
                                    borderColor: colors[index % 5],
                                    borderWidth: 1,
                                    hoverBackgroundColor: 'rgb(151, 216, 207, 1)',
                                    hoverBorderColor: 'rgb(151, 216, 207, 1)',
                                    data: data[index]
                                }
                            )
                        })

                    configGraphs = {
                        labels: xAxis,
                        datasets
                    };


                    console.log("config", configGraphs);



                    output =
                        <div>
                            <div className={classes.Title}> Visited by: </div>
                            <br />
                            <br />
                            <br />
                            <br />
                            <div>
                                <Bar
                                    data={configGraphs}
                                    width={100}
                                    height={500}
                                    options={{
                                        maintainAspectRatio: false,
                                        scales: {
                                            yAxes: [{
                                                ticks: {
                                                    beginAtZero: true
                                                }
                                            }]
                                        }
                                    }}
                                />
                            </div>
                        </div>

                    break;
                case "HallOfFame":
                    output =
                        <div>
                            <div className={classes.Title}> Best of the Best! </div>
                            <br />
                            <br />
                            <br />
                            {
                                this.state.tabData.map((client, index) => {
                                    return (
                                        <div key={index}>
                                            <ArrElement
                                                firstTag={"Customer's name"}
                                                id={client.name}
                                                secondTag={"Age"}
                                                body={client.age}
                                                thirdTag={"Points"}
                                                secondaryBody={client.points}
                                            >
                                                {index === 0 ? <img src={first} className={classes.Image} alt={""} /> : null}
                                                {index === 1 ? <img src={second} className={classes.Image} alt={""} /> : null}
                                                {index === 2 ? <img src={third} className={classes.Image} alt={""} /> : null}
                                            </ArrElement>

                                        </div>
                                    )
                                })
                            }
                        </div>
                    break;
                case "getPrize":
                    console.log(this.state.tabData);
                    
                    output =
                        <div>
                            <div className={classes.Title}>
                                Congratulations {this.state.tabData[0].name}!!!
                            </div>
                            <div> You gave us the most money this month and for that you'll be awarded with:</div>
                            <br/>
                            <br/>
                            <br/>
                            <div className={classes.NumberCircle}> {this.state.tabData[0].award}p. </div>
                        </div>
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
                    Famous Prod Couples
                </button>

                <button
                    value={"famousLocations"}
                    onClick={this.changeTabHandler.bind(this, "/location")}
                    className={(this.state.selectedTab === "famousLocations") ? classes.active : null}
                >
                    Store Locations
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
                    value={"HallOfFame"}
                    onClick={this.changeTabHandler.bind(this, "/hof")}
                    className={(this.state.selectedTab === "HallOfFame") ? classes.active : null}
                >
                    Hall of Fame
                </button>

                <button
                    value={"getPrize"}
                    onClick={this.changeTabHandler.bind(this, "/prize")}
                    className={(this.state.selectedTab === "getPrize") ? classes.active : null}
                >
                    Get Prize
                </button>


                <br />
                <br />
                <div> {output} </div>
            </div>
        );

    }
}

export default StatisticsPage;