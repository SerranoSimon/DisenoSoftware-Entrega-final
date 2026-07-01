package com.example.demo.models;

public interface Notificable {
    NotificacionPreferencia getNotificacionPreferencia();
    String getMensajeCita(Cita cita);
    DatosContactoDestinatario getDatosContactoDestinatario();

}