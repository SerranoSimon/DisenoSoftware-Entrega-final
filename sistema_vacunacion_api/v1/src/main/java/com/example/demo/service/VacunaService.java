package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.models.Vacuna;
import com.example.demo.repository.VacunaRepo;

import jakarta.persistence.EntityNotFoundException;

@Service
public class VacunaService {
    @Autowired
    VacunaRepo vacunaRepo;

    Vacuna buscarPorId(Long id){
        return vacunaRepo.findById(id)
        .orElseThrow(() -> new EntityNotFoundException("Vacuna no encontrada con id: " + id));
    }

    void guardar(Vacuna vacuna){
        vacunaRepo.save(vacuna);
    }
}
