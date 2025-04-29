import api from './axios';

export const getRazas = () => api.get('/razas');
export const getRazaById = (id) => api.get(`/razas/${id}`);