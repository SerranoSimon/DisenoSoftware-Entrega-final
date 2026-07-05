import React from 'react';
import { Bell, ChevronDown } from 'lucide-react';

export function TopBar({ rol }) {
  const esFuncionario = rol === 'FUNCIONARIO';
  return (
    <header className="h-[56px] flex items-center px-6 gap-4 flex-shrink-0 border-b" style={{ background: "#fff", borderColor: "#E2E8F0" }}>
      <div className="flex-1 min-w-0">
        <span className="text-[12px] font-semibold text-slate-600 truncate block">Sistema de Gestión de Campañas de Vacunación</span>
      </div>
      <button className="relative p-2 rounded-lg hover:bg-slate-50 transition-colors">
        <Bell size={17} className="text-slate-500" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
      </button>
      <div className="flex items-center gap-2.5 pl-3 border-l" style={{ borderColor: "#E2E8F0" }}>
        <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
          <span className="text-[10px] font-extrabold text-blue-700">{esFuncionario ? 'FS' : 'PA'}</span>
        </div>
        <div>
          <div className="text-[12px] font-semibold text-slate-800 leading-none">{esFuncionario ? 'Personal de salud' : 'Paciente'}</div>
          <div className="text-[10px] text-slate-400 leading-none mt-0.5">MINSAL · Chile</div>
        </div>
        <ChevronDown size={13} className="text-slate-400" />
      </div>
    </header>
  );
}
