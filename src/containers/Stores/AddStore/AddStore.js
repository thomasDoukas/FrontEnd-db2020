import React, { Component } from 'react';
import axios from '../../../axios.js';

import classes from './AddStore.css';

//Add new store in database
class AddStore extends Component {

    state = {
        storeData: null,
        from: null,
        to: null,
        contactInfo: ["210XXXXXXX"]
    }

    // state = {
    //     storeData: {
    //         operating_hours: null,
    //         phone: null,
    //         size: null,
    //         street: null,
    //         number: null,
    //         postal_code: null,
    //         city: null
    //     },
    //     from: null,
    //     to: null
    // }

    backHandler = () => {
        this.props.history.push("/Stores");
    }

    saveHandler = () => {
        const data = { ...this.state.storeData };
        var regex = /\d/g;

        if (this.state.from !== null && this.state.to !== null) {
            data["operating_hours"] = this.state.from + ' ' + this.state.to;
        }

        let count = 0;
        let wrongTelValue = false;
        this.state.contactInfo.forEach(tel => {
            if (tel.length === 10)
                count += 1;
            if (tel <= 0)
                wrongTelValue = true;
        });
        if (count === this.state.contactInfo.length)
            data["phone"] = this.state.contactInfo;

        if (Object.keys(data).length < 7)
            alert("Oops! To create a store you must specify all parameters.");
        else if (wrongTelValue)
            alert("Oops! Invalid phone number(s).");
        else if (data.size <= 0)
            alert("Oops! Invalid store size.");
        else if (data.number <= 0)
            alert("Oops! Invalid street number.");
            else if (data.postal_code && (data.postal_code < 0) )
            alert("Oops! Invalid postal code.");
        else if (regex.test(data.street))
            alert("Oops! Please do not use numbers as street name.");
        else if (regex.test(data.city))
            alert("Oops!  Please do not use numbers as city name.");
        else
            console.log("submitting the following data:", data);
            axios.post('/stores', data)
                .then(res => {
                    console.log("/stores returns: ", res.data);
                    this.props.history.push("/Stores/" + res.data.store_id);
                })
                .catch(err => {
                    console.log("/stores error:", err.message);
                    this.props.history.push("/aWildErrorHasAppeared/" + err.message);
                });
    }

    addTelephoneHandler = () => {
        const data = [...this.state.contactInfo];
        data.push("0");
        this.setState({ contactInfo: data })
    }

    deleteTelephoneHandler = () => {
        if (this.state.contactInfo.length > 1) {
            const data = [...this.state.contactInfo];
            data.splice(-1, 1);
            this.setState({ contactInfo: data })
        }
    }

    changeHandler = (event) => {
        const data = { ...this.state.storeData };
        if (event.target.name === "from")
            this.setState({ from: event.target.value });
        else if (event.target.name === "to")
            this.setState({ to: event.target.value });
        else
            data[event.target.name] = event.target.value;
        this.setState({ storeData: data });
    }

    changeTelephoneHandler = (index, event) => {
        const data = [...this.state.contactInfo];
        data[index] = event.target.value;
        this.setState({ contactInfo: data });
    }

    render() {

        const telephones = this.state.contactInfo.map((telephone, index) => {
            return (
                <div key={index}>
                    <label>Phone #{index + 1}:</label>
                    <br />
                    <input type="tel" maxLength={10} placeholder={"210XXXXXXX"} onChange={this.changeTelephoneHandler.bind(this, index)} />
                </div>
            );
        })

        let form = (
            <div className={classes.Content}>
                <div className={classes.Title}>
                    To create a new store please specify the following information.
                    <br />
                    <br />
                </div>

                <form>

                    <div className={classes.OpHours}>
                        <label>Operating Hours </label>
                        <input type="time" name="from" onChange={this.changeHandler} />
                        <label> - </label>
                        <input type="time" name="to" onChange={this.changeHandler} />
                    </div>

                    <div className={classes.Information}>

                        {telephones}

                        <div>
                            <label>Size: </label>
                            <br />
                            <input type="number" placeholder={"ex 1200"} min={1} name="size" onChange={this.changeHandler} />
                        </div>

                        <br />
                        <br />
                        <br />

                        <div> Address
                            <br />
                            <label> Street: </label>
                            <br />
                            <input type="text" placeholder={"Spirit"} name="street" onChange={this.changeHandler} />
                            <br />
                            <label>Number: </label>
                            <br />
                            <input type="number" placeholder={"55"} min={1} name="number" onChange={this.changeHandler} />
                            <br />
                            <label>City: </label>
                            <br />
                            <input type="text" placeholder={"Paradise"} name="city" onChange={this.changeHandler} />
                            <br />
                            <label>Postal Code: </label>
                            <br />
                            <input type="number" placeholder={"12149"} min={11111} name="postal_code" onChange={this.changeHandler} />
                            <br />
                        </div>
                    </div>
                </form>

                <div className={classes.Buttons}>
                    <div>
                        <button onClick={this.addTelephoneHandler}> Add Extra Phone </button>
                        <button onClick={this.deleteTelephoneHandler}> Delete Extra Phone </button>
                    </div>
                    <br />
                    <br />
                    <br />
                    <button onClick={this.saveHandler}> Save </button>
                    <br />
                    <button onClick={this.backHandler}> Back </button>
                </div>

            </div>
        );
        return form;
    }

}

export default AddStore;