import api from '../services/api';

export const cinemaApi = {
    getAllCinemas: () => api.get('/api/v1/cinemas'),
    // [AI UPDATE - Bổ sung CRUD: phục vụ trang AdminCinemaPage]
    createCinema: (data) => api.post('/api/v1/cinemas', data),
    updateCinema: (id, data) => api.put(`/api/v1/cinemas/${id}`, data),
    deleteCinema: (id) => api.delete(`/api/v1/cinemas/${id}`),
};
