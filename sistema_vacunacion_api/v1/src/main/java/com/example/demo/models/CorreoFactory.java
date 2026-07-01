package com.example.demo.models;

public class CorreoFactory extends NotificacionFactory{
    public Notificacion crearNotificacion() {
        return new CorreoElectronico();
    }
}
