"use client";

import { useMemo, useState } from "react";

export function RoiCalculator() {
  const [tier, setTier] = useState<"plata" | "oro" | "diamante">("oro");
  const [conv, setConv] = useState(2.5); // % conversión asistentes → clientes
  const [aov, setAov] = useState(35);    // ticket medio €

  const cost = tier === "plata" ? 1500 : tier === "oro" ? 3500 : 8000;
  const reach = tier === "plata" ? 4000 : tier === "oro" ? 8000 : 15000;
  const newClients = Math.round((reach * conv) / 100);
  const revenue = newClients * aov;
  const roi = ((revenue - cost) / cost) * 100;
  const payback = revenue / cost;

  return (
    <div className="rounded-3xl bg-brand-carbon text-brand-bone p-7 md:p-10 border border-brand-orange/30">
      <p className="badge !text-brand-orange !border-brand-orange/40 mb-4">Calculadora ROI</p>
      <h3 className="h-brutal text-3xl md:text-4xl">¿Cuánto te va a devolver tu inversión?</h3>
      <p className="mt-3 text-brand-bone/75 max-w-xl">
        Estimación realista basada en datos de eventos similares. Mueve los sliders para tu caso.
      </p>

      <div className="mt-10 grid md:grid-cols-2 gap-8">
        {/* Controls */}
        <div className="space-y-6">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-brand-bone/60 mb-3">Tier de patrocinio</p>
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
              {(["plata", "oro", "diamante"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTier(t)}
                  className={`px-1 sm:px-3 md:px-4 py-2.5 sm:py-3 rounded-xl text-[11px] sm:text-sm font-bold uppercase tracking-[0.12em] sm:tracking-[0.18em] truncate transition-all ${
                    tier === t
                      ? "bg-brand-orange text-brand-carbon shadow-[0_12px_30px_-10px_rgba(232,93,31,0.6)]"
                      : "bg-brand-bone/10 text-brand-bone/85 hover:bg-brand-bone/20"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs sm:text-sm text-brand-bone/65">Coste: {cost.toLocaleString("es-ES")}€ · Reach: {reach.toLocaleString("es-ES")}</p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-brand-bone/60 mb-3">Tasa de conversión asistente → cliente: <strong className="text-brand-orange">{conv.toFixed(1)}%</strong></p>
            <input
              type="range"
              min="0.5"
              max="8"
              step="0.1"
              value={conv}
              onChange={(e) => setConv(parseFloat(e.target.value))}
              className="w-full accent-brand-orange"
            />
            <p className="mt-1 text-xs text-brand-bone/55">Media en eventos de nicho premium: 2-4%</p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-brand-bone/60 mb-3">Ticket medio (AOV): <strong className="text-brand-orange">{aov}€</strong></p>
            <input
              type="range"
              min="10"
              max="200"
              step="5"
              value={aov}
              onChange={(e) => setAov(parseInt(e.target.value))}
              className="w-full accent-brand-orange"
            />
            <p className="mt-1 text-xs text-brand-bone/55">Cuánto compra de media un cliente nuevo en 12 meses</p>
          </div>
        </div>

        {/* Results */}
        <div className="rounded-2xl bg-brand-orange/10 border border-brand-orange/30 p-6">
          <div className="space-y-5">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-brand-bone/60">Clientes nuevos estimados</p>
              <p className="h-brutal text-display-md text-brand-orange glow-orange">{newClients}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-brand-bone/60">Revenue 12 meses</p>
              <p className="h-brutal text-3xl text-brand-bone">{revenue.toLocaleString("es-ES")}€</p>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-brand-bone/15">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-brand-bone/60">ROI</p>
                <p className={`h-brutal text-2xl ${roi >= 0 ? "text-brand-orange" : "text-brand-wine"}`}>
                  {roi >= 0 ? "+" : ""}{roi.toFixed(0)}%
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-brand-bone/60">Payback x</p>
                <p className="h-brutal text-2xl text-brand-orange">{payback.toFixed(1)}x</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-8 text-xs text-brand-bone/55 italic">
        ⓘ Estimación orientativa. Resultados reales dependen de la categoría, el producto y la activación. Te entregamos
        reporte detallado post-festival con datos auditados.
      </p>
    </div>
  );
}
