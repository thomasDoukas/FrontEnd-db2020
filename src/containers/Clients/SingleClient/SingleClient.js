import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2'
import axios from '../../../axios.js';

import ArrElement from '../../../components/Arr/ArrElement/ArrElement.js';

import classes from './SingleClient.css';

//Profile page for a client
class SingleClient extends Component {

    state = {
        loadedClient: null,
        newData: null,
        selectedTab: "favouriteProducts",
        tabData: null
    }

    //Fetch data from db for selected store only
    componentDidMount() {
        if (this.props.match.params.clientId) {
            if (!this.state.loadedClient || (this.state.loadedClient && this.state.loadedClient.card !== +this.props.match.params.ClientId)) {
                //Data for client
                axios.get('/clients/' + this.props.match.params.clientId)
                    .then(res => {
                        console.log("get /clients/:client returns: ", res.data);
                        this.setState({ loadedClient: res.data[0], newData: res.data[0] });
                    })
                    .catch(err => {
                        console.log("get /clients/:client error: ", err.message);
                        this.props.history.push("/aWildErrorHasAppeared/" + err.message);
                    })
                //Data for tab1
                axios.get('/clients/' + this.props.match.params.clientId + '/transactions/favourite')
                    .then(res => {
                        console.log("get /clients/:client/transactions/favourite returns: ", res.data);
                        this.setState({ tabData: res.data })
                    })
                    .catch(err => {
                        console.log("get /clients/:client/transactions/favourite error: ", err.message);
                        this.props.history.push("/aWildErrorHasAppeared/" + err.message);
                    })
            }
        }
    }

    changeTabHandler = (link, event) => {
        let tab = event.target.value;
        axios.get('/clients/' + this.props.match.params.clientId + '/transactions' + link)
            .then(res => {
                console.log("get /clients/:client/transactions", link, "returns: ", res.data);
                this.setState({ tabData: res.data, selectedTab: tab })
            })
            .catch(err => {
                console.log("get /clients/:client/transactions", link, "error: ", err.message);
                this.props.history.push("/aWildErrorHasAppeared/" + err.message);
            })
    }

    deleteHandler = () => {
        console.log('/clients/' + this.props.match.params.clientId);
        axios.delete('/clients/' + this.props.match.params.clientId)
            .then(res => {
                console.log("delete /clients/:client returns", res.data);
                alert("Client has been successfully deleted.")
                this.props.history.push("/Clients");
            })
            .catch(err => {
                console.log("delete /clients/:client error", err.message);
                this.props.history.push("/aWildErrorHasAppeared/" + err.message);
            });
    }

    updateHandler = () => {
        const data = this.state.newData;
        var regex = /\d/g;

        let isReady = true;
        //Check newData for empty strings
        for (var member in data) {
            if (data[member] === "" && member === "pet")
                isReady = false;
        }

        if (isReady) {
            if (data === this.state.loadedClient)
                alert("Oops! Information not changed!");
            else if (data.phone && data.phone <= 0 && data.phone.label < 10)
                alert("Oops! Invalid client phone");
            else if (data.number && data.number <= 0)
                alert("Oops! Invalid address number.");
            else if (data.postal_code && data.postal_code < 0)
                alert("Oops! Invalid postal code.");
            else if (data.points && data.points < 0)
                alert("Oops! Invalid points number.");
            else if (data.family_members && data.family_members < 0)
                alert("Oops! Invalid family members.");
            else if (regex.test(data.name))
                alert("Oops! Please do not use numbers as clients name.");
            else if (regex.test(data.street))
                alert("Oops! Please do not use numbers in street name.");
            else if (regex.test(data.city))
                alert("Oops! Please do not use numbers in city name.");
            else {
                console.log("updating with data: ", data);
                data.date_of_birth = data.date_of_birth.split("T")[0];
                axios.put('/clients/' + this.props.match.params.clientId, data)
                    .then(res => {
                        console.log("post /clients/:client returns", res.data);
                        alert("Client information successfully updated.");
                        this.props.history.push("/Clients");
                    })
                    .catch(err => {
                        console.log("post /clients/:client error", err.message);
                        this.props.history.push("/aWildErrorHasAppeared/" + err.message);
                    })
            }
        }
        else
            alert("Oops! Looks like something is empty");
    }

    backHandler = () => {
        this.props.history.push("/Clients");
    }

    changeHandler = (event) => {
        const data = { ...this.state.newData };
        data[event.target.name] = event.target.value;
        this.setState({ newData: data });
    }

