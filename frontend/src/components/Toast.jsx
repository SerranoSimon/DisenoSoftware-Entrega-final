import React from 'react';
import { Mail, MessageSquare, Send, X } from 'lucide-react';

export function Toast({ open, email, phone, preference, onClose }) {
  if (!open) return null;

  // Identificamos la preferencia (fallback a correo si viene vacía)
  const isAmbos = preference === 'AMBOS';
  const isSMS = preference === 'SMS';
  const isCorreo = preference === 'CORREOELECTRONICO' || (!isAmbos && !isSMS);

  let Icon = Mail;
  let title = "Correo de confirmación enviado";
  if (isAmbos) { Icon = Send; title = "Confirmaciones enviadas"; }
  else if (isSMS) { Icon = MessageSquare; title = "SMS de confirmación enviado"; }

  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] w-[340px]" role="status" aria-live="polite">
      <div className="relative bg-white rounded-xl border shadow-xl p-5 pr-9 flex gap-3" style={{ borderColor: "#E2E8F0" }}>

        {/* Botón cerrar (arriba a la derecha) */}
        <button type="button" onClick={onClose} aria-label="Cerrar aviso"
          className="absolute top-2.5 right-2.5 text-slate-400 hover:text-slate-600 transition-colors">
          <X size={16} />
        </button>

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
      </div>
    </div>
  );
}
