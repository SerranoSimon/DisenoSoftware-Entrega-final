import React, { useEffect, useState } from 'react';
import { Syringe, Calendar, CheckCircle, UserX, ChevronRight, ListChecks, Loader2, AlertCircle } from 'lucide-react';
import { ApptStatusBadge } from '../components/ApptStatusBadge';
import { fmtDateShort } from '../lib/utils';
import { getMisCitas } from '../api/citaService';
import { apiError } from '../api/axiosConfig';

export function DashboardScreen({ setScreen, onViewDetail }) {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let activo = true;
    getMisCitas()
      .then((data) => { if (activo) setCitas(data); })
      .catch((err) => { if (activo) setError(apiError(err, "No se pudieron cargar sus citas.")); })
      .finally(() => { if (activo) setLoading(false); });
    return () => { activo = false; };
  }, []);

  const count = (status) => citas.filter((c) => c.status === status).length;
  const stats = [
    { label: "Citas agendadas", value: count("scheduled"), icon: Calendar, color: "blue" },
    { label: "Vacunaciones completadas", value: count("completed"), icon: CheckCircle, color: "emerald" },
    { label: "Inasistencias", value: count("missed"), icon: UserX, color: "red" },
    { label: "Total de citas", value: citas.length, icon: Syringe, color: "violet" },
  ];
  const iconCls = {
    blue: "bg-blue-50 text-blue-600", emerald: "bg-emerald-50 text-emerald-600",
    violet: "bg-violet-50 text-violet-600", red: "bg-red-50 text-red-500",
  };

  const recientes = [...citas].sort((a, b) => (b.fechaHora || "").localeCompare(a.fechaHora || "")).slice(0, 5);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Inicio</h2>
        <p className="text-[12px] text-slate-500">Resumen de sus citas de vacunación</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex gap-3">
          <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-[12px] text-red-700 font-medium">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl border shadow-sm p-5" style={{ borderColor: "#E2E8F0" }}>
            <div className="flex items-start justify-between mb-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconCls[color]}`}><Icon size={17} /></div>
            </div>
            <div className="text-[22px] font-extrabold text-slate-900 tracking-tight">{loading ? "—" : value}</div>
            <div className="text-[11px] text-slate-500 mt-0.5 font-medium">{label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
        <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: "#F1F5F9" }}>
          <h3 className="text-[13px] font-bold text-slate-900">Citas recientes</h3>
          <button onClick={() => setScreen("misCitas")} className="text-[11px] text-blue-600 hover:text-blue-700 font-bold transition-colors">Ver todo →</button>
        </div>
        {loading ? (
          <div className="py-12 text-center"><Loader2 size={26} className="text-slate-300 mx-auto animate-spin" /></div>
        ) : recientes.length === 0 ? (
          <div className="py-12 text-center text-[13px] text-slate-400">Aún no tiene citas registradas.</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr style={{ background: "#F8FAFC" }}>
                {["N.° Cita", "Vacuna", "Centro", "Fecha", "Estado"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b" style={{ borderColor: "#F1F5F9" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recientes.map((c) => (
                <tr key={c.id} onClick={() => onViewDetail(c.id)} className="border-b hover:bg-slate-50/60 transition-colors cursor-pointer" style={{ borderColor: "#F8FAFC" }}>
                  <td className="px-5 py-3.5"><span className="text-[11px] font-bold text-slate-500 font-mono">{c.displayId}</span></td>
                  <td className="px-5 py-3.5 text-[12px] text-slate-700 font-medium">{c.vacunaTipo || "—"}</td>
                  <td className="px-5 py-3.5 text-[12px] text-slate-600">{c.centroNombre}</td>
                  <td className="px-5 py-3.5 text-[12px] text-slate-600 font-medium">{fmtDateShort(c.fecha)} · {c.hora}</td>
                  <td className="px-5 py-3.5"><ApptStatusBadge status={c.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[
          { label: "Agendar cita", desc: "Reservar una nueva hora de vacunación", icon: Calendar, screen: "appointment", from: "from-blue-600", to: "to-blue-700" },
          { label: "Mis Citas", desc: "Ver y gestionar mis citas", icon: ListChecks, screen: "misCitas", from: "from-emerald-600", to: "to-emerald-700" },
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
