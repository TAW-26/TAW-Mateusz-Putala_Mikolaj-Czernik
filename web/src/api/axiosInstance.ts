// src/api/axiosInstance.ts
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api', // upewnij się, że port pasuje do backendu
});

// Interceptor, który do każdego zapytania dorzuca token z pamięci przeglądarki
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;