    render() {
        let output = <div> Sending Request </div>
        let stats = <div> Loading </div>

        let configGraphs = "Initalizing";
        let xAxis = [];
        let yAxis = [];

        let avgNum = 1;
        let decDigits = 0;

        if (this.props.match.params.clientId) {
            output = <div> Loading...! </div>;
            if (this.state.loadedClient) {

                let date = new Date(this.state.loadedClient.date_of_birth);
                let birthday = date.toString().substring(0, 15);
                const offset = date.getTimezoneOffset();
                date = new Date(date.getTime() - (offset * 60 * 1000));
                const defInputBirthday = date.toISOString().split('T')[0];

                let address = this.state.loadedClient.number + ' ' + this.state.loadedClient.street + ', ' + this.state.loadedClient.city + ', ' + this.state.loadedClient.postal_code;

                if (this.state.tabData) {
                    switch (this.state.selectedTab) {
                        case "favouriteProducts":
                            if (this.state.tabData.length === 0) {
                                stats =
                                    <div className={classes.Title}>
                                        This client hasn't made any transactions yet.
                                    </div>
                            }
                            else {
                                stats = this.state.tabData.map(favProduct => {
                                    return (
                                        <ArrElement
                                            key={favProduct.barcode}
                                            firstTag={"Barcode"}
                                            id={favProduct.barcode}
                                            secondTag={"Name"}
                                            body={favProduct.name}
                                            thirdTag={"Brand Name"}
                                            secondaryBody={favProduct.brand_name}
                                        />
                                    );
                                })
                            }
                            break;
                        case "visitedStores":
                            if (this.state.tabData.length === 0) {
                                stats =
                                    <div className={classes.Title}>
                                        This client hasn't visited any stores yet.
                                    </div>
                            }
                            else {
                                stats = this.state.tabData.map(store => {
                                    return (
                                        <ArrElement
                                            key={store.store_id}
                                            firstTag={"Store ID"}
                                            id={store.store_id}
                                            secondTag={"Address"}
                                            body={store.number + ' ' + store.street + ', ' + store.city + ', ' + store.postal_code}
                                        />
                                    );
                                })
                            }
                            break;
                        case "visitingHours":
                            if (this.state.tabData.length === 0) {
                                stats =
                                    <div className={classes.Title}>
                                        This client hasn't visited any stores yet.
                                    </div>
                            }
                            else {
                                xAxis.length = 12;
                                xAxis = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"];

                                this.state.tabData.forEach(element => {
                                    //Create labels
                                    if (element.hour < 10)
                                        xAxis[element.hour - 9] = "0" + element.hour.toString() + ":00";
                                    else
                                        xAxis[element.hour - 9] = element.hour.toString() + ":00";
                                    //Create dataset.data
                                    yAxis[element.hour - 9] = element.total;

                                });
                                configGraphs = {
                                    labels: xAxis,
                                    datasets: [
                                        {
                                            label: 'Visiting Hours',
                                            backgroundColor: 'rgba(51, 51, 51, 1)',
                                            borderColor: 'rgba(51, 51, 51, 1)',
                                            borderWidth: 1,
                                            hoverBackgroundColor: 'rgb(151, 216, 207, 1)',
                                            hoverBorderColor: 'rgb(151, 216, 207, 1)',
                                            data: yAxis
                                        }
                                    ]
                                };
                                stats =
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
                            }
                            break;
                        case "avgWeekTransactions":
                            avgNum = this.state.tabData[0].average_per_week;
                            if (avgNum === null) {
                                stats =
                                    <div className={classes.Title}>
                                        This client hasn't made any transactions yet.
                                    </div>
                            }
                            else {
                                if (Math.floor(avgNum) !== avgNum)
                                    decDigits = avgNum.toString().split(".")[1].length || 0;
                                if (decDigits >= 2)
                                    avgNum = avgNum.toFixed(2);
                                else if (decDigits === 1)
                                    avgNum = avgNum.toString() + '0';

                                stats =
                                    <div>
                                        <div className={classes.Title}> Average Transactions per Week </div>
                                        <br />
                                        <br />
                                        <br />
                                        <br />
                                        <div className={classes.NumberCircle}>
                                            {avgNum}€
                                        </div>
                                    </div>
                            }

                            break;
                        case "avgMonthTransactions":
                            avgNum = this.state.tabData[0].average_per_month;
                            if (avgNum === null) {
                                stats =
                                    <div className={classes.Title}>
                                        This client hasn't made any transactions yet.
                                    </div>
                            }
                            else {
                                if (Math.floor(avgNum) !== avgNum)
                                    decDigits = avgNum.toString().split(".")[1].length || 0;
                                if (decDigits >= 2)
                                    avgNum = avgNum.toFixed(2);
                                else if (decDigits === 1)
                                    avgNum = avgNum.toString() + '0';

                                stats =
                                    <div>
                                        <div className={classes.Title}> Average Transactions per Month </div>
                                        <br />
                                        <br />
                                        <br />
                                        <br />
                                        <div className={classes.NumberCircle}>
                                            {avgNum}€
                                    </div>
                                    </div>
                            }
                            break;
                        default:
                            stats = <div> How did you get here? There is nothing for you to see! Leave. </div>
                    }
                }

                output = (
                    <div>
                        <div className={classes.Title}>
                            Information about Client:{this.state.loadedClient.card_id}
                        </div>

                        <div className={classes.Info}>
                            <div> Name: {this.state.loadedClient.name}</div>
                            <div> Date of Birth: {birthday} </div>
                            <div> Phone: {this.state.loadedClient.phone} </div>
                            <div> Family members: {this.state.loadedClient.family_members} </div>
                            <div> Pet: {this.state.loadedClient.pet ? this.state.loadedClient.pet : "No pet"} </div>
                            <div> Points: {this.state.loadedClient.points} </div>
                            <div> Address: {address} </div>
                        </div>

                        <div className={classes.Stats}>
                            <button value={"favouriteProducts"}
                                onClick={this.changeTabHandler.bind(this, "/favourite")}
                                className={(this.state.selectedTab === "favouriteProducts") ? classes.active : null}
                            >
                                Favourite Products
                            </button>

                            <button value={"visitedStores"}
                                onClick={this.changeTabHandler.bind(this, "/stores")}
                                className={(this.state.selectedTab === "visitedStores") ? classes.active : null}
                            >
                                Visited Stores
                            </button>

                            <button value={"visitingHours"}
                                onClick={this.changeTabHandler.bind(this, "/hours")}
                                className={(this.state.selectedTab === "visitingHours") ? classes.active : null}
                            >
                                Visiting Hours
                            </button>

                            <button value={"avgWeekTransactions"}
                                onClick={this.changeTabHandler.bind(this, "/average")}
                                className={(this.state.selectedTab === "avgWeekTransactions") ? classes.active : null}
                            >
                                Weekly Transactions
                            </button>

                            <button value={"avgMonthTransactions"}
                                onClick={this.changeTabHandler.bind(this, "/average")}
                                className={(this.state.selectedTab === "avgMonthTransactions") ? classes.active : null}
                            >
                                Monthly Transactions
                            </button>


                            <br />
                            <br />
                            <br />
                            <br />
                            <div> {stats} </div>
                        </div>

                        <form className={classes.Form}>
                            <div className={classes.Title}> Change information </div>

                            <div>
                                <label>Name: </label>
                                <br />
                                <input type="text" defaultValue={this.state.loadedClient.name} name="name" onChange={this.changeHandler} />
                            </div>

                            <div>
                                <label>Date of Birth: </label>
                                <br />
                                <input type="date" defaultValue={defInputBirthday} name="date_of_birth" onChange={this.changeHandler} />
                            </div>

                            <div>
                                <label>Phone: </label>
                                <br />
                                <input type="tel" maxLength={10} defaultValue={this.state.loadedClient.phone} name="phone" onChange={this.changeHandler} />
                            </div>

                            <div>
                                <label>Points: </label>
                                <br />
                                <input type="number" defaultValue={this.state.loadedClient.points} min={0} name="points" onChange={this.changeHandler} />
                            </div>


                            <div>
                                <label>Family members: </label>
                                <br />
                                <input type="number" defaultValue={this.state.loadedClient.family_members} min={0} name="family_members" onChange={this.changeHandler} />
                            </div>

                            <div>
                                <label>Pet: </label>
                                <br />
                                <select name="pet" onChange={this.changeHandler} defaultValue={this.state.loadedClient.pet}>
                                    <option value={""}> No Pet </option>
                                    <option value={"Cat"}> Cat </option>
                                    <option value={"Bird"}> Bird </option>
                                    <option value={"Dog"}> Dog </option>
                                    <option value={"Fish"}> Fish </option>
                                </select>
                            </div>

                            <div> Address
                            <div>
                                    <label> Street: </label>
                                    <br />
                                    <input type="text" defaultValue={this.state.loadedClient.street} name="street" onChange={this.changeHandler} />
                                    <br />
                                    <br />
                                    <label>Number: </label>
                                    <br />
                                    <input type="number" defaultValue={this.state.loadedClient.number} min={1} name="number" onChange={this.changeHandler} />
                                    <br />
                                    <br />
                                    <label>City: </label>
                                    <br />
                                    <input type="text" defaultValue={this.state.loadedClient.city} name="city" onChange={this.changeHandler} />
                                    <br />
                                    <br />
                                    <label>Postal Code: </label>
                                    <br />
                                    <input type="number" maxLength={4} defaultValue={this.state.loadedClient.postal_code} name="postal_code" onChange={this.changeHandler} />
                                    <br />
                                </div>
                            </div>

                        </form>

                        <div className={classes.Buttons}>
                            <button className={classes.Delete} onClick={this.deleteHandler}> Delete Client </button>
                            <button className={classes.Update} onClick={this.updateHandler}> Submit Changes </button>
                            <button className={classes.Back} onClick={this.backHandler}> Back </button>
                        </div>

                    </div>
                )
            }
        }

        return output;
    }
}

export default SingleClient;