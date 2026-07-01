package com.example.demo.models;

public record ResultadoValidacion(
    FuncSalud funcionario,
    Vacuna vacuna,
    Campania campania,
    CentroVacunacion centro
) {}