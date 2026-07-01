package com.example.demo.service;
import java.beans.Transient;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.models.Campania;
import com.example.demo.models.CentroVacunacion;
import com.example.demo.models.Cita;
import com.example.demo.models.FuncSalud;
import com.example.demo.models.Paciente;
import com.example.demo.models.ResultadoValidacion;
import com.example.demo.models.Vacuna;
import com.example.demo.repository.CitaRepo;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
// Clase creadora de citas
@Service
@AllArgsConstructor
public class GestorCitas {

    @Autowired
    private GestorNotificaciones gestorNotificaciones;
    @Autowired
    private ValidadorCita validadorCita;

    @Autowired
    private CitaRepo citaRepo;


    @Transactional
    // Crear cita usa al experto ValidarCita para ver si es posible crearla.
    public Cita crearCita(Paciente paciente, LocalDateTime fecha_hora, Long id_centro, Long id_campania) {
            
        ResultadoValidacion resultadoValidacion= validadorCita.validarCita(fecha_hora,id_centro,id_campania);
        
        FuncSalud fs = resultadoValidacion.funcionario();
        CentroVacunacion centro = resultadoValidacion.centro();
        Vacuna v = resultadoValidacion.vacuna();
        Campania campania = resultadoValidacion.campania();
        Cita cita = new Cita(paciente, fs, fecha_hora, centro, v,campania);
        gestorNotificaciones.notificarCita(cita);

        // equivalente a citaRepo.agregarCita(cita)
        citaRepo.save(cita);
        return cita;
    
    }



}
