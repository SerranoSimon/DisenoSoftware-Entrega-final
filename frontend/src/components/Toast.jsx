import React, { useEffect } from 'react';
import { Mail, X } from 'lucide-react';

// Notificación breve arriba a la derecha (debajo del nombre) al confirmar
// una cita o una vacunación: avisa que se envió el correo de confirmación.
export function Toast({ open, email, onClose }) {
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => onClose?.(), 6000);
    return () => clearTimeout(t);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed top-[68px] right-6 z-[70] w-[320px]" role="status" aria-live="polite">
      <div className="bg-white rounded-xl border shadow-lg p-4 flex gap-3" style={{ borderColor: "#E2E8F0" }}>
        <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
          <Mail size={17} className="text-emerald-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-bold text-slate-900">Correo de confirmación enviado</div>
          {email ? (
            <>
              <div className="text-[12px] text-slate-500 mt-0.5">Se ha enviado un correo a:</div>
              <div className="text-[12px] font-semibold text-blue-600 mt-0.5 truncate">{email}</div>
            </>
          ) : (
            <div className="text-[12px] text-slate-500 mt-0.5">Se ha enviado un correo de confirmación.</div>
          )}
        </div>
        <button type="button" onClick={onClose} aria-label="Cerrar aviso"
          className="text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0">
          <X size={15} />
        </button>
      </div>
    </div>
  );
}
