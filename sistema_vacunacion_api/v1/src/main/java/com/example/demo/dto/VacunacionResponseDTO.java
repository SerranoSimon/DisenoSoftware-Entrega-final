package com.example.demo.dto;

import java.time.LocalDateTime;

public record VacunacionResponseDTO(
        Long idVacunacion,
        Integer numDosis,
        String observaciones,
        LocalDateTime fechaHora,
        Long idCita
) {}
