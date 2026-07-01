package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.models.TipoVacuna;



public interface TipoVacunaRepo extends JpaRepository<TipoVacuna,Long>{
    
}
