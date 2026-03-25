import api from './axios';

export const getCandidates = (params = {}) => api.get('/candidates', { params }).then(res => res.data);
export const getCandidate = (id) => api.get(`/candidates/${id}`).then(res => res.data);
export const createCandidate = (data) => api.post('/candidates', data).then(res => res.data);
export const updateCandidateStatus = (id, status) => api.put(`/candidates/${id}/status`, { status }).then(res => res.data);
export const deleteCandidate = (id) => api.delete(`/candidates/${id}`);
