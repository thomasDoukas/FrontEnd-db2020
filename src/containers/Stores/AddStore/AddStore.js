import React, { Component } from 'react';
import axios from '../../../axios.js';

import classes from './AddStore.css';

//Add new store in database
class AddStore extends Component {

    // state = {
    //     storeData: null
    // }

    state = {
        storeData: {
            operating_hours: null,
            phone: null,
            size: null,
            street: null,
            number: null,
            postal_code: null,
            city: null
        },
        from: null,
        to: null
    }

    backHandler = () => {
        this.props.history.push("/Stores");
    }

    saveHandler = () => {
        const data = { ...this.state.storeData };
        data["operating_hours"] = this.state.from + '-' + this.state.to;
        if (Object.keys(data).length < 7)
            alert("Oops! To create a store you must specify all parameters.");
        else if (data.phone <= 0 || data.phone.length < 10)
            alert("Oops! Invalid phone number.");
        else if (data.size <= 0)
            alert("Oops! Invalid store size.");
        else if (data.number <= 0)
            alert("Oops! Invalid street number.");
        else if (data.postal_code <= 0)
            alert("Oops! Invalid postal code.");
        else
            axios.post('/stores', data)
                .then(res => {
                    console.log("/stores returns: ", res.data);
                    this.props.history.push("/Stores/" + res.data.id);
                })
                .catch(err => {
                    console.log("/stores error:", err.message);
                    this.props.history.push("/aWildErrorHasAppeared/" + err.message);
                });
    }

    changeHandler = (event) => {
        const data = { ...this.state.storeData };
        if (event.target.name === "from")
            this.setState({ from: event.target.value })
        else if (event.target.name === "to")
            this.setState({ to: event.target.value })
        else
            data[event.target.name] = event.target.value;
        this.setState({ storeData: data });
    }

    render() {
        let form = (
            <div className={classes.Content}>
                <div className={classes.Title}>
                    To create a new store please specify the following information.
                </div>

                <form>

                    <div className={classes.OpHours}>
                        <label>Operating Hours </label>
                        <input type="time" name="from" onChange={this.changeHandler} />
                        <label> - </label>
                        <input type="time" name="to" onChange={this.changeHandler} />
                    </div>

                    <div className={classes.Information}>

                        <div>
                            <label>Phone: </label>
                            <br />
                            <input type="tel" maxLength={10} placeholder={"ex 210XXXXXXX"} name="phone" onChange={this.changeHandler} />
                        </div>

                        <div>
                            <label>Size: </label>
                            <br />
                            <input type="number" maxLength={4} placeholder={"ex 1200"} name="size" onChange={this.changeHandler} />
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
                            <input type="number" placeholder={"55"} name="number" onChange={this.changeHandler} />
                            <br />
                            <label>City: </label>
                            <br />
                            <input type="text" placeholder={"Paradise"} name="city" onChange={this.changeHandler} />
                            <br />
                            <label>Postal Code: </label>
                            <br />
                            <input type="number" maxLength={4} placeholder={"12149"} name="postal_code" onChange={this.changeHandler} />
                            <br />
                        </div>
                    </div>
                </form>

                <div className={classes.Buttons}>
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