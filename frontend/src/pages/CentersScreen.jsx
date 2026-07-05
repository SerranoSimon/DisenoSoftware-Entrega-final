import React, { useState } from 'react';
import { Search, MapPin, Package, MapPinned, Syringe, ChevronDown, ArrowRight, Building2, Phone, Clock } from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { StockPill } from '../components/StockPill';
import { CENTERS, campaignsWithStock, TIME_SLOTS } from '../models/data';

export function CentersScreen({ setScreen }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [expandedCampaign, setExpandedCampaign] = useState(null);

  const filtered = CENTERS.filter(
    (c) => c.name.toLowerCase().includes(query.toLowerCase()) || c.address.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="flex gap-5 h-full min-h-0">
      <div className="w-[340px] flex-shrink-0 flex flex-col gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Centros de Vacunación</h2>
          <p className="text-[12px] text-slate-500 mt-0.5">{filtered.length} centros encontrados</p>
        </div>
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar por nombre o dirección…"
            className="w-full pl-8 pr-4 py-2.5 text-[12px] bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400/25 focus:border-blue-400 transition-all"
            style={{ borderColor: "#E2E8F0" }} />
        </div>
        <div className="flex flex-col gap-2 overflow-y-auto flex-1 pr-1">
          {filtered.map((center) => {
            const avail = campaignsWithStock(center);
            const isSel = selected?.id === center.id;
            return (
              <button key={center.id} onClick={() => { setSelected(center); setExpandedCampaign(null); }}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-150 ${isSel ? "border-blue-500 bg-blue-50 shadow-sm" : "border-transparent bg-white hover:border-slate-200 hover:shadow-sm shadow-[0_1px_3px_rgba(0,0,0,.06)]"}`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="font-semibold text-[13px] text-slate-900 leading-snug">{center.name}</span>
                  <StatusBadge status={center.status} />
                </div>
                <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1.5">
                  <MapPin size={11} className="flex-shrink-0" />
                  <span className="truncate">{center.address.split(",")[0]}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                  <Package size={11} className="flex-shrink-0" />
                  <span>{avail.length} campaña{avail.length !== 1 ? "s" : ""} con stock</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 min-w-0 overflow-y-auto">
        {!selected ? (
          <div className="h-full flex flex-col items-center justify-center text-center select-none">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
              <Building2 size={28} className="text-blue-300" />
            </div>
            <h3 className="text-[14px] font-semibold text-slate-600 mb-1">Seleccione un centro</h3>
            <p className="text-[12px] text-slate-400 max-w-xs">Haga clic en un centro de vacunación para ver su información detallada y disponibilidad de campañas.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border overflow-hidden shadow-sm" style={{ borderColor: "#E2E8F0" }}>
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-[18px] font-bold text-white leading-snug mb-1.5">{selected.name}</h2>
                  <div className="flex items-center gap-1.5 text-blue-200 text-[12px]">
                    <MapPinned size={13} className="flex-shrink-0" />
                    <span>{selected.address}</span>
                  </div>
                </div>
                <StatusBadge status={selected.status} />
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: Phone, label: "Teléfono", value: selected.phone },
                  { icon: Clock, label: "Horario de atención", value: selected.hours },
                  { icon: Package, label: "Campañas con stock", value: `${campaignsWithStock(selected).length} campaña${campaignsWithStock(selected).length !== 1 ? "s" : ""} disponible${campaignsWithStock(selected).length !== 1 ? "s" : ""}` },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="rounded-xl p-4 border" style={{ background: "#F8FAFC", borderColor: "#E2E8F0" }}>
                    <div className="flex items-center gap-1.5 mb-2">
                      <Icon size={13} className="text-blue-500" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>
                    </div>
                    <span className="text-[12px] font-semibold text-slate-800 leading-snug">{value}</span>
                  </div>
                ))}
              </div>
              <div>
                <h3 className="text-[13px] font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Syringe size={15} className="text-blue-500" />Campañas con vacunas disponibles
                </h3>
                {campaignsWithStock(selected).length === 0 ? (
                  <div className="py-8 text-center text-[12px] text-slate-400 rounded-xl border" style={{ borderColor: "#E2E8F0" }}>No hay campañas con stock disponible en este centro actualmente.</div>
                ) : (
                  <div className="space-y-2.5">
                    {campaignsWithStock(selected).map((campaign) => (
                      <div key={campaign.id} className="border rounded-xl overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
                        <button onClick={() => setExpandedCampaign(expandedCampaign === campaign.id ? null : campaign.id)}
                          className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors text-left" style={{ background: "#F8FAFC" }}>
                          <span className="font-semibold text-[13px] text-slate-800">{campaign.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-slate-400">{campaign.vaccines.length} vacuna{campaign.vaccines.length !== 1 ? "s" : ""}</span>
                            <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${expandedCampaign === campaign.id ? "rotate-180" : ""}`} />
                          </div>
                        </button>
                        {expandedCampaign === campaign.id && (
                          <div className="divide-y" style={{ borderColor: "#F1F5F9" }}>
                            {campaign.vaccines.map((v) => (
                              <div key={v.name} className="px-4 py-3 flex items-center justify-between bg-white">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                                  <span className="text-[12px] text-slate-700 font-medium">{v.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-[11px] text-slate-400 font-medium">Stock:</span>
                                  <StockPill stock={v.stock} />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex justify-end pt-2 border-t" style={{ borderColor: "#F1F5F9" }}>
                <button onClick={() => setScreen("appointment")}
                  className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-bold rounded-xl transition-all duration-150 shadow-sm hover:shadow-md">
                  Agendar cita en este centro<ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}