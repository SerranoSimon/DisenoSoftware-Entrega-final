package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.models.Campania;
import com.example.demo.models.Cita;
import com.example.demo.models.EstadoCita;
import com.example.demo.models.Paciente;


public interface CitaRepo extends JpaRepository<Cita, Long> {
    List<Cita> findByPaciente_RUT(String rut);

    List<Cita> findByFuncSalud_RUT(String rut);
    // Devuelve la primera cita del paciente y campaña que tenga uno de los estados indicados,
    // ordenada de la más reciente a la más antigua.
    Cita findFirstByPacienteAndCampaniaAndEstadoInOrderByFechaHoraDesc(
            Paciente paciente, 
            Campania campania, 
            List<EstadoCita> estados
    );
}
