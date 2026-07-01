package com.example.demo.models;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.LocalTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Data               
@Table(name = "horarioFs")
@NoArgsConstructor
public class HorarioFs {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)    
    private Long idHorarioFs;
    private DayOfWeek diaSemana;
    private LocalTime horaInicio;
    private LocalTime horaFin;
    private boolean bloqueado;
    @ManyToOne
    @JoinColumn(
        name = "funcSalud_rut",           
        referencedColumnName = "RUT"     
    )
    private FuncSalud funcSalud;

    public HorarioFs(DayOfWeek diaSemana, LocalTime horaInicio, LocalTime horaFin, FuncSalud funcSalud){
        this.diaSemana = diaSemana;
        this.horaInicio = horaInicio;
        this.horaFin = horaFin;
        this.bloqueado = false;
        this.funcSalud = funcSalud;
    }

    // revisamos si el bloque abarca la hora que se pidio.
    public boolean abarca(LocalDateTime fechaHora){
        DayOfWeek dia = fechaHora.getDayOfWeek();
        LocalTime hora = fechaHora.toLocalTime();
        return diaSemana.equals(dia) && !hora.isBefore(horaInicio) && !hora.isAfter(horaFin);
    }
    // bloquea el bloque horario
    public void bloquear(){
        this.bloqueado = true;
    }
   // devuelve si el bloque está o no disponible
    public boolean estaDisponible(){
        return !bloqueado;
    }
}
