package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.models.FuncSalud;
import com.example.demo.models.HorarioFs;
import com.example.demo.repository.FuncSaludRepo;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

@Service
public class FuncSaludService {

    @Autowired
    private FuncSaludRepo funcSaludRepo;

    @Transactional
    public void agregarHorario(String rutFuncionario, HorarioFs horario) {
        FuncSalud func = buscarPorRut(rutFuncionario);
        func.getHorarios().add(horario);
        horario.setFuncSalud(func);
        guardar(func);
    }

    public FuncSalud buscarPorRut(String rut){
        return funcSaludRepo.findById(rut).orElseThrow(() -> new EntityNotFoundException("F. de salud no encontrado con rut: " + rut));
    }

    void guardar(FuncSalud fs){
        funcSaludRepo.save(fs);
    }
}