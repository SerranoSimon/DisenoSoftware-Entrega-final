package com.example.demo.models;



import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data               
@Table(name = "stock_vacuna")
@NoArgsConstructor
public class StockVacuna {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idStockVacuna")
    private Long idStockVacuna;
    @OneToMany(mappedBy = "stockVacuna")
    private List<Vacuna> vacunas;
    private Integer cantidadReservada;

    @ManyToOne
    @JoinColumn(
        name = "centro_id",          
        referencedColumnName = "idCentro"     
    )
    private CentroVacunacion centroVacunacion;
    @ManyToOne
    @JoinColumn(
        name = "campania_id",          
        referencedColumnName = "idCampania"     
    )
    private Campania campania;
    
    @ManyToOne
    @JoinColumn(
    name = "tipo_vacuna_id",
    referencedColumnName = "idTipoVacuna"
)
    private TipoVacuna tipoVacuna;

    public StockVacuna(List<Vacuna> vacunas,  Campania campania, CentroVacunacion centroVacunacion, TipoVacuna tipoVacuna) {
        this.vacunas = vacunas;
        this.cantidadReservada = 0;
        this.centroVacunacion = centroVacunacion;
        this.campania = campania;
        this.tipoVacuna = tipoVacuna;
    }

    // Verifica que una vacuna sirva para cierta campaña
    public boolean vacunaEsDeCampania(Campania camp){
        if(this.campania.equals(camp)) return true;
        else return false;
    }
    // Verifica que existan vacunas disponibles
    public boolean verificarStock(){
        for(Vacuna v: vacunas){
            if(v.getEstadoVacuna().equals(EstadoVacuna.DISPONIBLE)){
                return true;
            }
        }
        return false;
    }

}
