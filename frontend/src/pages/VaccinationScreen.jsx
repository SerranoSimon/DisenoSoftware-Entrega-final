import React, { useState } from 'react';
import { ArrowLeft, ChevronRight, User, Calendar, Syringe, AlertCircle, CheckCircle, X } from 'lucide-react';
import { fmtDateShort, initials } from '../lib/utils';

export function VaccinationScreen({ appointment, onBack }) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    vaccineId: "auto",
    dose: "1",
    date: new Date().toISOString().split("T")[0],
    observations: "",
  });

  const a = appointment;

  if (submitted) {
    return (
      <div className="max-w-[480px] mx-auto mt-16">
        <div className="bg-white rounded-2xl border shadow-sm p-10 text-center" style={{ borderColor: "#E2E8F0" }}>
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={34} className="text-emerald-500" />
          </div>
          <h2 className="text-[18px] font-bold text-slate-900 mb-2">Vacunación registrada correctamente.</h2>
          <p className="text-[12px] text-slate-500 mb-7 leading-relaxed">El registro ha sido guardado en el sistema. El paciente recibirá su comprobante de vacunación.</p>
          <div className="rounded-xl border p-5 text-left mb-7 space-y-3" style={{ background: "#F8FAFC", borderColor: "#E2E8F0" }}>
            {[
              { label: "Paciente", value: a.patient.name },
              { label: "RUT", value: a.patient.rut },
              { label: "Vacuna", value: a.vaccine.name },
              { label: "Dosis N.°", value: form.dose },
              { label: "Fecha", value: fmtDateShort(form.date) },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-start gap-3">
                <span className="text-[11px] text-slate-500 font-semibold flex-shrink-0">{label}</span>
                <span className="text-[12px] text-slate-900 font-bold text-right">{value}</span>
              </div>
            ))}
          </div>
          <button onClick={onBack}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-[12px] font-bold rounded-xl transition-all">
            Volver a Mis Citas
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[860px] mx-auto">
      <button onClick={onBack} className="flex items-center gap-1.5 text-[12px] text-slate-500 hover:text-slate-700 mb-5 transition-colors font-medium">
        <ArrowLeft size={14} /><span>Mis Citas</span><ChevronRight size={12} className="text-slate-300" /><span>Detalle {a.id}</span><ChevronRight size={12} className="text-slate-300" /><span className="text-slate-900">Registrar Vacunación</span>
      </button>
      <div className="mb-5">
        <h2 className="text-lg font-bold text-slate-900">Registrar Vacunación</h2>
        <p className="text-[12px] text-slate-500">Cita {a.id} · {a.patient.name} · {fmtDateShort(a.date)} · {a.time} hrs.</p>
      </div>

      <div className="grid grid-cols-[280px_1fr] gap-5">
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border shadow-sm p-5" style={{ borderColor: "#E2E8F0" }}>
            <h3 className="text-[12px] font-bold text-slate-900 mb-4 flex items-center gap-2">
              <User size={14} className="text-blue-500" />Información del Paciente
            </h3>
            <div className="flex items-center gap-3 mb-4 pb-4 border-b" style={{ borderColor: "#F1F5F9" }}>
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-extrabold text-blue-700">{initials(a.patient.name)}</span>
              </div>
              <div>
                <div className="font-bold text-[12px] text-slate-900 leading-snug">{a.patient.name}</div>
                <div className="text-[10px] text-slate-500">RUT: {a.patient.rut}</div>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { label: "Fecha de nacimiento", value: a.patient.dob },
                { label: "Edad", value: `${a.patient.age} años` },
                { label: "Teléfono", value: a.patient.phone },
                { label: "Vacunaciones previas", value: `${a.patient.prevVaccinations} registradas` },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</div>
                  <div className="text-[11px] text-slate-800 font-semibold mt-0.5">{value}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl border shadow-sm p-5" style={{ borderColor: "#E2E8F0" }}>
            <h3 className="text-[12px] font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Calendar size={14} className="text-blue-500" />Cita Asociada
            </h3>
            <div className="space-y-3">
              {[
                { label: "N.° de cita", value: a.id },
                { label: "Centro", value: a.center.name },
                { label: "Campaña", value: a.campaign.name },
                { label: "Agendado", value: `${fmtDateShort(a.date)} · ${a.time} hrs.` },
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
                {a.vaccine.name}
                <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200 flex-shrink-0">{a.vaccine.id}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-semibold text-slate-700 mb-1.5">Número de dosis</label>
                <select value={form.dose} onChange={(e) => setForm({ ...form, dose: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-400/25 focus:border-blue-400 bg-white transition-all font-medium text-slate-800"
                  style={{ borderColor: "#E2E8F0" }}>
                  <option value="1">1.ª dosis</option>
                  <option value="2">2.ª dosis</option>
                  <option value="3">3.ª dosis (refuerzo)</option>
                  <option value="4">4.ª dosis</option>
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-slate-700 mb-1.5">Fecha de vacunación</label>
                <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-400/25 focus:border-blue-400 bg-white transition-all font-medium text-slate-800"
                  style={{ borderColor: "#E2E8F0" }} />
              </div>
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-slate-700 mb-1.5">
                Observaciones <span className="text-[11px] font-normal text-slate-400">(opcional)</span>
              </label>
              <textarea value={form.observations} onChange={(e) => setForm({ ...form, observations: e.target.value })} rows={4}
                placeholder="Reacciones adversas, indicaciones post-vacunación, condiciones del paciente…"
                className="w-full px-4 py-3 rounded-xl border text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-400/25 focus:border-blue-400 transition-all resize-none"
                style={{ background: "#F8FAFC", borderColor: "#E2E8F0" }} />
            </div>
            <div className="flex gap-3 p-4 rounded-xl border bg-amber-50 border-amber-100">
              <AlertCircle size={14} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-amber-700 leading-relaxed">Verifique los datos del paciente, el número de lote y la dosis antes de registrar. Este registro no podrá ser eliminado una vez confirmado.</p>
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 mt-6 pt-5 border-t" style={{ borderColor: "#F1F5F9" }}>
            <button onClick={onBack} className="flex items-center gap-2 px-5 py-2.5 text-[12px] font-bold text-slate-600 border rounded-xl hover:bg-slate-50 transition-all" style={{ borderColor: "#E2E8F0" }}>
              <X size={14} />Cancelar
            </button>
            <button onClick={() => setSubmitted(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[12px] font-bold rounded-xl transition-all duration-150 shadow-sm hover:shadow-md">
              <CheckCircle size={14} />Registrar Vacunación
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}