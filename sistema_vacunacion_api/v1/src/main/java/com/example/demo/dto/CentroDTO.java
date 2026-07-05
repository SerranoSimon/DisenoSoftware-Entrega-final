package com.example.demo.dto;

import java.util.List;

public record CentroDTO(
        Long id,
        String nombre,
        String tipo,
        String direccion,
        List<HorarioCentroDTO> horarios,
        List<CampaniaDTO> campanias
) {}