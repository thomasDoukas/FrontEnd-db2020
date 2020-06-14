import React, { Component } from 'react';
import axios from '../../axios.js';

import ArrElement from '../../components/Arr/ArrElement/ArrElement.js';
import Arr from '../../components/Arr/Arr.js';

import classes from './TransactionsPage.css';

//Page of all stores in database
class TransactionsPage extends Component {

    state = {
        stores: [],
        formIsReady: false,
        formData: {
            selectedStoreId: null,
            date: null,
            time: null,
            total_pieces: null,
            total_amount: null,
            payment_method: "noInfo",
            productCategory: null
        },
        result: null
    }

    //Set URL /stores/getStoreList
    componentDidMount() {
        axios.get('/posts')
            .then(res =>
                this.setState({ stores: res.data })
            )
            .catch(err => {
                console.log(err);
                this.props.history.push("/aWildErrorHasAppeared");
            })
    }

    StoreSelectedHandler = (id) => {
        let data = { ...this.state.formData };
        data.selectedStoreId = id;
        this.setState({ formData: data });
    }

    changeHandler = (event) => {
        const data = { ...this.state.formData };
        data[event.target.name] = event.target.value;
        this.setState({ formData: data });
    }

    backHandler = () => {
        this.props.history.goBack();
    }

    backToFormHandler = () => {
        const nullifyData = { ...this.state.formData }
        for (var prop in nullifyData) {
            if (nullifyData.hasOwnProperty(prop)) {
                nullifyData[prop] = null;
            }
        }
        this.setState({ result: null, formData: nullifyData });
    }

    submitHandler = () => {
        if (this.state.formData.selectedStoreId === null)
            alert("Oops! You must select a store to continue.");
        else if (this.state.total_amount < 0)
            alert("Oops! total")
        else {
            console.log("inside submit handler");
            const data = this.state.formData;
            console.log(data);
            // axios.post('/posts', data)
            //     .then(res =>
            //         this.setState({ result: res.data })
            //     )
            //     .catch(err => {
            //         console.log(err);
            //         this.props.history.push("/aWildErrorHasAppeared");
            //     })
            axios.get('/posts')
                .then(res => {
                    console.log("Fetching result", res)
                    this.setState({ result: res.data[1].body })
                })
                .catch(err => {
                    console.log(err);
                    this.props.history.push("/aWildErrorHasAppeared");
                })
        }
    }

    render() {

        //what does the api return?? store.id=>
        const stores = this.state.stores.map(store => {
            return (
                <ArrElement
                    key={store.id}
                    id={store.id}
                    firstTag={"Store id"}
                    secondTag={"Address"}
                    body={store.body.slice(0, 21)}
                    clicked={() => this.StoreSelectedHandler(store.id)}
                />
            );
        })

        let isStoreSelected = (this.state.formData.selectedStoreId !== null) ? `You have selected store: ${this.state.formData.selectedStoreId}` : "You have not selected any store";

        // let output = <div> Something went wrong!!! </div>
        // if (!this.state.error){

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

                    <div className={classes.Form}>
                        <div className={classes.Title}>
                            Please Complete the following form:
                    </div >

                        <div>
                            {isStoreSelected}
                        </div>

                        <form>
                            <div className={classes.Information}>

                                <div>
                                    <label>Date: </label>
                                    <br />
                                    <input type="date" name="date" onChange={this.changeHandler} />
                                </div>

                                <div>
                                    <label>Time: </label>
                                    <br />
                                    <input type="time" name="time" onChange={this.changeHandler} />
                                </div>

                                <div>
                                    <label>Product Category: </label>
                                    <br />
                                    <input type="text" placeholder={"ex: Dairy"} name="productCategory" onChange={this.changeHandler} />
                                </div>

                                <div>
                                    <label>Quantity: </label>
                                    <br />
                                    <input type="number" placeholder={"2"} name="total_pieces" onChange={this.changeHandler} />
                                </div>

                                <div>
                                    <label>Total cost: </label>
                                    <br />
                                    <input type="number" placeholder={"20"} name="total_amount" onChange={this.changeHandler} />
                                </div>

                                <div>
                                    <label>Payment method: </label>
                                    <br />
                                    <select name="payment_method" onChange={this.changeHandler} value={this.state.formData.payment_method}>
                                        <option value={"noInfo"}> NoInfo </option>
                                        <option value={"cash"}> Cash </option>
                                        <option value={"creditCard"}> Credit Card </option>
                                    </select>
                                </div>

                            </div>
                        </form>
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

        // }

        // return output; 
    }
}

export default TransactionsPage;