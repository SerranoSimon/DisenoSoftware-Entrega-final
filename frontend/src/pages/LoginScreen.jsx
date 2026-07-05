import React, { useState } from 'react';
import { Shield, Activity, Users, ClipboardList, Eye, EyeOff, AlertCircle, Loader2, ArrowLeft, Stethoscope } from 'lucide-react';
import { Button } from "../components/ui/button";
import { login } from '../api/authService';
import { apiError } from '../api/axiosConfig';

export function LoginScreen({ onLogin }) {
  const [tipo, setTipo] = useState("paciente"); // 'paciente' | 'personal' | 'claveunica'
  const [rut, setRut] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const esPersonal = tipo === "personal";
  const esClaveUnica = tipo === "claveunica";

  function cambiarTipo(nuevo) {
    setTipo(nuevo);
    setError("");
    setPassword("");
  }

  async function handleSubmit(e) {
    e?.preventDefault();
    if (!rut || !password) {
      setError(esClaveUnica ? "Ingrese su RUT y Clave Única." : "Ingrese su RUT y contraseña.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      // Clave Única no tiene backend propio: se autentica como paciente.
      const endpoint = esPersonal ? "personal" : "paciente";
      const { rol } = await login(endpoint, rut.trim(), password);
      onLogin(rol);
    } catch (err) {
      setError(apiError(err, "No se pudo iniciar sesión."));
    } finally {
      setLoading(false);
    }
  }

  const titulo = esPersonal ? "Acceso personal de salud" : esClaveUnica ? "Ingresar con Clave Única" : "Iniciar sesión";
  const subtitulo = esPersonal ? "Ingrese sus credenciales de funcionario"
    : esClaveUnica ? "Ingrese su RUT y Clave Única del Estado"
      : "Acceso para pacientes del sistema";
  const passwordLabel = esClaveUnica ? "Clave Única" : "Contraseña";

  return (
    <div className="min-h-screen flex" style={{ background: "#F5F7FA" }}>
      <div className="hidden lg:flex w-[480px] xl:w-[540px] flex-shrink-0 flex-col justify-between p-12 relative overflow-hidden bg-blue-700">
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(255,255,255,.6) 39px,rgba(255,255,255,.6) 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(255,255,255,.6) 39px,rgba(255,255,255,.6) 40px)" }} />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-14">
            <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center">
              <Shield size={22} className="text-white" />
            </div>
            <div>
              <div className="text-white font-extrabold text-base tracking-wide">MINSAL</div>
              <div className="text-blue-200 text-xs">Ministerio de Salud · Chile</div>
            </div>
          </div>
          <h1 className="text-white text-[28px] font-bold leading-tight mb-4">Sistema de Gestión de Campañas de Vacunación</h1>
          <p className="text-blue-200 text-sm leading-relaxed max-w-sm">Plataforma oficial para la administración y seguimiento de campañas de inmunización en centros de salud públicos a nivel nacional.</p>
        </div>
        <div className="relative z-10 space-y-3.5">
          {[
            { icon: Shield, text: "Acceso seguro con autenticación JWT" },
            { icon: Activity, text: "Agendamiento y seguimiento de citas" },
            { icon: Users, text: "Gestión de pacientes y personal de salud" },
            { icon: ClipboardList, text: "Trazabilidad del historial de vacunación" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                <Icon size={15} className="text-blue-200" />
              </div>
              <span className="text-blue-100 text-[13px]">{text}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-[420px]">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border shadow-sm p-8" style={{ borderColor: "#E2E8F0" }}>
            <div className="mb-7 flex items-center gap-3">
              {esPersonal && (
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <Stethoscope size={19} className="text-blue-600" />
                </div>
              )}
              {esClaveUnica && (
                <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-[11px] font-black tracking-tighter">CL</span>
                </div>
              )}
              <div>
                <h2 className="text-xl font-bold text-slate-900">{titulo}</h2>
                <p className="text-[13px] text-slate-500 mt-1">{subtitulo}</p>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex gap-2.5 items-start">
                <AlertCircle size={15} className="text-red-500 flex-shrink-0 mt-0.5" />
                <span className="text-[12px] text-red-700 font-medium">{error}</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="rut" className="block text-[13px] font-semibold text-slate-700 mb-1.5">RUT</label>
                <input id="rut" name="rut" type="text" autoComplete="username" value={rut} onChange={(e) => setRut(e.target.value)} placeholder="12345678-9"
                  className="w-full px-4 py-3 rounded-xl border text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-400/25 focus:border-blue-400 transition-all"
                  style={{ background: "#F8FAFC", borderColor: "#E2E8F0" }} />
                <p className="text-[11px] text-slate-400 mt-1.5">Sin puntos y con guión (ej: 12345678-9)</p>
              </div>
              <div>
                <label htmlFor="password" className="block text-[13px] font-semibold text-slate-700 mb-1.5">{passwordLabel}</label>
                <div className="relative">
                  <input id="password" name="password" type={showPw ? "text" : "password"} autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                    className="w-full px-4 py-3 pr-11 rounded-xl border text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-400/25 focus:border-blue-400 transition-all"
                    style={{ background: "#F8FAFC", borderColor: "#E2E8F0" }} />
                  <button type="button" onClick={() => setShowPw(!showPw)} aria-label={showPw ? "Ocultar contraseña" : "Mostrar contraseña"}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? <span className="flex items-center justify-center gap-2"><Loader2 size={15} className="animate-spin" />Ingresando…</span> : "Iniciar sesión"}
              </Button>
            </div>

            {/* Acceso con Clave Única (solo en la vista de pacientes) */}
            {tipo === "paciente" && (
              <>
                <div className="flex items-center gap-3 my-4">
                  <div className="flex-1 h-px bg-slate-100" />
                  <span className="text-[11px] text-slate-400 font-medium">o</span>
                  <div className="flex-1 h-px bg-slate-100" />
                </div>
                <button type="button" onClick={() => cambiarTipo("claveunica")}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 border-2 border-blue-200 rounded-xl text-blue-700 font-semibold text-[13px] hover:bg-blue-50 transition-all">
                  <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-[9px] font-black tracking-tighter">CL</span>
                  </div>
                  Ingresar con Clave Única
                </button>
              </>
            )}

            <div className="mt-6 pt-5 border-t text-center" style={{ borderColor: "#F1F5F9" }}>
              {esPersonal || esClaveUnica ? (
                <button type="button" onClick={() => cambiarTipo("paciente")}
                  className="text-[13px] text-slate-600 hover:text-blue-700 font-semibold inline-flex items-center gap-1.5 transition-colors">
                  <ArrowLeft size={14} />Volver al acceso de pacientes
                </button>
              ) : (
                <div className="flex items-center justify-center gap-3">
                  <span className="text-[13px] text-slate-600 inline-flex items-center gap-1.5">
                    <Stethoscope size={14} className="text-slate-400" />¿Eres personal de salud?
                  </span>
                  <Button type="button" size="sm" onClick={() => cambiarTipo("personal")}>
                    Ingresa aquí
                  </Button>
                </div>
              )}
            </div>
          </form>
          <p className="mt-5 text-center text-[12px] text-slate-500">
            ¿Problemas para ingresar? Contacte a su centro de salud o llame al <span className="font-semibold text-slate-700">600 360 7777</span>.
          </p>
          <p className="mt-2 text-center text-[11px] text-slate-400">© 2026 Ministerio de Salud · Gobierno de Chile</p>
        </div>
      </div>
    </div>
  );
}
