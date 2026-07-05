import api from './axiosConfig';

// GET /pacientes/me  (rol PACIENTE) -> { rut, nombres, apellidos, correoElectronico, fono }
export async function getMe() {
    const { data } = await api.get('/pacientes/me');
    return data;
}
