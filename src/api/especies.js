import api from './axios';

export const getEspecies = () => api.get('/especies');
export const getEspeciesById = (id) => api.get(`/especies/${id}`);