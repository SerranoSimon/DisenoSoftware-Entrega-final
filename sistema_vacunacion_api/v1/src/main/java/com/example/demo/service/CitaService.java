package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.models.Cita;
import com.example.demo.repository.CitaRepo;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor 
public class CitaService {
    @Autowired
    private final CitaRepo citaRepo;

    public void agregarCita(Cita cita){
        citaRepo.save(cita);
    }
}
