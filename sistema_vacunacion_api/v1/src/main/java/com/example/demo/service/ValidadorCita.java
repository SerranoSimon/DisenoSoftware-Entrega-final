package com.example.demo.service;
import java.time.LocalDateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.demo.exceptions.ValidacionCitaException;
import com.example.demo.models.Campania;
import com.example.demo.models.CentroVacunacion;
import com.example.demo.models.FuncSalud;
import com.example.demo.models.Paciente;
import com.example.demo.models.ResultadoValidacion;
import com.example.demo.models.Vacuna;

// Clase experto que valida una cita
@Service

public class ValidadorCita {

    @Autowired
    private CampaniaService campaniaService;
    @Autowired
    private CentroService centrosService;
    @Autowired
    private CitaService citaService;
    @Autowired
    private VacunacionService vacunacionService;
    @Autowired
    private DisponibilidadService disponibilidadService;

    public ResultadoValidacion validarCita(LocalDateTime fecha_hora, Long idCentro, Long idCampania, Paciente paciente){

        //revisamos que la fecha_hora de solicitud sea de al menos 1 hora de antelacion
        if(LocalDateTime.now().plusHours(1).isAfter(fecha_hora)){
            throw new ValidacionCitaException("Las solicitudes se deben realizar con al menos 1 hora de antelación.");
        }
         // Buscamos la campaña
        Campania camp = campaniaService.obtenerCampaniaPorId(idCampania);
        if(!camp.estaActiva()){
            throw new ValidacionCitaException("La campaña no está activa");
        } 

        // Buscamos el centro     
        CentroVacunacion c = centrosService.buscarCentroPorId(idCentro);

        // Verificamos que el centro está abierto
        if (!centrosService.estaAbierto(c, fecha_hora)) {
            throw new ValidacionCitaException("El centro "+ c.getNombre() + " no está abierto en la hora seleccionada");
        }
        // Buscamos el funcionario que pueda atender
        FuncSalud fs = disponibilidadService.buscarFsDisponible(c, fecha_hora); 
        if(fs==null){
             throw new ValidacionCitaException("No hay funcionarios disponibles en la hora seleccionada");
        }
        // Buscamos la vacuna que pueda ser aplicada
        Vacuna v= centrosService.buscarVacuna(c, camp,paciente);
        // Revisamos que no agende mas citas que dosis
        if(citaService.pacienteTieneMaximoCitasPorVacuna(paciente, v.getTipoVacuna())){
            throw new ValidacionCitaException("Ya tienes el máximo de citas para la vacuna");
        }
        if(!vacunacionService.pacienteEstaHabilitadoParaVacuna(paciente, camp, fecha_hora)){
            throw new ValidacionCitaException("Debes esperar al menos 20 días para la siguiente vacuna");
        }
        return new ResultadoValidacion(fs, v, camp, c);
    }

}
