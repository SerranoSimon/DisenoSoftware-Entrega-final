package com.example.demo.models;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Entity
@Data             
@NoArgsConstructor  
@AllArgsConstructor 
@Table(name = "tipo_vacuna")
/** Representa una vacuna en general, ej. Pzifer 2 dosis */
public class TipoVacuna {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idTipoVacuna;
    private String nombre;          
    private Integer dosisRequeridas; 
    @OneToMany(mappedBy = "tipoVacuna")
    private List<Vacuna> unidades; 
}
