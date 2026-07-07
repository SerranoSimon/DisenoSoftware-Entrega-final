
package com.example.demo.models;



import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
@NoArgsConstructor  
@AllArgsConstructor 
@Table(name = "vacuna")
//** Representa la unidad física de un tipo de vacuna */
public class Vacuna {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idVacuna;

    @ManyToOne
    @JoinColumn(name = "tipo_vacuna_id")
    private TipoVacuna tipoVacuna;
    @ManyToOne
    @JoinColumn(
        name = "stockVacuna_id",          
        referencedColumnName = "idStockVacuna"     
    )
    private StockVacuna stockVacuna;
    
    @Enumerated(EnumType.STRING)
    private EstadoVacuna estadoVacuna;


    



}
