import api from '../services/api';

export const showtimeSeatApi = {
    // Lay so do ghe kem trang thai thuc te cho mot suat chieu
    getSeatLayout: (showtimeId) => api.get(`/api/v1/showtimes/${showtimeId}/seat-layout`),
};