package com.example.demo.security;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

// límite de requests por minuto por ip
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class RateLimitFilter extends OncePerRequestFilter {

    private final int maxLogin;
    private final int maxEscritura;
    private final int maxLecturaCitas;
    private final int maxGeneral;
    private final Map<String, Contador> contadores = new ConcurrentHashMap<>();

    public RateLimitFilter(
            @Value("${app.rate-limit.login-por-minuto}") int maxLogin,
            @Value("${app.rate-limit.escritura-por-minuto}") int maxEscritura,
            @Value("${app.rate-limit.lectura-citas-por-minuto}") int maxLecturaCitas,
            @Value("${app.rate-limit.general-por-minuto}") int maxGeneral) {
        this.maxLogin = maxLogin;
        this.maxEscritura = maxEscritura;
        this.maxLecturaCitas = maxLecturaCitas;
        this.maxGeneral = maxGeneral;
    }

    private static class Contador {
        final long ventana;
        final AtomicInteger cuenta = new AtomicInteger(0);

        Contador(long ventana) {
            this.ventana = ventana;
        }
    }

    // clasifica la ruta en su grupo 
    private String grupoDe(HttpServletRequest request) {
    
        String ruta = request.getRequestURI().substring(request.getContextPath().length());
        String metodo = request.getMethod();
        if (ruta.startsWith("/login")) {
            return "login";
        }
        if ("POST".equals(metodo) && (ruta.equals("/citas") || ruta.equals("/vacunaciones"))) {
            return "escritura";
        }
        if ("GET".equals(metodo) && ruta.startsWith("/citas")) {
            return "lectura-citas";
        }
        return "general";
    }

    private int limiteDe(String grupo) {
        return switch (grupo) {
            case "login" -> maxLogin;
            case "escritura" -> maxEscritura;
            case "lectura-citas" -> maxLecturaCitas;
            default -> maxGeneral;
        };
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        long ventanaActual = System.currentTimeMillis() / 60_000; // número de minuto actual
        String grupo = grupoDe(request);
        String claveContador = request.getRemoteAddr() + "|" + grupo;

        Contador contador = contadores.compute(claveContador,
                (k, c) -> (c == null || c.ventana != ventanaActual) ? new Contador(ventanaActual) : c);

        if (contador.cuenta.incrementAndGet() > limiteDe(grupo)) {
            response.setStatus(429); // Too Many Requests
            response.setContentType("application/json");
            response.getWriter().write("{\"error\":\"Demasiadas solicitudes, intente en un minuto\"}");
            return;
        }
        filterChain.doFilter(request, response);
    }
}
