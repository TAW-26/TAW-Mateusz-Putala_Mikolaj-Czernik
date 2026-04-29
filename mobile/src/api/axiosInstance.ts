import axios from 'axios';

const BASE_URL = 'http://192.168.0.13:5000/api';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

export default api;