import api from '../services/api';

export const roomApi = {
    getAllRooms: () => api.get('/api/v1/rooms'),
    getRoomsByCinema: (cinemaId) => api.get(`/api/v1/rooms/cinema/${cinemaId}`),
    // [AI UPDATE - Bổ sung CRUD phục vụ AdminRoomPage]
    createRoom: (data) => api.post('/api/v1/rooms', data),
    updateRoom: (id, data) => api.put(`/api/v1/rooms/${id}`, data),
    deleteRoom: (id) => api.delete(`/api/v1/rooms/${id}`),
};
