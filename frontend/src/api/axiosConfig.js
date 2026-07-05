import axios from 'axios';

// Cliente HTTP centralizado.
// baseURL '/api/v1' -> el proxy de Vite lo reenvía a http://localhost:8080/api/v1
const api = axios.create({
    baseURL: '/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Adjunta el JWT (guardado tras el login) en cada petición.
api.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Si el backend responde 401 (token ausente/inválido/expirado), limpiamos la
// sesión y avisamos a la app para volver al login.
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('rol');
            window.dispatchEvent(new Event('auth:logout'));
        }
        return Promise.reject(error);
    }
);

// Extrae un mensaje legible desde un error de axios.
// El backend siempre responde { "error": "..." } (ver GlobalExceptionHandler).
export function apiError(error, fallback = 'Ocurrió un error inesperado') {
    if (error?.response?.status === 429) {
        return 'Demasiadas solicitudes, intente nuevamente en un minuto.';
    }
    return error?.response?.data?.error || error?.message || fallback;
}

export default api;
