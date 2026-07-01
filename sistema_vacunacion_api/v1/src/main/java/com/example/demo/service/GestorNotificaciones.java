package com.example.demo.service;

import org.springframework.stereotype.Service;

import com.example.demo.models.Cita;
import com.example.demo.models.CorreoFactory;
import com.example.demo.models.Notificable;
import com.example.demo.models.Notificacion;
import com.example.demo.models.NotificacionDobleFactory;
import com.example.demo.models.NotificacionFactory;
import com.example.demo.models.NotificacionPreferencia;
import com.example.demo.models.SMSFactory;

// Clase experta en gestionar la forma en que se notifica.
@Service
public class GestorNotificaciones {

    public void notificarCita(Cita cita) {
        notificarDestinatario(cita.getPaciente(), cita);
        notificarDestinatario(cita.getFuncSalud(), cita);
    }
    private void notificarDestinatario(Notificable destinatario, Cita cita) {
        NotificacionPreferencia preferencia = destinatario.getNotificacionPreferencia();
        NotificacionFactory factory = getFactory(preferencia);
        String mensaje = destinatario.getMensajeCita(cita);
        Notificacion notificacion = factory.crearNotificacion();
        notificacion.enviarMensaje(mensaje);
    }
    private NotificacionFactory getFactory(NotificacionPreferencia pref) {
        return switch (pref) {
            case SMS -> new SMSFactory();
            case CORREOELECTRONICO -> new CorreoFactory();
            case AMBOS -> new NotificacionDobleFactory();
        };
    }
}
