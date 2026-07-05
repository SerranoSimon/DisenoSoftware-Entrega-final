import React, { useEffect } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';

// Diálogo de confirmación reutilizable para acciones irreversibles.
// Cumple: prevención de errores (H5), control y libertad del usuario (H3: Escape/Cancelar).
export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  tone = "danger", // 'danger' | 'primary'
  loading = false,
  onConfirm,
  onCancel,
}) {
  // Cerrar con la tecla Escape (salida de emergencia)
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape" && !loading) onCancel?.(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, loading, onCancel]);

  if (!open) return null;

  const confirmCls = tone === "danger" ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700";
  const iconWrap = tone === "danger" ? "bg-red-50" : "bg-blue-50";
  const iconCls = tone === "danger" ? "text-red-500" : "text-blue-500";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40"
      role="dialog" aria-modal="true" aria-label={title} onClick={() => !loading && onCancel?.()}>
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${iconWrap}`}>
            <AlertTriangle size={20} className={iconCls} />
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-slate-900">{title}</h3>
            <p className="text-[13px] text-slate-500 mt-1 leading-relaxed">{message}</p>
          </div>
        </div>
        <div className="flex justify-end gap-2.5 mt-6">
          <button type="button" onClick={onCancel} disabled={loading}
            className="px-4 py-2 text-[12px] font-bold text-slate-600 border rounded-xl hover:bg-slate-50 transition-all disabled:opacity-50"
            style={{ borderColor: "#E2E8F0" }}>
            {cancelLabel}
          </button>
          <button type="button" onClick={onConfirm} disabled={loading}
            className={`px-4 py-2 text-[12px] font-bold text-white rounded-xl transition-all disabled:opacity-60 inline-flex items-center gap-2 ${confirmCls}`}>
            {loading && <Loader2 size={13} className="animate-spin" />}{loading ? "Procesando…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
