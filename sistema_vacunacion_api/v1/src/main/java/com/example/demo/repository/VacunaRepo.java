package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.models.Vacuna;

public interface VacunaRepo extends JpaRepository<Vacuna, Long>{
    
}
