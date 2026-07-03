package com.example.demo.controller;

import com.example.demo.dto.CampaniaDTO;
import com.example.demo.repository.CampaniaRepo;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/campanias")
@AllArgsConstructor
public class CampaniaController {

    private final CampaniaRepo campaniaRepo;

    // Cualquier usuario autenticado (paciente o funcionario) puede listarlas,
    // el frontend las usa para poblar el select al solicitar una cita.
    @GetMapping
    public List<CampaniaDTO> listar() {
        return campaniaRepo.findAll().stream().map(c -> new CampaniaDTO(
                        c.getIdCampania(),
                        c.getNombre(),
                        c.getFechaInicio(),
                        c.getFechaFin(),
                        c.getEstadoCampania().name()
                ))
                .toList();
    }
}
