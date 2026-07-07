package com.example.demo.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.models.Campania;
import com.example.demo.models.Cita;
import com.example.demo.models.EstadoCita;
import com.example.demo.models.Paciente;
import com.example.demo.models.TipoVacuna;

import com.example.demo.repository.CitaRepo;

import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class CitaService {
    @Autowired
    private final CitaRepo citaRepo;
    @Autowired
    private final StockVacunaService stockVacunaService;    
    @Autowired
    private final GestorNotificaciones gestorNotificaciones;

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
    public boolean pacienteTieneMaximoCitasPorVacuna(Paciente paciente, TipoVacuna tipoVacuna){
        int cantidadCitas= 0;

        // Contamos todas las citas vigentes que sean de la vacuna elegida
        for(Cita c: paciente.getCitas()){
            if(c.getEstado().equals(EstadoCita.VIGENTE) && c.getVacuna().getTipoVacuna().equals(tipoVacuna)){
                cantidadCitas++;
            }
        }
        if(cantidadCitas>=tipoVacuna.getDosisRequeridas()){
            return true;
        }
        return false;

    }

    public void marcarCitaComoInasistida(Cita cita){
        LocalDateTime ahora = LocalDateTime.now();
        LocalDateTime limiteTolerancia = cita.getFechaHora().plusMinutes(5);

        if (!ahora.isAfter(limiteTolerancia)) {
            throw new IllegalStateException("Se puede marcar inasistencia despúes de 5 minutos");
        }
        gestorNotificaciones.notificarCitaInasistidaPaciente(cita, ahora);

        cita.setEstado(EstadoCita.INASISTIDA);
        stockVacunaService.eliminarReserva(cita);
        
        guardar(cita);
    }


    public void marcarCitaComoCompletada(Cita cita){
        cita.setEstado(EstadoCita.COMPLETADA);
        guardar(cita);
    }

    public Cita obtenerUltimaCitaParaCampania(Paciente paciente, Campania campania){
        Cita cita = citaRepo.findFirstByPacienteAndCampaniaOrderByFechaHoraDesc(paciente, campania);
        if(cita==null) return null;
        if(cita.getEstado().equals(EstadoCita.VIGENTE) || cita.getEstado().equals(EstadoCita.COMPLETADA) ){
            return cita;
        }
        return null;
    }
}