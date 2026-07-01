package com.example.demo.models;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.example.demo.service.GestorCitas;

import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
@Entity
@Table(name = "paciente")
@NoArgsConstructor  
@AllArgsConstructor 
public class Paciente extends Usuario implements Notificable {

    @OneToMany(mappedBy = "paciente")
    private List<Cita> citas;


    public Paciente(String RUT, String nombres, String apellidos, String fono, String correoElectronico, LocalDate fechaNacimiento, NotificacionPreferencia preferencia) {
        super(RUT, nombres, apellidos, fono, correoElectronico, fechaNacimiento, preferencia);
        this.citas= new ArrayList<>();
    }

    public void solicitarCita(Long id_camp, Long id_centro, LocalDateTime fecha_hora, GestorCitas gestorCitas){
       Cita cita= gestorCitas.crearCita(this,fecha_hora,id_centro,id_camp);
       citas.add(cita);
    };

    @Override
    public NotificacionPreferencia getNotificacionPreferencia() {
        return getPreferencia();
    }


    @Override
    public DatosContactoDestinatario getDatosContactoDestinatario() {
        return new DatosContactoDestinatario(getCorreoElectronico(), getFono());
    }



}
