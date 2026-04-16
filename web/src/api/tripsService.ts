import api from './axiosInstance';
import type { Trip, Waypoint } from '../types';

export const tripsService = {
    getTrips: () => api.get<{ data: Trip[] }>('/trips').then(res => res.data),

    getTripDetails: (id: string) => api.get<{ data: Trip }>(`/trips/${id}`).then(res => res.data),

    createTrip: (tripData: Partial<Trip>) => api.post('/trips', tripData),

    // GENEROWANIE AI
    generateAIWaypoints: (id: string) => api.post(`/trips/${id}/generate`),

    // WAYPOINTS
    getWaypoints: (tripId: string) => api.get(`/trips/${tripId}/waypoints`),

    updateWaypoint: (id: string, data: Partial<Waypoint>) =>
        api.put(`/trips/waypoints/${id}`, data)
};