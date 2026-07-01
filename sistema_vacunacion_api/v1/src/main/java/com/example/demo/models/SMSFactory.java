package com.example.demo.models;

public class SMSFactory extends NotificacionFactory {
    @Override
    public Notificacion crearNotificacion() {
        return  new SMS();

    }
}
