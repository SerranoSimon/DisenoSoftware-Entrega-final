import React, { useEffect, useState } from 'react';
import { Search, Calendar, CheckCircle, UserX, ChevronRight, CalendarCheck, Loader2, AlertCircle } from 'lucide-react';
import { ApptStatusBadge } from '../components/ApptStatusBadge';
import { initials, fmtDateShort } from "../lib/utils";
import { getMisCitas, getCitasAtender } from '../api/citaService';
import { apiError } from '../api/axiosConfig';

// Lista de citas reutilizable para el paciente (mode='mias') y el funcionario (mode='atender').
export function CitasListScreen({ mode = 'mias', onViewDetail }) {
  const esAtender = mode === 'atender';
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    let activo = true;
    setLoading(true);
    setError("");
    (esAtender ? getCitasAtender() : getMisCitas())
      .then((data) => { if (activo) setCitas(data); })
      .catch((err) => { if (activo) setError(apiError(err, "No se pudieron cargar las citas.")); })
      .finally(() => { if (activo) setLoading(false); });
    return () => { activo = false; };
  }, [esAtender]);

  const persona = (c) => esAtender ? c.pacienteNombre : c.funcionarioNombre;
  const personaRut = (c) => esAtender ? c.pacienteRUT : null;

  const filtered = citas.filter((c) => {
    const nombre = persona(c) || "";
    const matchesQ = !query || nombre.toLowerCase().includes(query.toLowerCase()) || String(c.id).includes(query);
    const matchesS = filterStatus === "all" || c.status === filterStatus;
    return matchesQ && matchesS;
  });

  const count = (status) => citas.filter((c) => c.status === status).length;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">{esAtender ? 'Citas a atender' : 'Mis Citas'}</h2>
          <p className="text-[12px] text-slate-500 mt-0.5">{loading ? 'Cargando…' : `${filtered.length} citas encontradas`}</p>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={esAtender ? "Buscar paciente o N.° cita…" : "Buscar por N.° de cita…"}
              className="pl-8 pr-4 py-2 text-[12px] bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400/25 focus:border-blue-400 transition-all w-56"
              style={{ borderColor: "#E2E8F0" }} />
          </div>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 text-[12px] bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400/25 focus:border-blue-400 transition-all font-medium text-slate-700"
            style={{ borderColor: "#E2E8F0" }}>
            <option value="all">Todos los estados</option>
            <option value="scheduled">Agendadas</option>
            <option value="completed">Completadas</option>
            <option value="missed">Inasistentes</option>
            <option value="cancelled">Canceladas</option>
          </select>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Agendadas", count: count("scheduled"), color: "blue", icon: Calendar },
          { label: "Completadas", count: count("completed"), color: "emerald", icon: CheckCircle },
          { label: "Inasistentes", count: count("missed"), color: "red", icon: UserX },
        ].map(({ label, count, color, icon: Icon }) => {
          const cls = { blue: "bg-blue-50 text-blue-600", emerald: "bg-emerald-50 text-emerald-600", red: "bg-red-50 text-red-500" };
          return (
            <div key={label} className="bg-white rounded-2xl border shadow-sm p-4 flex items-center gap-4" style={{ borderColor: "#E2E8F0" }}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${cls[color]}`}>
                <Icon size={18} />
              </div>
              <div>
                <div className="text-xl font-extrabold text-slate-900">{count}</div>
                <div className="text-[11px] text-slate-500 font-medium">{label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex gap-3">
          <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-[12px] text-red-700 font-medium">{error}</p>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
        <table className="w-full">
          <thead>
            <tr style={{ background: "#F8FAFC" }}>
              {["N.° Cita", esAtender ? "Paciente" : "Profesional", "Centro", "Vacuna", "Fecha y hora", "Estado", "Acción"].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b" style={{ borderColor: "#F1F5F9" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-b hover:bg-slate-50/60 transition-colors" style={{ borderColor: "#F8FAFC" }}>
                <td className="px-5 py-3.5">
                  <span className="text-[11px] font-bold text-slate-500 font-mono">{c.displayId}</span>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-[9px] font-extrabold text-blue-700">{initials(persona(c))}</span>
                    </div>
                    <div>
                      <div className="font-semibold text-[12px] text-slate-900">{persona(c) || "—"}</div>
                      {personaRut(c) && <div className="text-[10px] text-slate-400">{personaRut(c)}</div>}
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <div className="text-[12px] text-slate-700 font-medium max-w-[180px] truncate">{c.centroNombre}</div>
                  <div className="text-[10px] text-slate-400 max-w-[180px] truncate">{c.centroDireccion}</div>
                </td>
                <td className="px-5 py-3.5">
                  <div className="text-[12px] text-slate-700 font-medium">{c.vacunaTipo || "—"}</div>
                </td>
                <td className="px-5 py-3.5">
                  <div className="text-[12px] text-slate-700 font-medium">{fmtDateShort(c.fecha)}</div>
                  <div className="text-[10px] text-slate-400">{c.hora} hrs.</div>
                </td>
                <td className="px-5 py-3.5"><ApptStatusBadge status={c.status} /></td>
                <td className="px-5 py-3.5">
                  <button onClick={() => onViewDetail(c.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-all">
                    Ver detalle<ChevronRight size={12} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && (
          <div className="py-16 text-center">
            <Loader2 size={28} className="text-slate-300 mx-auto mb-3 animate-spin" />
            <p className="text-[13px] text-slate-400">Cargando citas…</p>
          </div>
        )}
        {!loading && filtered.length === 0 && !error && (
          <div className="py-16 text-center">
            <CalendarCheck size={32} className="text-slate-200 mx-auto mb-3" />
            <p className="text-[13px] text-slate-400">No se encontraron citas con los filtros seleccionados.</p>
          </div>
        )}
      </div>
    </div>
  );
}
