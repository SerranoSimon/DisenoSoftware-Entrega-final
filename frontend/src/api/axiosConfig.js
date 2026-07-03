import axios from 'axios';

// Configuración centralizada
const api = axios.create({
    baseURL: 'http://localhost:8080', // URL donde corre tu Spring Boot
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para incluir el token JWT automáticamente
api.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('token'); // Donde guardaremos el JWT tras el login
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;