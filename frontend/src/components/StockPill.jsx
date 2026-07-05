import React from 'react';

export function StockPill({ stock }) {
  if (stock === 0) return <span className="text-xs font-semibold text-red-500">Sin stock</span>;
  if (stock < 50) return <span className="text-xs font-semibold text-amber-600">{stock} dosis</span>;
  return <span className="text-xs font-semibold text-emerald-600">{stock} dosis</span>;
}