package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.models.HorarioFs;

public interface HorarioFsRepo extends JpaRepository<HorarioFs, Long> {
    
}
