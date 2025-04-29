import api from './axios';

export const getSexos = () => api.get('/sexos');
export const getSexoById = (id) => api.get(`/sexos/${id}`);