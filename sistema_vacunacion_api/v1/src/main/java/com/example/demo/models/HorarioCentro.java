package com.example.demo.models;

import java.time.DayOfWeek;
import java.time.LocalTime;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data               
@NoArgsConstructor  
@AllArgsConstructor 

public class HorarioCentro {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)    
    private Long idHorarioCentro;
    
    @Enumerated(EnumType.STRING)
    private DayOfWeek diaSemana;
    private LocalTime horaApertura;
    private LocalTime horaCierre;
    @ManyToOne
    @JoinColumn(name = "centro_id")
    private CentroVacunacion centroVacunacion;



}
