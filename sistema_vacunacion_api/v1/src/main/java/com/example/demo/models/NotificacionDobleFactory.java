package com.example.demo.models;

public class NotificacionDobleFactory extends NotificacionFactory{
    @Override
    public Notificacion crearNotificacion() {
        return new NotificacionDoble(new SMS(), new CorreoElectronico());
    }
}
