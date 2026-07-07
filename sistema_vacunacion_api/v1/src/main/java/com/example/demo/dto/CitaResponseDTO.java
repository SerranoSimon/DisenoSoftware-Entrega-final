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
        String nombreVacuna = "No asignada (perdió la reserva)";
        if (cita.getVacuna() != null && cita.getVacuna().getTipoVacuna() != null) {
            nombreVacuna = cita.getVacuna().getTipoVacuna().getNombre();
        }
        return new CitaResponseDTO(
                cita.getIdCita(),
                cita.getEstado().name(),
                cita.getFechaHora(),
                cita.getCentroVacunacion().getNombre(),
                cita.getCentroVacunacion().getDireccion(),
                nombreVacuna,
                cita.getFuncSalud().getNombres() + " " + cita.getFuncSalud().getApellidos(),
                cita.getPaciente().getNombres() + " " + cita.getPaciente().getApellidos(),
                cita.getPaciente().getRUT()
        );
    }
}
