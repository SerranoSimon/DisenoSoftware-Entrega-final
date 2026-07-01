package com.example.demo.models;

public interface Notificacion {
    public void enviarMensaje(DatosContactoDestinatario destinatario, String asunto, String mensaje);
}
