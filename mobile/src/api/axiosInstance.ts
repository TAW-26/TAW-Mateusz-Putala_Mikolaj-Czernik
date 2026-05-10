import axios from 'axios';
import { useAuthStore } from '../store/authStore'; // Importujemy Twój magazyn danych

// const BASE_URL = 'http://192.168.0.13:5000/api';
const BASE_URL = 'https://taw-mateusz-putala-mikolaj-czernik.onrender.com/api';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 15000, // Zwiększyłem do 15s, bo Render czasem wolno "wstaje"
});

// KLUCZOWY DODATEK: Automatyczne dodawanie tokena do każdego zapytania
api.interceptors.request.use(
    (config) => {
        // Pobieramy token ze stanu authStore
        const token = useAuthStore.getState().token;

        if (token) {
            // Dodajemy nagłówek Authorization: Bearer <twoj_token>
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;