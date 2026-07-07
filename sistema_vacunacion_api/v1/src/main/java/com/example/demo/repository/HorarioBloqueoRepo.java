package com.example.demo.repository;
import java.time.LocalDate;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.models.HorarioBloqueo;
import com.example.demo.models.HorarioFs;

public interface HorarioBloqueoRepo extends JpaRepository<HorarioBloqueo, Long> {

    boolean existsByHorarioFsAndFecha(HorarioFs horarioFs, LocalDate fecha);

    Optional<HorarioBloqueo> findByHorarioFsAndFecha(HorarioFs horarioFs, LocalDate fecha);


}