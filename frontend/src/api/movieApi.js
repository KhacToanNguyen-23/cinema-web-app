import api from '../services/api'; // file chứa axios interceptor, nếu dự án của bạn chưa có thì tạo file api.js bọc axios lại

export const movieApi = {
    getAllMovies: () => api.get('/api/v1/movies'),
    getMovieById: (id) => api.get(`/api/v1/movies/${id}`),
    createMovie: (movieData) => api.post('/api/v1/movies', movieData),
    updateMovie: (id, movieData) => api.put(`/api/v1/movies/${id}`, movieData),
    deleteMovie: (id) => api.delete(`/api/v1/movies/${id}`)
};
