package com.example.demo.service;

import java.util.Optional;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.demo.dto.LoginResponseDTO;
import com.example.demo.models.FuncSalud;
import com.example.demo.models.Paciente;
import com.example.demo.models.Usuario;
import com.example.demo.repository.FuncSaludRepo;
import com.example.demo.repository.PacienteRepo;
import com.example.demo.security.JwtService;

import lombok.AllArgsConstructor;

// Clase experta en autenticar usuarios y emitir su token.
@Service
@AllArgsConstructor
public class AuthService {

    private final PacienteRepo pacienteRepo;
    private final FuncSaludRepo funcSaludRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    // El rol se deduce de la tabla donde está el RUT. Cuando existan los otros roles  basta con agregar su búsqueda aquí
    public LoginResponseDTO login(String rut, String password) {
        Usuario usuario;
        String rol;

        Optional<Paciente> paciente = pacienteRepo.findById(rut);
        Optional<FuncSalud> funcSalud = funcSaludRepo.findById(rut);
        if (paciente.isPresent()) {
            usuario = paciente.get();
            rol = "PACIENTE";
        } else if (funcSalud.isPresent()) {
            usuario = funcSalud.get();
            rol = "FUNCIONARIO";
        } else {
            // Mismo mensaje que una contraseña incorrecta para no revelar qué ruts existen
            throw new BadCredentialsException("Credenciales inválidas");
        }

        if (usuario.getPassword() == null || !passwordEncoder.matches(password, usuario.getPassword())) {
            throw new BadCredentialsException("Credenciales inválidas");
        }

        String token = jwtService.generarToken(rut, rol);
        return new LoginResponseDTO(token, rol);
    }
}
