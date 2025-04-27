import api from './axios';

export const getCitas = () => api.get('/citas');
export const getCitaById = (id) => api.get(`/citas/${id}`);
export const createCita = (data) => api.post('/citas', data);
export const updateCita = (id, data) => api.put(`/citas/${id}`, data);
export const deleteCita = (id) => api.delete(`/citas/${id}`);
export const getCitasByFecha = (fecha) => api.get(`/citas/byFecha/${fecha}`);
export const getCitasByProfesional = (id) => api.get(`/citas/byProfesional/${id}`);
export const getCitasByMascota = (id) => api.get(`/citas/byMascota/${id}`);