package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.models.StockVacuna;
import com.example.demo.models.Vacuna;
import com.example.demo.repository.StockVacunaRepo;

import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class StockVacunaService {

    @Autowired
    private StockVacunaRepo stockVacunaRepo;
    @Autowired
    private VacunaService vacunaService;

    public Vacuna reservar(StockVacuna stockVacuna) {
        stockVacuna.setCantidadReservada(stockVacuna.getCantidadReservada() + 1);
        Vacuna vacuna = stockVacuna.getVacunas().remove(stockVacuna.getVacunas().size() -1 ); // sacamos la ultima vacuna de la lista
        vacuna.setStockVacuna(null);
        vacunaService.guardar(vacuna);
        stockVacunaRepo.save(stockVacuna);
        return vacuna;
    }
    void guardar(StockVacuna sv){
        stockVacunaRepo.save(sv);
    }

    StockVacuna buscarPorId(Long id){
        return stockVacunaRepo.findById(id)
             .orElseThrow(() -> new EntityNotFoundException("Stock vacuna no encontrado con id: " + id));
    }

}
