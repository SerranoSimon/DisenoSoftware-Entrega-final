package com.example.demo.models;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.example.demo.repository.VacunacionRepo;


import lombok.Data;

@Component
@Data

public class CalculadoraDosis {
    private  VacunacionRepo vacunacionRepo;

    public CalculadoraDosis(VacunacionRepo vacunacionRepo) {
        this.vacunacionRepo = vacunacionRepo;
    }
    public  int calcularNumeroDosis(Paciente paciente, Vacuna vacuna) {
        int dosisRequeridas = vacuna.getTipoVacuna().getDosisRequeridas();
        int dosisAplicadas = vacunacionRepo.countByPacienteAndTipoVacuna(paciente, vacuna.getTipoVacuna());

        if (dosisAplicadas >= dosisRequeridas) {
            throw new IllegalStateException("El paciente ya tiene todas las dosis");
        }
        return dosisRequeridas - dosisAplicadas - 1;
    }
}