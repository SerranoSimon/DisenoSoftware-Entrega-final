package com.example.demo.controller;

import com.example.demo.dto.CentroDTO;
import com.example.demo.exceptions.ValidacionCitaException;
import com.example.demo.models.CentroVacunacion;
import com.example.demo.repository.CentrosRepo;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/centros")
@AllArgsConstructor
public class CentroController {

    private final CentrosRepo centrosRepo;

    @GetMapping
    public List<CentroDTO> listar() {
        return centrosRepo.findAll().stream()
                .map(c -> new CentroDTO(c.getIdCentro(), c.getNombre(), c.getTipo(), c.getDireccion()))
                .toList();
    }

    @GetMapping("/{id}")
    public CentroDTO obtener(@PathVariable Long id) {
        CentroVacunacion c = centrosRepo.findById(id)
                .orElseThrow(() -> new ValidacionCitaException("Centro no encontrado"));
        return new CentroDTO(c.getIdCentro(), c.getNombre(), c.getTipo(), c.getDireccion());
    }
}
