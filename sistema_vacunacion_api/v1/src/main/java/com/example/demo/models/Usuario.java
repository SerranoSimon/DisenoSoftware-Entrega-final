package com.example.demo.models;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnore;

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
    @Column(name = "rut")
    private String RUT;
    private String nombres;
    private String apellidos;
    private String fono;
    private String correoElectronico;
    private LocalDate fechaNacimiento;
    @Enumerated(EnumType.STRING)
    private NotificacionPreferencia preferencia;

    // Hash BCrypt de la contraseña interna del sistema.
    @JsonIgnore
    private String password;

    // Constructor sin password lo usan los constructores de Paciente y FuncSalud.
    // La contraseña se asigna aparte con setPassword(hash).
    public Usuario(String RUT, String nombres, String apellidos, String fono,
            String correoElectronico, LocalDate fechaNacimiento, NotificacionPreferencia preferencia) {
        this.RUT = RUT;
        this.nombres = nombres;
        this.apellidos = apellidos;
        this.fono = fono;
        this.correoElectronico = correoElectronico;
        this.fechaNacimiento = fechaNacimiento;
        this.preferencia = preferencia;
    }

}
