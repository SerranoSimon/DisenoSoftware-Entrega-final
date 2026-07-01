package com.example.demo.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.models.Campania;
import com.example.demo.models.StockVacuna;
import com.example.demo.repository.CampaniaRepo;
import com.example.demo.repository.StockVacunaRepo;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor 
public class CampaniaService {

    private final CampaniaRepo campaniaRepo;
    private final StockVacunaRepo stockVacunaRepo; 


    @Transactional
    public void agregarVacunaACampania(Long idCampania, Long idStockVacuna) {
        //  Buscamos la campaña (o lanzamos error si no existe)
        Campania campania = campaniaRepo.findById(idCampania)
                .orElseThrow(() -> new RuntimeException("Campaña no encontrada"));

        // Buscamos el stock de la vacuna
        StockVacuna stock = stockVacunaRepo.findById(idStockVacuna)
                .orElseThrow(() -> new RuntimeException("Stock no encontrado"));

        // 3. Usamos el método de la entidad
        campania.agregarStockVacunas(stock);

        // Guardamos la campaña actualizada
        campaniaRepo.save(campania);
    }
    public Campania obtenerCampaniaPorId(Long idCampania){
        return campaniaRepo.getReferenceById(idCampania);
    }
}