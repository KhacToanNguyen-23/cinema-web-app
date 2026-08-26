import api from '../services/api';

export const showtimeApi = {
    getAllShowtimes: (cinemaId) => api.get('/api/v1/showtimes' + (cinemaId ? `?cinemaId=${cinemaId}` : '')),
    getShowtimeById: (id) => api.get(`/api/v1/showtimes/${id}`),
    createShowtime: (showtimeData) => api.post('/api/v1/showtimes', showtimeData),
    updateShowtime: (id, showtimeData) => api.put(`/api/v1/showtimes/${id}`, showtimeData),
    deleteShowtime: (id) => api.delete(`/api/v1/showtimes/${id}`)
};
