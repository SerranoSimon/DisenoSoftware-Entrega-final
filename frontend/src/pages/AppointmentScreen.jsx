import React, { useEffect, useState } from 'react';
import { Search, CheckCircle, ArrowLeft, ArrowRight, AlertCircle, Loader2, Building2 } from 'lucide-react';
import { Button } from "../components/ui/button";
import { fmtDate } from '../lib/utils';
import { getCentros } from '../api/centroService';
import { getCampanias } from '../api/campaniaService';
import { crearCita } from '../api/citaService';
import { apiError } from '../api/axiosConfig';

export const STEP_LABELS = ["Centro", "Campaña", "Fecha", "Hora", "Revisión", "Confirmación"];
const TIME_SLOTS = ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"];

export function AppointmentScreen({ onFinished }) {
  const [step, setStep] = useState(1);
  const [centerQuery, setCenterQuery] = useState("");
  const [center, setCenter] = useState(null);
  const [campaign, setCampaign] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  // Datos del backend
  const [centros, setCentros] = useState([]);
  const [campanias, setCampanias] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [dataError, setDataError] = useState("");

  // Envío
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [citaCreada, setCitaCreada] = useState(null);

  useEffect(() => {
    let activo = true;
    Promise.all([getCentros(), getCampanias()])
      .then(([cs, cps]) => { if (activo) { setCentros(cs); setCampanias(cps); } })
      .catch((err) => { if (activo) setDataError(apiError(err, "No se pudieron cargar centros y campañas.")); })
      .finally(() => { if (activo) setLoadingData(false); });
    return () => { activo = false; };
  }, []);

  const filteredCenters = centros.filter(
    (c) => (c.nombre || "").toLowerCase().includes(centerQuery.toLowerCase()) ||
      (c.direccion || "").toLowerCase().includes(centerQuery.toLowerCase())
  );

  // Calendar helpers
  const today = new Date();
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [calYear, setCalYear] = useState(today.getFullYear());
  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const monthName = new Date(calYear, calMonth).toLocaleDateString("es-CL", { month: "long", year: "numeric" });

  const isDisabled = (day) => {
    const d = new Date(calYear, calMonth, day);
    const dow = d.getDay();
    const todayStr = today.toISOString().split("T")[0];
    const dStr = d.toISOString().split("T")[0];
    return dow === 0 || dow === 6 || dStr <= todayStr;
  };

  const canNext =
    (step === 1 && !!center) || (step === 2 && !!campaign) ||
    (step === 3 && !!date) || (step === 4 && !!time) || step === 5;

  function reset() {
    setStep(1); setCenter(null); setCampaign(null);
    setDate(""); setTime(""); setCenterQuery("");
    setSubmitError(""); setCitaCreada(null);
  }

  async function confirmar() {
    setSubmitting(true);
    setSubmitError("");
    try {
      const fechaHora = `${date}T${time}:00`;
      const cita = await crearCita({ idCentro: center.id, idCampania: campaign.id, fechaHora });
      setCitaCreada(cita);
      setStep(6);
    } catch (err) {
      setSubmitError(apiError(err, "No se pudo agendar la cita."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-[720px] mx-auto">
      <div className="mb-5">
        <h2 className="text-lg font-bold text-slate-900">Agendar Cita de Vacunación</h2>
        <p className="text-[12px] text-slate-500">Complete los pasos para reservar su hora en el centro de salud</p>
      </div>

      {/* Stepper */}
      <div className="bg-white rounded-2xl border p-5 mb-5 shadow-sm" style={{ borderColor: "#E2E8F0" }}>
        <div className="flex items-center">
          {STEP_LABELS.map((label, i) => {
            const n = i + 1; const done = n < step; const active = n === step;
            return (
              <div key={label} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 ${done ? "bg-emerald-500 text-white shadow-sm" : active ? "bg-blue-600 text-white shadow-sm ring-4 ring-blue-100" : "bg-slate-100 text-slate-400"}`}>
                    {done ? <CheckCircle size={14} /> : n}
                  </div>
                  <span className={`text-[10px] font-semibold whitespace-nowrap ${active ? "text-blue-600" : done ? "text-emerald-600" : "text-slate-400"}`}>{label}</span>
                </div>
                {i < STEP_LABELS.length - 1 && <div className={`flex-1 h-0.5 mx-2 mb-4 rounded-full transition-all duration-300 ${done ? "bg-emerald-400" : "bg-slate-100"}`} />}
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
        {dataError && step < 6 && (
          <div className="m-6 p-4 bg-red-50 border border-red-200 rounded-xl flex gap-3">
            <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-[12px] text-red-700 font-medium">{dataError}</p>
          </div>
        )}

        {/* STEP 1 — Centro */}
        {step === 1 && (
          <div className="p-6">
            <div className="mb-4">
              <h3 className="text-[14px] font-bold text-slate-900">Paso 1 — Centro de vacunación</h3>
              <p className="text-[12px] text-slate-500 mt-0.5">Busque y seleccione el centro donde desea vacunarse</p>
            </div>
            <div className="relative mb-4">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input type="text" value={centerQuery} onChange={(e) => setCenterQuery(e.target.value)}
                placeholder="Buscar centro por nombre o dirección…"
                className="w-full pl-8 pr-4 py-2.5 text-[12px] border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400/25 focus:border-blue-400 transition-all"
                style={{ background: "#F8FAFC", borderColor: "#E2E8F0" }} />
            </div>
            {loadingData ? (
              <div className="py-10 text-center"><Loader2 size={26} className="text-slate-300 mx-auto animate-spin" /></div>
            ) : filteredCenters.length === 0 ? (
              <div className="py-8 text-center text-[12px] text-slate-400">No se encontraron centros.</div>
            ) : (
              <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                {filteredCenters.map((c) => (
                  <button key={c.id} onClick={() => setCenter(c)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-150 ${center?.id === c.id ? "border-blue-500 bg-blue-50" : "border-slate-100 bg-slate-50 hover:border-slate-200 hover:bg-white"}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <Building2 size={16} className="text-blue-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-[13px] text-slate-900">{c.nombre}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{c.direccion}</div>
                        {c.tipo && <div className="text-[10px] text-slate-400 mt-0.5">{c.tipo}</div>}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* STEP 2 — Campaña (la vacuna la asigna el sistema; se informa al confirmar) */}
        {step === 2 && (
          <div className="p-6">
            <div className="mb-5">
              <h3 className="text-[14px] font-bold text-slate-900">Paso 2 — Campaña de vacunación</h3>
              <p className="text-[12px] text-slate-500 mt-0.5">Seleccione la campaña. La vacuna se asigna automáticamente y se le informará al confirmar la cita.</p>
            </div>
            {loadingData ? (
              <div className="py-10 text-center"><Loader2 size={26} className="text-slate-300 mx-auto animate-spin" /></div>
            ) : campanias.length === 0 ? (
              <div className="py-8 text-center text-[12px] text-slate-400">No hay campañas disponibles.</div>
            ) : (
              <div className="space-y-3">
                {campanias.map((c) => {
                  const isSelected = campaign?.id === c.id;
                  return (
                    <div key={c.id} onClick={() => setCampaign(c)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-150 flex items-center justify-between ${isSelected ? "border-blue-500 bg-blue-50" : "border-slate-100 hover:border-slate-200"}`}
                    >
                      <div className="font-semibold text-[13px] text-slate-900">{c.nombre}</div>
                      <span className="text-[11px] text-slate-500 font-medium">{c.estado}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* STEP 3 — Fecha */}
        {step === 3 && (
          <div className="p-6">
            <div className="mb-5">
              <h3 className="text-[14px] font-bold text-slate-900">Paso 3 — Seleccione fecha</h3>
              <p className="text-[12px] text-slate-500 mt-0.5">Días hábiles disponibles (lunes a viernes)</p>
            </div>
            <div className="border rounded-2xl overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
              <div className="flex items-center justify-between px-5 py-3.5 border-b" style={{ background: "#F8FAFC", borderColor: "#E2E8F0" }}>
                <button onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(calYear - 1); } else setCalMonth(calMonth - 1); }}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
                  <ArrowLeft size={14} />
                </button>
                <span className="text-[13px] font-bold text-slate-800 capitalize">{monthName}</span>
                <button onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(calYear + 1); } else setCalMonth(calMonth + 1); }}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
                  <ArrowRight size={14} />
                </button>
              </div>
              <div className="grid grid-cols-7 border-b" style={{ borderColor: "#F1F5F9" }}>
                {["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"].map((d) => (
                  <div key={d} className="py-2.5 text-center text-[10px] font-bold text-slate-400 uppercase">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 p-3 gap-1">
                {Array.from({ length: (firstDay === 0 ? 6 : firstDay - 1) }).map((_, i) => <div key={`e${i}`} />)}
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                  const iso = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                  const disabled = isDisabled(day);
                  const selected_ = date === iso;
                  return (
                    <button key={day} disabled={disabled} onClick={() => setDate(iso)}
                      className={`aspect-square rounded-xl text-[12px] font-semibold transition-all duration-150 ${disabled ? "text-slate-200 cursor-not-allowed" :
                        selected_ ? "bg-blue-600 text-white shadow-md" :
                          "text-slate-700 hover:bg-blue-50 hover:text-blue-600"
                        }`}
                    >{day}</button>
                  );
                })}
              </div>
              {date && (
                <div className="px-5 py-3 border-t text-[12px] font-semibold text-blue-700" style={{ background: "#EFF6FF", borderColor: "#DBEAFE" }}>
                  Fecha seleccionada: {fmtDate(date)}
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 4 — Hora */}
        {step === 4 && (
          <div className="p-6">
            <div className="mb-5">
              <h3 className="text-[14px] font-bold text-slate-900">Paso 4 — Seleccione hora</h3>
              <p className="text-[12px] text-slate-500 mt-0.5">Horas disponibles para el <span className="font-semibold text-slate-700">{fmtDate(date)}</span></p>
            </div>
            <div className="grid grid-cols-4 gap-2.5">
              {TIME_SLOTS.map((t) => (
                <button key={t} onClick={() => setTime(t)}
                  className={`py-3 rounded-xl border-2 text-[13px] font-bold transition-all duration-150 ${time === t ? "border-blue-500 bg-blue-600 text-white shadow-md" : "border-slate-100 text-slate-700 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50"}`}
                >{t}</button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 5 — Revisión (sin vacuna: se asigna al confirmar) */}
        {step === 5 && (
          <div className="p-6">
            <div className="mb-5">
              <h3 className="text-[14px] font-bold text-slate-900">Paso 5 — Revisión de información</h3>
              <p className="text-[12px] text-slate-500 mt-0.5">Verifique los datos de su cita antes de confirmar</p>
            </div>
            <div className="rounded-xl border overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
              {[
                { label: "Centro de vacunación", value: center?.nombre },
                { label: "Dirección", value: center?.direccion },
                { label: "Campaña", value: campaign?.nombre },
                { label: "Fecha", value: fmtDate(date) },
                { label: "Hora", value: time ? `${time} hrs.` : "—" },
              ].map(({ label, value }, i) => (
                <div key={label} className={`flex items-start gap-4 px-5 py-3.5 ${i % 2 === 0 ? "bg-slate-50" : "bg-white"}`}>
                  <span className="text-[12px] font-semibold text-slate-500 w-44 flex-shrink-0">{label}</span>
                  <span className="text-[12px] font-semibold text-slate-900">{value ?? "—"}</span>
                </div>
              ))}
            </div>
            {submitError && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex gap-3">
                <AlertCircle size={15} className="text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-[12px] text-red-700 font-medium">{submitError}</p>
              </div>
            )}
            <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-xl flex gap-3">
              <AlertCircle size={15} className="text-blue-500 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-blue-700 leading-relaxed">Al confirmar, el sistema asignará la vacuna correspondiente y recibirá una notificación con los detalles de su cita.</p>
            </div>
          </div>
        )}

        {/* STEP 6 — Confirmación */}
        {step === 6 && citaCreada && (
          <div className="p-10 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5">
              <CheckCircle size={34} className="text-emerald-500" />
            </div>
            <h3 className="text-[18px] font-bold text-slate-900 mb-2">¡Cita agendada correctamente!</h3>
            <p className="text-[12px] text-slate-500 mb-7 max-w-sm mx-auto leading-relaxed">Su cita de vacunación ha sido registrada exitosamente.</p>
            <div className="rounded-xl border p-5 text-left max-w-sm mx-auto mb-7 space-y-3" style={{ background: "#F8FAFC", borderColor: "#E2E8F0" }}>
              {[
                { label: "N.° de cita", value: citaCreada.displayId },
                { label: "Centro", value: citaCreada.centroNombre },
                { label: "Vacuna asignada", value: citaCreada.vacunaTipo },
                { label: "Fecha", value: fmtDate(citaCreada.fecha) },
                { label: "Hora", value: citaCreada.hora ? `${citaCreada.hora} hrs.` : "—" },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-start gap-3">
                  <span className="text-[11px] text-slate-500 font-semibold flex-shrink-0">{label}</span>
                  <span className="text-[12px] text-slate-900 font-bold text-right">{value || "—"}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t" style={{ borderColor: "#F1F5F9" }}>
          <button onClick={() => setStep((s) => s - 1)} disabled={step === 1 || step === 6}
            className="flex items-center gap-1.5 px-4 py-2 text-[12px] font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded-lg hover:bg-slate-50">
            <ArrowLeft size={14} />Anterior
          </button>
          {step < 5 && (
            <button onClick={() => setStep((s) => s + 1)} disabled={!canNext}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white text-[12px] font-bold rounded-xl transition-all">
              Siguiente<ArrowRight size={14} />
            </button>
          )}
          {step === 5 && (
            <button onClick={confirmar} disabled={submitting}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white text-[12px] font-bold rounded-xl transition-all shadow-sm">
              {submitting ? <><Loader2 size={14} className="animate-spin" />Agendando…</> : <><CheckCircle size={14} />Confirmar cita</>}
            </button>
          )}
          {step === 6 && (
            <div className="flex gap-2">
              <button onClick={reset}
                className="flex items-center gap-1.5 px-5 py-2.5 border text-slate-700 text-[12px] font-bold rounded-xl transition-all hover:bg-slate-50" style={{ borderColor: "#E2E8F0" }}>
                Agendar otra
              </button>
              <button onClick={() => onFinished?.()}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-[12px] font-bold rounded-xl transition-all">
                Ir a Mis Citas
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
