import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../../axios.js';

import ArrElement from '../../../components/Arr/ArrElement/ArrElement.js';
import Arr from '../../../components/Arr/Arr.js';

import classes from './ProductsPage.css';

//Page of all stores in database
class ProductsPage extends Component {

    state = {
        products: [],
        selectedProductId: null,
    }

    //Set URL /stores/getStoreList
    componentDidMount() {
        axios.get('/posts')
            .then(res =>
                this.setState({ products: res.data })
            )
            .catch(err => {
                console.log(err);
                this.props.history.push("/aWildErrorHasAppeared");
            })
    }

    StoreSelectedHandler = (id) => {
        this.setState({ selectedProductId: id });
    }

    render() {

        //what does the api return?? store.id=>
        const products = this.state.products.map(product => {
            return (<Link to={"/Products/" + product.id} key={product.id} style={{ textDecoration: 'none' }}>
                <ArrElement
                    id={product.id}
                    firstTag={"Barcode"}
                    secondTag={"Product Name"}
                    body={product.body.slice(0, 21)}
                    clicked={() => this.StoreSelectedHandler(product.id)}
                />
            </Link>);
        })

        // let output = <div> Something went wrong!!! </div>
        // if (!this.state.error){
        return (
            <div className={classes.Content}>

                <Link to="/AddProduct" > 
                    <button className={classes.Add}> Add Product </button>
                </Link>

                <div className={classes.Title}>
                    Or select one of the available products:
                </div >

                <Arr> {products} </Arr>
            </div>
        );
        // }

        // return output; 
    }
}

export default ProductsPage;