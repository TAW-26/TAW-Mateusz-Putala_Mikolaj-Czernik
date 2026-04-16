// src/api/tripsService.ts
import api from './axiosInstance'
import type { Trip } from '../types/';

export const tripsService = {
    // Pobieranie wszystkich wycieczek
    getAllTrips: async (): Promise<Trip[]> => {
        const response = await api.get('/trips');
        return response.data;
    },

    // Tworzenie nowej wycieczki (np. przez AI)
    createTrip: async (tripData: Trip): Promise<Trip> => {
        const response = await api.post('/trips', tripData);
        return response.data;
    }
};