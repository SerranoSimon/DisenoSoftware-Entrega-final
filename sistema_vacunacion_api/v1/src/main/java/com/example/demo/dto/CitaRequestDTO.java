package com.example.demo.dto;

import java.time.LocalDateTime;


public record CitaRequestDTO(
        Long idCentro,
        Long idCampania,
        LocalDateTime fechaHora
) {}
