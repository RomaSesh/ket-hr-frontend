import api from './axios';

export const getPositions = () => api.get('/positions').then(res => res.data);
export const getPosition = (id) => api.get(`/positions/${id}`).then(res => res.data);
export const createPosition = (data) => api.post('/positions', data).then(res => res.data);
export const updatePosition = (id, data) => api.put(`/positions/${id}`, data).then(res => res.data);
export const deletePosition = (id) => api.delete(`/positions/${id}`);