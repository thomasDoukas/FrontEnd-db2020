import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

//Setting up to use routing in application
const app = (
    <BrowserRouter>
        <App />
    </BrowserRouter>
);

ReactDOM.render(app, document.getElementById('root'));
registerServiceWorker();
