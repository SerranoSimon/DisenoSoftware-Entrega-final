import React from 'react';
import { Shield, LogOut, LayoutDashboard, Calendar, ListChecks } from 'lucide-react';

// Menú según el rol autenticado.
const NAV_BY_ROL = {
  PACIENTE: [
    { id: 'dashboard', label: 'Inicio', icon: LayoutDashboard },
    { id: 'appointment', label: 'Agendar Cita', icon: Calendar },
    { id: 'misCitas', label: 'Mis Citas', icon: ListChecks },
  ],
  FUNCIONARIO: [
    { id: 'atender', label: 'Citas a atender', icon: ListChecks },
  ],
};

export function Sidebar({ rol, active, setScreen, onLogout }) {
  const nav = NAV_BY_ROL[rol] || [];
  // El detalle/vacunación se resaltan según la lista de la que provienen.
  const visibleActive = (['detalleCita', 'vaccination']).includes(active)
    ? (rol === 'FUNCIONARIO' ? 'atender' : 'misCitas')
    : active;

  return (
    <aside className="w-[232px] flex-shrink-0 flex flex-col h-full border-r" style={{ background: "#fff", borderColor: "#E2E8F0" }}>
      <div className="flex items-center gap-3 px-5 h-[56px] border-b" style={{ borderColor: "#E2E8F0" }}>
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-sm">
          <Shield size={16} className="text-white" />
        </div>
        <div>
          <div className="text-[11px] font-extrabold text-blue-700 tracking-wide leading-none">MINSAL</div>
          <div className="text-[10px] text-slate-400 leading-none mt-0.5">Gov. de Chile</div>
        </div>
      </div>
      <nav className="flex-1 py-3 px-3 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest px-3 mb-2">Módulos</p>
        {nav.map(({ id, label, icon: Icon }) => {
          const isActive = visibleActive === id;
          return (
            <button key={id} onClick={() => setScreen(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 text-left group ${isActive ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
            >
              <Icon size={17} className={isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"} />
              <span className="flex-1 truncate">{label}</span>
            </button>
          );
        })}
      </nav>
      <div className="border-t p-3" style={{ borderColor: "#E2E8F0" }}>
        <button onClick={onLogout}
          className="w-full flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors text-left">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-extrabold text-blue-700">{rol === 'FUNCIONARIO' ? 'FS' : 'PA'}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[12px] font-semibold text-slate-800 truncate">{rol === 'FUNCIONARIO' ? 'Personal de salud' : 'Paciente'}</div>
            <div className="text-[10px] text-slate-400 truncate">Cerrar sesión</div>
          </div>
          <LogOut size={14} className="text-slate-400 flex-shrink-0" />
        </button>
      </div>
    </aside>
  );
}
