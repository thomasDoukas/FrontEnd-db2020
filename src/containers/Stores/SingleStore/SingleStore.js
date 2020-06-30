import React, { Component } from 'react';
import axios from '../../../axios.js';

import classes from './SingleStore.css';

//Profile page for a store
class SingleStore extends Component {

    state = {
        loadedStore: null,
        newData: null,
        contactInfo: []
    }

    //Fetch data from db for selected store only
    componentDidMount() {
        if (this.props.match.params.storeId) {
            if (!this.state.loadedStore || (this.state.loadedStore && this.state.loadedStore.id !== +this.props.match.params.storeId)) {
                axios.get("/stores/" + this.props.match.params.storeId)
                    .then(res => {
                        console.log("get /stores/:store returns: ", res.data);
                        this.setState({ loadedStore: res.data, newData: res.data, contactInfo: res.data.phones });
                    })
                    .catch(err => {
                        console.log("get /stores/:store error:", err.message);
                        this.props.history.push("/aWildErrorHasAppeared/" + err.message);
                    });
            }
        }
    }

    deleteHandler = () => {
        axios.delete("/stores/" + this.props.match.params.storeId)
            .then(res => {
                console.log("delete /stores/:store returns: ", res.data);
                alert("Store has been successfully deleted.");
                this.props.history.push("/Stores");
            })
            .catch(err => {
                console.log("delete /stores/:store error:", err.message);
                this.props.history.push("/aWildErrorHasAppeared/" + err.message);
            });
    }

    updateHandler = () => {
        const data = this.state.newData;
        var regex = /\d/g;
        let isReady = true;

        let count = 0;
        let wrongTelValue = false;
        this.state.contactInfo.forEach(tel => {
            if (tel.length === 10)
                count += 1;
            if (tel <= 0)
                wrongTelValue = true;
            if (count === this.state.contactInfo.length){
                data["phone"] = this.state.contactInfo;
                delete data.phones;
            }
                
        });

        //Check newData for empty strings
        for (var member in data) {
            if (data[member] === "") {
                isReady = false;
                console.log(member, " is empty ");
            }
        }

        if (isReady) {
            if (data === this.state.loadedStore)
                alert("Oops! Information not changed!");
            else if (wrongTelValue)
                alert("Oops! Invalid phone number.");
            else if (data.size && data.size <= 0)
                alert("Oops! Invalid store size.");
            else if (data.number && data.number <= 0)
                alert("Oops! Invalid street number.");
            else if (data.postal_code && data.postal_code <= 0 && data.postal_code.length !== 5)
                alert("Oops! Invalid postal code.");
            else if (regex.test(data.street))
                alert("Oops! Please do not use numbers as street name.");
            else if (regex.test(data.city))
                alert("Oops!  Please do not use numbers as city name.");
            else {
                console.log("submitting the following data:", data);
                // axios.put("/stores/" + this.props.match.params.StoreId, data)
                //     .then(res => {
                //         console.log("put /stores/:store returns: ", res.data);
                //         alert("Store information successfully updated.");
                //         this.props.history.push("/Stores/" + res.data.store_id);
                //     })
                //     .catch(err => {
                //         console.log("put /stores/:store error:", err.message);
                //         this.props.history.push("/aWildErrorHasAppeared" + err.message);
                //     })
            }
        }
        else
            alert("Oops! Looks like something is empty");

    }

    addTelephoneHandler = () => {
        const data = [...this.state.newData.phones];
        data.push("0");

        const newState = { ...this.state.newData };
        newState["phones"] = data;

        this.setState({ newData: newState, contactInfo: data });
    }

    deleteTelephoneHandler = () => {
        if (this.state.newData.phones.length > 1) {
            const data = [...this.state.newData.phones];
            data.splice(-1, 1);

            const newState = { ...this.state.newData };
            newState["phones"] = data;

            this.setState({ newData: newState, contactInfo: data });
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

    changeTelephoneHandler = (index, event) => {
        const data = [...this.state.contactInfo];
        data[index] = event.target.value;
        this.setState({ contactInfo: data });
    }

    render() {
        let output = <div> Sending Request </div>
        if (this.props.match.params.storeId) {
            output = <div> Loading... </div>;
            if (this.state.loadedStore) {

                const telephones = this.state.newData.phones.map((telephone, index) => {
                    return (
                        <div key={index}>
                            <label>Phone #{index + 1}:</label>
                            <br />
                            <input type="tel" maxLength={10} defaultValue={telephone} onChange={this.changeTelephoneHandler.bind(this, index)} />
                        </div>
                    );
                })

                let address = this.state.loadedStore.number + ' ' + this.state.loadedStore.street + ', ' + this.state.loadedStore.city + ', ' + this.state.loadedStore.postal_code;
                let operatingHours = this.state.loadedStore.operating_hours.split(' ');
                let from = operatingHours[0];
                let to = operatingHours[1];

                output = (
                    <div>
                        <div className={classes.Title}>
                            Information about Store: {this.state.loadedStore.store_id}
                        </div>

                        <div className={classes.Info}>
                            <div> Operating Hours: {from} - {to} </div>
                            <div> Contact Information: {this.state.loadedStore.phones.join(", ")} </div>
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

                            {telephones}

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

                        <div>
                            <div className={classes.TelButtons}>
                                <button onClick={this.addTelephoneHandler}> Add Extra Phone </button>
                                <button onClick={this.deleteTelephoneHandler}> Delete Extra Phone </button>
                            </div>
                        </div>


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