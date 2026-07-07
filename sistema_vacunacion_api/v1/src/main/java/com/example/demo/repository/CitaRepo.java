package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.models.Campania;
import com.example.demo.models.Cita;
import com.example.demo.models.Paciente;


public interface CitaRepo extends JpaRepository<Cita, Long> {
    List<Cita> findByPaciente_RUT(String rut);

    List<Cita> findByFuncSalud_RUT(String rut);
    Cita findFirstByPacienteAndCampaniaOrderByFechaHoraDesc(Paciente paciente, Campania campania);
}
