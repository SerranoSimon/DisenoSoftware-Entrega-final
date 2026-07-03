import React from 'react';

export function ApptStatusBadge({ status }) {
  const map = {
    scheduled: { label: "Agendada", cls: "bg-blue-50 text-blue-700 border-blue-200", dot: "bg-blue-500" },
    completed: { label: "Completada", cls: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
    missed: { label: "Inasistente", cls: "bg-red-50 text-red-600 border-red-200", dot: "bg-red-400" },
  };
  const { label, cls, dot } = map[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full inline-block ${dot}`} />{label}
    </span>
  );
}
