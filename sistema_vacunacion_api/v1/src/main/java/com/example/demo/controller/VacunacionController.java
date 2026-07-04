package com.example.demo.controller;

import com.example.demo.dto.VacunacionRequestDTO;
import com.example.demo.dto.VacunacionResponseDTO;

import com.example.demo.models.Vacunacion;
import com.example.demo.service.GestorNotificaciones;
import com.example.demo.service.VacunacionService;

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
public class VacunacionController {
    private final VacunacionService vacunacionService;
    private final GestorNotificaciones gestorNotificaciones;

    // El funcionario sale del token; el paciente se deriva de la cita.
    @PostMapping
    @PreAuthorize("hasRole('FUNCIONARIO')")
    public ResponseEntity<VacunacionResponseDTO> registrarVacunacion(@RequestBody VacunacionRequestDTO dto, Authentication auth) {

        String rutFuncionario = auth.getName();

        Vacunacion vacunacion = vacunacionService.registrarVacunacion(
                dto.idCita(), rutFuncionario, dto.observaciones()
        );
        
        gestorNotificaciones.notificarConfirmacionVacunacionPaciente(vacunacion);

        return ResponseEntity.ok(new VacunacionResponseDTO(
                vacunacion.getIdVacunacion(),
                vacunacion.getNumDosis(),
                vacunacion.getObservaciones(),
                vacunacion.getFecha_hora(),
                dto.idCita()
        ));
    }
}
