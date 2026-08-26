import api from '../services/api';

export const roomApi = {
    getAllRooms: () => api.get('/api/v1/rooms'),
    getRoomsByCinema: (cinemaId) => api.get(`/api/v1/rooms/cinema/${cinemaId}`)
};
