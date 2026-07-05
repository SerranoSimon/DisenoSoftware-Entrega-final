import api from './axiosConfig';

// POST /vacunaciones  (rol FUNCIONARIO) -> el funcionario sale del token,
// el paciente se deriva de la cita. payload: { idCita, observaciones }
// Respuesta: { idVacunacion, numDosis, observaciones, fechaHora, idCita }
export async function registrarVacunacion({ idCita, observaciones }) {
    const { data } = await api.post('/vacunaciones', { idCita, observaciones });
    return data;
}
