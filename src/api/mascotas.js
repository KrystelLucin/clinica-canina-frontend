import api from './axios';

export const getMascotas = () => api.get('/mascotas');
export const getMascotaById = (id) => api.get(`/mascotas/${id}`);
export const createMascota = (data) => api.post('/mascotas', data);
export const updateMascota = (id, data) => api.put(`/mascotas/${id}`, data);
export const deleteMascota = (id) => api.delete(`/mascotas/${id}`);

export const getMascotasByNombre = (nombre) => api.get(`/mascotas/byNombre/${nombre}`);
export const getMascotasByDueno = (nombreDueno) => api.get(`/mascotas/byDueno/nombre/${nombreDueno}`);