package com.example.demo.models;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
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
@Table(name = "centroVacunacion")
public class CentroVacunacion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idCentro")
    private Long idCentro;
    private String nombre;
    private String tipo;
    private String direccion;
    @OneToMany(mappedBy = "centroVacunacion", cascade = CascadeType.ALL)
    private List<StockVacuna> stockVacunas = new ArrayList<>();
    @OneToMany(mappedBy = "centroVacunacion", cascade = CascadeType.ALL)
    private List<FuncSalud> funcionariosSalud = new ArrayList<>();
    @OneToMany(mappedBy = "centroVacunacion", cascade = CascadeType.ALL, orphanRemoval = true) //orphanRemoval=true ya que si se borra centro, no tiene sentido guardar el horario
    private List<HorarioCentro> horarios = new ArrayList<>();
    @OneToMany(mappedBy = "centroVacunacion", cascade = CascadeType.ALL)
    private List<Cita> citas = new ArrayList<>();







}
