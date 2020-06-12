import React, { Component } from 'react';
import axios from '../../../axios.js';

import classes from './AddClient.css';

//Page of all stores in database
class AddClient extends Component {

    state = {
        clientData: null
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
        else if (data.family_members<= 0)
            alert("Oops! Invalid postal code.")
        else {
            console.log("After save", data);
            axios.post('/postsAfterSave', data)
                .then(res => {
                    console.log(res);
                    this.props.history.push("/Clients/" + res.data.id); //what does post return
                })
                .catch(err => {
                    console.log(err);
                    this.props.history.push("/aWildErrorHasAppeared");
                })
        }
    }

    changeHandler = (event) => {
        const data = { ...this.state.clientData };
        data[event.target.name] = event.target.value;
        this.setState({ clientData: data });
        console.log(this.state.clientData);
    }

    render() {
        console.log(this.state.clientData);

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