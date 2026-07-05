package com.example.demo.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.models.Cita;
import com.example.demo.models.FuncSalud;
import com.example.demo.models.Paciente;
import com.example.demo.models.Vacuna;
import com.example.demo.models.Vacunacion;

import com.example.demo.repository.VacunacionRepo;

import jakarta.transaction.Transactional;

@Service
public class VacunacionService {

    @Autowired
    VacunacionRepo vacunacionRepo;

    @Autowired
    private PacienteService pacienteService;

    @Autowired
    private FuncSaludService funcSaludService;

    @Autowired
    private VacunaService vacunaService;
   

    @Autowired
    private CitaService citaService;

    void guardar(Vacunacion vacunacion){
        vacunacionRepo.save(vacunacion);
    }

    public  int calcularNumeroDosis(Paciente paciente, Vacuna vacuna) {
        int dosisRequeridas = vacuna.getTipoVacuna().getDosisRequeridas();
        int dosisAplicadas = vacunacionRepo.countByPacienteAndTipoVacuna(paciente, vacuna.getTipoVacuna());

        if (dosisAplicadas >= dosisRequeridas) {
            throw new IllegalStateException("El paciente ya tiene todas las dosis");
        }
        return dosisRequeridas - dosisAplicadas - 1;
    }

    @Transactional
    //SUPUESTO IMPORTANTE: Las citas con vacunacion registrada no pueden modificarse  (así tenemos certeza que el paciente, funcSalud y vacuna en cita son los mismos que en Vacunacion)
    public Vacunacion registrarVacunacion(Long idCita, String rutFuncionario ,  String observaciones ){
        Cita cita = citaService.buscarCitaPorId(idCita);
        FuncSalud func = funcSaludService.buscarPorRut(rutFuncionario);
        Paciente paciente = pacienteService.buscarPorRut(cita.getPaciente().getRUT());
        Vacuna vacuna = vacunaService.buscarPorId(cita.getVacuna().getIdVacuna());

        cita.validarEstadoCitaParaVacunacion();
        cita.validarParticipantes(func, paciente);

        int numDosis = calcularNumeroDosis(paciente, vacuna);
        Vacunacion vacunacion = new Vacunacion(null, numDosis, observaciones, LocalDateTime.now(), cita);

        citaService.marcarCitaComoCompletada(cita);
        guardar(vacunacion);
        return vacunacion;
    }
}
