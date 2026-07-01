package com.example.demo.models;

public class CorreoElectronico implements Notificacion{
    @Override
    public void enviarMensaje(String mensaje) {
        System.out.println("Mensaje enviado por correo, con el siguiente contenido: "+ mensaje);

    }
}
