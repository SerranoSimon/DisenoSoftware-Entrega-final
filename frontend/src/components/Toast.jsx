import React, { useEffect } from 'react';
import { Mail, MessageSquare, Send, X } from 'lucide-react'; // Importamos 'Send' para la opción AMBOS

export function Toast({ open, email, phone, preference, onClose }) {
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => onClose?.(), 6000);
    return () => clearTimeout(t);
  }, [open, onClose]);

  if (!open) return null;

  // 1. Identificamos qué preferencia viene del enum
  const isAmbos = preference === 'AMBOS';
  const isSMS = preference === 'SMS';
  // Fallback: si no es AMBOS ni SMS, asumimos correo por defecto
  const isCorreo = preference === 'CORREOELECTRONICO' || (!isAmbos && !isSMS); 

  // 2. Configuramos el título y el ícono dinámicamente
  let Icon = Mail;
  let title = "Correo de confirmación enviado";

  if (isAmbos) {
    Icon = Send;
    title = "Confirmaciones enviadas";
  } else if (isSMS) {
    Icon = MessageSquare;
    title = "SMS de confirmación enviado";
  }

  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] w-[320px]" role="status" aria-live="polite">
      <div className="bg-white rounded-xl border shadow-lg p-4 flex gap-3" style={{ borderColor: "#E2E8F0" }}>
        
        {/* Ícono dinámico */}
        <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
          <Icon size={17} className="text-emerald-600" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-bold text-slate-900">{title}</div>
          
          {/* --- CASO 1: AMBOS --- */}
          {isAmbos && (
            <div className="mt-1">
              <div className="text-[12px] text-slate-500">Se ha notificado a:</div>
              <div className="flex flex-col mt-0.5">
                {email ? (
                  <div className="text-[12px] font-semibold text-blue-600 truncate">
                    <span className="text-slate-500 font-normal">Correo: </span>{email}
                  </div>
                ) : null}
                {phone ? (
                  <div className="text-[12px] font-semibold text-blue-600 truncate">
                    <span className="text-slate-500 font-normal">SMS: </span>{phone}
                  </div>
                ) : null}
              </div>
            </div>
          )}

          {/* --- CASO 2: SOLO SMS --- */}
          {isSMS && (
            <>
              <div className="text-[12px] text-slate-500 mt-0.5">Se ha enviado un SMS a:</div>
              <div className="text-[12px] font-semibold text-blue-600 mt-0.5 truncate">
                {phone || "tu número registrado"}
              </div>
            </>
          )}

          {/* --- CASO 3: SOLO CORREO --- */}
          {isCorreo && (
            <>
              <div className="text-[12px] text-slate-500 mt-0.5">Se ha enviado un correo a:</div>
              <div className="text-[12px] font-semibold text-blue-600 mt-0.5 truncate">
                {email || "tu correo registrado"}
              </div>
            </>
          )}
        </div>

        <button type="button" onClick={onClose} aria-label="Cerrar aviso"
          className="text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0 h-fit">
          <X size={15} />
        </button>
      </div>
    </div>
  );
}