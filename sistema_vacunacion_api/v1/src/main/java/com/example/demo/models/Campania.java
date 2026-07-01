package com.example.demo.models;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Entity
@Data               // genera getters, setters, toString, equals
@NoArgsConstructor  // constructor vacío (requerido por JPA)
@AllArgsConstructor // constructor con todos los campos (opcional)
@Table(name = "campania")
public class Campania {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idCampania")
    private Long idCampania;
    private String nombre;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private String descripcion;
    @Enumerated(EnumType.STRING)
    private EstadoCampania estadoCampania;
    @Embedded
    private PoblacionObjetivo pobObj;
    @OneToMany(mappedBy = "campania")
    private List<StockVacuna> stockVacunas = new ArrayList<>();


    public void agregarStockVacunas(StockVacuna stockVacuna){
        stockVacunas.add(stockVacuna);
    }

    public boolean estaActiva(){
        if(estadoCampania.equals(EstadoCampania.EN_CURSO)) return true;
        else return false;
    }

}
