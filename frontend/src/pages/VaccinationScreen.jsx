import React, { useEffect, useState } from 'react';
import { ArrowLeft, ChevronRight, User, Calendar, Syringe, AlertCircle, CheckCircle, X, Loader2 } from 'lucide-react';
import { fmtDate, initials } from '../lib/utils';
import { getCita } from '../api/citaService';
import { registrarVacunacion } from '../api/vacunacionService';
import { apiError } from '../api/axiosConfig';

export function VaccinationScreen({ citaId, onBack, onDone }) {
  const [cita, setCita] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [observations, setObservations] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [resultado, setResultado] = useState(null);

  useEffect(() => {
    let activo = true;
    getCita(citaId)
      .then((c) => { if (activo) setCita(c); })
      .catch((err) => { if (activo) setLoadError(apiError(err, "No se pudo cargar la cita.")); })
      .finally(() => { if (activo) setLoading(false); });
    return () => { activo = false; };
  }, [citaId]);

  async function handleSubmit() {
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await registrarVacunacion({ idCita: citaId, observaciones: observations });
      setResultado(res);
    } catch (err) {
      setSubmitError(apiError(err, "No se pudo registrar la vacunación."));
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <div className="py-20 text-center"><Loader2 size={30} className="text-slate-300 mx-auto animate-spin" /></div>;
  }
  if (loadError || !cita) {
    return (
      <div className="max-w-[860px] mx-auto">
        <button onClick={onBack} className="flex items-center gap-1.5 text-[12px] text-slate-500 hover:text-slate-700 mb-5 font-medium"><ArrowLeft size={14} />Volver</button>
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex gap-3">
          <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-[12px] text-red-700 font-medium">{loadError || "Cita no encontrada."}</p>
        </div>
      </div>
    );
  }

  if (resultado) {
    return (
      <div className="max-w-[480px] mx-auto mt-16">
        <div className="bg-white rounded-2xl border shadow-sm p-10 text-center" style={{ borderColor: "#E2E8F0" }}>
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={34} className="text-emerald-500" />
          </div>
          <h2 className="text-[18px] font-bold text-slate-900 mb-2">Vacunación registrada correctamente</h2>
          <p className="text-[12px] text-slate-500 mb-7 leading-relaxed">El registro ha sido guardado en el sistema.</p>
          <div className="rounded-xl border p-5 text-left mb-7 space-y-3" style={{ background: "#F8FAFC", borderColor: "#E2E8F0" }}>
            {[
              { label: "Paciente", value: cita.pacienteNombre },
              { label: "RUT", value: cita.pacienteRUT },
              { label: "Vacuna", value: cita.vacunaTipo },
              { label: "Dosis N.°", value: resultado.numDosis },
              { label: "Observaciones", value: resultado.observaciones || "—" },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-start gap-3">
                <span className="text-[11px] text-slate-500 font-semibold flex-shrink-0">{label}</span>
                <span className="text-[12px] text-slate-900 font-bold text-right">{value}</span>
              </div>
            ))}
          </div>
          <button onClick={onDone}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-[12px] font-bold rounded-xl transition-all">
            Volver al detalle
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[860px] mx-auto">
      <button onClick={onBack} className="flex items-center gap-1.5 text-[12px] text-slate-500 hover:text-slate-700 mb-5 transition-colors font-medium">
        <ArrowLeft size={14} /><span>Detalle {cita.displayId}</span><ChevronRight size={12} className="text-slate-300" /><span className="text-slate-900">Registrar Vacunación</span>
      </button>
      <div className="mb-5">
        <h2 className="text-lg font-bold text-slate-900">Registrar Vacunación</h2>
        <p className="text-[12px] text-slate-500">Cita {cita.displayId} · {cita.pacienteNombre} · {fmtDate(cita.fecha)} · {cita.hora} hrs.</p>
      </div>

      <div className="grid grid-cols-[280px_1fr] gap-5">
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
              <Calendar size={14} className="text-blue-500" />Cita Asociada
            </h3>
            <div className="space-y-3">
              {[
                { label: "N.° de cita", value: cita.displayId },
                { label: "Centro", value: cita.centroNombre },
                { label: "Agendado", value: `${fmtDate(cita.fecha)} · ${cita.hora} hrs.` },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</div>
                  <div className="text-[11px] text-slate-800 font-semibold mt-0.5 leading-snug">{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border shadow-sm p-6" style={{ borderColor: "#E2E8F0" }}>
          <h3 className="text-[13px] font-bold text-slate-900 mb-5 flex items-center gap-2">
            <Syringe size={15} className="text-blue-500" />Datos de la Vacunación Administrada
          </h3>
          <div className="space-y-5">
            <div>
              <label className="block text-[12px] font-semibold text-slate-700 mb-1.5">Vacuna administrada</label>
              <div className="w-full px-4 py-3 rounded-xl border text-[12px] font-semibold text-slate-800 flex items-center gap-2" style={{ background: "#F8FAFC", borderColor: "#E2E8F0" }}>
                <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                {cita.vacunaTipo || "Asignada por el sistema"}
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5">La vacuna y el número de dosis los determina el sistema según la cita.</p>
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-slate-700 mb-1.5">
                Observaciones <span className="text-[11px] font-normal text-slate-400">(opcional)</span>
              </label>
              <textarea value={observations} onChange={(e) => setObservations(e.target.value)} rows={4}
                placeholder="Reacciones adversas, indicaciones post-vacunación, condiciones del paciente…"
                className="w-full px-4 py-3 rounded-xl border text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-400/25 focus:border-blue-400 transition-all resize-none"
                style={{ background: "#F8FAFC", borderColor: "#E2E8F0" }} />
            </div>
            {submitError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex gap-3">
                <AlertCircle size={15} className="text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-[12px] text-red-700 font-medium">{submitError}</p>
              </div>
            )}
            <div className="flex gap-3 p-4 rounded-xl border bg-amber-50 border-amber-100">
              <AlertCircle size={14} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-amber-700 leading-relaxed">Verifique los datos del paciente antes de registrar. Este registro no podrá ser eliminado una vez confirmado.</p>
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 mt-6 pt-5 border-t" style={{ borderColor: "#F1F5F9" }}>
            <button onClick={onBack} className="flex items-center gap-2 px-5 py-2.5 text-[12px] font-bold text-slate-600 border rounded-xl hover:bg-slate-50 transition-all" style={{ borderColor: "#E2E8F0" }}>
              <X size={14} />Cancelar
            </button>
            <button onClick={handleSubmit} disabled={submitting}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white text-[12px] font-bold rounded-xl transition-all duration-150 shadow-sm hover:shadow-md">
              {submitting ? <><Loader2 size={14} className="animate-spin" />Registrando…</> : <><CheckCircle size={14} />Registrar Vacunación</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
