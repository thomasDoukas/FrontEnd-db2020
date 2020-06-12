import axios from 'axios';

//Set baseURL
const instance = axios.create({
    baseURL: 'https://jsonplaceholder.typicode.com'
    // baseURL: 'http://localhost:8765/db/api'
});

export default instance;