import React, { Component } from 'react';
import axios from '../../../axios.js';

import classes from './SingleStore.css';

//Profile page for a store
class SingleStore extends Component {

    state = {
        loadedStore: null,
        newData: null
    }

    componentDidMount() {
        this.loadData();
    }

    //Fetch data from db for selected store only
    loadData() {
        if (this.props.match.params.storeId) {
            if (!this.state.loadedStore || (this.state.loadedStore && this.state.loadedStore.id !== +this.props.match.params.storeId)) {
                axios.get("/stores/" + this.props.match.params.storeId)
                    .then(res => {
                        console.log("/Stores/:store returns: ", res.data);
                        this.setState({ loadedStore: res.data });
                    })
                    .catch(err => {
                        console.log("/Stores/:store error:", err.message);
                        this.props.history.push("/aWildErrorHasAppeared/" + err.message);
                    });
            }
        }
    }

    deleteHandler = () => {
        axios.delete("/stores/" + this.props.match.params.storeId)
            .then(res => {
                console.log("/Stores/:store returns: ", res.data);
                alert("Store has been successfully deleted.");
                this.props.history.push("/Stores");
            })
            .catch(err => {
                console.log("/Stores/:store error:", err.message);
                this.props.history.push("/aWildErrorHasAppeared/" + err.message);
            });
    }

    updateHandler = () => {
        const data = this.state.newData;
        if (data === this.state.loadedStore)
            alert("Oops! Information not changed!");
            //what happens when the user presses submit without changing the default values in form???
        else if (data.phone && ( data.phone <= 0 || data.phone.length < 10) )
            alert("Oops! Invalid phone number.");
        else if (data.size && data.size <= 0)
            alert("Oops! Invalid store size.");
        else if (data.number && data.number <= 0)
            alert("Oops! Invalid street number.");
        else if (data.postal_code && data.postal_code <= 0)
            alert("Oops! Invalid postal code.");
        else {
            axios.put("/stores/" + this.props.match.params.storeId, data)
                .then(res => {
                    console.log("/Stores/:store returns: ", res.data);
                    alert("Store information have been successfully updated.");
                    this.props.history.push("/Stores/" + res.data.store_id);
                })
                .catch(err => {
                    console.log("/Stores/:store error:", err.message);
                    this.props.history.push("/aWildErrorHasAppeared" + err.message);
                })
        }
    }

    backHandler = () => {
        this.props.history.push("/Stores");
    }

    changeHandler = (event) => {
        const data = { ...this.state.newData };
        if (event.target.name === "from" || event.target.name === "to") {
            let opHours = data["operating_hours"].split("-");
            if (event.target.name === "from")
                opHours[0] = event.target.value;
            else if (event.target.name === "to")
                opHours[1] = event.target.value;
            opHours = opHours.join('-');
            data["operating_hours"] = opHours;
            this.setState({ newData: data })
        }
        else {
            data[event.target.name] = event.target.value;
            this.setState({ newData: data });
        }
    }

    render() {

        let address = this.state.loadedStore.number + ' ' + this.state.loadedStore.street + ', ' + this.state.loadedStore.city + ', ' + this.state.loadedStore.postal_code;
        let operatingHours = this.state.operating_hours.split('-');
        let from = operatingHours[0];
        let to = operatingHours[1];

        let output = <div> Sending Request </div>
        if (this.props.match.params.storeId) {
            output = <div> Loading...! </div>;
            if (this.state.loadedStore) {
                output = (
                    <div>
                        <div className={classes.Title}>
                            Information about Store: {this.state.loadedStore.store_id}
                        </div>

                        <div className={classes.Info}>
                            <div> Operating Hours: {this.state.loadedStore.operating_hours} </div>
                            <div> Contact Information: {this.state.loadedStore.phone} </div>
                            <div> Store size: {this.state.loadedStore.size} </div>
                            <div> Address: {address} </div>
                        </div>

                        <form className={classes.Form}>
                            <div className={classes.Title}> Change information </div>

                            <div className={classes.OpHours}>
                                <label>Operating Hours: </label>
                                <input type="time" defaultValue={from} name="from" onChange={this.changeHandler} />
                                <label> - </label>
                                <input type="time" defaultValue={to} name="to" onChange={this.changeHandler} />
                            </div>

                            <div>
                                <label>Phone: </label>
                                <br />
                                <input type="tel" maxLength={10} defaultValue={this.state.loadedStore.phone} name="phone" onChange={this.changeHandler} />
                            </div>

                            <div>
                                <label>Size: </label>
                                <br />
                                <input type="number" maxLength={4} defaultValue={this.state.loadedStore.size} name="size" onChange={this.changeHandler} />
                            </div>

                            <div> Address
                                <div>
                                    <label>Street: </label>
                                    <br />
                                    <input type="text" defaultValue={this.state.loadedStore.street} name="street" onChange={this.changeHandler} />
                                    <br />
                                    <br />
                                    <label>Number: </label>
                                    <br />
                                    <input type="number" defaultValue={this.state.loadedStore.number} name="number" onChange={this.changeHandler} />
                                    <br />
                                    <br />
                                    <label>City: </label>
                                    <br />
                                    <input type="text" defaultValue={this.state.loadedStore.city} name="city" onChange={this.changeHandler} />
                                    <br />
                                    <br />
                                    <label>Postal Code: </label>
                                    <br />
                                    <input type="number" maxLength={4} defaultValue={this.state.loadedStore.postal_code} name="postal_code" onChange={this.changeHandler} />
                                    <br />
                                </div>
                            </div>
                        </form>

                        <div className={classes.Buttons}>
                            <button className={classes.Delete} onClick={this.deleteHandler}> Delete Store </button>
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

export default SingleStore;