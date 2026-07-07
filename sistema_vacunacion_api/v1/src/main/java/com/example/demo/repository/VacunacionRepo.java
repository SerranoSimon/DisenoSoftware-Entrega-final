package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.demo.models.Campania;
import com.example.demo.models.Paciente;
import com.example.demo.models.TipoVacuna;
import com.example.demo.models.Vacunacion;

public interface VacunacionRepo extends JpaRepository<Vacunacion, Long> {
    
    @Query("SELECT COUNT(v) FROM Vacunacion v " +
       "WHERE v.cita.paciente = :paciente AND v.cita.vacuna.tipoVacuna = :tipoVacuna")
    Integer countByPacienteAndTipoVacuna(
    @Param("paciente") Paciente paciente,
    @Param("tipoVacuna") TipoVacuna tipoVacuna);

    Vacunacion findFirstByCitaPacienteAndCitaCampaniaOrderByFechaHoraDesc(Paciente paciente, Campania campania);
}
