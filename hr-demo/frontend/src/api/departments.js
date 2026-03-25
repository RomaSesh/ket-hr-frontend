import api from './axios';

export const getDepartments = () => api.get('/departments').then(res => res.data);
export const getDepartment = (id) => api.get(`/departments/${id}`).then(res => res.data);
export const createDepartment = (data) => api.post('/departments', data).then(res => res.data);
export const updateDepartment = (id, data) => api.put(`/departments/${id}`, data).then(res => res.data);
export const deleteDepartment = (id) => api.delete(`/departments/${id}`);