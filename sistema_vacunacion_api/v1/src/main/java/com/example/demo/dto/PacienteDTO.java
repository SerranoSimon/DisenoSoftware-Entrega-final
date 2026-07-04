package com.example.demo.dto;

public record PacienteDTO(
        String rut,
        String nombres,
        String apellidos,
        String correoElectronico,
        String fono
) {}

