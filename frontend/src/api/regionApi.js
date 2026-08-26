import api from '../services/api';

export const regionApi = {
    getAllRegions: () => api.get('/api/v1/regions'),
};
