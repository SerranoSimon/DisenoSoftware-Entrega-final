package com.example.demo.models;

public class NotificacionDoble implements  Notificacion{
    private SMS sms;
    private CorreoElectronico correo;

    public NotificacionDoble(SMS sms, CorreoElectronico correo) {
        this.sms = sms;
        this.correo = correo;
    }

    @Override
    public void enviarMensaje(String mensaje) {
        sms.enviarMensaje(mensaje);
        correo.enviarMensaje(mensaje);
    }
}
