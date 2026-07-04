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

// Límite de requests por minuto por IP (ventana fija, en memoria), el máximo se configura en application.properties.
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class RateLimitFilter extends OncePerRequestFilter {

    private final int maxPorMinuto;
    private final Map<String, Contador> contadores = new ConcurrentHashMap<>();

    public RateLimitFilter(@Value("${app.rate-limit.requests-por-minuto}") int maxPorMinuto) {
        this.maxPorMinuto = maxPorMinuto;
    }

    private static class Contador {
        final long ventana;
        final AtomicInteger cuenta = new AtomicInteger(0);

        Contador(long ventana) {
            this.ventana = ventana;
        }
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        long ventanaActual = System.currentTimeMillis() / 60_000; // número de minuto actual
        String ip = request.getRemoteAddr();

        Contador contador = contadores.compute(ip,
                (k, c) -> (c == null || c.ventana != ventanaActual) ? new Contador(ventanaActual) : c);

        if (contador.cuenta.incrementAndGet() > maxPorMinuto) {
            response.setStatus(429); // Too Many Requests
            response.setContentType("application/json");
            response.getWriter().write("{\"error\":\"Demasiadas solicitudes, intente en un minuto\"}");
            return;
        }
        filterChain.doFilter(request, response);
    }
}
