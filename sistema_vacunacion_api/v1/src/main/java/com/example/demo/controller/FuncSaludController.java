package com.example.demo.controller;

import com.example.demo.dto.FuncSaludDTO;
import com.example.demo.models.FuncSalud;
import com.example.demo.service.FuncSaludService;

import lombok.AllArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/funcionarios")
@AllArgsConstructor
public class FuncSaludController {

    private final FuncSaludService funcSaludService;

    @GetMapping("/me")
    @PreAuthorize("hasRole('FUNCIONARIO')")
    public FuncSaludDTO yo(Authentication auth) {
        FuncSalud f = funcSaludService.buscarPorRut(auth.getName());
        return new FuncSaludDTO(
                f.getRUT(), f.getNombres(), f.getApellidos(),
                f.getCorreoElectronico(), f.getFono(),
                f.getCentroVacunacion() != null ? f.getCentroVacunacion().getNombre() : null
        );
    }
}