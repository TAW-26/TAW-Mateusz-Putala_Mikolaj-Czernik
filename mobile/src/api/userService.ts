import api from './axiosInstance';

export const userService = {
    // Aktualizacja danych (username, email)
    updateProfile: (data: { username: string; email: string }) =>
        api.put('/users/profile', data).then(res => res.data),

    // Zmiana hasła
    changePassword: (data: { oldPassword: string; newPassword: string }) =>
        api.put('/users/change-password', data).then(res => res.data),
};