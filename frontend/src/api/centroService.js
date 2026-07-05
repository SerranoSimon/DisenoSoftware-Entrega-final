import api from './axiosConfig';

// GET /centros -> [{ id, nombre, tipo, direccion }]
export async function getCentros() {
    const { data } = await api.get('/centros');
    return data;
}

// GET /centros/{id}
export async function getCentro(id) {
    const { data } = await api.get(`/centros/${id}`);
    return data;
}

// GET /centros/{id}/disponibilidad?idCampania=X&fecha=YYYY-MM-DD
// -> lista de LocalDateTime disponibles ["2026-07-06T08:00:00", ...]
export async function getDisponibilidad(idCentro, idCampania, fecha) {
    const { data } = await api.get(`/centros/${idCentro}/disponibilidad`, {
        params: { idCampania, fecha },
    });
    return data;
}
