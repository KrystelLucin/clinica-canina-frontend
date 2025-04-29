import api from './axios';

export const getEspecies = () => api.get('/especies');
export const getEspecieById = (id) => api.get(`/especies/${id}`);