import React, { Component } from 'react';
import axios from '../../../axios.js';

import classes from './SingleStore.css';

//Page of all stores in database
class SingleStore extends Component {

    state = {
        loadedStore: null,
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
        if (this.props.match.params.storeId) {
            if (!this.state.loadedStore || (this.state.loadedStore && this.state.loadedStore.id !== +this.props.match.params.storeId)) {
                console.log("inside loadData");
                axios.get('/posts/' + this.props.match.params.storeId)
                    .then(res => {
                        console.log(res.data);
                        this.setState({ loadedStore: res.data, newData: res.data});
                    })
                    .catch(err => {
                        console.log(err);
                        this.props.history.push("/aWildErrorHasAppeared");
                    })
            }
        }
    }

    //fix
    deleteHandler = () => {
        console.log("inside deleteHandler");
        axios.delete('/postssss/' + this.props.match.params.storeId)
            .then(res => {
                console.log(res);
                this.props.history.push("/Stores");
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
        // if (data === this.state.loadedStore)
        //     alert("Information not changed! Mission abort.");
        // else{
        //===========================================================================Check if needed
            axios.post('/postsssss', data)
            .then( res => {
                console.log(res);
                this.props.history.push("/Stores/" + this.props.match.params.storeId);
            })
            .catch( err => {
                console.log(err);
                this.props.history.push("/aWildErrorHasAppeared");
            })
        // }
    }

    backHandler = () => {
        this.props.history.push("/Stores");
    }

    changeHandler = (event) => {
        console.log("CH before anything: ", this.state.newData);
        const data = { ...this.state.newData };
        data[event.target.name] = event.target.value;
        console.log("After assignment to data: ", data);
        this.setState({ newData: data});
        console.log("End of changeHandler: ", this.state.newData);
    }

    render() {
        let output = <div> Sending Request </div>
        // if (!this.state.error){
        if (this.props.match.params.storeId) {
            output = <div> Loading...! </div>;
            if (this.state.loadedStore) {
                output = (
                    <div>
                        <div className={classes.Title}>
                            Information about Store:{this.state.loadedStore.id}
                        </div>

                        <div className={classes.Info}>
                            <div> Operating Hours: --:--:-- to --:--:--</div>
                            <div> Contact Information: 210 XX XX XXX </div>
                            <div> Store size: </div>
                            <div> Address: Street Number City PostalCode </div>
                        </div>

                        {/* Make Not Dummy */}
                        <form className={classes.Form}>
                            <div className={classes.Title}> Change information </div>

                            <div className={classes.OpHours}>
                                <label>Operating Hours: </label>
                                <input type="time" defaultValue="09:00" name="from" onChange={this.changeHandler} />
                                <label> - </label>
                                <input type="time" defaultValue="21:00" name="to" onChange={this.changeHandler} />
                            </div>

                            <div>
                                <label>Phone: </label>
                                <br />
                                <input type="tel" maxLength={10} defaultValue={"012346789"} name="phone" onChange={this.changeHandler} />
                            </div>

                            <div>
                                <label>Size: </label>
                                <br />
                                <input type="number" maxLength={4} defaultValue={"500"} name="size" onChange={this.changeHandler} />
                            </div>

                            <div> Address
                                <div>
                                    <label>Street: </label>
                                    <br />
                                    <input type="text" defaultValue={"RandomSt"} name="street" onChange={this.changeHandler} />
                                    <br />
                                    <br />
                                    <label>Number: </label>
                                    <br />
                                    <input type="number" defaultValue={"27"} name="number" onChange={this.changeHandler} />
                                    <br />
                                    <br />
                                    <label>City: </label>
                                    <br />
                                    <input type="text" defaultValue={"Paradise"} name="city" onChange={this.changeHandler} />
                                    <br />
                                    <br />
                                    <label>Postal Code: </label>
                                    <br />
                                    <input type="number" maxLength={4} defaultValue={"12223"} name="postal_code" onChange={this.changeHandler} />
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
        // }
        return output;
    }
}

export default SingleStore;