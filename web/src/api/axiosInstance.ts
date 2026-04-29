import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Interceptor żądań: Dodaje token do każdego zapytania
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// --- NOWOŚĆ: Interceptor odpowiedzi: Globalna obsługa błędów ---
api.interceptors.response.use(
    (response) => {
        // Jeśli zapytanie się powiodło, po prostu zwracamy odpowiedź
        return response;
    },
    (error) => {
        const status = error.response?.status;

        if (status === 401) {
            // SCENARIUSZ: Token wygasł lub jest nieprawidłowy
            console.error("Unauthorized access - logging out...");
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            // Przekierowanie do logowania (tylko jeśli nie jesteśmy już na stronie logowania)
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }

        if (status === 429) {
            // SCENARIUSZ: Przekroczono limity API (np. Groq AI)
            console.warn("System overloaded: Too many requests.");
        }

        if (status === 500) {
            // SCENARIUSZ: Błąd krytyczny serwera
            console.error("Internal Server Error. Please contact administrator.");
        }

        // Zwracamy błąd dalej, aby catch w komponentach (np. TripDetailsPage) też mógł go obsłużyć
        return Promise.reject(error);
    }
);

export default api;