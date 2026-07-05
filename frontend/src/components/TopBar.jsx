import React from 'react';
import { initials } from '../lib/utils';

export function TopBar({ rol, userName }) {
  const esFuncionario = rol === 'FUNCIONARIO';
  const rolLabel = esFuncionario ? 'Personal de salud' : 'Paciente';
  const nombre = userName || rolLabel;
  const avatar = userName ? initials(userName) : (esFuncionario ? 'FS' : 'PA');
  return (
    <header className="h-[56px] flex items-center px-6 gap-4 flex-shrink-0 border-b" style={{ background: "#fff", borderColor: "#E2E8F0" }}>
      <div className="flex-1 min-w-0">
        <span className="text-[12px] font-semibold text-slate-600 truncate block">Sistema de Gestión de Campañas de Vacunación</span>
      </div>
      <div className="flex items-center gap-2.5 pl-3 border-l" style={{ borderColor: "#E2E8F0" }}>
        <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
          <span className="text-[10px] font-extrabold text-blue-700">{avatar}</span>
        </div>
        <div>
          <div className="text-[12px] font-semibold text-slate-800 leading-none">{nombre}</div>
          <div className="text-[10px] text-slate-400 leading-none mt-0.5">{rolLabel}</div>
        </div>
      </div>
    </header>
  );
}
