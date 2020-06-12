import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../../axios.js';

import ArrElement from '../../../components/Arr/ArrElement/ArrElement.js';
import Arr from '../../../components/Arr/Arr.js';

import classes from './StoresPage.css';

//Page of all stores in database
class StoresPage extends Component {

    state = {
        stores: [],
        selectedStoreId: null,
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
        this.setState({ selectedStoreId: id });
    }

    render() {

        //what does the api return?? store.id=>
        const stores = this.state.stores.map(store => {
            return (<Link to={"/Stores/" + store.id} key={store.id} style={{ textDecoration: 'none' }}>
                <ArrElement
                    id={store.id}
                    firstTag={"Store id"}
                    secondTag={"Address"}
                    body={store.body.slice(0, 21)}
                    clicked={() => this.StoreSelectedHandler(store.id)}
                />
            </Link>);
        })

        // let output = <div> Something went wrong!!! </div>
        // if (!this.state.error){
        return (
            <div className={classes.Content}>

                <Link to="/AddStore" > 
                    <button className={classes.Add}> Add Store </button>
                </Link>

                <div className={classes.Title}>
                    Or select one of the available stores:
                </div >

                <Arr> {stores} </Arr>
            </div>
        );
        // }

        // return output; 
    }
}

export default StoresPage;