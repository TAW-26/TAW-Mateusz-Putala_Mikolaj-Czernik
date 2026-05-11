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
    // Pobieranie wszystkich wycieczek
    getTrips: async () => {
        const response = await api.get('/trips');
        return response.data;
    },

    // Detale konkretnej wycieczki
    getTripDetails: async (id: string) => {
        const response = await api.get(`/trips/${id}`);
        return response.data;
    },

    // --- TO BYŁO BRAKUJĄCE OGNIWO ---
    // Aktualizacja wycieczki (np. ulubione, zmiana tytułu, zmiana parametrów)
    updateTrip: async (id: string, data: any) => {
        const response = await api.patch(`/trips/${id}`, data);
        return response.data;
    },

    // Usuwanie wycieczki
    deleteTrip: async (id: string) => {
        const response = await api.delete(`/trips/${id}`);
        return response.data;
    },

    // Generowanie nowych punktów przez AI
    generateAIWaypoints: async (tripId: string) => {
        const response = await api.post(`/trips/${tripId}/generate-waypoints`);
        return response.data;
    },

    // Aktualizacja konkretnego punktu (np. oznaczenie jako odwiedzony)
    updateWaypoint: async (wpId: string, data: any) => {
        const response = await api.patch(`/waypoints/${wpId}`, data);
        return response.data;
    },

    // Usuwanie konkretnego punktu z wycieczki
    deleteWaypoint: async (wpId: string) => {
        const response = await api.delete(`/waypoints/${wpId}`);
        return response.data;
    }
};



