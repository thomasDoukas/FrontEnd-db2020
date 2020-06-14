import React, { Component } from 'react';
import axios from '../../../axios.js';

import classes from './AddClient.css';

//Add new client in database
class AddClient extends Component {

    // state = {
    //     clientData: null
    // }

    state = {
        clientData: {
            name: null,
            date_of_birth: null,
            points: null,
            phone: null,
            pet: null,
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
        const data = { ...this.state.clientData };
        if (Object.keys(data).length < 10)
            alert("Oops! To create a client you must specify all parameters.");
        else if (data.phone <= 0)
            alert("Oops! Invalid client phone")
        else if (data.number <= 0)
            alert("Oops! Invalid address number.")
        else if (data.postal_code <= 0)
            alert("Oops! Invalid postal code.")
        else if (data.points < 0)
            alert("Oops! Invalid points number.")
        else if (data.family_members < 0)
            alert("Oops! Invalid postal code.")
        else {
            axios.post('/clients', data)
                .then(res => {
                    console.log("post /clients returns: ", res.data);
                    this.props.history.push("/Clients/" + res.data.card);
                })
                .catch(err => {
                    console.log("post /clients error: ", err.message);
                    this.props.history.push("/aWildErrorHasAppeared/" + err.message);
                })
        }
    }

    changeHandler = (event) => {
        const data = { ...this.state.clientData };
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
                            <label>Name: </label>
                            <br />
                            <input type="text" placeholder={"milk"} name="name" onChange={this.changeHandler} />
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
                            <input type="number" placeholder={"10000"} name="points" onChange={this.changeHandler} />
                        </div>


                        <div>
                            <label>Family members: </label>
                            <br />
                            <input type="number" placeholder={"2"} name="family_members" onChange={this.changeHandler} />
                        </div>

                        <div>
                            <label>Pet: </label>
                            <br />
                            <input type="text" placeholder={"Dog"} name="pet" onChange={this.changeHandler} />
                        </div>

                        <div>
                            <label>Pet: </label>
                            <br />
                            <select name="pet" onChange={this.changeHandler}>
                                <option value={null}> No Pet </option>
                                <option value={"cat"}> Cat </option>
                                <option value={"bird"}> Bird </option>
                                <option value={"dog"}> Dog </option>
                                <option value={"fish"}> Fish </option>
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

export default AddClient;