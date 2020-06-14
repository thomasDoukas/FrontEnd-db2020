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

    componentDidMount() {
        axios.get('/stores')
            .then(res => {
                console.log("/stores returns:", res.data);
                this.setState({ stores: res.data })
            })
            .catch(err => {
                console.log("/stores error:", err.message);
                this.props.history.push("/aWildErrorHasAppeared/" + err.message);
            });
    }

    StoreSelectedHandler = (id) => {
        this.setState({ selectedStoreId: id });
    }

    render() {

        const stores = this.state.stores.map(store => {
            return (<Link to={"/Stores/" + store.store_id} key={store.store_id} style={{ textDecoration: 'none' }}>
                <ArrElement
                    firstTag={"Store id"}
                    id={store.store_id}
                    secondTag={"Address"}
                    body={store.address}
                    clicked={() => this.StoreSelectedHandler(store.store_id)}
                />
            </Link>);
        })

        let output = <div> Loading... </div>;
        if (!this.state.stores) {
            output = (
                <div className={classes.Content}>

                    <Link to="/AddStore" >
                        <button className={classes.Add}> Add Store </button>
                    </Link>

                    <div className={classes.Title}>
                        Or select one of the available stores:
                    </div >

                    <Arr> {stores} </Arr>
                </div>
            )
        }

        return output;

    }
}

export default StoresPage;