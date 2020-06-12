import React, { Component } from 'react';
import axios from '../../../axios.js';

import classes from './AddProduct.css';

//Page of all stores in database
class AddProduct extends Component {

    state = {
        productData: null
    }

    backHandler = () => {
        this.props.history.push("/Products");
    }

    saveHandler = () => {
        const data = { ...this.state.productData };
        if (Object.keys(data).length < 4)
            alert("Oops! To create a product you must specify all parameters.");
        else if (data.price <= 0)
            alert("Oops! Invalid product price")
        else {
            console.log("After save", data);
            axios.post('/postsAfterSave', data)
                .then(res => {
                    console.log(res);
                    this.props.history.push("/Products/" + res.data.id); //what does post return
                })
                .catch(err => {
                    console.log(err);
                    this.props.history.push("/aWildErrorHasAppeared");
                })
        }
    }

    changeHandler = (event) => {
        const data = { ...this.state.productData };
        data[event.target.name] = event.target.value;
        this.setState({ productData: data });
        console.log(this.state.productData);

    }

    render() {
        console.log(this.state.productData);

        let form = (
            <div className={classes.Content}>
                <div className={classes.Title}>
                    To create a new product please specify the following information.
                </div>

                <form>

                    <div className={classes.Information}>

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

export default AddProduct;