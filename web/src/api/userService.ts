// api/userService.ts
import api from './axiosInstance';

export const userService = {
    getAllUsers: () => api.get('/users').then(res => res.data),
    updateRole: (id: string, role: string) => api.put(`/users/${id}/role`, { role }),
    deleteUser: (id: string) => api.delete(`/users/${id}`),
};