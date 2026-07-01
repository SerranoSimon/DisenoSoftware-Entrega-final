package com.example.demo.models;

public class NotificacionDoble implements  Notificacion{
    private SMS sms;
    private CorreoElectronico correo;

    public NotificacionDoble(SMS sms, CorreoElectronico correo) {
        this.sms = sms;
        this.correo = correo;
    }

    @Override
    public void enviarMensaje(DatosContactoDestinatario destinatario, String mensaje) {
        sms.enviarMensaje(destinatario, mensaje);
        correo.enviarMensaje(destinatario, mensaje);
    }

}
