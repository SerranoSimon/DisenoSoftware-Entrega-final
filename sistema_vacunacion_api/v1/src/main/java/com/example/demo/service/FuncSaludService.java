package com.example.demo.service;

import java.time.LocalDateTime;
import java.time.LocalTime;

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
import com.example.demo.repository.CitaRepo;
import com.example.demo.repository.FuncSaludRepo;
import com.example.demo.repository.HorarioFsRepo;
import com.example.demo.repository.PacienteRepo;
import com.example.demo.repository.VacunaRepo;
import com.example.demo.repository.VacunacionRepo;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;


@Service
public class FuncSaludService {

    @Autowired
    private FuncSaludRepo funcSaludRepo;

    @Autowired
    private PacienteRepo pacienteRepo;

    @Autowired
    private VacunaRepo vacunaRepo;

    
    @Autowired
    private VacunacionRepo vacunacionRepo;

    @Autowired
    private CitaRepo citaRepo;
    @Autowired
    private HorarioFsRepo horarioFsRepo;
    @Autowired
    private CalculadoraDosis calculadoraDosis;


    @Transactional
    public void agregarHorario(String rutFuncionario, HorarioFs horario) {
        FuncSalud func = funcSaludRepo.findById(rutFuncionario).orElseThrow();
        horario.setFuncSalud(func);
        horarioFsRepo.save(horario);
    }
    @Transactional
    //SUPUESTO IMPORTANTE: Las citas con vacunacion registrada no pueden modificarse  (así tenemos certeza que el paciente, funcSalud y vacuna en cita son los mismos que en Vacunacion)
    public Vacunacion registrarVacunacion(Long idCita, String rutPaciente, String rutFuncionario ,  String observaciones ){
        Cita cita = citaRepo.findById(idCita)
                .orElseThrow(() -> new EntityNotFoundException("Cita no encontrada con id: " + idCita));
        FuncSalud func = funcSaludRepo.findById(rutFuncionario)
                .orElseThrow(() -> new EntityNotFoundException("Funcionario no encontrado con rut: " + rutFuncionario));
        Paciente paciente = pacienteRepo.findById(rutPaciente)
                .orElseThrow(() -> new EntityNotFoundException("Paciente no encontrado con rut: " + rutPaciente));
        Vacuna vacuna = vacunaRepo.findById(cita.getVacuna().getIdVacuna())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Vacuna no encontrada con id: " + cita.getVacuna().getIdVacuna()));

        cita.validarEstadoCitaParaVacunacion();
        cita.validarParticipantes(func, paciente);

        int numDosis = calculadoraDosis.calcularNumeroDosis(paciente, vacuna);
        Vacunacion vacunacion = new Vacunacion(null, numDosis, observaciones, LocalDateTime.now(), cita);
        cita.setEstado(EstadoCita.COMPLETADA);
        citaRepo.save(cita);
        vacunacionRepo.save(vacunacion);
        return vacunacion;
    }


    public void marcarCitaComoInasistida(Cita cita){
        
        LocalDateTime ahora = LocalDateTime.now();
        LocalDateTime limiteTolerancia = cita.getFecha_hora().plusMinutes(5);

        if (!ahora.isAfter(limiteTolerancia)) {
            throw new IllegalStateException("Se puede marcar inasistencia despúes de 5 minutos");
        }
        cita.setEstado(EstadoCita.INASISTIDA);
        citaRepo.save(cita);
    }


 
}