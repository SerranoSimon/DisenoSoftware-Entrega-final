package com.example.demo.controller;

import com.example.demo.dto.CitaRequestDTO;
import com.example.demo.dto.CitaResponseDTO;
import com.example.demo.exceptions.ValidacionCitaException;
import com.example.demo.models.Cita;
import com.example.demo.models.Paciente;
import com.example.demo.repository.CitaRepo;
import com.example.demo.repository.PacienteRepo;
import com.example.demo.service.CitaService;
import com.example.demo.service.FuncSaludService;
import com.example.demo.service.GestorCitas;
import com.example.demo.service.PacienteService;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/citas")
@AllArgsConstructor
public class CitaController {

    private final GestorCitas gestorCitas;
    private final FuncSaludService funcSaludService;
    private final PacienteService pacienteService;
    private final CitaService citaService;

    // El paciente sale del token, nunca del body -> no puede reservar a nombre de otro.
    @PostMapping
    @PreAuthorize("hasRole('PACIENTE')")
    public ResponseEntity<CitaResponseDTO> crearCita(@RequestBody CitaRequestDTO dto, Authentication auth) {
        String rutPaciente = auth.getName();
        Paciente paciente = pacienteService.buscarPorRut(rutPaciente);
        Cita cita = gestorCitas.crearCita(paciente, dto.fechaHora(), dto.idCentro(), dto.idCampania());
        return ResponseEntity.ok(CitaResponseDTO.from(cita));
    }

    @GetMapping("/mias")
    @PreAuthorize("hasRole('PACIENTE')")
    public ResponseEntity<List<CitaResponseDTO>> misCitas(Authentication auth) {
        List<Cita> citas = citaService.obtenerCitasPaciente(auth.getName());
        return ResponseEntity.ok(citas.stream().map(CitaResponseDTO::from).toList());
    }

    @GetMapping("/atender")
    @PreAuthorize("hasRole('FUNCIONARIO')")
    public ResponseEntity<List<CitaResponseDTO>> citasParaAtender(Authentication auth) {
        List<Cita> citas = citaService.obtenerCitasFuncSalud(auth.getName());
        return ResponseEntity.ok(citas.stream().map(CitaResponseDTO::from).toList());
    }

    // solo los participantes de la cita pueden verla, el paciente citado o el  funcionario citado. El RUT sale del token, así nadie ve citas ajenas por id.
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('PACIENTE','FUNCIONARIO')")
    public ResponseEntity<CitaResponseDTO> obtener(@PathVariable Long id, Authentication auth) {
        Cita cita = citaService.buscarCitaPorId(id);
        String rut = auth.getName();
        if (!cita.getPaciente().getRUT().equals(rut) && !cita.getFuncSalud().getRUT().equals(rut)) {
            throw new AccessDeniedException("Solo puede ver citas en las que participa");
        }
        return ResponseEntity.ok(CitaResponseDTO.from(cita));
    }

    // Solo el funcionario citado puede marcar la inasistencia de su cita
    @PatchMapping("/{id}/inasistencia")
    @PreAuthorize("hasRole('FUNCIONARIO')")
    public ResponseEntity<String> marcarInasistencia(@PathVariable Long id, Authentication auth) {
        Cita cita = citaService.buscarCitaPorId(id);
        if (!cita.getFuncSalud().getRUT().equals(auth.getName())) {
            throw new AccessDeniedException("Solo puede marcar inasistencia en sus propias citas");
        }
        funcSaludService.marcarCitaComoInasistida(cita);
        return ResponseEntity.ok("Cita marcada como inasistida");
    }
}
