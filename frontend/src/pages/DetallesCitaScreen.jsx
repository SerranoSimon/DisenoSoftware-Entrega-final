import React, { useState } from 'react';
import { ArrowLeft, ChevronRight, UserX, Syringe, CheckCircle, AlertCircle, User, Building2 } from 'lucide-react';
import { ApptStatusBadge } from '../components/ApptStatusBadge';
import { fmtDate, fmtDateShort, initials } from '../lib/utils';

export function DetalleCitaScreen({
  appointment,
  onBack,
  onRegisterVaccination,
  onMarkAbsent,
}) {
  const [markedAbsent, setMarkedAbsent] = useState(false);

  function handleMarkAbsent() {
    setMarkedAbsent(true);
    onMarkAbsent();
  }

  const a = appointment;

  return (
    <div className="max-w-[860px] mx-auto">
      {/* Breadcrumb */}
      <button onClick={onBack} className="flex items-center gap-1.5 text-[12px] text-slate-500 hover:text-slate-700 mb-5 transition-colors font-medium">
        <ArrowLeft size={14} /><span>Mis Citas</span><ChevronRight size={12} className="text-slate-300" /><span className="text-slate-900">{a.id}</span>
      </button>

      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Detalle de Cita {a.id}</h2>
          <p className="text-[12px] text-slate-500 mt-0.5">{fmtDate(a.date)} · {a.time} hrs.</p>
        </div>
        <div className="flex items-center gap-3">
          <ApptStatusBadge status={markedAbsent ? "missed" : a.status} />
          {a.status === "scheduled" && !markedAbsent && (
            <>
              <button onClick={handleMarkAbsent}
                className="flex items-center gap-2 px-4 py-2.5 text-[12px] font-bold text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-all">
                <UserX size={14} />Marcar Inasistente
              </button>
              <button onClick={onRegisterVaccination}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[12px] font-bold rounded-xl transition-all shadow-sm hover:shadow-md">
                <Syringe size={14} />Registrar Vacunación
              </button>
            </>
          )}
          {a.status === "completed" && (
            <span className="px-4 py-2.5 text-[12px] font-bold text-emerald-700 border border-emerald-200 bg-emerald-50 rounded-xl flex items-center gap-2">
              <CheckCircle size={14} />Vacunación registrada
            </span>
          )}
          {(a.status === "missed" || markedAbsent) && (
            <span className="px-4 py-2.5 text-[12px] font-bold text-red-600 border border-red-200 bg-red-50 rounded-xl flex items-center gap-2">
              <UserX size={14} />Paciente inasistente
            </span>
          )}
        </div>
      </div>

      {markedAbsent && (
        <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl flex gap-3">
          <AlertCircle size={15} className="text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-[12px] text-red-700 font-semibold">El paciente ha sido marcado como inasistente. Se ha actualizado el estado de la cita en el sistema.</p>
        </div>
      )}

      <div className="grid grid-cols-[280px_1fr] gap-5">
        {/* Left */}
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
                { label: "Dirección", value: a.patient.address },
                { label: "Vacunaciones previas", value: `${a.patient.prevVaccinations} registradas` },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</div>
                  <div className="text-[11px] text-slate-800 font-semibold mt-0.5 leading-snug">{value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border shadow-sm p-5" style={{ borderColor: "#E2E8F0" }}>
            <h3 className="text-[12px] font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Building2 size={14} className="text-blue-500" />Centro de Vacunación
            </h3>
            <div className="space-y-3">
              {[
                { label: "Centro", value: a.center.name },
                { label: "Dirección", value: a.center.address },
                { label: "Teléfono", value: a.center.phone },
                { label: "Horario", value: a.center.hours },
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
            <div className="text-white text-[18px] font-bold">{a.id}</div>
          </div>
          <div className="p-6 space-y-0">
            {[
              { label: "Campaña de vacunación", value: a.campaign.name },
              { label: "Vacuna", value: a.vaccine.name },
              { label: "Fecha de la cita", value: fmtDate(a.date) },
              { label: "Hora", value: `${a.time} hrs.` },
              { label: "Estado actual", value: null },
            ].map(({ label, value }, i) => (
              <div key={label} className={`flex items-center gap-4 py-3.5 ${i < 5 ? "border-b" : ""}`} style={{ borderColor: "#F1F5F9" }}>
                <span className="text-[12px] font-semibold text-slate-500 w-48 flex-shrink-0">{label}</span>
                {value !== null ? (
                  <span className="text-[12px] font-bold text-slate-900">{value}</span>
                ) : (
                  <ApptStatusBadge status={markedAbsent ? "missed" : a.status} />
                )}
              </div>
            ))}
          </div>

          {a.status === "scheduled" && !markedAbsent && (
            <div className="px-6 pb-6">
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex gap-3 mt-2">
                <AlertCircle size={15} className="text-blue-500 flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-blue-700 leading-relaxed">
                  Para registrar la vacuna administrada a este paciente, presione el botón <strong>"Registrar Vacunación"</strong>. Para registrar su inasistencia, use <strong>"Marcar Inasistente"</strong>.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}