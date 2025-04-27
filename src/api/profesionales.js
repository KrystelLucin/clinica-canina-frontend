import api from './axios';

export const getProfesionales = () => api.get('/profesionales');
export const getProfesionalesById = (id) => api.get(`/profesionales/${id}`);