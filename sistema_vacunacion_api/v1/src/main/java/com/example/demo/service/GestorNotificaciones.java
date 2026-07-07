package com.example.demo.service;

import java.time.LocalDateTime;

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
        
        String asunto = "Confirmación de cita de vacunación";
        String mensaje = "Estimado/a " + paciente.getNombres() + " " + paciente.getApellidos() + ",\n\n" +
        "Nos comunicamos para confirmar su próxima cita de vacunación correspondiente a la campaña: " + cita.getCampania().getNombre() + ".\n\n" +
        "Detalles de su cita:\n" +
        "- Vacuna: " + cita.getVacuna().getTipoVacuna().getNombre() + "\n" +
        "- Centro de Vacunación: " + cita.getCentroVacunacion().getNombre() + "\n" +
        "- Dirección: " + cita.getCentroVacunacion().getDireccion() + "\n" +
        "- Fecha y Hora: " + cita.getFechaHora() + "\n" +
        "- Profesional a cargo: " + cita.getFuncSalud().getNombres() + " " + cita.getFuncSalud().getApellidos() + "\n\n" +
        "Agradecemos su puntualidad. Le recordamos que su asistencia es muy importante.\n\n" +
        "Atentamente,\n" +
        "El equipo de Salud";
        
        Notificacion notificacion = factory.crearNotificacion();
        notificacion.enviarMensaje(paciente.getDatosContactoDestinatario(), asunto, mensaje);
    }
    public void notificarCitaInasistidaPaciente( Cita cita, LocalDateTime hora_inasistencia) {
        Paciente paciente = cita.getPaciente();
        NotificacionPreferencia preferencia = paciente.getNotificacionPreferencia();
        NotificacionFactory factory = getFactory(preferencia);
        
        String asunto = "Inasistencia a cita de vacunación";
        String mensaje = "Estimado/a " + paciente.getNombres() + " " + paciente.getApellidos() + ",\n\n" +
        "Nos comunicamos para informar que su cita de vacunación: " + "\n\n" +
        "- Campaña: " + cita.getCampania().getNombre() + "\n" +
        "- Vacuna: " + cita.getVacuna().getTipoVacuna().getNombre() + "\n" +
        "- Centro de Vacunación: " + cita.getCentroVacunacion().getNombre() + "\n" +
        "- Dirección: " + cita.getCentroVacunacion().getDireccion() + "\n" +
        "- Fecha y Hora: " + cita.getFechaHora() + "\n" +
        "- Profesional a cargo: " + cita.getFuncSalud().getNombres() + " " + cita.getFuncSalud().getApellidos() + "\n\n" +
        "Ha sido marcada como inasistida a eso de las : .\n\n" +
        "Atentamente,\n" +
        "El equipo de Salud";
        
        Notificacion notificacion = factory.crearNotificacion();
        notificacion.enviarMensaje(paciente.getDatosContactoDestinatario(), asunto, mensaje);
    }

    private void notificarConfirmacionCitaFuncSalud(FuncSalud funcSalud, Cita cita) {
        NotificacionPreferencia preferencia = funcSalud.getNotificacionPreferencia();
        NotificacionFactory factory = getFactory(preferencia);
        
        String asunto = "Asignación de nueva cita de vacunación";
        String mensaje = "Estimado/a " + funcSalud.getNombres() + " " + funcSalud.getApellidos() + ",\n\n" +
        "Se le ha asignado una nueva cita para administrar una vacuna. A continuación, le detallamos la información del procedimiento:\n\n" +
        "Detalles de la cita:\n" +
        "- Paciente a atender: " + cita.getPaciente().getNombres() + " " + cita.getPaciente().getApellidos() + "\n" +
        "- Vacuna a administrar: " + cita.getVacuna().getTipoVacuna().getNombre() + "\n" +
        "- Centro de Vacunación: " + cita.getCentroVacunacion().getNombre() + "\n" +
        "- Dirección: " + cita.getCentroVacunacion().getDireccion() + "\n" +
        "- Fecha y Hora: " + cita.getFechaHora() + "\n\n" +
        "Atentamente,\n" +
        "Sistema de Gestión de Citas";
        
        Notificacion notificacion = factory.crearNotificacion();
        notificacion.enviarMensaje(funcSalud.getDatosContactoDestinatario(), asunto, mensaje);
    }

    public void notificarConfirmacionVacunacionPaciente(Vacunacion vacunacion) {
        Cita cita = vacunacion.getCita();
        Paciente paciente = cita.getPaciente();
        NotificacionPreferencia preferencia = paciente.getNotificacionPreferencia();
        NotificacionFactory factory = getFactory(preferencia);
        
        String asunto = "Confirmación de inoculación: " + cita.getCampania().getNombre();
        String mensaje = "Estimado/a " + paciente.getNombres() + " " + paciente.getApellidos() + ",\n\n" +
        "Este mensaje confirma que ha sido vacunado/a exitosamente en el marco de la campaña: " + cita.getCampania().getNombre() + ".\n\n" +
        "Registro de la inoculación:\n" +
        "- Vacuna administrada: " + cita.getVacuna().getTipoVacuna().getNombre() + " (Lote/ID: #" + cita.getVacuna().getIdVacuna() + ")\n" +
        "- Centro de Vacunación: " + cita.getCentroVacunacion().getNombre() + "\n" +
        "- Dirección: " + cita.getCentroVacunacion().getDireccion() + "\n" +
        "- Fecha y Hora de inoculación: " + vacunacion.getFechaHora() + "\n" +
        "- Profesional a cargo: " + cita.getFuncSalud().getNombres() + " " + cita.getFuncSalud().getApellidos() + "\n\n" +
        "IMPORTANTE: Le recordamos ingresar a nuestra plataforma para reportar su estado de salud tras la inoculación.\n\n" +
        "Atentamente,\n" +
        "El equipo de Salud";
        
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
