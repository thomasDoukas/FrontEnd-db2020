import React, { Component } from 'react';
import axios from '../../../axios.js';

import classes from './SingleClient.css';

//Page of all stores in database
class SingleClient extends Component {

    state = {
        loadedClient: null,
        // error: false,
        newData: null
    }

    componentDidMount() {
        this.loadData();
    }

    // componentDidUpdate() {
    //     this.loadData();
    // }

    //Fetch data from db for selected store only
    //Set URL /Stores/:store/getStore
    loadData() {
        if (this.props.match.params.clientId) {
            if (!this.state.loadedClient || (this.state.loadedClient && this.state.loadedClient.id !== +this.props.match.params.ClientId)) {
                console.log("inside loadData");
                axios.get('/posts/' + this.props.match.params.clientId)
                    .then(res => {
                        console.log(res.data);
                        this.setState({ loadedClient: res.data, newData: res.data });
                    })
                    .catch(err => {
                        console.log(err);
                        this.props.history.push("/aWildErrorHasAppeared");
                    })

                // axios.get('/posts')
                //     .then(res => {
                //         console.log("comments", res.data);
                //         this.setState({ historyPrice: res.data });
                //     })
                //     .catch(err => {
                //         console.log(err);
                //         this.props.history.push("/aWildErrorHasAppeared");
                //     })
            }
        }
    }

    //fix
    deleteHandler = () => {
        console.log("inside deleteHandler");
        axios.delete('/postssss/' + this.props.match.params.clientId)
            .then(res => {
                console.log(res);
                this.props.history.push("/Clients");
            })
            .catch(err => {
                console.log(err);
                this.props.history.push("/aWildErrorHasAppeared");
            });
    }

    //fix
    updateHandler = () => {
        console.log("Update Handler: ", this.state.newData);
        const data = this.state.newData;
        // if (data === this.state.loadedProduct)
        //     alert("Information not changed! Mission abort.");
        // else {
        //===========================================================================Check if needed
        axios.post('/postsssss', data)
            .then(res => {
                console.log(res);
                this.props.history.push("/Clients/" + this.props.match.params.clientId);
            })
            .catch(err => {
                console.log(err);
                this.props.history.push("/aWildErrorHasAppeared");
            })
        // }
    }

    backHandler = () => {
        this.props.history.push("/Clients");
    }

    changeHandler = (event) => {
        console.log("CH before anything: ", this.state.newData);
        const data = { ...this.state.newData };
        data[event.target.name] = event.target.value;
        console.log("After assignment to data: ", data);
        this.setState({ newData: data });
        console.log("End of changeHandler: ", this.state.newData);
    }

    render() {
        let output = <div> Sending Request </div>
        // if (!this.state.error){
        if (this.props.match.params.clientId) {
            output = <div> Loading...! </div>;
            if (this.state.loadedClient) {
                output = (
                    <div>
                        <div className={classes.Title}>
                            Information about Client:{this.state.loadedClient.id}
                        </div>

                        <div className={classes.Info}>
                            <div> Name: SomeName</div>
                            <div> Date of Birth: 12/12/12</div>
                            <div> Phone: 210XXXXXXX </div>
                            <div> Family members: 2 </div>
                            <div> Pet: dog </div>
                            <div> Points: 10000 </div>
                            <div> Address: Street Number City PostalCode </div>
                        </div>

                        <div className={classes.Info}>
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
                        </div>

                        {/* Make Not Dummy */}
                        <form className={classes.Form}>
                            <div className={classes.Title}> Change information </div>

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

                        <div> Address
                            <div>
                                <label> Street: </label>
                                <br />
                                <input type="text" placeholder={"Spirit"} name="street" onChange={this.changeHandler} />
                                <br />
                                <br />
                                <label>Number: </label>
                                <br />
                                <input type="number" placeholder={"55"} name="number" onChange={this.changeHandler} />
                                <br />
                                <br />
                                <label>City: </label>
                                <br />
                                <input type="text" placeholder={"Paradise"} name="city" onChange={this.changeHandler} />
                                <br />
                                <br />
                                <label>Postal Code: </label>
                                <br />
                                <input type="number" maxLength={4} placeholder={"12149"} name="postal_code" onChange={this.changeHandler} />
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
        // }
        return output;
    }
}

export default SingleClient;