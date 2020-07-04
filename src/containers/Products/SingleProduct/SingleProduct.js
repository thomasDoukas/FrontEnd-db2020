import React, { Component } from 'react';
import axios from '../../../axios.js';

import ArrElement from '../../../components/Arr/ArrElement/ArrElement.js';

import classes from './SingleProduct.css';

//Profile page for a product
class SingleProduct extends Component {

    state = {
        loadedProduct: null,
        newData: null,
        historyPrice: null,
        oldCatNum: 0,
        catNum: 0
    }

    //Fetch data from db for selected store only
    componentDidMount() {
        if (this.props.match.params.productId) {
            if (!this.state.loadedProduct || (this.state.loadedProduct && this.state.loadedProduct.barcode !== +this.props.match.params.productId)) {
                axios.get('/products/' + this.props.match.params.productId)
                    .then(res => {
                        console.log("get /products/:product returns", res.data[0]);
                        let cat = 0;
                        switch (res.data[0].category_name) {
                            case "Fresh":
                                cat = 1;
                                break;
                            case "Dairy and Frozen":
                                cat = 2;
                                break;
                            case "Drinks":
                                cat = 3;
                                break;
                            case "Personal":
                                cat = 4;
                                break;
                            case "Household":
                                cat = 5;
                                break;
                            case "Pet":
                                cat = 6;
                                break;
                            default:
                                console.log("If you see this you should take a break and rethink about your life choices");
                        }
                        this.setState({ loadedProduct: res.data[0], newData: res.data[0], catNum: cat, oldCatNum: cat });
                    })
                    .catch(err => {
                        console.log("get /products/:product error: ", err.message);
                        this.props.history.push("/aWildErrorHasAppeared/" + err.message);
                    })

                axios.get('/products/' + this.props.match.params.productId + '/history')
                    .then(res => {
                        console.log("get /products/:product/history returns: ", res.data);
                        this.setState({ historyPrice: res.data });
                    })
                    .catch(err => {
                        console.log("get /products/:product/history returns: ", err.message);
                        this.props.history.push("/aWildErrorHasAppeared/" + err.message);
                    })
            }
        }
    }


    deleteHandler = () => {
        axios.delete('/products/' + this.props.match.params.productId)
            .then(res => {
                console.log("delete /products/:product returns: ", res.data);
                alert("Product has been successfully deleted.");
                this.props.history.push("/Products");
            })
            .catch(err => {
                console.log("delete /products/:product error: ", err.message);
                this.props.history.push("/aWildErrorHasAppeared/" + err.message);
            });
    }

    updateHandler = () => {
        const data = this.state.newData;
        var regex = /\d/g;
        data["category_id"] = this.state.catNum;

        let isReady = true;
        //Check newData for empty strings
        for (var member in data) {
            if (data[member] === "")
                isReady = false;
        }

        if (isReady) {
            if (data.price && data.price <= 0)
                alert("Oops! Invalid product price");
            else if (data.category_id && data.category_id === 0)
                alert("Oops! Invalid product category");
            else if (regex.test(data.name))
                alert("Oops! Please do not use numbers as product name.");
            else if (regex.test(data.brand_name))
                alert("Oops! Please do not use numbers as brand name.");
            else {
                console.log("updating with data: ", data);
                axios.put('/products/' + this.props.match.params.productId, data)
                    .then(res => {
                        console.log("put /products/:product returns: ", res.data);
                        alert("Product information successfully updated.")
                        this.props.history.push("/Products");
                    })
                    .catch(err => {
                        console.log("put /products/:product error: ", err.message);
                        this.props.history.push("/aWildErrorHasAppeared/" + err.message);
                    })
            }
        }
        else
            alert("Oops! Looks like something is empty");
    }

    backHandler = () => {
        this.props.history.push("/Products");
    }

    changeHandler = (event) => {
        const data = { ...this.state.newData };
        data[event.target.name] = event.target.value;
        if (event.target.name === "category_name")
            this.setState({ catNum: event.target.value });
        else
            this.setState({ newData: data });
    }

