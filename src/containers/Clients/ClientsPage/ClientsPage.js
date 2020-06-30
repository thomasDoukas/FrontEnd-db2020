import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../../axios.js';

import ArrElement from '../../../components/Arr/ArrElement/ArrElement.js';
import Arr from '../../../components/Arr/Arr.js';

import classes from './ClientsPage.css';

//Page of all clients in database
class ClientsPage extends Component {

    state = {
        clients: [],
        selectedClientId: null,
    }

    componentDidMount() {
        axios.get('/clients')
            .then(res => {
                console.log("get /clients returns: ", res.data);
                this.setState({ clients: res.data })
            })
            .catch(err => {
                console.log("get /clients error: ", err.message);
                this.props.history.push("/aWildErrorHasAppeared/" + err.message);
            })
    }

    ClientSelectedHandler = (id) => {
        this.setState({ selectedClientId: id });
    }

    render() {

        const clients = this.state.clients.map(client => {
            return (<Link to={"/Clients/" + client.card_id} key={client.card_id} style={{ textDecoration: 'none' }}>
                <ArrElement
                    firstTag={"Card Number"}
                    id={client.card_id}
                    secondTag={"Client Name"}
                    body={client.name}
                    thirdTag={"Address"}
                    secondaryBody={client.city}
                    clicked={() => this.ClientSelectedHandler(client.id)}
                />
            </Link>);
        })

        let output = <div> Loading... </div>
        // if (!this.state.clients) {
            output = (
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

        return output; 
    }
}

export default ClientsPage;