import React, { Component } from 'react';
import axios from '../../../axios.js';

import classes from './AddClient.css';

//Add new client in database
class AddClient extends Component {

    // state = {
    //     clientData: null,
    //     firstName: null,
    //     lastName: null
    // }

    state = {
        clientData: {
            name: null,
            date_of_birth: null,
            points: null,
            phone: null,
            pet: "",
            family_members: null,
            street: null,
            number: null,
            postal_code: null,
            city: null
        }
    }

    backHandler = () => {
        this.props.history.push("/Clients");
    }

    saveHandler = () => {
        let data = { ...this.state.clientData };
        var regex = /\d/g;

        delete data.firstName;

        if (this.state.firstName !== null && this.state.lastName !== null) {
            data["name"] = this.state.firstName + ' ' + this.state.lastName;
        }

        if (Object.keys(data).length < 10)
            alert("Oops! To create a client you must specify all parameters.");
        else if (regex.test(data.name))
            alert("Oops! Please do not use numbers as clients name.");
        else if (data.phone <= 0)
            alert("Oops! Invalid client phone")
        else if (data.number <= 0)
            alert("Oops! Invalid address number.")
        else if (data.postal_code && data.postal_code < 0 )
                alert("Oops! Invalid postal code.");
        else if (data.points < 0)
            alert("Oops! Invalid points number.")
        else if (data.family_members < 0)
            alert("Oops! Invalid family members.")
        else if (regex.test(data.street))
            alert("Oops! Please do not use numbers as street name.");
        else if (regex.test(data.city))
            alert("Oops! Please do not use numbers as city name.");
        else {
            data.date_of_birth = data.date_of_birth.split("T")[0];
            console.log("submitting the following data:", data);
            axios.post('/clients', data)
                .then(res => {
                    console.log("post /clients returns: ", res.data);
                    this.props.history.push("/Clients/" + res.data.customer_id);
                })
                .catch(err => {
                    console.log("post /clients error: ", err);
                    this.props.history.push("/aWildErrorHasAppeared/" + err.message);
                })
        }
    }

    changeHandler = (event) => {
        const data = { ...this.state.clientData };
        if (event.target.name === "firstName")
            this.setState({ firstName: event.target.value });

        if (event.target.name === "lastName")
            this.setState({ lastName: event.target.value });

        else
            data[event.target.name] = event.target.value;

        this.setState({ clientData: data });
    }

    render() {

        let form = (
            <div className={classes.Content}>
                <div className={classes.Title}>
                    To create a new client please specify the following information.
                </div>

                <form>

                    <div className={classes.Information}>

                        <div>
                            <label>First Name: </label>
                            <br />
                            <input type="text" placeholder={"Jake"} name="firstName" onChange={this.changeHandler} />
                        </div>

                        <div>
                            <label>Last Name: </label>
                            <br />
                            <input type="text" placeholder={"Jake"} name="lastName" onChange={this.changeHandler} />
                        </div>

                        <div>
                            <label>Date of Birth: </label>
                            <br />
                            <input type="date" name="date_of_birth" onChange={this.changeHandler} />
                        </div>

                        <div>
                            <label>Phone: </label>
                            <br />
                            <input type="tel" maxLength={10} placeholder={"ex 210XXXXXXX"} name="phone" onChange={this.changeHandler} />
                        </div>

                        <div>
                            <label>Points: </label>
                            <br />
                            <input type="number" placeholder={"10000"} min={0} name="points" onChange={this.changeHandler} />
                        </div>


                        <div>
                            <label>Family members: </label>
                            <br />
                            <input type="number" placeholder={"2"} min={1} name="family_members" onChange={this.changeHandler} />
                        </div>

                        <div>
                            <label>Pet: </label>
                            <br />
                            <select name="pet" onChange={this.changeHandler}>
                                <option value={""}> No Pet </option>
                                <option value={"Cat"}> Cat </option>
                                <option value={"Bird"}> Bird </option>
                                <option value={"Dog"}> Dog </option>
                                <option value={"Fish"}> Fish </option>
                            </select>
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
                            <input type="number" placeholder={"12149"} min={11111} name="postal_code" onChange={this.changeHandler} />
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

export default AddClient;