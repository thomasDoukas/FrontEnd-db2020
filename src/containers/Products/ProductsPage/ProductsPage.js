import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../../axios.js';

import ArrElement from '../../../components/Arr/ArrElement/ArrElement.js';
import Arr from '../../../components/Arr/Arr.js';

import classes from './ProductsPage.css';

//Page of all products in database
class ProductsPage extends Component {

    state = {
        products: [],
        selectedProductId: null,
    }

    componentDidMount() {
        axios.get('/products')
            .then(res => {
                console.log("/products returns: ", res.data);
                this.setState({ products: res.data });
            })
            .catch(err => {
                console.log("/products error: ", err.message);
                this.props.history.push("/aWildErrorHasAppeared/" + err.message);
            })
    }

    StoreSelectedHandler = (id) => {
        this.setState({ selectedProductId: id });
    }

    render() {

        const products = this.state.products.map(product => {
            return (<Link to={"/Products/" + product.barcode} key={product.barcode} style={{ textDecoration: 'none' }}>
                <ArrElement
                    firstTag={"Barcode"}
                    id={product.barcode}
                    secondTag={"Product Name"}
                    body={product.name}
                    thirdTag={"Brand Name"}
                    secondaryBody={product.brand_name}
                    clicked={() => this.StoreSelectedHandler(product.barcode)}
                />
            </Link>);
        })

        let output = <div> Loading... </div>
        if (!this.state.products) {
            output = (
                <div className={classes.Content}>

                    <Link to="/AddProduct" >
                        <button className={classes.Add}> Add Product </button>
                    </Link>

                    <div className={classes.Title}>
                        Or select one of the available products:
                </div >

                    <Arr> {products} </Arr>
                </div>
            )
        }
        return output;

    }
}

export default ProductsPage;