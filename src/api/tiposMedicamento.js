import api from './axios';

export const getTiposMedicamento = () => api.get('/tipomedicamentos');
export const getTipoMedicamentoById = (id) => api.get(`/tipomedicamentos/${id}`);