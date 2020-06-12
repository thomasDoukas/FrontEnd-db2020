import React, { Component } from 'react';
import axios from '../../../axios.js';

import classes from './SingleProduct.css';

//Page of all stores in database
class SingleProduct extends Component {

    state = {
        loadedProduct: null,
        // error: false,
        newData: null,
        historyPrice: null
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
        if (this.props.match.params.productId) {
            if (!this.state.loadedProduct || (this.state.loadedProduct && this.state.loadedProduct.id !== +this.props.match.params.productId)) {
                console.log("inside loadData");
                axios.get('/posts/' + this.props.match.params.productId)
                    .then(res => {
                        console.log(res.data);
                        this.setState({ loadedProduct: res.data, newData: res.data });
                    })
                    .catch(err => {
                        console.log(err);
                        this.props.history.push("/aWildErrorHasAppeared");
                    })

                axios.get('/posts')
                    .then(res => {
                        console.log("comments", res.data);
                        this.setState({ historyPrice: res.data });
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
        axios.delete('/postssss/' + this.props.match.params.productId)
            .then(res => {
                console.log(res);
                this.props.history.push("/Products");
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
                this.props.history.push("/Products/" + this.props.match.params.productId);
            })
            .catch(err => {
                console.log(err);
                this.props.history.push("/aWildErrorHasAppeared");
            })
        // }
    }

    backHandler = () => {
        this.props.history.push("/Products");
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
        if (this.props.match.params.productId) {
            output = <div> Loading...! </div>;
            if (this.state.loadedProduct) {
                output = (
                    <div>
                        <div className={classes.Title}>
                            Information about Product:{this.state.loadedProduct.id}
                        </div>

                        <div className={classes.Info}>
                            <div> Name: SomeName</div>
                            <div> Brand name: SomeBrand</div>
                            <div> Price: 1$ </div>
                            <div> First transaction: 22/12/20 </div>
                        </div>

                        <div className={classes.Info}>
                            <div> HistoryPrice </div>
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
                                <label>Price: </label>
                                <br />
                                <input type="number" maxLength={5} placeholder={"ex 12.99"} name="price" onChange={this.changeHandler} />
                            </div>

                            <div>
                                <label>Brand Name: </label>
                                <br />
                                <input type="text" placeholder={"example brand"} name="brand_name" onChange={this.changeHandler} />
                            </div>

                            <div>
                                <label>First Transaction: </label>
                                <br />
                                <input type="date" name="first_transaction" onChange={this.changeHandler} />
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

export default SingleProduct;