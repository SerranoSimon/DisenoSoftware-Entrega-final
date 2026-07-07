package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.models.Cita;
import com.example.demo.models.EstadoVacuna;
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
    // reservamos una vacuna para  una cita
    public Vacuna reservar(StockVacuna stockVacuna) {
        // Buscamos la primera vacuna de este stock que tenga estado DISPONIBLE
        Vacuna vacuna = stockVacuna.getVacunas().stream()
                .filter(v -> v.getEstadoVacuna() == EstadoVacuna.DISPONIBLE)
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No hay vacunas disponibles en este stock"));

        // Cambiamos estado y contadores
        vacuna.setEstadoVacuna(EstadoVacuna.RESERVADA);
        stockVacuna.setCantidadReservada(stockVacuna.getCantidadReservada() + 1);

        // Guardamos
        vacunaService.guardar(vacuna);
        stockVacunaRepo.save(stockVacuna);
        
        return vacuna;
    }

    public void eliminarReserva(Cita cita) {
        Vacuna vacuna = cita.getVacuna();
        
        // Validamos que haya una vacuna y que efectivamente esté reservada
        if (vacuna == null || vacuna.getEstadoVacuna() != EstadoVacuna.RESERVADA) {
            throw new RuntimeException("No hay una reserva válida para cancelar en esta cita");
        }

        // Cambiamos el estado de la vacuna a DISPONIBLE
        vacuna.setEstadoVacuna(EstadoVacuna.DISPONIBLE);

        // 2Obtenemos el stock y restamos la cantidad reservada
        StockVacuna stockVacuna = vacuna.getStockVacuna();
        if (stockVacuna != null && stockVacuna.getCantidadReservada() > 0) {
            stockVacuna.setCantidadReservada(stockVacuna.getCantidadReservada() - 1);
            stockVacunaRepo.save(stockVacuna);
        }

        // 3. Rompemos la relación en la Cita, ya que se canceló
        cita.setVacuna(null); 

        // 4. Guardamos los cambios de la vacuna
        vacunaService.guardar(vacuna);
    }
    public void guardar(StockVacuna sv){
        stockVacunaRepo.save(sv);
    }

    public StockVacuna buscarPorId(Long id){
        return stockVacunaRepo.findById(id)
             .orElseThrow(() -> new EntityNotFoundException("Stock vacuna no encontrado con id: " + id));
    }

}
