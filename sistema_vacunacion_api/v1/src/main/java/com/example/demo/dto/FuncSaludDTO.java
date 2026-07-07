package com.example.demo.dto;

public record FuncSaludDTO(
        String rut,
        String nombres,
        String apellidos,
        String correoElectronico,
        String fono,
        String centroNombre
) {}