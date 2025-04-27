import api from './axios';

export const getDuenos = () => api.get('/duenos');
export const getDuenoById = (id) => api.get(`/duenos/${id}`);
export const createDueno = (data) => api.post('/duenos', data);
export const updateDueno = (id, data) => api.put(`/duenos/${id}`, data);
export const deleteDueno = (id) => api.delete(`/duenos/${id}`);