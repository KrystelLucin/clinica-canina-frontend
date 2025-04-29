import api from './axios';

export const getServicios = () => api.get('/servicios');
export const getServicioById = (id) => api.get(`/servicios/${id}`);

export const getDetalleServicios = () => api.get('/detalleservicios');
export const getDetalleServicioByCita = (id) => api.get(`/detalleservicios/byCita/${id}`);
export const createDetalleServicio = (data) => api.post('/detalleservicios', data);
export const updateDetalleServicio = (id, data) => api.put(`/detalleservicios/${id}`, data);
export const deleteDetalleServicio = (id) => api.delete(`/detalleservicios/${id}`);