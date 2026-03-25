import api from './axios';

export const getVacations = (params = {}) => api.get('/vacations', { params }).then(res => res.data);
export const getVacation = (id) => api.get(`/vacations/${id}`).then(res => res.data);
export const createVacation = (data) => api.post('/vacations', data).then(res => res.data);
export const approveVacation = (id) => api.put(`/vacations/${id}/approve`).then(res => res.data);
export const rejectVacation = (id) => api.put(`/vacations/${id}/reject`).then(res => res.data);
export const deleteVacation = (id) => api.delete(`/vacations/${id}`);