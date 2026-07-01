package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.models.Cita;
import com.example.demo.models.CorreoFactory;
import com.example.demo.models.FuncSalud;
import com.example.demo.models.Notificacion;
import com.example.demo.models.NotificacionDobleFactory;
import com.example.demo.models.NotificacionFactory;
import com.example.demo.models.NotificacionPreferencia;
import com.example.demo.models.Paciente;
import com.example.demo.models.SMSFactory;

// Clase experta en gestionar la forma en que se notifica.
@Service
public class GestorNotificaciones {
    @Autowired
    EmailService emailService;
    public void notificarConfirmacionCita(Cita cita) {
        notificarConfirmacionPaciente(cita.getPaciente(), cita);
        notificarConfirmacionFuncSalud(cita.getFuncSalud(), cita);
    }

    private void notificarConfirmacionPaciente(Paciente paciente, Cita cita) {
        NotificacionPreferencia preferencia = paciente.getNotificacionPreferencia();
        NotificacionFactory factory = getFactory(preferencia);
        String asunto = "Confirmacion de cita vacunacion";
        String mensaje = "Estimado Paciente.\n" +
        "Usted " +
        paciente.getNombres() + " " + paciente.getApellidos() +
        " tiene una cita para vacunarse contra " + cita.getCampania().getNombre() +
        ".\n Se le aplicará la vacuna "+ cita.getVacuna().getTipoVacuna().getNombre() + " ,en el centro " + cita.getCentroVacunacion().getNombre() +
        ".\nUbicado en " + cita.getCentroVacunacion().getDireccion() +
        ".\nEl horario a asistir es " + cita.getFecha_hora() +
        " y será atendido por " + cita.getFuncSalud().getNombres() + " " + cita.getFuncSalud().getApellidos() +
        ".\nEsperamos su asistencia y puntualidad.";
        Notificacion notificacion = factory.crearNotificacion();
        notificacion.enviarMensaje(paciente.getDatosContactoDestinatario(), asunto, mensaje);
    }

        private void notificarConfirmacionFuncSalud(FuncSalud funcSalud, Cita cita) {
        NotificacionPreferencia preferencia = funcSalud.getNotificacionPreferencia();
        NotificacionFactory factory = getFactory(preferencia);
        String asunto = "Confirmacion de cita vacunacion";
        String mensaje = "Estimado Funcionario de la salud.\n" +
        "Usted " +
        funcSalud.getNombres() + " " + funcSalud.getApellidos() +
        ". Tiene que aplicar una vacuna " + cita.getVacuna().getTipoVacuna().getNombre() + " ,en el centro " + cita.getCentroVacunacion().getNombre() +
        ".\nUbicacado en " + cita.getCentroVacunacion().getDireccion() +
        ".\nEl horario de vacunación es " + cita.getFecha_hora() +
        " y atenderá a " + cita.getPaciente().getNombres() + " " + cita.getPaciente().getApellidos();
        Notificacion notificacion = factory.crearNotificacion();
        notificacion.enviarMensaje(funcSalud.getDatosContactoDestinatario(), asunto, mensaje);
    }

    private NotificacionFactory getFactory(NotificacionPreferencia pref) {
        return switch (pref) {
            case SMS -> new SMSFactory();
            case CORREOELECTRONICO -> new CorreoFactory(emailService);
            case AMBOS -> new NotificacionDobleFactory(emailService);
        };
    }
}
