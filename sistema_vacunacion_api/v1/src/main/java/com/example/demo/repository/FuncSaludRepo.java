package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.models.FuncSalud;

public interface FuncSaludRepo extends JpaRepository<FuncSalud, String> {
    
}
