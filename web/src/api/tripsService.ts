import api from './axiosInstance';
import type { Trip, Waypoint } from '../types';

export const tripsService = {
    // POBIERANIE WYCIECZEK
    getTrips: () => api.get<{ data: Trip[] }>('/trips').then(res => res.data),

    // SZCZEGÓŁY WYCIECZKI (Z POPULATE WAYPOINTS)
    getTripDetails: (id: string) => api.get<{ data: Trip }>(`/trips/${id}`).then(res => res.data),

    // TWORZENIE
    createTrip: (tripData: Partial<Trip>) => api.post('/trips', tripData),

    // AKTUALIZACJA WYCIECZKI (Tytuł, budżet itp.)
    updateTrip: (id: string, data: Partial<Trip>) =>
        api.put(`/trips/${id}`, data),

    // USUWANIE WYCIECZKI
    deleteTrip: (id: string) =>
        api.delete(`/trips/${id}`),

    // --- GENEROWANIE AI ---
    generateAIWaypoints: (id: string) => api.post(`/trips/${id}/generate`),

    // --- LOGIKA WAYPOINTS (PRZYSTANKÓW) ---

    // Pobieranie wszystkich punktów dla danej trasy
    getWaypoints: (tripId: string) => api.get(`/trips/${tripId}/waypoints`),

    // AKTUALIZACJA PUNKTU (Zgodnie z Twoim routerem: /api/trips/waypoints/:id)
    updateWaypoint: (id: string, data: Partial<Waypoint>) =>
        api.put(`/trips/waypoints/${id}`, data),

    // USUWANIE PUNKTU (Zgodnie z Twoim routerem: /api/trips/waypoints/:id)
    deleteWaypoint: (id: string) =>
        api.delete(`/trips/waypoints/${id}`),
};