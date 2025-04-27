import api from './axios';

export const getSexos = () => api.get('/sexos');
export const getSexosById = (id) => api.get(`/sexos/${id}`);