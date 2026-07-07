package com.example.demo.service;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.models.Campania;
import com.example.demo.models.Cita;
import com.example.demo.models.EstadoVacuna;
import com.example.demo.models.Paciente;
import com.example.demo.models.StockVacuna;
import com.example.demo.models.TipoVacuna;
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
    private VacunaService vacunaService;

    @Autowired
    private StockVacunaService stockVacunaService;

    @Autowired
    private CampaniaService campaniaService;  

    @Autowired
    private CitaService citaService;

    void guardar(Vacunacion vacunacion){
        vacunacionRepo.save(vacunacion);
    }
    public boolean pacienteEstaHabilitadoParaVacuna(Paciente paciente, Campania camp, LocalDateTime fecha){
        // Buscamos su ultima  cita registrada para una campaña, si ya tiene, debe esperar al menos 20 dias.
        // caso contrario, no tiene citas (no vacunas) asi que puede hacerlo.
        Cita ultimaCita = citaService.obtenerUltimaCitaParaCampania(paciente, camp);
        if(ultimaCita!=null){
            LocalDate fechaMinimaPermitida = ultimaCita.getFechaHora().toLocalDate().plusDays(20);
            LocalDate fechaCita = fecha.toLocalDate();
            if (fechaCita.isBefore(fechaMinimaPermitida)) {
                return false;
            }
        }
        return true;
    }
    //** Metodo para identificar si un paciente cuenta con todas las dosis de una vacuna */
    public boolean pacienteTieneTodasLasDosis(Paciente paciente, Vacuna vacuna){
        int dosisRequeridas = vacuna.getTipoVacuna().getDosisRequeridas();
        int dosisAplicadas = vacunacionRepo.countByPacienteAndTipoVacuna(paciente, vacuna.getTipoVacuna());
        if (dosisAplicadas >= dosisRequeridas) {
            return true;
        }
        return false;
    }
    //* Metodo para calcular el numero de dosis que le corresponde a un paciente para la vacuna */
    public  int calcularNumeroDosis(Paciente paciente, Vacuna vacuna) {
        if (pacienteTieneTodasLasDosis(paciente, vacuna)) {
            throw new IllegalStateException("El paciente ya tiene todas las dosis");
        }
        int dosisAplicadas = vacunacionRepo.countByPacienteAndTipoVacuna(paciente, vacuna.getTipoVacuna());
        return  dosisAplicadas + 1;
    }
    //* Retorna la ultima vacunacion que tuvo un paciente para una campaña, si no tiene devuelve null */
    public Vacunacion obtenerUltimaVacunacionYaRegistrada(Paciente paciente, Campania camp){
        return vacunacionRepo.findFirstByCitaPacienteAndCitaCampaniaOrderByFechaHoraDesc(paciente, camp);  
    }
    //* Metodo que representa la aplicacion de una vacuna */
    public void aplicarVacuna(Cita cita) {      
        Vacuna vacuna = cita.getVacuna();
        
        if (vacuna == null || vacuna.getEstadoVacuna() != EstadoVacuna.RESERVADA) {
            throw new RuntimeException("No hay una vacuna reservada para aplicar en esta cita");
        }

        // aplicamos la vacuna
        vacuna.setEstadoVacuna(EstadoVacuna.APLICADA);

        // actualizamos el stock
        StockVacuna stockVacuna = vacuna.getStockVacuna();
        if (stockVacuna != null && stockVacuna.getCantidadReservada() > 0) {
            stockVacuna.setCantidadReservada(stockVacuna.getCantidadReservada() - 1);
            stockVacunaService.guardar(stockVacuna);
        }

        // Se guarda el registro 
        vacunaService.guardar(vacuna);
        citaService.guardar(cita);
    }

    @Transactional
    //*Metodo de para registrar una vacunacion */
    public Vacunacion registrarVacunacion(Long idCita, String rutFuncionario ,  String observaciones ){
        //Buscamos la cita
        Cita cita = citaService.buscarCitaPorId(idCita);
        Paciente paciente = cita.getPaciente();
        Vacuna vacuna = cita.getVacuna();
        // validamos que esté apta para vacunar la cita
        cita.validarEstadoCitaParaVacunacion();
        // calculamos el numero de dosis, aplicamos la vacuna y registramos la vacunacion
        int numDosis = calcularNumeroDosis(paciente, vacuna);
        aplicarVacuna(cita);
        Vacunacion vacunacion = new Vacunacion(null, numDosis, observaciones, LocalDateTime.now(), cita);
        // marcamos la cita como completada
        citaService.marcarCitaComoCompletada(cita);

        guardar(vacunacion);
        return vacunacion;
    }

        //* Si ya registra una vacunacion para la campaña, devolvemos la vacuna que necesita. Caso contrario null */
     TipoVacuna obtenerTipoVacunaRequerida(String rutPaciente, Long idCampania){
        Paciente paciente = pacienteService.buscarPorRut(rutPaciente);
        Campania campania = campaniaService.obtenerCampaniaPorId(idCampania);
        Cita cita = citaService.obtenerUltimaCitaParaCampania(paciente, campania);
        if(cita!=null){
            return cita.getVacuna().getTipoVacuna();
        }
         return null;
    }
}
