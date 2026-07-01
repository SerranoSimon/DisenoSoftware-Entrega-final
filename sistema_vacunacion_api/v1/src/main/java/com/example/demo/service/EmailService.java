package com.example.demo.service;

import com.resend.Resend;
import com.resend.services.emails.model.SendEmailRequest;

import ch.qos.logback.classic.Logger;

import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    private static final Logger log = (Logger) LoggerFactory.getLogger(EmailService.class);
    private final Resend resend;

    public EmailService(@Value("${RESEND_API_KEY}") String apiKey) {
        this.resend = new Resend(apiKey);
    }
    // ubicamos el catch aquí para no frenar la creacion de la cita si es que el
    // falla el envío del email.
    public void sendEmail(String to, String subject, String htmlContent) {
        SendEmailRequest params = SendEmailRequest.builder()
            .from("Sistema Vacunación <onboarding@resend.dev>")
            .to(to)
            .subject(subject)
            .html(htmlContent)
            .build();

        try {
            resend.emails().send(params);
            log.debug("correo enviado con exito {}.", to, subject);
        } catch (Exception e) {
           log.error("Fallo al enviar el correo de confirmación a {}. Causa: {}", to, e.getMessage(), e);
        }
    }
}