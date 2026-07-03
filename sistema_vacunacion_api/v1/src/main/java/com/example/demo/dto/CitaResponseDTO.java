package com.example.demo.dto;

import com.example.demo.models.Cita;

import java.time.LocalDateTime;

public record CitaResponseDTO(
        Long id,
        String estado,
        LocalDateTime fechaHora,
        String centroNombre,
        String centroDireccion,
        String vacunaTipo,
        String funcionarioNombre,
        String pacienteNombre,
        String pacienteRUT
) {
    public static CitaResponseDTO from(Cita cita) {
        return new CitaResponseDTO(
                cita.getIdCita(),
                cita.getEstado().name(),
                cita.getFecha_hora(),
                cita.getCentroVacunacion().getNombre(),
                cita.getCentroVacunacion().getDireccion(),
                cita.getVacuna().getTipoVacuna().getNombre(),
                cita.getFuncSalud().getNombres() + " " + cita.getFuncSalud().getApellidos(),
                cita.getPaciente().getNombres() + " " + cita.getPaciente().getApellidos(),
                cita.getPaciente().getRUT()
        );
    }
}
