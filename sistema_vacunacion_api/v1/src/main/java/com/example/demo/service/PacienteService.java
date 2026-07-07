package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.demo.models.Paciente;
import com.example.demo.repository.PacienteRepo;

import jakarta.persistence.EntityNotFoundException;

@Service
public class PacienteService {
    
    @Autowired
    private PacienteRepo pacienteRepo;

    public Paciente buscarPorRut(String rut){
        return pacienteRepo.findById(rut)
        .orElseThrow(() -> new EntityNotFoundException("Paciente no encontrado con rut: " + rut));
    }

}
