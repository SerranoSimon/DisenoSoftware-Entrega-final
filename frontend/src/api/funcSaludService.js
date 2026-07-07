import api from './axiosConfig';

// GET /funcionarios/me  (rol FUNCIONARIO)
// -> { rut, nombres, apellidos, correoElectronico, fono, centroNombre }
export async function getMe() {
    const { data } = await api.get('/funcionarios/me');
    return data;
}
