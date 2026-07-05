package com.example.demo.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.models.Cita;
import com.example.demo.models.EstadoCita;
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
       return citaRepo.findById(id)
          .orElseThrow(() -> new EntityNotFoundException("Cita no encontrada con id: " + id));
    }

    void guardar(Cita cita){
        citaRepo.save(cita);
    }

    public List<Cita> obtenerCitasPaciente(String rut){
       return citaRepo.findByPaciente_RUT(rut);
    }

    public List<Cita> obtenerCitasFuncSalud(String rut){
       return citaRepo.findByFuncSalud_RUT(rut);
    }

    public void marcarCitaComoInasistida(Cita cita){
        LocalDateTime ahora = LocalDateTime.now();
        LocalDateTime limiteTolerancia = cita.getFecha_hora().plusMinutes(5);

        if (!ahora.isAfter(limiteTolerancia)) {
            throw new IllegalStateException("Se puede marcar inasistencia despúes de 5 minutos");
        }
        cita.setEstado(EstadoCita.INASISTIDA);
        guardar(cita);
    }

    // lo que faltaba y que VacunacionService ya asume que existe
    public void marcarCitaComoCompletada(Cita cita){
        cita.setEstado(EstadoCita.COMPLETADA);
        guardar(cita);
    }
}