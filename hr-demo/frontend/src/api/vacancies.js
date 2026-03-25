import api from './axios';

export const getVacancies = (params = {}) => api.get('/vacancies', { params }).then(res => res.data);
export const getVacancy = (id) => api.get(`/vacancies/${id}`).then(res => res.data);
export const createVacancy = (data) => api.post('/vacancies', data).then(res => res.data);
export const updateVacancy = (id, data) => api.put(`/vacancies/${id}`, data).then(res => res.data);
export const closeVacancy = (id) => api.put(`/vacancies/${id}/close`).then(res => res.data);
export const deleteVacancy = (id) => api.delete(`/vacancies/${id}`);