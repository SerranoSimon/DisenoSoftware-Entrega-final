package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.models.HorarioCentro;

public interface HorarioCentroRepo extends JpaRepository<HorarioCentro,Long> {
    
}
