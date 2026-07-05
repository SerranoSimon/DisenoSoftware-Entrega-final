// Adaptadores entre los DTOs del backend y la forma que consumen las pantallas.

// EstadoCita del backend -> estado visual usado por ApptStatusBadge
export function estadoToStatus(estado) {
  switch (estado) {
    case 'VIGENTE': return 'scheduled';
    case 'COMPLETADA': return 'completed';
    case 'INASISTIDA': return 'missed';
    case 'CANCELADA': return 'cancelled';
    default: return 'scheduled';
  }
}

// "2026-07-06T10:00:00" -> { fecha: "2026-07-06", hora: "10:00" }
export function splitFechaHora(fechaHora) {
  if (!fechaHora) return { fecha: '', hora: '' };
  const [fecha, rest = ''] = fechaHora.split('T');
  return { fecha, hora: rest.slice(0, 5) };
}

// CitaResponseDTO -> objeto normalizado para las vistas
export function mapCita(dto) {
  const { fecha, hora } = splitFechaHora(dto.fechaHora);
  return {
    id: dto.id,
    displayId: `#${dto.id}`,
    estado: dto.estado,
    status: estadoToStatus(dto.estado),
    fechaHora: dto.fechaHora,
    fecha,
    hora,
    centroNombre: dto.centroNombre,
    centroDireccion: dto.centroDireccion,
    vacunaTipo: dto.vacunaTipo,
    funcionarioNombre: dto.funcionarioNombre,
    pacienteNombre: dto.pacienteNombre,
    pacienteRUT: dto.pacienteRUT,
  };
}
