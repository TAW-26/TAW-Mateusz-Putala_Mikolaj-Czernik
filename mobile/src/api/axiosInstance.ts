import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const RENDER_API_URL = 'https://taw-mateusz-putala-mikolaj-czernik.onrender.com/api';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? RENDER_API_URL;

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000,
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