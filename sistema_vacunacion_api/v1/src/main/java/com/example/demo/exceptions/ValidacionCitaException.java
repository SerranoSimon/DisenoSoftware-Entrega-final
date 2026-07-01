package com.example.demo.exceptions;


public class ValidacionCitaException extends RuntimeException {
    
    public ValidacionCitaException(String mensaje) {
        super(mensaje);
    }
}