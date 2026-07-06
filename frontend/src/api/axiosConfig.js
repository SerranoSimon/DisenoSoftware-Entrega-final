import axios from 'axios';

// Cliente HTTP centralizado.
// baseURL '
const backendUrl = import.meta.env.VITE_API_URL;
const api = axios.create({
    baseURL: backendUrl,
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

// Extrae un mensaje legible desde un error de axios, evitando exponer jerga técnica.
// El backend responde reglas de negocio como { "error": "..." } (ver GlobalExceptionHandler).
export function apiError(error, fallback = 'Ocurrió un error inesperado') {
    // Sin respuesta del servidor -> problema de red / backend caído
    if (!error?.response) {
        return 'No se pudo conectar con el servidor. Verifique su conexión e intente nuevamente.';
    }
    const status = error.response.status;
    if (status === 429) {
        return 'Demasiadas solicitudes. Espere un minuto e intente nuevamente.';
    }
    // Errores internos del servidor: no mostrar detalles técnicos crudos al usuario
    if (status >= 500) {
        return 'Ocurrió un problema en el servidor. Intente nuevamente en unos minutos.';
    }
    // Reglas de negocio / validaciones: el backend envía un mensaje claro
    return error.response.data?.error || fallback;
}

export default api;
