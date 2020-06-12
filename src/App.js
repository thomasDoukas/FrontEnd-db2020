import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import Layout from './hoc/Layout/Layout.js';
import HomePage from './containers/HomePage/HomePage.js';

import StoresPage from './containers/Stores/StoresPage/StoresPage.js';
import SingleStore from './containers/Stores/SingleStore/SingleStore.js';
import AddStore from './containers/Stores/AddStore/AddStore.js';

import ProductsPage from './containers/Products/ProductsPage/ProductsPage.js';
import AddProduct from './containers/Products/AddProduct/AddProduct.js';
import SingleProduct from './containers/Products/SingleProduct/SingleProduct.js';

import ClientsPage from './containers/Clients/ClientsPage/ClientsPage.js';
import AddClient from './containers/Clients/AddClient/AddClient.js';
import SingleClient from './containers/Clients/SingleClient/SingleClient.js';

import TransactionsPage from './containers/Transactions/TransactionsPage.js';

import StatisticsPage from './containers/Statistics/StatisticsPage.js';

import Error from './containers/Error/Error.js';

class App extends Component {
    render() {
        return (
            <Layout>
                <Route path="/" exact component={HomePage} />

                <Route path="/Stores" exact component={StoresPage} />
                <Route path="/AddStore" exact component={AddStore} />
                <Route path="/Stores/:storeId" exact component={SingleStore} />

                <Route path="/Products" exact component={ProductsPage} />
                <Route path="/AddProduct" exact component={AddProduct} />
                <Route path="/Products/:productId" exact component={SingleProduct} />

                <Route path="/Clients" exact component={ClientsPage} />
                <Route path="/AddClient" exact component={AddClient} />
                <Route path="/Clients/:clientId" exact component={SingleClient} />


                <Route path="/Transactions" exact component={TransactionsPage} />

                <Route path="/Statistics" exact component={StatisticsPage} />

                <Route path="/aWildErrorHasAppeared" exact component={Error} />
            </Layout>
        );
    }
}

export default App;