package com.example.demo.models;

import com.example.demo.service.EmailService;

public class NotificacionDobleFactory extends NotificacionFactory{
    EmailService emailService;
    public NotificacionDobleFactory(EmailService emailService){
        this.emailService = emailService;
    }
    @Override
    public Notificacion crearNotificacion() {
        return new NotificacionDoble(new SMS(), new CorreoElectronico(emailService));
    }
}
