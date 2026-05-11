import api from './axiosInstance';

export const tripsService = {
    getTrips: async () => {
        const response = await api.get('/trips');
        return response.data;
    },

    getTripDetails: async (id: string) => {
        const response = await api.get(`/trips/${id}`);
        return response.data;
    },

    // Web używa .put() zamiast .patch() dla wycieczek
    updateTrip: async (id: string, data: any) => {
        const response = await api.put(`/trips/${id}`, data);
        return response.data;
    },

    deleteTrip: async (id: string) => {
        const response = await api.delete(`/trips/${id}`);
        return response.data;
    },

    // W wersji webowej endpoint to /generate a nie /generate-waypoints
    generateAIWaypoints: async (tripId: string) => {
        const response = await api.post(`/trips/${tripId}/generate`);
        return response.data;
    },

    // --- KLUCZOWA POPRAWKA DLA 404 ---
    // Musisz dodać /trips przed /waypoints/
    updateWaypoint: async (wpId: string, data: any) => {
        const response = await api.put(`/trips/waypoints/${wpId}`, data);
        return response.data;
    },

    // Tu tak samo - dodajemy /trips
    deleteWaypoint: async (wpId: string) => {
        const response = await api.delete(`/trips/waypoints/${wpId}`);
        return response.data;
    }
};