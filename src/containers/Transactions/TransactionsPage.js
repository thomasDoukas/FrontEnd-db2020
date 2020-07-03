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
            store_id: null,
            date_time: ["", ""],
            pieces: [0, 0],
            total_amount: [0, 0],
            payment_method: "",
            category_id: ""
        },
        result: null,
        nextView: "By Product Category"
        // nextView: "General Transactions"
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
                this.props.history.push("/aWildErrorHasAppeared/" + err.message);
            })
    }

    //Handler for selecting one of the available stores
    storeSelectedHandler = (id) => {
        let data = { ...this.state.formData };
        data.store_id = id;
        this.setState({ formData: data });
    }

    //General onChange event handler
    changeHandler = (event) => {
        if (event.target.name === "fromDate") {
            const data = { ...this.state.formData };
            data["date_time"][0] = event.target.value;
            data["date_time"][1] = event.target.value;
            this.setState({ formData: data });
        }
        else if (event.target.name === "toDate") {
            const data = { ...this.state.formData };
            data["date_time"][1] = event.target.value;
            this.setState({ formData: data });
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

    //Event handler - setting up the pieces slider manually 
    changePiecesHandler = (event) => {
        //Limiting the input value
        let value = Number(event.target.value);
        if (value < 0)
            value = 0;
        else if (event.target.value > 20)
            value = 20;
        const newData = { ...this.state.formData };
        const data = this.state.formData.pieces;
        if (event.target.name === "pieces_min") {
            // min value cannot be greater than max
            if (value > data[1])
                value = data[1];
            data[0] = value;
            newData["pieces"] = data;
            this.setState({ formData: newData });
        }
        else if (event.target.name === "pieces_max") {
            // max value cannot be less than min
            if (value < data[0])
                value = data[0];
            data[1] = value;
            newData["pieces"] = data;
            this.setState({ formData: newData });
        }
        else
            console.log("Hopefully you will never see this!");
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
            newData["total_amount"] = data;
            this.setState({ formData: newData });
        }
        else if (event.target.name === "total_amount_max") {
            // max value cannot be less than min
            if (value < data[0])
                value = data[0];
            data[1] = value;
            newData["total_amount"] = data;
            this.setState({ formData: newData });
        }
        else
            console.log("Or this!");
    }

    //Go to previous page
    backHandler = () => {
        this.props.history.goBack();
    }

    // Reset the form in initial state
    backToFormHandler = () => {
        const nullifyData = { ...this.state.formData };
        nullifyData["store_id"] = null;
        nullifyData["payment_method"] = "";
        nullifyData["pieces"] = [0, 0];
        nullifyData["total_amount"] = [0, 0];
        nullifyData["date_time"] = ["", ""];
        nullifyData["category_id"] = "";
        this.setState({ result: null, formData: nullifyData });
    }

    toggleViewHandler = () => {
        let view = "By Product Category";
        if (this.state.nextView === "By Product Category")
            view = "General Transactions";
        else if (this.state.nextView === "General Transactions")
            view = "By Product Category";
        this.setState({ nextView: view });
    }

    // Send request. Check if parameters are of right values
    submitHandler = () => {
        const data = this.state.formData;
        let datesAreCool = true;

        if (data["date_time"][0] !== "" && data["date_time"][1] !== "") {
            let d1 = new Date(data["date_time"][0]);
            let d2 = new Date(data["date_time"][1]);
            if (d1 > d2) {
                datesAreCool = false;
            }
        }

        if (data["store_id"] === undefined)
            alert("Oops! You must select a store to continue.");
        else if (data["date_time"][0] === "" && data["date_time"][1] !== "")
            alert("Oops! Please select a starting date.")
        else if (!datesAreCool)
            alert("Oops! You did not select the dates correctly.")
        else {
            delete data[""];

            if (data["date_time"][0] === "" && data["date_time"][1] === "")
                data["date_time"] = "";
            if (data["pieces"][0] === 0 && data["pieces"][1] === 0)
                data["pieces"] = "";
            if (data["total_amount"][0] === 0 && data["total_amount"][1] === 0)
                data["total_amount"] = "";

            let url = "";
            if (this.state.nextView === "By Product Category") {
                url = "/transactions";
                delete data["category_id"];
            }
            else if (this.state.nextView === "General Transactions")
                url = "/transactions/products";

            axios.post(url, data)
                .then(res => {
                    console.log("post /transactions returns: ", res.data);
                    let dataArray = {};
                    if (this.state.nextView === "General Transactions") {
                        dataArray = res.data.reduce((r, a) => {
                            r[a.date_time] = [...r[a.date_time] || [], a];
                            return r;
                        }, {});
                        dataArray = Object.keys(dataArray).map(i => dataArray[i]);
                    }
                    else
                        dataArray = res.data;
                    this.setState({ result: dataArray });
                })
                .catch(err => {
                    console.log("get /transactions error: ", err)
                    this.props.history.push("/aWildErrorHasAppeared/" + err.message);
                })
        }
    }

    render() {

        const stores = this.state.stores.map(store => {
            let address = store.number + ' ' + store.street + ', ' + store.city + ', ' + store.postal_code;
            return (
                <ArrElement
                    key={store.store_id}
                    firstTag={"Store id"}
                    id={store.store_id}
                    secondTag={"Address"}
                    body={address}
                    clicked={() => this.storeSelectedHandler(store.store_id)}
                />
            );
        })

        let isStoreSelected = (this.state.formData.store_id !== null) ?
            <div>
                You have selected store: {this.state.formData.store_id}
            </div>
            :
            <div style={{ color: "red" }}>
                You have not selected any store
            </div>

        let categoryId = (this.state.nextView === "General Transactions") ?
            <div>
                <label>Product Category: </label>
                <br />
                <select name="category_id" onChange={this.changeHandler} value={this.state.category_id}>
                    <option value={""}> Not Specified </option>
                    <option value={2}> Dairy and Frozen </option>
                    <option value={3}> Drinks </option>
                    <option value={1}> Fresh </option>
                    <option value={5}> Household </option>
                    <option value={4}> Personal </option>
                    <option value={6}> Pet </option>
                </select>
            </div>
            :
            <div />

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
                                <input type="date" name="fromDate" value={this.state.formData.date_time[0]} onChange={this.changeHandler} />
                                <label> - </label>
                                <input type="date" name="toDate" value={this.state.formData.date_time[1]} onChange={this.changeHandler} />
                                <br />
                                <div style={{ fontSize: "10px" }} > *For a single date set the same value on both fields. </div>
                            </div>

                            <div className={classes.Information}>

                                <div>
                                    <label>Payment method: </label>
                                    <br />
                                    <select name="payment_method" onChange={this.changeHandler} value={this.state.formData.payment_method}>
                                        <option value={""}> Not Specified </option>
                                        <option value={"cash"}> Cash </option>
                                        <option value={"creditCard"}> Credit Card </option>
                                    </select>
                                </div>

                                {categoryId}

                                <br />
                                <br />

                                <div className={classes.Range}>
                                    <label>Quantity: </label>
                                    <br />
                                    <div className={classes.Slider}>
                                        <Slider
                                            value={this.state.formData.pieces}
                                            id={"pieces"}
                                            min={0}
                                            max={20}
                                            onChange={this.sliderHandler}
                                            valueLabelDisplay="auto"
                                        />
                                    </div>
                                    {(this.state.formData.pieces[0] > 0) ?
                                        <input type="number" maxLength={2} value={this.state.formData.pieces[0]} name="pieces_min" onChange={this.changePiecesHandler} />
                                        :
                                        null
                                    }
                                    <input type="number" maxLength={2} value={this.state.formData.pieces[1]} name="pieces_max" onChange={this.changePiecesHandler} />
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
                                        :
                                        null
                                    }
                                    <input type="number" maxLength={3} value={this.state.formData.total_amount[1]} name="total_amount_max" onChange={this.changeAmountHandler} />
                                </div>

                            </div>
                        </form>

                        <button onClick={this.toggleViewHandler} className={classes.ToggleForm}> {this.state.nextView} </button>
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
        else if (this.state.result.length === 0) {
            output = 
                <div className={classes.Content}>
                    <div className={classes.Title}>
                        There are no transactions in store {this.state.formData.store_id} yet.
                    </div>

                    <div className={classes.Buttons}>
                        <button onClick={this.backToFormHandler} className={classes.Back}> Back </button>
                    </div>
                </div>
        }
        else {

            output = (this.state.nextView === "By Product Category") ?
                <div className={classes.Content}>
                    <div className={classes.Title}>
                        General Transaction in store
                        </div>

                    <br />
                    <br />

                    {
                        this.state.result.map((transaction, index) => {
                            let date = new Date(transaction.date_time);
                            date = date.toString().substring(0, 24);
                            return (
                                <ArrElement
                                    key={index}
                                    firstTag={"Transaction Date"}
                                    id={date}
                                    secondTag={"Quantity of products"}
                                    body={transaction.total_pieces}
                                    thirdTag={"Total cost"}
                                    secondaryBody={transaction.total_amount + "€"}
                                    fourthTag={"Paid with"}
                                    tertiaryBody={transaction.payment_method.charAt(0).toUpperCase() + transaction.payment_method.slice(1)}
                                    fifthTag={"Customer"}
                                    quaternaryBody={transaction.card_id}
                                />
                            )
                        })
                    }

                    <div className={classes.Buttons}>
                        <button onClick={this.backToFormHandler} className={classes.Back}> Back </button>
                    </div>
                </div>

                :

                <div className={classes.Content}>
                    <div className={classes.Title}>
                        Transaction per product category in store {this.state.formData.store_id}
                    </div>

                    <br />
                    <br />

                    {
                        this.state.result.map((arr, index) => {
                            let date = new Date(arr[0]["date_time"]);
                            date = date.toString().substring(0, 24);
                            console.log(arr);
                            return (
                                <div className={classes.Content} key={index}>
                                    <div className={classes.Title} key={index}>
                                        Transaction at: {date}
                                        <br />
                                            Total Cost:  {arr[0]["total_amount"] + "€"}
                                        <br />
                                            Paid with: {arr[0]["payment_method"].charAt(0).toUpperCase() + arr[0]["payment_method"].slice(1)}
                                        <br />
                                            Customer: {arr[0]["card_id"]}
                                    </div>
                                    <br />
                                    <br />
                                    {
                                        arr.map((internalElement, internalIndex) => {
                                            return (
                                                <ArrElement
                                                    key={internalIndex}
                                                    firstTag={"Product"}
                                                    id={internalElement["product"]}
                                                    secondTag={"Brand"}
                                                    body={internalElement["brand"]}
                                                    thirdTag={"Category"}
                                                    secondaryBody={internalElement["category"]}
                                                    fourthTag={"Quantity"}
                                                    tertiaryBody={internalElement["pieces"]}
                                                />
                                            )
                                        })
                                    }
                                </div>
                            )
                        })
                    }

                    <div className={classes.Buttons}>
                        <button onClick={this.backToFormHandler} className={classes.Back}> Back </button>
                    </div>
                </div>
        }

        return (
            output
        );

    }
}

export default TransactionsPage;