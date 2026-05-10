import api from './axiosInstance';

// Typy pomocnicze (możesz je później przenieść do osobnego pliku types.ts)
export interface Waypoint {
    _id: string;
    name: string;
    address: string;
    description: string;
    lat: number;
    lng: number;
    visited: boolean;
}

export interface Trip {
    _id: string;
    title: string;
    origin: { address: string };
    destination: { address: string };
    waypoints: Waypoint[];
    budget: number;
}

export const tripsService = {
    // POBIERANIE SZCZEGÓŁÓW
    getTripDetails: (id: string) =>
        api.get<{ data: Trip }>(`/trips/${id}`).then(res => res.data),

    // GENEROWANIE AI
    generateAIWaypoints: (id: string) =>
        api.post(`/trips/${id}/generate`),

    // AKTUALIZACJA PUNKTU (np. odwiedzone)
    updateWaypoint: (id: string, data: Partial<Waypoint>) =>
        api.put(`/trips/waypoints/${id}`, data),

    // USUWANIE PUNKTU
    deleteWaypoint: (id: string) =>
        api.delete(`/trips/waypoints/${id}`),
};