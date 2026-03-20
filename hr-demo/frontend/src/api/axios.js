import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8000', // адрес вашего бэкенда
  timeout: 5000,
});

// Добавляем токен к каждому запросу, если он есть
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
