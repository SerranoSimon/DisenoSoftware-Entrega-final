package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.models.StockVacuna;

public interface StockVacunaRepo extends JpaRepository<StockVacuna,Long>{
    
}
