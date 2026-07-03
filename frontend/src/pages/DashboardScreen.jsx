import React from 'react';
import { Syringe, Calendar, Building2, Package, ChevronRight, ListChecks } from 'lucide-react';
import { ApptStatusBadge } from '../components/ApptStatusBadge';
import { APPOINTMENTS , CENTERS , CAMPAIGNS } from '../models/data';

export function DashboardScreen({ setScreen }) {
  const stats = [
    { label: "Vacunas aplicadas hoy", value: "1,247", change: "+12%", up: true, icon: Syringe, color: "blue" },
    { label: "Citas agendadas", value: "342", change: "+5%", up: true, icon: Calendar, color: "emerald" },
    { label: "Centros activos", value: "28", change: "±0%", up: null, icon: Building2, color: "violet" },
    { label: "Stock total (dosis)", value: "48,320", change: "-2%", up: false, icon: Package, color: "orange" },
  ];
  const iconCls = {
    blue: "bg-blue-50 text-blue-600", emerald: "bg-emerald-50 text-emerald-600",
    violet: "bg-violet-50 text-violet-600", orange: "bg-orange-50 text-orange-600",
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Dashboard</h2>
        <p className="text-[12px] text-slate-500">Jueves, 3 de julio de 2025 · Resumen de actividad diaria</p>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {stats.map(({ label, value, change, up, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl border shadow-sm p-5" style={{ borderColor: "#E2E8F0" }}>
            <div className="flex items-start justify-between mb-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconCls[color]}`}><Icon size={17} /></div>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${up === true ? "bg-emerald-50 text-emerald-600" : up === false ? "bg-red-50 text-red-500" : "bg-slate-100 text-slate-500"}`}>{change}</span>
            </div>
            <div className="text-[22px] font-extrabold text-slate-900 tracking-tight">{value}</div>
            <div className="text-[11px] text-slate-500 mt-0.5 font-medium">{label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
        <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: "#F1F5F9" }}>
          <h3 className="text-[13px] font-bold text-slate-900">Citas recientes</h3>
          <button onClick={() => setScreen("misCitas")} className="text-[11px] text-blue-600 hover:text-blue-700 font-bold transition-colors">Ver todo →</button>
        </div>
        <table className="w-full">
          <thead>
            <tr style={{ background: "#F8FAFC" }}>
              {["Paciente", "Vacuna", "Centro", "Hora", "Estado"].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b" style={{ borderColor: "#F1F5F9" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {APPOINTMENTS.slice(0, 5).map((a, i) => (
              <tr key={i} className="border-b hover:bg-slate-50/60 transition-colors" style={{ borderColor: "#F8FAFC" }}>
                <td className="px-5 py-3.5">
                  <div className="font-semibold text-[12px] text-slate-900">{a?.patient?.name || "Sin nombre"}</div>
                  <div className="text-[10px] text-slate-400">{a.patient.rut}</div>
                </td>
                <td className="px-5 py-3.5 text-[12px] text-slate-700 font-medium">{a.campaign?.name || "N/A"}</td>
                <td className="px-5 py-3.5 text-[12px] text-slate-600">{a.center.name}</td>
                <td className="px-5 py-3.5 text-[12px] text-slate-600 font-medium">{a.time} hrs.</td>
                <td className="px-5 py-3.5"><ApptStatusBadge status={a.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Agendar cita", desc: "Crear nueva cita de vacunación", icon: Calendar, screen: "appointment", from: "from-blue-600", to: "to-blue-700" },
          { label: "Centros de Vacunación", desc: "Ver stock y disponibilidad", icon: Building2, screen: "centers", from: "from-indigo-600", to: "to-indigo-700" },
          { label: "Mis Citas", desc: "Gestionar citas y registrar", icon: ListChecks, screen: "misCitas", from: "from-emerald-600", to: "to-emerald-700" },
        ].map(({ label, desc, icon: Icon, screen, from, to }) => (
          <button key={label} onClick={() => setScreen(screen)}
            className={`flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-br ${from} ${to} text-white text-left transition-all duration-150 shadow-sm hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0`}>
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0"><Icon size={20} /></div>
            <div>
              <div className="font-bold text-[13px]">{label}</div>
              <div className="text-[11px] text-white/70 mt-0.5">{desc}</div>
            </div>
            <ChevronRight size={16} className="ml-auto text-white/50" />
          </button>
        ))}
      </div>
    </div>
  );
}