import api from './axiosConfig';

// tipo: 'paciente' -> POST /login/paciente | 'personal' -> POST /login/personal
// Devuelve { token, rol }. Guarda la sesión en sessionStorage.
export async function login(tipo, rut, password) {
    const { data } = await api.post(`/login/${tipo}`, { rut, password });
    sessionStorage.setItem('token', data.token);
    sessionStorage.setItem('rol', data.rol);
    return data;
}

export function logout() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('rol');
}

export function getRol() {
    return sessionStorage.getItem('rol');
}

export function isLoggedIn() {
    return !!sessionStorage.getItem('token');
}
