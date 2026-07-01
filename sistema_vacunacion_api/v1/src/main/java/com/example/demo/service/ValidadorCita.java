package com.example.demo.service;

import java.time.LocalDateTime;
import java.time.LocalTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.models.Campania;
import com.example.demo.models.CentroVacunacion;
import com.example.demo.models.FuncSalud;
import com.example.demo.models.ResultadoValidacion;
import com.example.demo.models.Vacuna;

// Clase experto que valida una cita
@Service

public class ValidadorCita {

    @Autowired
    private CampaniaService campaniaService;
    @Autowired
    private CentroService centrosService;


    public ResultadoValidacion validarCita(LocalDateTime fecha_hora, Long idCentro, Long idCampania){

        //revisamos que la fecha_hora de solicitud sea de al menos 1 hora de antelacion
        if(!LocalDateTime.now().minusHours(1).isAfter(fecha_hora)){
            throw new IllegalStateException("Las solicitudes se deben realizar con 1 hora de antelación");
        }
        // Buscamos la campaña y el centro
        Campania camp = campaniaService.obtenerCampaniaPorId(idCampania);
        if(camp == null){
            throw new IllegalStateException("Campaña no encontrada");
        }
        if(!camp.estaActiva()){
            throw new IllegalStateException("La campaña no está activa");
        }        
        CentroVacunacion c = centrosService.obtenerCentroPorId(idCentro);
        if (c == null ) {
            throw new IllegalStateException("Centro no encontrado");
        }

        // Verificamos que el centro está abierto
        if (!centrosService.estaAbierto(c, fecha_hora)) {
            throw new IllegalStateException("El centro "+ c.getNombre() + " no está abierto en la hora seleccionada");
        }
        // Buscamos el funcionario que pueda atender
        FuncSalud fs = centrosService.buscarFsParaCita(c, fecha_hora);
        if (fs == null) {
            throw new IllegalStateException("No hay funcionarios que le puedan atender en la hora seleccionada");
        }
        // Buscamos la vacuna que pueda ser aplicada
        Vacuna v= centrosService.buscarVacuna(c, camp);
        if(v == null){
           throw new IllegalStateException("No hay vacunas en el centro para la campaña que seleccionó");
        }

        return new ResultadoValidacion(fs, v, camp, c);
    }

}
