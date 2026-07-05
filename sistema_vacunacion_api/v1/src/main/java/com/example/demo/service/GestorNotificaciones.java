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
import com.example.demo.models.Vacunacion;

// Clase experta en gestionar la forma en que se notifica.
@Service
public class GestorNotificaciones {
    @Autowired
    EmailService emailService;
    public void notificarConfirmacionCita(Cita cita) {
        notificarConfirmacionCitaPaciente(cita.getPaciente(), cita);
        notificarConfirmacionCitaFuncSalud(cita.getFuncSalud(), cita);
    }

    private void notificarConfirmacionCitaPaciente(Paciente paciente, Cita cita) {
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

    private void notificarConfirmacionCitaFuncSalud(FuncSalud funcSalud, Cita cita) {
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
    public void notificarConfirmacionVacunacionPaciente(Vacunacion vacunacion) {
        Cita cita = vacunacion.getCita();
        Paciente paciente = cita.getPaciente();
        NotificacionPreferencia preferencia = paciente.getNotificacionPreferencia();
        NotificacionFactory factory = getFactory(preferencia);
       
        String asunto = "Confirmacion de inoculación de vacuna";
        String mensaje = "Estimado Paciente.\n" +
        "Usted " +
        paciente.getNombres() + " " + paciente.getApellidos() +
        " Ha sido vacunado contra " + cita.getCampania().getNombre() +
        ".\n Con la vacuna "+ cita.getVacuna().getTipoVacuna().getNombre() + "#" + cita.getVacuna().getIdVacuna() + ",en el centro " + cita.getCentroVacunacion().getNombre() +
        ".\nUbicado en " + cita.getCentroVacunacion().getDireccion() +
        ".\n Hora de inoculación : " + vacunacion.getFecha_hora() +
        " Fue atendido por " + cita.getFuncSalud().getNombres() + " " + cita.getFuncSalud().getApellidos() +
        ".\nRecuerde ingresar a la plataforma para reportar su estado tras la inoculación.";
        Notificacion notificacion = factory.crearNotificacion();
        notificacion.enviarMensaje(paciente.getDatosContactoDestinatario(), asunto, mensaje);
    }

    private NotificacionFactory getFactory(NotificacionPreferencia pref) {
        return switch (pref) {
            case SMS -> new SMSFactory();
            case CORREOELECTRONICO -> new CorreoFactory(emailService);
            case AMBOS -> new NotificacionDobleFactory(emailService);
        };
    }
}
