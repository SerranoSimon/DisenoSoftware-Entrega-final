package com.example.demo.controller;

import com.example.demo.dto.*;
import com.example.demo.exceptions.ValidacionCitaException;
import com.example.demo.models.*;
import com.example.demo.repository.CentrosRepo;
import com.example.demo.service.DisponibilidadService;
import lombok.AllArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/centros")
@AllArgsConstructor
public class CentroController {

    private final CentrosRepo centrosRepo;
    private final DisponibilidadService disponibilidadService;

    @GetMapping
    public List<CentroDTO> listar() {
        return centrosRepo.findAll().stream().map(this::toDTO).toList();
    }

    @GetMapping("/{id}")
    public CentroDTO obtener(@PathVariable Long id) {
        CentroVacunacion c = centrosRepo.findById(id)
                .orElseThrow(() -> new ValidacionCitaException("Centro no encontrado"));
        return toDTO(c);
    }

    // Endpoint que faltaba
    @GetMapping("/{id}/disponibilidad")
    public List<LocalDateTime> disponibilidad(
            @PathVariable Long id,
            @RequestParam Long idCampania,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        return disponibilidadService.horariosDisponibles(id, fecha, idCampania);
    }

    private CentroDTO toDTO(CentroVacunacion c) {
        List<HorarioCentroDTO> horarios = c.getHorarios().stream()
                .map(h -> new HorarioCentroDTO(h.getDiaSemana(), h.getHoraApertura(), h.getHoraCierre()))
                .toList();

        Map<Long, Campania> campaniasPorId = new LinkedHashMap<>();
        for (StockVacuna sv : c.getStockVacunas()) {
            Campania camp = sv.getCampania();
            if (camp.estaActiva()) {
                campaniasPorId.putIfAbsent(camp.getIdCampania(), camp);
            }
        }
        List<CampaniaDTO> campanias = campaniasPorId.values().stream()
                .map(camp -> new CampaniaDTO(camp.getIdCampania(), camp.getNombre(),
                        camp.getFechaInicio(), camp.getFechaFin(), camp.getEstadoCampania().name()))
                .toList();

        return new CentroDTO(c.getIdCentro(), c.getNombre(), c.getTipo(), c.getDireccion(), horarios, campanias);
    }
}