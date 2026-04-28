import api from './axiosInstance';

export const userService = {
    // --- PANEL ADMINA ---
    // Pobieranie wszystkich użytkowników
    getAllUsers: () => api.get('/users').then(res => res.data),

    // Zmiana uprawnień użytkownika
    updateRole: (id: string, role: string) => api.put(`/users/${id}/role`, { role }),

    // Usuwanie użytkownika z systemu
    deleteUser: (id: string) => api.delete(`/users/${id}`),

    // --- PROFIL UŻYTKOWNIKA (Nowe metody) ---

    // Pobieranie danych aktualnie zalogowanego użytkownika (opcjonalnie, jeśli potrzebujesz odświeżyć dane z serwera)
    getMe: () => api.get('/users/me').then(res => res.data),

    // Aktualizacja podstawowych danych profilu (username, email)
    // To wywoła Twój endpoint: PUT /api/users/profile
    updateProfile: (data: { username: string; email: string }) =>
        api.put('/users/profile', data).then(res => res.data),

    // Zmiana hasła użytkownika
    // To wywoła Twój endpoint: PUT /api/users/change-password
    changePassword: (data: { oldPassword: string; newPassword: string }) =>
        api.put('/users/change-password', data).then(res => res.data),
};