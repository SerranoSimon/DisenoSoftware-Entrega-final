package com.example.demo.service;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.LocalTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.models.Campania;
import com.example.demo.models.CentroVacunacion;
import com.example.demo.models.FuncSalud;
import com.example.demo.models.HorarioCentro;
import com.example.demo.models.StockVacuna;
import com.example.demo.models.Vacuna;
import com.example.demo.repository.CentrosRepo;
import com.example.demo.repository.FuncSaludRepo;
import com.example.demo.repository.HorarioCentroRepo;
import com.example.demo.repository.StockVacunaRepo;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class CentroService {
    @Autowired
    private final CentrosRepo centrosRepo;
    @Autowired
    private final HorarioCentroRepo hCentroRepo;
    @Autowired
    private final FuncSaludRepo fsRepo;
    @Autowired 
    private final StockVacunaRepo stockVacunaRepo;
    @Autowired
    private final StockVacunaService stockVacunaService;
    public CentroVacunacion obtenerCentroPorId(Long id){
        return centrosRepo.getReferenceById(id);
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


    public FuncSalud buscarFsParaCita(CentroVacunacion centro , LocalDateTime fechaHora){
        for(FuncSalud fs: centro.getFuncionariosSalud()){
            if(fs.disponible(fechaHora)){
                return fs;
            }
        }
        return null;
    }

    
    public Vacuna buscarVacuna(CentroVacunacion centro, Campania camp){
            for(StockVacuna sv: centro.getStockVacunas()){
                if(sv.vacunaEsDeCampania(camp) && sv.verificarStock()){
                    return stockVacunaService.reservar(sv);
                }
            }
            return null;
    }

   public void agregarHorario(Long centroId, HorarioCentro horario) {
        CentroVacunacion centro = centrosRepo.getReferenceById(centroId);
        horario.setCentroVacunacion(centro);
        hCentroRepo.save(horario);
    }

    public void agregarFuncionario(Long centroId, FuncSalud funcSalud) {
        CentroVacunacion centro = centrosRepo.getReferenceById(centroId);
        funcSalud.setCentroVacunacion(centro);
        fsRepo.save(funcSalud);
    }

    public void agregarStock(Long centroId, StockVacuna stockVacuna) {
        CentroVacunacion centro = centrosRepo.getReferenceById(centroId);
        stockVacuna.setCentroVacunacion(centro);
        stockVacunaRepo.save(stockVacuna);
    }

}
    

