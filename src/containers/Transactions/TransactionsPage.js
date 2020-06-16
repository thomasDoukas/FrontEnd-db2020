import React, { Component } from 'react';
import { Slider } from '@material-ui/core';
import axios from '../../axios.js';

import ArrElement from '../../components/Arr/ArrElement/ArrElement.js';
import Arr from '../../components/Arr/Arr.js';

import classes from './TransactionsPage.css';

//Transaction form
class TransactionsPage extends Component {

    state = {
        stores: [],
        formIsReady: false,
        formData: {
            selectedStoreId: 1,
            fromDate: "",
            toDate: "",
            fromTime: "",
            toTime: "",
            total_pieces: 0,
            total_amount: [0, 0],
            payment_method: "noInfo"
        },
        result: null
    }

    //Set URL /stores/getStoreList
    componentDidMount() {
        axios.get('/stores')
            .then(res => {
                console.log("get /stores returns: ", res.data);
                this.setState({ stores: res.data })
            })
            .catch(err => {
                console.log("get /stores error: ", err.message);
                //this.props.history.push("/aWildErrorHasAppeared/" + err.message);
            })
    }

    //Handler for selecting one of the available stores
    storeSelectedHandler = (id) => {
        let data = { ...this.state.formData };
        data.selectedStoreId = id;
        this.setState({ formData: data });
    }

    //General onChange event handler
    changeHandler = (event) => {
        if (event.target.name === "fromDate") {
            const data = { ...this.state.formData };
            data.fromDate = event.target.value;
            data.toDate = event.target.value;
            this.setState({ formData: data });
            console.log("inside");

        }
        else {
            const data = { ...this.state.formData };
            data[event.target.name] = event.target.value;
            this.setState({ formData: data });
        }
    }

    //Handler for slider from material ui
    sliderHandler = (event, value) => {
        const data = { ...this.state.formData };
        data[event.target.id] = value;
        this.setState({ formData: data });
    }

    //Event handler - setting up the total_pieces slider manually 
    changePiecesHandler = (event) => {
        //Limiting the input value
        let value = Number(event.target.value);
        if (event.target.value < 0)
            value = 0;
        else if (event.target.value > 20)
            value = 20;
        const data = { ...this.state.formData };
        data[event.target.name] = value;
        this.setState({ formData: data });
    }

    //Event handler - setting up the total_amount slider manually 
    changeAmountHandler = (event) => {
        //Limiting the input value
        let value = Number(event.target.value);
        if (value < 0)
            value = 0;
        else if (value > 300)
            value = 300;
        const newData = { ...this.state.formData }
        const data = this.state.formData.total_amount;
        if (event.target.name === "total_amount_min") {
            // min value cannot be greater than max
            if (value > data[1])
                value = data[1];
            data[0] = value;
            newData.total_amount = data;
            this.setState({ formData: newData });
        }
        else if (event.target.name === "total_amount_max") {
            // max value cannot be less than min
            if (value < data[0])
                value = data[0];
            data[1] = value;
            newData.total_amount = data;
            this.setState({ formData: newData });
        }
        else
            console.log("Hopefully you will never see this!");
    }

    //Go to previous page
    backHandler = () => {
        this.props.history.goBack();
    }

    // Reset the form in initial state
    backToFormHandler = () => {
        const nullifyData = { ...this.state.formData }
        nullifyData.selectedStoreId = null;
        nullifyData.payment_method = "noInfo";
        nullifyData.total_pieces = 0;
        nullifyData.total_amount = [0, 0];
        nullifyData.fromDate = "";
        nullifyData.toDate = "";
        nullifyData.fromTime = "";
        nullifyData.toTime = "";
        this.setState({ result: null, formData: nullifyData });
    }

    // Send request. Check if parameters are of right values
    submitHandler = () => {
        if (this.state.formData.selectedStoreId === null)
            alert("Oops! You must select a store to continue.");
        else {
            const data = this.state.formData;
            console.log(data);
            axios.get('/transactions')
                .then(res => {
                    console.log("get /transactions returns: ", res)
                    this.setState({ result: res.data })
                })
                .catch(err => {
                    console.log("get /transactions error: ", err)
                    // this.props.history.push("/aWildErrorHasAppeared/" + err.message);
                })
        }
    }

