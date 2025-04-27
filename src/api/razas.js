import api from './axios';

export const getRazas = () => api.get('/razas');
export const getRazasById = (id) => api.get(`/razas/${id}`);