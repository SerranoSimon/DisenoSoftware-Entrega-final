import { useEffect, useState } from 'react';
import { getCitas } from '../../api/citaService';
import { createCita } from '../../models/cita';

export const ListaCitas = () => {
    const [citas, setCitas] = useState([]);

    useEffect(() => {
        const cargarCitas = async () => {
            const data = await getCitas(); // Llama al servicio
            // Mapeamos los datos recibidos a nuestro modelo
            const citasModeladas = data.map(c => createCita(c));
            setCitas(citasModeladas);
        };
        cargarCitas();
    }, []);

    return (
        <div>
            <h1>Mis Citas</h1>
            {citas.map(c => (
                <div key={c.id}>
                    <p>Fecha: {c.fechaHora} - Estado: {c.estado}</p>
                </div>
            ))}
        </div>
    );
};