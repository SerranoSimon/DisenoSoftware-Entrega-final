package com.example.demo.dto;

import java.time.DayOfWeek;
import java.time.LocalTime;

public record HorarioCentroDTO(
        DayOfWeek diaSemana,
        LocalTime horaApertura,
        LocalTime horaCierre
) {}