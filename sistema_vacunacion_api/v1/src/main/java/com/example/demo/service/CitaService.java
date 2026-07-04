package com.example.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.models.Cita;
import com.example.demo.repository.CitaRepo;

import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor 
public class CitaService {
    @Autowired
    private final CitaRepo citaRepo;

    public void agregarCita(Cita cita){
        citaRepo.save(cita);
    }
    public Cita buscarCitaPorId(Long id){
       return  citaRepo.findById(id)
          .orElseThrow(() -> new EntityNotFoundException("Cita no encontrada con id: " + id));
    }

    void guardar(Cita cita){
        citaRepo.save(cita);
    }

    List<Cita> obtenerCitasPaciente(String rut){
       return citaRepo.findByPaciente_RUT(rut);
    }
    List<Cita> obtenerCitasFuncSalud(String rut){
       return citaRepo.findByFuncSalud_RUT(rut);
    }
}