    render() {
        let output = <div> Sending Request </div>
        let historyPrice = <div> Loading ... </div>

        let historyExists = false;

        if (this.state.historyPrice) {
            if (this.state.historyPrice.length > 0) {
                historyExists = true;
                historyPrice = this.state.historyPrice.map((history, index) => {
                    return (
                        <ArrElement
                            key={index}
                            firstTag={"Price"}
                            id={history.price}
                            secondTag={"Start Date"}
                            body={history.start_date.substring(0, 10)}
                            thirdTag={"End Date"}
                            secondaryBody={history.end_date.substring(0, 10)}
                        />
                    );
                })
            }
        }

        if (this.props.match.params.productId) {
            output = <div> Loading... </div>;
            if (this.state.loadedProduct) {

                let date = new Date(this.state.loadedProduct.first_transaction);
                console.log("new Data is: ", date);
                let trans = date.toString().substring(0, 24);
                console.log("trans is: ", trans);
                const offset = date.getTimezoneOffset();
                date = new Date(date.getTime() - (offset * 60 * 1000));
                const defInputDate = date.toISOString().split('T')[0];

                output = (
                    <div>
                        <div className={classes.Title}>
                            Information about Product: {this.state.loadedProduct.barcode}
                        </div>

                        <div className={classes.Info}>
                            <div> Name: {this.state.loadedProduct.name} </div>
                            <div> Brand name: {this.state.loadedProduct.brand_name} </div>
                            <div> Category name: {this.state.loadedProduct.category_name} </div>
                            <div> Price: {this.state.loadedProduct.price} </div>
                            <div> First transaction: {trans} </div>
                        </div>

                        {historyExists ?
                            <div className={classes.Info}>
                                <div className={classes.Title}> Older prices </div>
                                <br />
                                {historyPrice}
                            </div>
                            :
                            <div className={classes.Info}>
                                <div className={classes.Title}> This product has no older prices </div>
                                <br />
                                <ArrElement
                                    key={1}
                                    firstTag={"Price"}
                                    id={this.state.loadedProduct.price}
                                    secondTag={"Date"}
                                    body={this.state.loadedProduct.first_transaction.substring(0, 10) + " to today"}
                                />
                            </div>
                        }


                        <form className={classes.Form}>
                            <div className={classes.Title}> Change information </div>

                            <div>
                                <label>Name: </label>
                                <br />
                                <input type="text" defaultValue={this.state.loadedProduct.name} name="name" onChange={this.changeHandler} />
                            </div>

                            <div>
                                <label>Price: </label>
                                <br />
                                <input type="number" min={1} defaultValue={this.state.loadedProduct.price} name="price" onChange={this.changeHandler} />
                            </div>

                            <div>
                                <label>Brand Name: </label>
                                <br />
                                <input type="text" defaultValue={this.state.loadedProduct.brand_name} name="brand_name" onChange={this.changeHandler} />
                            </div>

                            <div>
                                <label>Product Category: </label>
                                <br />
                                <select name="category_name" onChange={this.changeHandler} value={this.state.catNum}>
                                    <option value={0} hidden> Please select a category for the new product </option>
                                    <option value={2}> Dairy and Frozen </option>
                                    <option value={3}> Drinks </option>
                                    <option value={1}> Fresh </option>
                                    <option value={5}> Household </option>
                                    <option value={4}> Personal </option>
                                    <option value={6}> Pet </option>
                                </select>
                            </div>

                            {/* <div>
                                <label>First Transaction: </label>
                                <br />
                                <input type="date" defaultValue={defInputDate} name="first_transaction" onChange={this.changeHandler} />
                            </div> */}
                        </form>

                        <div className={classes.Buttons}>
                            <button className={classes.Delete} onClick={this.deleteHandler}> Delete Product </button>
                            <button className={classes.Update} onClick={this.updateHandler}> Submit Changes </button>
                            <button className={classes.Back} onClick={this.backHandler}> Back </button>
                        </div>

                    </div>
                )
            }
        }
        return output;
    }
}

export default SingleProduct;