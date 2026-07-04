package com.example.demo.controller;

import com.example.demo.dto.PacienteDTO;
import com.example.demo.exceptions.ValidacionCitaException;
import com.example.demo.models.Paciente;
import com.example.demo.repository.PacienteRepo;
import lombok.AllArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/pacientes")
@AllArgsConstructor
public class PacienteController {

    private final PacienteRepo pacienteRepo;

    @GetMapping("/me")
    @PreAuthorize("hasRole('PACIENTE')")
    public PacienteDTO yo(Authentication auth) {
        Paciente p = pacienteRepo.findById(auth.getName())
                .orElseThrow(() -> new ValidacionCitaException("Paciente no encontrado"));
        return new PacienteDTO(p.getRUT(), p.getNombres(), p.getApellidos(), p.getCorreoElectronico(), p.getFono());
    }
}
