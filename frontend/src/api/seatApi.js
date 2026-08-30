import api from '../services/api';

export const seatApi = {
    getSeatsByRoom: (roomId) => api.get(`/api/v1/seats/room/${roomId}`),
    // POST nhan List<SeatDto> - dung cho ca tao 1 lan hoac bulk
    createSeats: (seats) => api.post('/api/v1/seats', seats),
    updateSeat: (id, data) => api.put(`/api/v1/seats/${id}`, data),
    deleteSeat: (id) => api.delete(`/api/v1/seats/${id}`),
};

