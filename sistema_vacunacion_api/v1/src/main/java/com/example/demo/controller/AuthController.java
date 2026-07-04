package com.example.demo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.LoginRequestDTO;
import com.example.demo.dto.LoginResponseDTO;
import com.example.demo.service.AutenticacionPacientesService;
import com.example.demo.service.AutenticacionPersonalService;

import lombok.AllArgsConstructor;

// Deriva el login al componente de autenticación que corresponde, pacientes  o personal del sistema 
// unicos endpoints públicos.
// Si las credenciales fallan, los services lanzan BadCredentialsException y el GlobalExceptionHandler responde 401.
@RestController
@RequestMapping("/login")
@AllArgsConstructor
public class AuthController {

    private final AutenticacionPacientesService autenticacionPacientes;
    private final AutenticacionPersonalService autenticacionPersonal;

    @PostMapping("/paciente")
    public ResponseEntity<LoginResponseDTO> loginPaciente(@RequestBody LoginRequestDTO dto) {
        return ResponseEntity.ok(autenticacionPacientes.login(dto.rut(), dto.password()));
    }

    @PostMapping("/personal")
    public ResponseEntity<LoginResponseDTO> loginPersonal(@RequestBody LoginRequestDTO dto) {
        return ResponseEntity.ok(autenticacionPersonal.login(dto.rut(), dto.password()));
    }
}
