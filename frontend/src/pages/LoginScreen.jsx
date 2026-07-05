import React, { useState } from 'react';
import { Shield, Activity, Users, ClipboardList, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from "../components/ui/button";
import { login } from '../api/authService';
import { apiError } from '../api/axiosConfig';

export function LoginScreen({ onLogin }) {
  const [tipo, setTipo] = useState("paciente"); // 'paciente' | 'personal'
  const [rut, setRut] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e?.preventDefault();
    if (!rut || !password) {
      setError("Ingrese su RUT y contraseña.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const { rol } = await login(tipo, rut.trim(), password);
      onLogin(rol);
    } catch (err) {
      setError(apiError(err, "No se pudo iniciar sesión."));
    } finally {
      setLoading(false);
    }
  }

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
            <div className="mb-7">
              <h2 className="text-xl font-bold text-slate-900">Iniciar sesión</h2>
              <p className="text-[13px] text-slate-500 mt-1">Ingrese sus credenciales para acceder al sistema</p>
            </div>

            {/* Selector de tipo de usuario -> define el endpoint de login */}
            <div className="grid grid-cols-2 gap-2 mb-5 p-1 rounded-xl bg-slate-100">
              {[
                { id: "paciente", label: "Paciente" },
                { id: "personal", label: "Personal de salud" },
              ].map((opt) => (
                <button key={opt.id} type="button" onClick={() => setTipo(opt.id)}
                  className={`py-2 rounded-lg text-[12px] font-semibold transition-all ${tipo === opt.id ? "bg-white text-blue-700 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
                  {opt.label}
                </button>
              ))}
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex gap-2.5 items-start">
                <AlertCircle size={15} className="text-red-500 flex-shrink-0 mt-0.5" />
                <span className="text-[12px] text-red-700 font-medium">{error}</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">RUT</label>
                <input type="text" value={rut} onChange={(e) => setRut(e.target.value)} placeholder="7382025-1"
                  className="w-full px-4 py-3 rounded-xl border text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-400/25 focus:border-blue-400 transition-all"
                  style={{ background: "#F8FAFC", borderColor: "#E2E8F0" }} />
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">Contraseña</label>
                <div className="relative">
                  <input type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                    className="w-full px-4 py-3 pr-11 rounded-xl border text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-400/25 focus:border-blue-400 transition-all"
                    style={{ background: "#F8FAFC", borderColor: "#E2E8F0" }} />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? <span className="flex items-center justify-center gap-2"><Loader2 size={15} className="animate-spin" />Ingresando…</span> : "Iniciar sesión"}
              </Button>
            </div>
          </form>
          <p className="mt-5 text-center text-[11px] text-slate-400">© 2026 Ministerio de Salud · Gobierno de Chile</p>
        </div>
      </div>
    </div>
  );
}
