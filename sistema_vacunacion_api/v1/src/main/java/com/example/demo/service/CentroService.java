package com.example.demo.service;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.LocalTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.exceptions.ValidacionCitaException;
import com.example.demo.models.Campania;
import com.example.demo.models.CentroVacunacion;
import com.example.demo.models.FuncSalud;
import com.example.demo.models.HorarioCentro;
import com.example.demo.models.Paciente;
import com.example.demo.models.StockVacuna;
import com.example.demo.models.TipoVacuna;
import com.example.demo.models.Vacuna;
import com.example.demo.repository.CentrosRepo;

import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class CentroService {
    @Autowired
    private final CentrosRepo centrosRepo;

    @Autowired
    private final FuncSaludService fsService;
    @Autowired
    private final StockVacunaService stockVacunaService;
    @Autowired
    private final VacunacionService vacunacionService;

    public CentroVacunacion buscarCentroPorId(Long id){
        return centrosRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Centro no encontrado con id: " + id));
    }

    
    public boolean estaAbierto(CentroVacunacion centro , LocalDateTime fechaHora){
        DayOfWeek dia= fechaHora.getDayOfWeek();
        LocalTime hora = fechaHora.toLocalTime();
        for(HorarioCentro horarioCentro: centro.getHorarios()){
            if(horarioCentro.getDiaSemana().equals(dia) && !hora.isBefore(horarioCentro.getHoraApertura())
            && !hora.isAfter(horarioCentro.getHoraCierre())){
                return true;
            }
        }
      return false;
    }


  

    
    public Vacuna buscarVacuna(CentroVacunacion centro, Campania camp, Paciente paciente){
        TipoVacuna tipoVacunaRequerida = vacunacionService.obtenerTipoVacunaRequerida(paciente.getRUT(), camp.getIdCampania());
        // si ya tiene una vacunacion para la campaña registrada, le reservamos el mismo tipo de vacuna
        if(tipoVacunaRequerida!=null){
             for(StockVacuna sv: centro.getStockVacunas()){
                if(sv.getTipoVacuna().equals(tipoVacunaRequerida)){
                        if(sv.verificarStock()){
                            return stockVacunaService.reservar(sv);
                        }
                        else{
                            throw new ValidacionCitaException("No quedan más dosis para su vacuna");
                        }
                    }
                
                }
                throw new ValidacionCitaException(
                  "Este centro no cuenta con " + tipoVacunaRequerida.getNombre() + ", la vacuna con la que ya inició su esquema. Intente en otro centro."
                   );
            }
        // si no, le asignamos una que cumpla con la campaña que solicitó
            for(StockVacuna sv: centro.getStockVacunas()){
                if(sv.vacunaEsDeCampania(camp) && sv.verificarStock()){
                        return stockVacunaService.reservar(sv); 
                }
            }
            throw new ValidacionCitaException("No quedan vacunas para la campaña en el centro");
    }

   public void agregarHorario(Long centroId, HorarioCentro horario) {
        CentroVacunacion centro = buscarCentroPorId(centroId);
        centro.getHorarios().add(horario);
        horario.setCentroVacunacion(centro);
        centrosRepo.save(centro);
    }

    public void agregarFuncionario(Long centroId, FuncSalud funcSalud) {
        CentroVacunacion centro = buscarCentroPorId(centroId);
        funcSalud.setCentroVacunacion(centro);
        fsService.guardar(funcSalud);
    }

    public void agregarStock(Long centroId, StockVacuna stockVacuna) {
        CentroVacunacion centro = buscarCentroPorId(centroId);
        stockVacuna.setCentroVacunacion(centro);
        stockVacunaService.guardar(stockVacuna);
    }

}
    

