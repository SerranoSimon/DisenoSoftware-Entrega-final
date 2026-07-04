package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.models.Vacunacion;
import com.example.demo.repository.VacunacionRepo;

@Service
public class VacunacionService {
    @Autowired
    VacunacionRepo vacunacionRepo;

    void guardar(Vacunacion vacunacion){
        vacunacionRepo.save(vacunacion);
    }
}
