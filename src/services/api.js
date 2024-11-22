import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api', // URL del backend
    timeout: 10000, // Tiempo de espera
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token'); // Obtener token de autenticación
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;