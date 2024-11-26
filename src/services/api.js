import axios from 'axios';

const api = axios.create({
    baseURL: process.env.VUE_APP_API_URL, // Usar la variable de entorno para la URL del backend
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
