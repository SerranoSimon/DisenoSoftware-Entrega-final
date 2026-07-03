import React, { useState } from 'react';
import { Shield, Activity, Users, ClipboardList, ChevronRight, Eye, EyeOff } from 'lucide-react';
import { Button } from "../components/ui/button";

export function LoginScreen({ onLogin }) {
  const [rut, setRut] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);

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
            { icon: Shield, text: "Acceso seguro con Clave Única del Estado" },
            { icon: Activity, text: "Monitoreo en tiempo real de stock de vacunas" },
            { icon: Users, text: "Gestión centralizada de pacientes y citas" },
            { icon: ClipboardList, text: "Trazabilidad completa del historial de vacunación" },
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
          <div className="bg-white rounded-2xl border shadow-sm p-8" style={{ borderColor: "#E2E8F0" }}>
            <div className="mb-7">
              <h2 className="text-xl font-bold text-slate-900">Iniciar sesión</h2>
              <p className="text-[13px] text-slate-500 mt-1">Ingrese sus credenciales para acceder al sistema</p>
            </div>
            <button className="w-full flex items-center justify-center gap-3 py-3 px-4 border-2 border-blue-200 rounded-xl text-blue-700 font-semibold text-[13px] hover:bg-blue-50 transition-all mb-5">
              <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-[9px] font-black tracking-tighter">CL</span>
              </div>
              Ingresar con Clave Única
              <ChevronRight size={14} className="ml-auto text-blue-400" />
            </button>
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-slate-100" />
              <span className="text-[11px] text-slate-400 font-medium">o continúe con RUT</span>
              <div className="flex-1 h-px bg-slate-100" />
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">RUT</label>
                <input type="text" value={rut} onChange={(e) => setRut(e.target.value)} placeholder="12.345.678-9"
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
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-blue-600" />
                  <span className="text-[13px] text-slate-600">Recordar sesión</span>
                </label>
                <button className="text-[13px] text-blue-600 hover:text-blue-700 font-semibold transition-colors">¿Olvidó su contraseña?</button>
              </div>
              <Button onClick={onLogin} className="w-full">
                Iniciar sesión
              </Button>
            </div>
          </div>
          <p className="mt-5 text-center text-[11px] text-slate-400">© 2025 Ministerio de Salud · Gobierno de Chile · Todos los derechos reservados</p>
        </div>
      </div>
    </div>
  );
}