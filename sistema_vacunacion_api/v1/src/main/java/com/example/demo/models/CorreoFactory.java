package com.example.demo.models;

import com.example.demo.service.EmailService;

public class CorreoFactory extends NotificacionFactory{
    EmailService emailService;
    public CorreoFactory(EmailService emailService){
        this.emailService = emailService;
    }
    public Notificacion crearNotificacion() {
        return new CorreoElectronico(emailService);
    }
}
