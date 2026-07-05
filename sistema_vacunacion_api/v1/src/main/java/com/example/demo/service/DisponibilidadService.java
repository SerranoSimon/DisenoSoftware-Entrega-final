package com.example.demo.service;

import com.example.demo.models.*;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class DisponibilidadService {

    private static final int GRANULARIDAD_MINUTOS = 15;

    private final CentroService centroService;
    private final CampaniaService campaniaService;

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

                if (candidato.isAfter(limiteAntelacion)
                        && hayFuncionarioLibre(centro, candidato)
                        && hayVacunaEnStock(centro, campania)) {
                    disponibles.add(candidato);
                }
                cursor = cursor.plusMinutes(GRANULARIDAD_MINUTOS);
            }
        }
        return disponibles;
    }

    // Solo lectura: no llama h.bloquear()
    private boolean hayFuncionarioLibre(CentroVacunacion centro, LocalDateTime fechaHora) {
        for (FuncSalud fs : centro.getFuncionariosSalud()) {
            for (HorarioFs h : fs.getHorarios()) {
                if (h.abarca(fechaHora) && h.estaDisponible()) return true;
            }
        }
        return false;
    }

    // Solo lectura: no llama stockVacunaService.reservar()
    private boolean hayVacunaEnStock(CentroVacunacion centro, Campania campania) {
        for (StockVacuna sv : centro.getStockVacunas()) {
            if (sv.vacunaEsDeCampania(campania) && sv.verificarStock()) return true;
        }
        return false;
    }
}