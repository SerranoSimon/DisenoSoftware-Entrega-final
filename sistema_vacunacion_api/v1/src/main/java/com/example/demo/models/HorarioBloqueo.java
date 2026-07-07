package com.example.demo.models;


import java.time.LocalDate;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Table(name = "horario_bloqueo")
@NoArgsConstructor
@AllArgsConstructor
public class HorarioBloqueo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idHorarioBloqueo;

    @ManyToOne
    @JoinColumn(name = "horario_fs_id")
    private HorarioFs horarioFs;

    private LocalDate fecha;


    public HorarioBloqueo(HorarioFs horarioFs, LocalDate fecha) {
        this.horarioFs = horarioFs;
        this.fecha = fecha;
    }
}