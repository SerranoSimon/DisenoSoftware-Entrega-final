package com.example.demo.controller;

import com.example.demo.dto.CitaRequestDTO;
import com.example.demo.dto.CitaResponseDTO;
import com.example.demo.exceptions.ValidacionCitaException;
import com.example.demo.models.Cita;
import com.example.demo.models.Paciente;
import com.example.demo.repository.CitaRepo;
import com.example.demo.repository.PacienteRepo;
import com.example.demo.service.FuncSaludService;
import com.example.demo.service.GestorCitas;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
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
    private final PacienteRepo pacienteRepo;
    private final CitaRepo citaRepo;

    // El paciente sale del token, nunca del body -> no puede reservar a nombre de otro.
    @PostMapping
    @PreAuthorize("hasRole('PACIENTE')")
    public ResponseEntity<CitaResponseDTO> crearCita(@RequestBody CitaRequestDTO dto, Authentication auth) {
        String rutPaciente = auth.getName();
        Paciente paciente = pacienteRepo.findById(rutPaciente)
                .orElseThrow(() -> new ValidacionCitaException("Paciente no encontrado"));

        Cita cita = gestorCitas.crearCita(paciente, dto.fechaHora(), dto.idCentro(), dto.idCampania());
        return ResponseEntity.ok(CitaResponseDTO.from(cita));
    }

    @GetMapping("/mias")
    @PreAuthorize("hasRole('PACIENTE')")
    public ResponseEntity<List<CitaResponseDTO>> misCitas(Authentication auth) {
        List<Cita> citas = citaRepo.findByPaciente_RUT(auth.getName());
        return ResponseEntity.ok(citas.stream().map(CitaResponseDTO::from).toList());
    }

    @GetMapping("/atender")
    @PreAuthorize("hasRole('FUNCIONARIO')")
    public ResponseEntity<List<CitaResponseDTO>> citasParaAtender(Authentication auth) {
        List<Cita> citas = citaRepo.findByFuncSalud_RUT(auth.getName());
        return ResponseEntity.ok(citas.stream().map(CitaResponseDTO::from).toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CitaResponseDTO> obtener(@PathVariable Long id) {
        Cita cita = citaRepo.findById(id)
                .orElseThrow(() -> new ValidacionCitaException("Cita no encontrada"));
        return ResponseEntity.ok(CitaResponseDTO.from(cita));
    }

    @PatchMapping("/{id}/inasistencia")
    @PreAuthorize("hasRole('FUNCIONARIO')")
    public ResponseEntity<String> marcarInasistencia(@PathVariable Long id) {
        Cita cita = citaRepo.findById(id)
                .orElseThrow(() -> new ValidacionCitaException("Cita no encontrada"));
        funcSaludService.marcarCitaComoInasistida(cita);
        return ResponseEntity.ok("Cita marcada como inasistida");
    }
}
