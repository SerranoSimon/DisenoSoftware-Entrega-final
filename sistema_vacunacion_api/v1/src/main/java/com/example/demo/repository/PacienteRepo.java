package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.models.Paciente;


public interface PacienteRepo extends JpaRepository<Paciente,String>{
    
}
