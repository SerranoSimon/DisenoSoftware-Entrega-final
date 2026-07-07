package com.example.demo.service;

import com.example.demo.models.*;
import com.example.demo.repository.HorarioBloqueoRepo;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DisponibilidadService {

    private final HorarioBloqueoRepo horarioBloqueoRepository;
    private final CentroService centroService;
    private final CampaniaService campaniaService;

    private static final int GRANULARIDAD_MINUTOS = 15;

    
    public List<LocalDateTime> horariosDisponibles(Long idCentro, LocalDate fecha, Long idCampania) {
        CentroVacunacion centro = centroService.buscarCentroPorId(idCentro);
        Campania campania = campaniaService.obtenerCampaniaPorId(idCampania);
        if (campania == null || !campania.estaActiva()) return List.of();

        DayOfWeek dia = fecha.getDayOfWeek();
        List<LocalDateTime> disponibles = new ArrayList<>();
        LocalDateTime limiteAntelacion = LocalDateTime.now().plusHours(1);

        for (HorarioCentro hc : centro.getHorarios()) {
            if (!hc.getDiaSemana().equals(dia)) continue;

            LocalTime cursor = hc.getHoraApertura();
            while (!cursor.isAfter(hc.getHoraCierre().minusMinutes(GRANULARIDAD_MINUTOS))) {
                LocalDateTime candidato = LocalDateTime.of(fecha, cursor);

                if (candidato.isAfter(limiteAntelacion) && buscarFsDisponible(centro, candidato)!=null) {
                    disponibles.add(candidato);
                }
                cursor = cursor.plusMinutes(GRANULARIDAD_MINUTOS);
            }
        }
        return disponibles;
    }

    // Solo lectura: revisa la plantilla recurrente (abarca) + el bloqueo puntual por fecha
    public FuncSalud buscarFsDisponible(CentroVacunacion centro, LocalDateTime fechaHora) {
        LocalDate fecha = fechaHora.toLocalDate();
        for (FuncSalud fs : centro.getFuncionariosSalud()) {
            for (HorarioFs h : fs.getHorarios()) {
                if (h.abarca(fechaHora) && estaDisponible(h, fecha)) {
                    return fs;
                }
            }
        }
        return null;
    }

    public boolean estaDisponible(HorarioFs horarioFs, LocalDate fecha) {
        return !horarioBloqueoRepository.existsByHorarioFsAndFecha(horarioFs, fecha);
    }

    // Bloquea solo esa fecha, no todos los días de la semana equivalentes
    public void bloquear(HorarioFs horarioFs, LocalDate fecha) {
        if (!estaDisponible(horarioFs, fecha)) {
            return; // ya estaba bloqueado
        }
        HorarioBloqueo bloqueo = new HorarioBloqueo(horarioFs, fecha);
        horarioBloqueoRepository.save(bloqueo);
    }


}