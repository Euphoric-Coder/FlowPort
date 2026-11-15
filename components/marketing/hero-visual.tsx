'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { CheckCircle2, Package, Sparkles, Truck, Warehouse } from 'lucide-react';

/**
 * Restrained, non-primary dashboard preview for the landing page.
 * Shows the shape of the real platform without a hardcoded screenshot.
 */
export function HeroVisual() {
  const reduce = useReducedMotion();
  const anim = reduce ? {} : { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 } };

  const kpis = [
    { icon: Package, label: 'Active Shipments', value: '1,284', delta: '+3.1%' },
    { icon: CheckCircle2, label: 'On-Time Rate', value: '98.2%', delta: '+0.4%' },
    { icon: Truck, label: 'In Transit', value: '96', delta: '+5' },
  ];

  const warehouses = [
    { name: 'WH-001 New York', v: 72 },
    { name: 'WH-002 Chicago', v: 94 },
    { name: 'WH-004 Atlanta', v: 63 },
  ];

  return (
    <motion.div
      {...anim}
      transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto w-full max-w-3xl"
    >
      <div className="overflow-hidden rounded-2xl border border-white/20 bg-white/95 shadow-2xl shadow-sky-700/25 backdrop-blur">
        {/* Window bar */}
        <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
          <span className="ml-3 text-xs font-medium text-slate-500">
            FlowPort — Operations Overview
          </span>
          <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Live demo
          </span>
        </div>

        <div className="space-y-3 p-4 text-slate-800">
          {/* KPI row */}
          <div className="grid gap-3 sm:grid-cols-3">
            {kpis.map((k) => (
              <div key={k.label} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                  <k.icon className="h-3.5 w-3.5 text-[#0891B2]" />
                  {k.label}
                </div>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-lg font-semibold tabular-nums text-slate-900">{k.value}</span>
                  <span className="text-[11px] font-medium text-emerald-600">{k.delta}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-[1.6fr_1fr]">
            {/* Mini route chart */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-[11px] font-medium text-slate-500">Delivery Network — Simulated</p>
              <svg viewBox="0 0 400 130" className="mt-1 w-full" role="img" aria-label="Simulated logistics route chart">
                <defs>
                  <linearGradient id="lp-route" x1="0" y1="0" x2="1" y2="0">
                    <stop stopColor="#0891B2" />
                    <stop offset="1" stopColor="#06B6D4" />
                  </linearGradient>
                </defs>
                {[30, 65, 100].map((y) => (
                  <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="#E2E8F0" strokeDasharray="2 5" />
                ))}
                <path
                  d="M 20 100 C 90 60, 150 95, 210 55 S 330 40, 385 30"
                  fill="none"
                  stroke="url(#lp-route)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray="6 5"
                />
                {[
                  { x: 20, y: 100 },
                  { x: 150, y: 85 },
                  { x: 260, y: 55 },
                  { x: 385, y: 30 },
                ].map((p, i) => (
                  <circle key={i} cx={p.x} cy={p.y} r="4.5" fill="#fff" stroke="#0891B2" strokeWidth="2.5" />
                ))}
              </svg>
            </div>

            {/* Warehouse bars */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
                <Warehouse className="h-3.5 w-3.5 text-[#0891B2]" />
                Warehouse Load
              </div>
              <div className="mt-2.5 space-y-2.5">
                {warehouses.map((w) => (
                  <div key={w.name}>
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>{w.name}</span>
                      <span className="tabular-nums">{w.v}%</span>
                    </div>
                    <div className="mt-0.5 h-1.5 overflow-hidden rounded-full bg-slate-200">
                      <div
                        className={`h-full rounded-full ${w.v > 85 ? 'bg-amber-400' : 'bg-[#0891B2]'}`}
                        style={{ width: `${w.v}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI strip */}
          <div className="flex items-start gap-2.5 rounded-xl border border-cyan-200 bg-cyan-50 p-3">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[#0891B2]" />
            <div>
              <p className="text-[11px] font-semibold text-[#0369A1]">Simulated AI Insight</p>
              <p className="text-[11px] leading-relaxed text-slate-600">
                Demand is projected to increase in the Eastern distribution region.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
