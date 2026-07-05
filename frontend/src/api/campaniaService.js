import api from './axiosConfig';

// GET /campanias -> [{ id, nombre, fechaInicio, fechaFin, estado }]
export async function getCampanias() {
    const { data } = await api.get('/campanias');
    return data;
}
