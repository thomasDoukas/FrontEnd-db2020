import React, { Component } from 'react';
import axios from '../../../axios.js';

import classes from './SingleClient.css';

//Profile page for a client
class SingleClient extends Component {

    state = {
        loadedClient: null,
        newData: null,
        selectedTab: "select1",
        tabData: null
    }

    componentDidMount() {
        this.loadData();
    }

    //Fetch data from db for selected store only
    loadData() {
        if (this.props.match.params.clientId) {
            if (!this.state.loadedClient || (this.state.loadedClient && this.state.loadedClient.card !== +this.props.match.params.ClientId)) {
                //Data for client
                axios.get('/clients/' + this.props.match.params.clientId)
                    .then(res => {
                        console.log("get /clients/:client returns: ", res.data);
                        this.setState({ loadedClient: res.data });
                    })
                    .catch(err => {
                        console.log("get /clients/:client error: ", err.message);
                        this.props.history.push("/aWildErrorHasAppeared/" + err.message);
                    })
                //Data for tab1
                axios.get('/posts')
                    .then(res =>
                        this.setState({ tabData: res.data[1].body })
                    )
                    .catch(err => {
                        console.log(err);
                        this.props.history.push("/aWildErrorHasAppeared");
                    })
            }
        }
    }

    changeTabHandler = (link, number, event) => {
        let tab = event.target.value;
        axios.get(link)
            .then(res => {
                this.setState({ tabData: res.data[number].body, selectedTab: tab })
            })
            .catch(err => {
                console.log(err);
                this.props.history.push("/aWildErrorHasAppeared");
            })
    }

    deleteHandler = () => {
        axios.delete('/clients/' + this.props.match.params.ClientId)
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
        if (data === this.state.loadedProduct)
            alert("Information not changed! Mission abort.");
        else if (data.phone && data.phone <= 0)
            alert("Oops! Invalid client phone")
        else if (data.number && data.number <= 0)
            alert("Oops! Invalid address number.")
        else if (data.postal_code && data.postal_code <= 0)
            alert("Oops! Invalid postal code.")
        else if (data.points && data.points < 0)
            alert("Oops! Invalid points number.")
        else if (data.family_members && data.family_members < 0)
            alert("Oops! Invalid postal code.")
        else {
            axios.post('/clients/' + this.props.match.params.ClientId, data)
                .then(res => {
                    console.log("post /clients/:client returns", res.data);
                    alert("Client information successfully updated.");
                    this.props.history.push("/Clients/" + res.data.card);
                })
                .catch(err => {
                    console.log("post /clients/:client error", err.message);
                    this.props.history.push("/aWildErrorHasAppeared/" + err.message);
                })
        }
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
        let address = this.state.loadedClient.number + ' ' + this.state.loadedClient.street + ' St, ' + this.state.loadedClient.city + ', ' + this.state.loadedClient.postal_code;
        let stats = <div> {this.state.tabData} </div>

        if (this.props.match.params.clientId) {
            output = <div> Loading...! </div>;
            if (this.state.loadedClient) {
                output = (
                    <div>
                        <div className={classes.Title}>
                            Information about Client:{this.state.loadedClient.id}
                        </div>

                        <div className={classes.Info}>
                            <div> Name: {this.state.loadedClient.name}</div>
                            <div> Date of Birth: {this.state.loadedClient.date_of_birth} </div>
                            <div> Phone: {this.state.loadedClient.phone} </div>
                            <div> Family members: {this.state.loadedClient.family_members} </div>
                            <div> Pet: {this.state.loadedClient.pet} </div>
                            <div> Points: {this.state.loadedClient.points} </div>
                            <div> Address: {address} </div>
                        </div>

                        <div className={classes.Stats}>
                            <button value={"select1"} onClick={this.changeTabHandler.bind(this, "/posts", 1)} className={(this.state.selectedTab === "select1") ? classes.active : null}> select1 </button>
                            <button value={"select2"} onClick={this.changeTabHandler.bind(this, "/posts", 2)} className={(this.state.selectedTab === "select2") ? classes.active : null}> select2 </button>
                            <button value={"select3"} onClick={this.changeTabHandler.bind(this, "/posts", 3)} className={(this.state.selectedTab === "select3") ? classes.active : null}> select3 </button>
                            <button value={"select4"} onClick={this.changeTabHandler.bind(this, "/posts", 4)} className={(this.state.selectedTab === "select4") ? classes.active : null}> select4 </button>
                            <button value={"select5"} onClick={this.changeTabHandler.bind(this, "/posts", 5)} className={(this.state.selectedTab === "select5") ? classes.active : null}> select5 </button>
                            <button value={"select6"} onClick={this.changeTabHandler.bind(this, "/posts", 6)} className={(this.state.selectedTab === "select6") ? classes.active : null}> select6 </button>
                            <button value={"select7"} onClick={this.changeTabHandler.bind(this, "/posts", 7)} className={(this.state.selectedTab === "select7") ? classes.active : null}> select7 </button>

                            <br />
                            <br />
                            <br />
                            <br />
                            <div> {stats} </div>
                        </div>

                        {/* <div className={classes.Info}>
                            <div> Popular products </div>
                        </div>

                        <div className={classes.Info}>
                            <div> Stores </div>
                        </div>

                        <div className={classes.Info}>
                            <div> Hours For Stores </div>
                        </div>

                        <div className={classes.Info}>
                            <div> Average Transactions per week </div>
                        </div>

                        <div className={classes.Info}>
                            <div> Average Transactions per month </div>
                        </div> */}

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
                                <input type="date" name="date_of_birth" onChange={this.changeHandler} />
                            </div>

                            <div>
                                <label>Phone: </label>
                                <br />
                                <input type="tel" maxLength={10} defaultValue={this.state.loadedClient.phone} name="phone" onChange={this.changeHandler} />
                            </div>

                            <div>
                                <label>Points: </label>
                                <br />
                                <input type="number" defaultValue={this.state.loadedClient.points} name="points" onChange={this.changeHandler} />
                            </div>


                            <div>
                                <label>Family members: </label>
                                <br />
                                <input type="number" defaultValue={this.state.loadedClient.family_members} name="family_members" onChange={this.changeHandler} />
                            </div>

                            <div>
                                <label>Pet: </label>
                                <br />
                                <input type="text" defaultValue={this.state.loadedClient.pet} name="pet" onChange={this.changeHandler} />
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
                                    <input type="number" defaultValue={this.state.loadedClient.number} name="number" onChange={this.changeHandler} />
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