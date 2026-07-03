package com.example.demo.dto;

import java.time.LocalDate;

public record CampaniaDTO(
        Long id,
        String nombre,
        LocalDate fechaInicio,
        LocalDate fechaFin,
        String estado
) {}

