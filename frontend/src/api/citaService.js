import api from './axiosConfig';

export const getCitas = async () => {
    // Corresponde a GET /citas[cite: 1]
    const response = await api.get('/citas');
    return response.data;
};

export const crearCita = async (citaData) => {
    // Corresponde a POST /cita[cite: 1]
    return await api.post('/cita', citaData);
};