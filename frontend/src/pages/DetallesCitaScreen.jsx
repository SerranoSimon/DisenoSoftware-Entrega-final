import React, { useEffect, useState } from 'react';
import { ArrowLeft, ChevronRight, UserX, Syringe, CheckCircle, AlertCircle, User, Building2, Loader2 } from 'lucide-react';
import { ApptStatusBadge } from '../components/ApptStatusBadge';
import { fmtDate, initials } from '../lib/utils';
import { getCita, marcarInasistencia } from '../api/citaService';
import { apiError } from '../api/axiosConfig';
import { ConfirmDialog } from '../components/ConfirmDialog';

export function DetalleCitaScreen({ citaId, rol, onBack, onRegisterVaccination }) {
  const esFuncionario = rol === 'FUNCIONARIO';
  const [cita, setCita] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [marcando, setMarcando] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    let activo = true;
    setLoading(true);
    getCita(citaId)
      .then((c) => { if (activo) setCita(c); })
      .catch((err) => { if (activo) setError(apiError(err, "No se pudo cargar la cita.")); })
      .finally(() => { if (activo) setLoading(false); });
    return () => { activo = false; };
  }, [citaId]);

  async function handleMarkAbsent() {
    setMarcando(true);
    setActionError("");
    try {
      await marcarInasistencia(citaId);
      const actualizada = await getCita(citaId);
      setCita(actualizada);
    } catch (err) {
      setActionError(apiError(err, "No se pudo marcar la inasistencia."));
    } finally {
      setMarcando(false);
      setConfirmOpen(false);
    }
  }

  if (loading) {
    return <div className="py-20 text-center"><Loader2 size={30} className="text-slate-300 mx-auto animate-spin" /></div>;
  }
  if (error || !cita) {
    return (
      <div className="max-w-[860px] mx-auto">
        <button onClick={onBack} className="flex items-center gap-1.5 text-[12px] text-slate-500 hover:text-slate-700 mb-5 font-medium"><ArrowLeft size={14} />Volver</button>
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex gap-3">
          <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-[12px] text-red-700 font-medium">{error || "Cita no encontrada."}</p>
        </div>
      </div>
    );
  }

  const puedeAtender = esFuncionario && cita.status === "scheduled";

  return (
    <div className="max-w-[860px] mx-auto">
      <button onClick={onBack} className="flex items-center gap-1.5 text-[12px] text-slate-500 hover:text-slate-700 mb-5 transition-colors font-medium">
        <ArrowLeft size={14} /><span>Volver</span><ChevronRight size={12} className="text-slate-300" /><span className="text-slate-900">{cita.displayId}</span>
      </button>

      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Detalle de Cita {cita.displayId}</h2>
          <p className="text-[12px] text-slate-500 mt-0.5">{fmtDate(cita.fecha)} · {cita.hora} hrs.</p>
        </div>
        <div className="flex items-center gap-3">
          <ApptStatusBadge status={cita.status} />
          {puedeAtender && (
            <>
              <button onClick={() => { setActionError(""); setConfirmOpen(true); }} disabled={marcando}
                className="flex items-center gap-2 px-4 py-2.5 text-[12px] font-bold text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-all disabled:opacity-50">
                {marcando ? <Loader2 size={14} className="animate-spin" /> : <UserX size={14} />}Marcar Inasistente
              </button>
              <button onClick={onRegisterVaccination}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[12px] font-bold rounded-xl transition-all shadow-sm hover:shadow-md">
                <Syringe size={14} />Registrar Vacunación
              </button>
            </>
          )}
          {cita.status === "completed" && (
            <span className="px-4 py-2.5 text-[12px] font-bold text-emerald-700 border border-emerald-200 bg-emerald-50 rounded-xl flex items-center gap-2">
              <CheckCircle size={14} />Vacunación registrada
            </span>
          )}
          {cita.status === "missed" && (
            <span className="px-4 py-2.5 text-[12px] font-bold text-red-600 border border-red-200 bg-red-50 rounded-xl flex items-center gap-2">
              <UserX size={14} />Paciente inasistente
            </span>
          )}
        </div>
      </div>

      {actionError && (
        <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl flex gap-3">
          <AlertCircle size={15} className="text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-[12px] text-red-700 font-medium">{actionError}</p>
        </div>
      )}

      <div className="grid grid-cols-[280px_1fr] gap-5">
        {/* Left */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border shadow-sm p-5" style={{ borderColor: "#E2E8F0" }}>
            <h3 className="text-[12px] font-bold text-slate-900 mb-4 flex items-center gap-2">
              <User size={14} className="text-blue-500" />Paciente
            </h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-extrabold text-blue-700">{initials(cita.pacienteNombre)}</span>
              </div>
              <div>
                <div className="font-bold text-[12px] text-slate-900 leading-snug">{cita.pacienteNombre}</div>
                <div className="text-[10px] text-slate-500">RUT: {cita.pacienteRUT}</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border shadow-sm p-5" style={{ borderColor: "#E2E8F0" }}>
            <h3 className="text-[12px] font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Building2 size={14} className="text-blue-500" />Centro de Vacunación
            </h3>
            <div className="space-y-3">
              {[
                { label: "Centro", value: cita.centroNombre },
                { label: "Dirección", value: cita.centroDireccion },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</div>
                  <div className="text-[11px] text-slate-800 font-semibold mt-0.5 leading-snug">{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5">
            <div className="text-blue-200 text-[10px] font-bold uppercase tracking-wider mb-1">Información de la Cita</div>
            <div className="text-white text-[18px] font-bold">{cita.displayId}</div>
          </div>
          <div className="p-6 space-y-0">
            {[
              { label: "Vacuna asignada", value: cita.vacunaTipo },
              { label: "Profesional", value: cita.funcionarioNombre },
              { label: "Fecha de la cita", value: fmtDate(cita.fecha) },
              { label: "Hora", value: `${cita.hora} hrs.` },
              { label: "Estado actual", value: null },
            ].map(({ label, value }, i, arr) => (
              <div key={label} className={`flex items-center gap-4 py-3.5 ${i < arr.length - 1 ? "border-b" : ""}`} style={{ borderColor: "#F1F5F9" }}>
                <span className="text-[12px] font-semibold text-slate-500 w-48 flex-shrink-0">{label}</span>
                {value !== null ? (
                  <span className="text-[12px] font-bold text-slate-900">{value || "—"}</span>
                ) : (
                  <ApptStatusBadge status={cita.status} />
                )}
              </div>
            ))}
          </div>

          {puedeAtender && (
            <div className="px-6 pb-6">
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex gap-3 mt-2">
                <AlertCircle size={15} className="text-blue-500 flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-blue-700 leading-relaxed">
                  Para registrar la vacuna administrada, presione <strong>"Registrar Vacunación"</strong>. Para registrar su inasistencia, use <strong>"Marcar Inasistente"</strong>.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Marcar cita como inasistida"
        message={`¿Confirma que ${cita.pacienteNombre} no se presentó a la cita? Esta acción no se puede deshacer.`}
        confirmLabel="Sí, marcar inasistencia"
        tone="danger"
        loading={marcando}
        onConfirm={handleMarkAbsent}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
