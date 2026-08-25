import api from '../services/api';

export const userApi = {
    getAllUsers: () => api.get('/api/users'),
    getUserById: (id) => api.get(`/api/users/${id}`),
    createUser: (userData) => api.post('/api/users', userData),
    updateUser: (id, userData) => api.put(`/api/users/${id}`, userData),
    deleteUser: (id) => api.delete(`/api/users/${id}`)
};
