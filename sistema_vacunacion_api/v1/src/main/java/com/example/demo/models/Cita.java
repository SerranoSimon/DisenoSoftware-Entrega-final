package com.example.demo.models;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data               
@NoArgsConstructor
@Table(name = "cita")  
public class Cita {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idCita")
    private Long idCita;
    @Column(name = "fecha_hora")
    private LocalDateTime fechaHora;
    @Enumerated(EnumType.STRING)
    private EstadoCita estado;
    @ManyToOne
    @JoinColumn(
        name = "paciente_rut",           // Nombre de la columna FK que se creará en la tabla CITA
        referencedColumnName = "RUT"     // Nombre exacto de la columna PK en la tabla PACIENTE
    )
    private Paciente paciente;
    @ManyToOne
    @JoinColumn(
        name = "fs_rut",          
        referencedColumnName = "RUT"     
    )
    private FuncSalud funcSalud;

    @ManyToOne
    @JoinColumn(
        name = "centro_id",          
        referencedColumnName = "idCentro"     
    )
    private CentroVacunacion centroVacunacion;
    @OneToOne
    @JoinColumn(
        name = "vacuna_id",          
        referencedColumnName = "idVacuna"     
    )
    private Vacuna vacuna;
    
    @ManyToOne
    @JoinColumn(
        name = "campania_id",
        referencedColumnName = "idCampania"
    )
    private Campania campania;

    @OneToOne
    @JoinColumn(
        name = "vacunacion_id",          
        referencedColumnName = "idVacunacion"     
    )
    private Vacunacion vacunacion;

    public Cita(Paciente paciente, FuncSalud funcionario, LocalDateTime fechaHora,
            CentroVacunacion centro, Vacuna vacuna, Campania camp) {
            this.paciente = paciente;
            this.funcSalud = funcionario;
            this.fechaHora = fechaHora;
            this.centroVacunacion = centro;
            this.vacuna= vacuna;
            this.estado = EstadoCita.VIGENTE;
            this.campania = camp;
            this.vacunacion = null;
    }

    public void validarEstadoCitaParaVacunacion() {
        if (estado == EstadoCita.CANCELADA) {
            throw new IllegalStateException("La cita está cancelada");
        }
        if (estado == EstadoCita.INASISTIDA) {
            throw new IllegalStateException("La cita fue marcada como inasistida");
        }
        LocalDateTime ahora = LocalDateTime.now();
        if (ahora.isBefore(fechaHora)) {
            throw new IllegalStateException("La cita aún no ha comenzado");
        }

    }





}
