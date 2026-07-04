package com.example.demo.service;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.demo.dto.LoginResponseDTO;
import com.example.demo.models.Paciente;
import com.example.demo.repository.PacienteRepo;
import com.example.demo.security.JwtService;

import lombok.AllArgsConstructor;

// Componente de autenticación de pacientes 
@Service
@AllArgsConstructor
public class AutenticacionPacientesService {

    private final PacienteRepo pacienteRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public LoginResponseDTO login(String rut, String password) {
        // Mismo mensaje si el RUT no existe o la contraseña falla, para no revelar qué RUTs existen
        Paciente paciente = pacienteRepo.findById(rut)
                .orElseThrow(() -> new BadCredentialsException("Credenciales inválidas"));
        if (paciente.getPassword() == null || !passwordEncoder.matches(password, paciente.getPassword())) {
            throw new BadCredentialsException("Credenciales inválidas");
        }
        return new LoginResponseDTO(jwtService.generarToken(rut, "PACIENTE"), "PACIENTE");
    }
}
