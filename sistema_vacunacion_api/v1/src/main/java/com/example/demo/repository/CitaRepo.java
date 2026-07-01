package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.models.Cita;

public interface CitaRepo extends JpaRepository<Cita, Long> {
    
}
