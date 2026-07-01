package com.example.demo.models;


import com.example.demo.service.EmailService;

public class CorreoElectronico implements Notificacion{

    EmailService emailService;
    public CorreoElectronico(EmailService emailService) {
        this.emailService = emailService;
    }
    @Override
    public void enviarMensaje(DatosContactoDestinatario destinatario, String asunto, String mensaje) {
      
        emailService.sendEmail(destinatario.correoElectronico(), asunto, mensaje);
    }
}
