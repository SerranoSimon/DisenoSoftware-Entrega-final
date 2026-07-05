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
