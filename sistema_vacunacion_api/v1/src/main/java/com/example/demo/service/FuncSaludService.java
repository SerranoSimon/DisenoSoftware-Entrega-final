package com.example.demo.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.models.CalculadoraDosis;
import com.example.demo.models.Cita;
import com.example.demo.models.EstadoCita;
import com.example.demo.models.FuncSalud;
import com.example.demo.models.HorarioFs;
import com.example.demo.models.Paciente;

import com.example.demo.models.Vacuna;
import com.example.demo.models.Vacunacion;
import com.example.demo.repository.FuncSaludRepo;


import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;


@Service
public class FuncSaludService {

    @Autowired
    private FuncSaludRepo funcSaludRepo;

    @Autowired
    private PacienteService pacienteService;

    @Autowired
    private VacunaService vacunaService;
   
    @Autowired
    private VacunacionService vacunacionService;

    @Autowired
    private CitaService citaService;

    @Autowired
    private CalculadoraDosis calculadoraDosis;


    @Transactional
    public void agregarHorario(String rutFuncionario, HorarioFs horario) {
        FuncSalud func = buscarPorRut(rutFuncionario);
        func.getHorarios().add(horario);
        horario.setFuncSalud(func);
        guardar(func);
    }

    FuncSalud buscarPorRut(String rut){
        return funcSaludRepo.findById(rut)
              .orElseThrow(() -> new EntityNotFoundException("F. de salud no encontrado con rut: " + rut));
    }

    void guardar(FuncSalud fs){
        funcSaludRepo.save(fs);
    }
    @Transactional
    //SUPUESTO IMPORTANTE: Las citas con vacunacion registrada no pueden modificarse  (así tenemos certeza que el paciente, funcSalud y vacuna en cita son los mismos que en Vacunacion)
    public Vacunacion registrarVacunacion(Long idCita, String rutPaciente, String rutFuncionario ,  String observaciones ){
        Cita cita = citaService.buscarCitaPorId(idCita);
        FuncSalud func = buscarPorRut(rutFuncionario);
        Paciente paciente = pacienteService.buscarPorRut(rutFuncionario);
        Vacuna vacuna = vacunaService.buscarPorId(cita.getVacuna().getIdVacuna());

        cita.validarEstadoCitaParaVacunacion();
        cita.validarParticipantes(func, paciente);

        int numDosis = calculadoraDosis.calcularNumeroDosis(paciente, vacuna);
        Vacunacion vacunacion = new Vacunacion(null, numDosis, observaciones, LocalDateTime.now(), cita);
        cita.setEstado(EstadoCita.COMPLETADA);
        citaService.guardar(cita);
        vacunacionService.guardar(vacunacion);
        return vacunacion;
    }


    public void marcarCitaComoInasistida(Cita cita){
        
        LocalDateTime ahora = LocalDateTime.now();
        LocalDateTime limiteTolerancia = cita.getFecha_hora().plusMinutes(5);

        if (!ahora.isAfter(limiteTolerancia)) {
            throw new IllegalStateException("Se puede marcar inasistencia despúes de 5 minutos");
        }
        cita.setEstado(EstadoCita.INASISTIDA);
        citaService.guardar(cita);
    }


 
}