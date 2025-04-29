import api from './axios';

export const getProfesionales = () => api.get('/profesionales');
export const getProfesionalById = (id) => api.get(`/profesionales/${id}`);