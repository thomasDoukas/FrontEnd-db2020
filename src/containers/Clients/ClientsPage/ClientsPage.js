import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../../axios.js';

import ArrElement from '../../../components/Arr/ArrElement/ArrElement.js';
import Arr from '../../../components/Arr/Arr.js';

import classes from './ClientsPage.css';

//Page of all stores in database
class ClientsPage extends Component {

    state = {
        clients: [],
        selectedClientId: null,
    }

    //Set URL /stores/getStoreList
    componentDidMount() {
        axios.get('/posts')
            .then(res =>
                this.setState({ clients: res.data })
            )
            .catch(err => {
                console.log(err);
                this.props.history.push("/aWildErrorHasAppeared");
            })
    }

    StoreSelectedHandler = (id) => {
        this.setState({ selectedClientId: id });
    }

    render() {

        //what does the api return?? store.id=>
        const clients = this.state.clients.map(client => {
            return (<Link to={"/Clients/" + client.id} key={client.id} style={{ textDecoration: 'none' }}>
                <ArrElement
                    id={client.id}
                    firstTag={"Card Number"}
                    secondTag={"Client Name"}
                    body={client.body.slice(0, 21)}
                    clicked={() => this.StoreSelectedHandler(client.id)}
                />
            </Link>);
        })

        // let output = <div> Something went wrong!!! </div>
        // if (!this.state.error){
        return (
            <div className={classes.Content}>

                <Link to="/AddClient" > 
                    <button className={classes.Add}> Add Client </button>
                </Link>

                <div className={classes.Title}>
                    Or select one of the available clients:
                </div >

                <Arr> {clients} </Arr>
            </div>
        );
        // }

        // return output; 
    }
}

export default ClientsPage;