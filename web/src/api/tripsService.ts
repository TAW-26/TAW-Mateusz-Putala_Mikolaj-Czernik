import api from './axiosInstance';
import type { Trip, Waypoint } from '../types';

// Pomocnicza funkcja do obsługi błędów API
const handleApiError = (error: any) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;

    if (status === 429) return "AI rate limit exceeded. Please wait 60 seconds.";
    if (status === 401) return "Session expired. Please log in again.";
    if (status === 403) return "Access denied. Insufficient permissions.";
    if (status === 500) return "Global server failure. Voyager DB is offline.";

    return message || "Unknown anomaly detected.";
};

export const tripsService = {
    // POBIERANIE WYCIECZEK
    getTrips: () => api.get<{ data: Trip[] }>('/trips').then(res => res.data),

    // SZCZEGÓŁY WYCIECZKI
    getTripDetails: (id: string) => api.get<{ data: Trip }>(`/trips/${id}`).then(res => res.data),

    // TWORZENIE
    createTrip: (tripData: Partial<Trip>) => api.post('/trips', tripData),

    // AKTUALIZACJA
    updateTrip: (id: string, data: Partial<Trip>) => api.put(`/trips/${id}`, data),

    // ULUBIONE
    toggleFavorite: (id: string, isFavorite: boolean) =>
        api.put(`/trips/${id}`, { isFavorite }).then(res => res.data),

    // USUWANIE
    deleteTrip: (id: string) => api.delete(`/trips/${id}`),

    // GENEROWANIE AI - z wbudowanym handlerem błędu dla wygody
    generateAIWaypoints: async (id: string) => {
        try {
            return await api.post(`/trips/${id}/generate`);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    // WAYPOINTS
    getWaypoints: (tripId: string) => api.get(`/trips/${tripId}/waypoints`),

    updateWaypoint: (id: string, data: Partial<Waypoint>) =>
        api.put(`/trips/waypoints/${id}`, data),

    deleteWaypoint: (id: string) =>
        api.delete(`/trips/waypoints/${id}`),

    // ADMIN
    adminGetAllTrips: () => api.get<{ data: any[] }>('/trips/admin/all').then(res => res.data),
    adminGetAllWaypoints: () => api.get<{ data: any[] }>('/trips/admin/waypoints').then(res => res.data),
};