    render() {

        const stores = this.state.stores.map(store => {
            let address = store.number + ' ' + store.street + 'St, ' + store.city + ', ' + store.postal_code;
            return (
                <ArrElement
                    key={store.store_id}
                    firstTag={"Store id"}
                    id={store.store_id}
                    secondTag={"Address"}
                    body={address}
                    clicked={() => this.storeSelectedHandler(store.id)}
                />
            );
        })

        let isStoreSelected = (this.state.formData.selectedStoreId !== null) ? `You have selected store: ${this.state.formData.selectedStoreId}` : "You have not selected any store";

        let output = <div> Loading... </div>;
        if (!this.state.result) {
            output = (
                <div>
                    <div className={classes.Content}>
                        <div className={classes.Title}>
                            Select one of the available stores:
                        </div >

                        <Arr> {stores} </Arr>
                    </div>

                    <div className={classes.Content}>
                        <div className={classes.Title}>
                            Please Complete the following form:
                        </div >

                        <div className={classes.Title}>
                            {isStoreSelected}
                            <br />
                            <br />
                            <br />
                        </div>

                        <form>

                            <div className={classes.Window}>
                                <label>Date: </label>
                                <input type="date" name="fromDate" value={this.state.formData.fromDate} onChange={this.changeHandler} />
                                <label> - </label>
                                <input type="date" name="toDate" value={this.state.formData.toDate} onChange={this.changeHandler} />
                            </div>

                            {/* <div className={classes.Window}>
                                <label>Time: </label>
                                <input type="time" name="fromTime" value={this.state.formData.fromTime} onChange={this.changeHandler} />
                                <label> - </label>
                                <input type="time" name="toTime" value={this.state.formData.toTime} onChange={this.changeHandler} />
                            </div> */}

                            <div className={classes.Information}>

                                <div>
                                    <label>Payment method: </label>
                                    <br />
                                    <select name="payment_method" onChange={this.changeHandler} value={this.state.formData.payment_method}>
                                        <option value={"noInfo"}> NoInfo </option>
                                        <option value={"cash"}> Cash </option>
                                        <option value={"creditCard"}> Credit Card </option>
                                    </select>
                                </div>

                                <div className={classes.Range}>
                                    <label>Quantity: </label>
                                    <br />
                                    <div className={classes.Slider}>
                                        <Slider
                                            value={this.state.formData.total_pieces}
                                            id={"total_pieces"}
                                            min={0}
                                            max={20}
                                            onChange={this.sliderHandler}
                                            valueLabelDisplay="auto"
                                        />
                                    </div>
                                    <input type="number" maxLength={2} value={this.state.formData.total_pieces} name="total_pieces" onChange={this.changePiecesHandler} />
                                </div>

                                <div className={classes.Range}>
                                    <label>Total Cost: </label>
                                    <div className={classes.Slider}>
                                        <Slider
                                            value={this.state.formData.total_amount}
                                            id={"total_amount"}
                                            min={0}
                                            max={300}
                                            onChange={this.sliderHandler}
                                            valueLabelDisplay="auto"
                                        />
                                    </div>
                                    {(this.state.formData.total_amount[0] > 0) ?
                                        <input type="number" maxLength={3} value={this.state.formData.total_amount[0]} name="total_amount_min" onChange={this.changeAmountHandler} />
                                        : null}
                                    <input type="number" maxLength={3} value={this.state.formData.total_amount[1]} name="total_amount_max" onChange={this.changeAmountHandler} />
                                </div>

                            </div>
                        </form>

                        <button onClick={this.backToFormHandler} className={classes.ResetForm}> Reset Form </button>

                    </div>

                    <div className={classes.Buttons}>
                        <button onClick={this.submitHandler} className={classes.Update}> Submit </button>
                        <br />
                        <button onClick={this.backHandler} className={classes.Back}> Back </button>
                    </div>

                </div>
            )
        }
        else
            output = <div className={classes.Content}>
                {this.state.result}
                <div className={classes.Buttons}>
                    <button onClick={this.backToFormHandler} className={classes.Back}> Back </button>
                </div>
            </div>

        return (
            output
        );

    }
}

export default TransactionsPage;