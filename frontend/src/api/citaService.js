import api from './axiosConfig';
import { mapCita } from '../models/adapters';

// GET /citas/mias  (rol PACIENTE)
export async function getMisCitas() {
    const { data } = await api.get('/citas/mias');
    return data.map(mapCita);
}

// GET /citas/atender  (rol FUNCIONARIO)
export async function getCitasAtender() {
    const { data } = await api.get('/citas/atender');
    return data.map(mapCita);
}

// GET /citas/{id}  (participante de la cita)
export async function getCita(id) {
    const { data } = await api.get(`/citas/${id}`);
    return mapCita(data);
}

// POST /citas  (rol PACIENTE) -> el paciente sale del token
// payload: { idCentro, idCampania, fechaHora } (fechaHora ISO "yyyy-MM-ddTHH:mm:ss")
export async function crearCita({ idCentro, idCampania, fechaHora }) {
    const { data } = await api.post('/citas', { idCentro, idCampania, fechaHora });
    return mapCita(data);
}

// PATCH /citas/{id}/inasistencia  (rol FUNCIONARIO, solo el funcionario citado)
export async function marcarInasistencia(id) {
    const { data } = await api.patch(`/citas/${id}/inasistencia`);
    return data;
}
