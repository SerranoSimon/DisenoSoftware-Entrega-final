package com.example.demo.models;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;

import lombok.NoArgsConstructor;
@Entity
@NoArgsConstructor  
@AllArgsConstructor
@Table(name = "func_salud")
public class FuncSalud extends Usuario implements Notificable{
    @OneToMany(mappedBy = "funcSalud")
    private List<Cita> citas;
    @OneToMany(mappedBy = "funcSalud", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<HorarioFs> horarios;

    @ManyToOne
    @JoinColumn(name = "centro_id")
    private CentroVacunacion centroVacunacion;
    
    public FuncSalud(String RUT, String nombres, String apellidos, String fono, String correoElectronico, LocalDate fechaNacimiento, ArrayList<HorarioFs> horarios, NotificacionPreferencia preferencia, CentroVacunacion
        centroVacunacion
    ) {
          super(RUT, nombres, apellidos, fono, correoElectronico, fechaNacimiento, preferencia);
          this.horarios = horarios;
          this.centroVacunacion = centroVacunacion;
          this.citas = new ArrayList<>();


    }
     // Busca entre los horarios del funcionario para ver si puede atender en cierta fecha_hora,
    // si es que puede, lo bloquea (será asignado a la cita que se creará).
    public boolean disponible(LocalDateTime fechaHora){
        for(HorarioFs h: horarios){
            if(h.abarca(fechaHora) && h.estaDisponible()){
                h.bloquear();
                return true;
            }
        }
        return false;
    }
    public CentroVacunacion getCentroVacunacion(){
        return centroVacunacion;
    }
    
    public List<HorarioFs> getHorarios(){
        return horarios;
    }
    
    public void setCentroVacunacion(CentroVacunacion centro){
        this.centroVacunacion = centro;
    }

    @Override
    public NotificacionPreferencia getNotificacionPreferencia() {
        return getPreferencia();
    }



    @Override
    public DatosContactoDestinatario getDatosContactoDestinatario() {
        return new DatosContactoDestinatario(getCorreoElectronico(), getFono());
    }
}
