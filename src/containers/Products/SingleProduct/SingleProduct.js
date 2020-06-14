import React, { Component } from 'react';
import axios from '../../../axios.js';

import classes from './SingleProduct.css';

//Profile page for a product
class SingleProduct extends Component {

    state = {
        loadedProduct: null,
        newData: null,
        historyPrice: null
    }

    componentDidMount() {
        this.loadData();
    }

    //Fetch data from db for selected store only
    loadData() {
        if (this.props.match.params.productId) {
            if (!this.state.loadedProduct || (this.state.loadedProduct && this.state.loadedProduct.barcode !== +this.props.match.params.productId)) {
                axios.get('/products/' + this.props.match.params.productId)
                    .then(res => {
                        console.log("get /products/:product returns", res.data);
                        this.setState({ loadedProduct: res.data });
                    })
                    .catch(err => {
                        console.log("get /products/:product error: ", err.message);
                        this.props.history.push("/aWildErrorHasAppeared/" + err.message);
                    })

                axios.get('/product/' + this.props.match.params.productId + '/history')
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
        console.log("Update Handler: ", this.state.newData);
        const data = this.state.newData;
        if (data === this.state.loadedProduct)
            alert("Oops! Information not changed.");
        else if (data.price <= 0)
            alert("Oops! Invalid product price");
        else {
        axios.put('/products/' + this.props.match.params.productId, data)
            .then(res => {
                console.log("put /products/:product returns: ", res.data);
                alert("Product information successfully updated.")
                this.props.history.push("/Products/" + this.props.match.params.productId);
            })
            .catch(err => {
                console.log("put /products/:product error: ", err.message);
                this.props.history.push("/aWildErrorHasAppeared/" + err.message);
            })
        }
    }

    backHandler = () => {
        this.props.history.push("/Products");
    }

    changeHandler = (event) => {
        const data = { ...this.state.newData };
        data[event.target.name] = event.target.value;
        this.setState({ newData: data });
    }

    render() {
        let output = <div> Sending Request </div>

        let historyPrice = <div> Loading ... </div>
        /* fix with ArrElement and map in historyPrice */
        if (this.state.historyPrice)
            historyPrice = <div> HistoryPrice will be displayed here </div>

        if (this.props.match.params.productId) {
            output = <div> Loading... </div>;
            if (this.state.loadedProduct) {
                output = (
                    <div>
                        <div className={classes.Title}>
                            Information about Product: {this.state.loadedProduct.barcode}
                        </div>

                        <div className={classes.Info}>
                            <div> Name: {this.state.loadedProduct.name} </div>
                            <div> Brand name: {this.state.loadedProduct.brand_name} </div>
                            <div> Price: {this.state.loadedProduct.price} </div>
                            <div> First transaction: {this.state.loadedProduct.first_transaction} </div>
                        </div>

                        <div className={classes.Info}>
                            {historyPrice}
                        </div>

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
                                <input type="number" maxLength={5} defaultValue={this.state.loadedProduct.price} name="price" onChange={this.changeHandler} />
                            </div>

                            <div>
                                <label>Brand Name: </label>
                                <br />
                                <input type="text" defaultValue={this.state.loadedProduct.brand_name} name="brand_name" onChange={this.changeHandler} />
                            </div>

                            <div>
                                <label>First Transaction: </label>
                                <br />
                                <input type="date" defaultValue={this.state.loadedProduct.first_transaction} name="first_transaction" onChange={this.changeHandler} />
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
        return output;
    }
}

export default SingleProduct;