package com.example.demo.models;

public class SMS implements Notificacion {
    //necesita numero
    @Override
    public void enviarMensaje(String mensaje) {
        System.out.println("Mensaje enviado por SMS, con el siguiente contenido: "+ mensaje);
    }

}
