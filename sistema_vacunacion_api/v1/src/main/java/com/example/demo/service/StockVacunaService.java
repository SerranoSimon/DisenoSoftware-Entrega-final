package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.models.StockVacuna;
import com.example.demo.models.Vacuna;
import com.example.demo.repository.StockVacunaRepo;
import com.example.demo.repository.VacunaRepo;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class StockVacunaService {

    @Autowired
    private StockVacunaRepo stockVacunaRepo;
    @Autowired
    private VacunaRepo vacunaRepo;

    public Vacuna reservar(StockVacuna stockVacuna) {
        stockVacuna.setCantidadReservada(stockVacuna.getCantidadReservada() + 1);
        Vacuna vacuna = stockVacuna.getVacunas().remove(stockVacuna.getVacunas().size() -1 ); // sacamos la ultima vacuna de la lista
        vacuna.setStockVacuna(null);
        vacunaRepo.save(vacuna);
        stockVacunaRepo.save(stockVacuna);
        return vacuna;
    }
}
