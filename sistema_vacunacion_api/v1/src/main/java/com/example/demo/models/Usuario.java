package com.example.demo.models;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Entity
@Data             
@NoArgsConstructor  
@AllArgsConstructor 
@Table(name = "usuario")
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
public class Usuario {
    @Id
    @Column(name = "RUT")
    private String RUT;
    private String nombres;
    private String apellidos;
    private Integer fono;
    private String correoElectronico;
    private LocalDate fechaNacimiento;
    @Enumerated(EnumType.STRING)
    private NotificacionPreferencia preferencia;



}
