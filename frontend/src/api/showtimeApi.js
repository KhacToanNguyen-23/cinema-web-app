import api from '../services/api';

export const showtimeApi = {
    getAllShowtimes: (cinemaId) => api.get('/api/v1/showtimes' + (cinemaId ? `?cinemaId=${cinemaId}` : '')),
    getShowtimeById: (id) => api.get(`/api/v1/showtimes/${id}`),
    // [AI UPDATE - Luon gui dang mang List<ShowtimeDto> tuong thich voi Backend API gop chung]
    createShowtimes: (showtimeList) => api.post('/api/v1/showtimes', Array.isArray(showtimeList) ? showtimeList : [showtimeList]),
    createShowtime: (showtimeData) => api.post('/api/v1/showtimes', Array.isArray(showtimeData) ? showtimeData : [showtimeData]),
    updateShowtime: (id, showtimeData) => api.put(`/api/v1/showtimes/${id}`, showtimeData),
    deleteShowtime: (id) => api.delete(`/api/v1/showtimes/${id}`)
};
