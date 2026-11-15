'use client';

import { motion } from 'framer-motion';
import { Package } from 'lucide-react';

interface NetworkNode {
  id: string;
  label: string;
  x: number;
  y: number;
  kind: 'warehouse' | 'port' | 'hub';
  load: number;
}

const nodes: NetworkNode[] = [
  { id: 'WH-001', label: 'New York', x: 250, y: 110, kind: 'warehouse', load: 72 },
  { id: 'WH-002', label: 'Chicago', x: 430, y: 165, kind: 'warehouse', load: 94 },
  { id: 'WH-003', label: 'Dallas', x: 330, y: 330, kind: 'warehouse', load: 31 },
  { id: 'WH-004', label: 'Atlanta', x: 490, y: 295, kind: 'warehouse', load: 63 },
  { id: 'WH-005', label: 'Denver', x: 190, y: 245, kind: 'warehouse', load: 58 },
  { id: 'WH-007', label: 'Los Angeles', x: 40, y: 300, kind: 'warehouse', load: 66 },
  { id: 'WH-006', label: 'Seattle', x: 55, y: 80, kind: 'warehouse', load: 61 },
  { id: 'PRT-1', label: 'Port of NY/NJ', x: 295, y: 150, kind: 'port', load: 80 },
  { id: 'PRT-2', label: 'Port of LA', x: 20, y: 330, kind: 'port', load: 74 },
  { id: 'HUB-1', label: 'Memphis Hub', x: 390, y: 250, kind: 'hub', load: 55 },
];

const links: Array<[string, string]> = [
  ['WH-001', 'PRT-1'],
  ['WH-001', 'WH-002'],
  ['WH-002', 'HUB-1'],
  ['HUB-1', 'WH-004'],
  ['WH-004', 'WH-003'],
  ['WH-003', 'WH-005'],
  ['WH-005', 'WH-007'],
  ['WH-007', 'PRT-2'],
  ['WH-006', 'WH-002'],
  ['WH-005', 'WH-006'],
  ['WH-002', 'WH-004'],
];

const kindStyle: Record<NetworkNode['kind'], { fill: string; stroke: string }> = {
  warehouse: { fill: 'hsl(217 91% 60%)', stroke: 'hsl(217 91% 60%)' },
  port: { fill: 'hsl(189 94% 43%)', stroke: 'hsl(189 94% 43%)' },
  hub: { fill: 'hsl(160 84% 39%)', stroke: 'hsl(160 84% 39%)' },
};

export function NetworkMap() {
  const byId = new Map(nodes.map((n) => [n.id, n]));

  return (
    <div className="relative">
      <svg viewBox="0 0 540 400" className="w-full" role="img" aria-label="Simulated logistics network map">
        <defs>
          <linearGradient id="net-grad" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#3B82F6" />
            <stop offset="1" stopColor="#06B6D4" />
          </linearGradient>
          <radialGradient id="net-glow" cx="50%" cy="50%" r="50%">
            <stop stopColor="hsl(217 91% 60%)" stopOpacity="0.06" />
            <stop offset="1" stopColor="transparent" />
          </radialGradient>
        </defs>
        <rect width="540" height="400" fill="url(#net-glow)" />

        {/* Graticule */}
        {Array.from({ length: 9 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 67.5} y1="0" x2={i * 67.5} y2="400" stroke="hsl(var(--border))" strokeDasharray="2 8" />
        ))}
        {Array.from({ length: 7 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 66.6} x2="540" y2={i * 66.6} stroke="hsl(var(--border))" strokeDasharray="2 8" />
        ))}

        {/* Routes */}
        {links.map(([a, b], i) => {
          const na = byId.get(a)!;
          const nb = byId.get(b)!;
          const mx = (na.x + nb.x) / 2 + (i % 2 === 0 ? 14 : -14);
          const my = (na.y + nb.y) / 2 + (i % 3 === 0 ? 12 : -10);
          return (
            <motion.path
              key={`${a}-${b}`}
              d={`M ${na.x} ${na.y} Q ${mx} ${my} ${nb.x} ${nb.y}`}
              fill="none"
              stroke="url(#net-grad)"
              strokeWidth="1.6"
              strokeOpacity="0.65"
              strokeDasharray="6 5"
              className="animate-dash-flow"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: i * 0.06 }}
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((n, i) => {
          const s = kindStyle[n.kind];
          const hot = n.load > 85;
          return (
            <motion.g
              key={n.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.05 }}
            >
              {hot && (
                <circle cx={n.x} cy={n.y} r="14" fill="hsl(38 92% 50%)" fillOpacity="0.15" className="animate-pulse-dot" />
              )}
              <circle cx={n.x} cy={n.y} r="7" fill={s.fill} fillOpacity="0.9" stroke="hsl(var(--card))" strokeWidth="2" />
              <text x={n.x} y={n.y - 12} textAnchor="middle" fontSize="9.5" fontWeight="600" fill="hsl(var(--foreground))">
                {n.label}
              </text>
              <text x={n.x} y={n.y + 18} textAnchor="middle" fontSize="8" fill="hsl(var(--muted-foreground))">
                {n.id} · {n.load}%
              </text>
            </motion.g>
          );
        })}
      </svg>

      <div className="mt-2 flex flex-wrap items-center gap-4 border-t border-border/60 pt-3 text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-blue-500" /> Warehouse
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-cyan-500" /> Port
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500" /> Sort Hub
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 animate-pulse-dot rounded-full bg-amber-500" /> High load (&gt;85%)
        </span>
        <span className="ml-auto inline-flex items-center gap-1.5">
          <Package className="h-3 w-3" /> 1,284 shipments in motion
        </span>
      </div>
    </div>
  );
}
