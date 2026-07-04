package com.example.demo.controller;

import com.example.demo.dto.VacunacionRequestDTO;
import com.example.demo.dto.VacunacionResponseDTO;
import com.example.demo.exceptions.ValidacionCitaException;
import com.example.demo.models.Cita;
import com.example.demo.models.Vacunacion;
import com.example.demo.repository.CitaRepo;
import com.example.demo.service.FuncSaludService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/vacunaciones")
@AllArgsConstructor
public class FuncSaludController {

    private final FuncSaludService funcSaludService;
    private final CitaRepo citaRepo;

    // El funcionario sale del token; el paciente se deriva de la cita.
    @PostMapping
    @PreAuthorize("hasRole('FUNCIONARIO')")
    public ResponseEntity<VacunacionResponseDTO> registrarVacunacion(@RequestBody VacunacionRequestDTO dto, Authentication auth) {
        Cita cita = citaRepo.findById(dto.idCita())
                .orElseThrow(() -> new ValidacionCitaException("Cita no encontrada"));

        String rutFuncionario = auth.getName();
        String rutPaciente = cita.getPaciente().getRUT();

        Vacunacion vacunacion = funcSaludService.registrarVacunacion(
                dto.idCita(), rutPaciente, rutFuncionario, dto.observaciones()
        );

        return ResponseEntity.ok(new VacunacionResponseDTO(
                vacunacion.getIdVacunacion(),
                vacunacion.getNumDosis(),
                vacunacion.getObservaciones(),
                vacunacion.getFecha_hora(),
                dto.idCita()
        ));
    }
}
