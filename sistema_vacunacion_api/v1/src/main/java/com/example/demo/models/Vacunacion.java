package com.example.demo.models;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Entity
@Data             
@NoArgsConstructor  
@AllArgsConstructor 
@Table(name = "vacunacion")
//**Clase que representa la aplicacion de una vacuna durante una cita */
public class Vacunacion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idVacunacion;
    private Integer numDosis;
    private String observaciones;
    private LocalDateTime fecha_hora;

    @OneToOne
    @JoinColumn(
        name = "cita_id",          
        referencedColumnName = "idCita"     
    )
    private Cita cita;
}
