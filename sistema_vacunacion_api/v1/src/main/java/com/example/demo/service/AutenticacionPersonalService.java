package com.example.demo.service;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.demo.dto.LoginResponseDTO;
import com.example.demo.models.FuncSalud;
import com.example.demo.repository.FuncSaludRepo;
import com.example.demo.security.JwtService;

import lombok.AllArgsConstructor;

// Componente de autenticación del personal del sistema 
@Service
@AllArgsConstructor
public class AutenticacionPersonalService {

    private final FuncSaludRepo funcSaludRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public LoginResponseDTO login(String rut, String password) {
        // Mismo mensaje si el RUT no existe o la contraseña falla, para no revelar qué RUTs existen
        FuncSalud funcSalud = funcSaludRepo.findById(rut)
                .orElseThrow(() -> new BadCredentialsException("Credenciales inválidas"));
        if (funcSalud.getPassword() == null || !passwordEncoder.matches(password, funcSalud.getPassword())) {
            throw new BadCredentialsException("Credenciales inválidas");
        }
        return new LoginResponseDTO(jwtService.generarToken(rut, "FUNCIONARIO"), "FUNCIONARIO");
    }
}
