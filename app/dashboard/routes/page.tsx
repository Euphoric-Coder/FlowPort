'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  DollarSign,
  Flag,
  Fuel,
  Loader2,
  MapPin,
  Route as RouteIcon,
  Sparkles,
  Zap,
} from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/layout/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { DeliveryPriority, RouteOption, RoutePreference } from '@/types';

const CITIES = [
  'New York', 'Boston', 'Chicago', 'Dallas', 'Atlanta', 'Denver',
  'Seattle', 'Los Angeles', 'Miami', 'Memphis', 'Phoenix', 'Houston',
];

const VEHICLES = ['FP-1001 (Semi-Trailer)', 'FP-1002 (Van)', 'FP-1004 (Box Truck)', 'FP-1008 (Van EV)'];

const PREFERENCES: RoutePreference[] = ['Shortest Distance', 'Fastest Delivery', 'Balanced', 'Fuel Efficient'];
const PRIORITIES: DeliveryPriority[] = ['Standard', 'Express', 'Same-Day', 'Economy'];

interface ScenarioInput {
  origin: string;
  destination: string;
  vehicle: string;
  priority: DeliveryPriority;
  preference: RoutePreference;
}

function buildRoutes(input: ScenarioInput): RouteOption[] {
  const seedNum =
    input.origin.length * 31 +
    input.destination.length * 17 +
    input.vehicle.length +
    input.preference.length * 7;
  const base = 380 + (seedNum % 320);
  const h = (n: number) => ((seedNum * n) % 97) / 97;

  const variants: Array<{ label: string; via: string[]; distMul: number; timeMul: number; costMul: number; traffic: RouteOption['traffic'] }> = [
    { label: 'Option A — Highway Corridor', via: ['I-90 W', 'I-80 W'], distMul: 1.0, timeMul: 1.0, costMul: 1.0, traffic: 'Moderate' },
    { label: 'Option B — Express Lanes', via: ['US-20 W', 'Toll 44'], distMul: 1.12, timeMul: 0.86, costMul: 1.18, traffic: 'Light' },
    { label: 'Option C — Southern Loop', via: ['I-70 W', 'US-63 S'], distMul: 1.24, timeMul: 1.18, costMul: 0.92, traffic: 'Heavy' },
  ];

  const effWeights: Record<RoutePreference, [number, number, number]> = {
    'Shortest Distance': [1.0, 0.35, 0.2],
    'Fastest Delivery': [0.3, 1.0, 0.25],
    'Balanced': [0.6, 0.6, 0.5],
    'Fuel Efficient': [0.4, 0.3, 1.0],
  };
  const [wd, wt, wc] = effWeights[input.preference];

  const routes = variants.map((v, i) => {
    const distanceKm = Math.round(base * v.distMul + h(i + 1) * 40);
    const durationMin = Math.round((base * 1.05) * v.timeMul + h(i + 2) * 50);
    const cost = Math.round((base * 1.6) * v.costMul + h(i + 3) * 120);
    const stops = 2 + ((seedNum + i * 13) % 4);
    const norm = (x: number, min: number, max: number) => 1 - (x - min) / (max - min);
    const efficiency = Math.round(
      100 *
        (0.55 +
          0.14 * (wd * norm(distanceKm, base * 0.95, base * 1.3) + wt * norm(durationMin, base * 0.85, base * 1.3) + wc * norm(cost, base * 1.4, base * 2.0)) -
          0.1 * (v.traffic === 'Heavy' ? 1 : v.traffic === 'Moderate' ? 0.4 : 0) +
          h(i + 5) * 0.12)
    );
    const mx = 180 + ((seedNum + i * 61) % 220);
    const my = 90 + i * 62 + ((seedNum + i * 29) % 30);
    return {
      id: `R-${i + 1}`,
      label: v.label,
      via: v.via,
      distanceKm,
      durationMin,
      stops,
      cost,
      efficiency: Math.max(42, Math.min(98, efficiency)),
      traffic: v.traffic,
      recommended: false,
      path: `M 40 200 C ${mx * 0.5} ${my - 40}, ${mx} ${my}, 500 ${150 + i * 36 - 30}`,
    };
  });

  const best = routes.reduce((a, b) => (b.efficiency > a.efficiency ? b : a));
  best.recommended = true;
  return routes;
}

function formatDuration(min: number) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${h}h ${String(m).padStart(2, '0')}m`;
}

export default function RoutePlanningPage() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [priority, setPriority] = useState<DeliveryPriority | ''>('');
  const [preference, setPreference] = useState<RoutePreference | ''>('');
  const [optimizing, setOptimizing] = useState(false);
  const [routes, setRoutes] = useState<RouteOption[] | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);

  const canOptimize = origin && destination && vehicle && priority && preference;

  const optimize = () => {
    if (!canOptimize) return;
    setOptimizing(true);
    setRoutes(null);
    setSelectedRoute(null);
    setTimeout(() => {
      setRoutes(buildRoutes({ origin, destination, vehicle, priority: priority as DeliveryPriority, preference: preference as RoutePreference }));
      setOptimizing(false);
      toast.success('Optimization complete', {
        description: '3 simulated route alternatives generated from deterministic demo data.',
      });
    }, 1600);
  };

  const active = routes?.find((r) => r.id === selectedRoute) ?? routes?.find((r) => r.recommended) ?? null;

  return (
    <>
      <PageHeader
        title="Route Planning"
        subtitle="Compare simulated route alternatives and pick the best corridor for the job."
      />

      <div className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/[0.06] px-4 py-2.5 text-xs font-medium text-amber-600 dark:text-amber-400">
        Route Optimization Demo — No live routing engine connected. All results are deterministic
        sample data for demonstration purposes.
      </div>

      <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
        <Card className="h-fit">
          <CardContent className="space-y-4 p-5">
            <div className="space-y-1.5">
              <Label>Origin</Label>
              <Select value={origin} onValueChange={setOrigin}>
                <SelectTrigger><SelectValue placeholder="Select origin city" /></SelectTrigger>
                <SelectContent>
                  {CITIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Destination</Label>
              <Select value={destination} onValueChange={setDestination}>
                <SelectTrigger><SelectValue placeholder="Select destination city" /></SelectTrigger>
                <SelectContent>
                  {CITIES.filter((c) => c !== origin).map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Vehicle</Label>
              <Select value={vehicle} onValueChange={setVehicle}>
                <SelectTrigger><SelectValue placeholder="Select vehicle" /></SelectTrigger>
                <SelectContent>
                  {VEHICLES.map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Priority</Label>
                <Select value={priority} onValueChange={(v) => setPriority(v as DeliveryPriority)}>
                  <SelectTrigger><SelectValue placeholder="Level" /></SelectTrigger>
                  <SelectContent>
                    {PRIORITIES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Preference</Label>
                <Select value={preference} onValueChange={(v) => setPreference(v as RoutePreference)}>
                  <SelectTrigger><SelectValue placeholder="Goal" /></SelectTrigger>
                  <SelectContent>
                    {PREFERENCES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button className="w-full" disabled={!canOptimize || optimizing} onClick={optimize}>
              {optimizing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Optimizing…
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Optimize Route
                </>
              )}
            </Button>
            {!canOptimize && (
              <p className="text-center text-xs text-muted-foreground">
                Fill in all fields to run the simulated optimizer.
              </p>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          {optimizing && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center gap-4 py-20">
                <div className="relative">
                  <RouteIcon className="h-10 w-10 text-primary animate-pulse" />
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-primary/30 border-t-primary"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    style={{ width: 56, height: 56, left: -8, top: -8 }}
                  />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">Evaluating corridors, traffic patterns, and stop sequences…</p>
                  <p className="text-xs text-muted-foreground">Simulated optimization — no live routing engine</p>
                </div>
                <div className="w-48">
                  <motion.div
                    className="h-1.5 overflow-hidden rounded-full bg-border"
                  >
                    <motion.div
                      className="h-full rounded-full bg-primary"
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 1.5 }}
                    />
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          )}

          {!optimizing && !routes && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center gap-3 py-20 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <RouteIcon className="h-6 w-6" />
                </div>
                <p className="font-medium">No route generated yet</p>
                <p className="max-w-sm text-sm text-muted-foreground">
                  Choose an origin, destination, vehicle, priority, and route preference on the left,
                  then run the optimizer to compare three simulated alternatives.
                </p>
              </CardContent>
            </Card>
          )}

          {routes && !optimizing && (
            <>
              <div className="grid gap-4 md:grid-cols-3">
                {routes.map((r, i) => (
                  <motion.button
                    key={r.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.12 }}
                    onClick={() => setSelectedRoute(r.id)}
                    className={cn(
                      'relative rounded-xl border bg-card p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-lg',
                      r.recommended ? 'border-emerald-500/50 shadow-md shadow-emerald-500/10' : 'border-border/70',
                      selectedRoute === r.id && 'ring-2 ring-primary/50'
                    )}
                  >
                    {r.recommended && (
                      <Badge className="absolute -top-2.5 left-4 gap-1 bg-emerald-500 text-white">
                        <CheckCircle2 className="h-3 w-3" />
                        Best Match
                      </Badge>
                    )}
                    <p className="text-sm font-semibold">{r.label}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">via {r.via.join(' → ')}</p>
                    <div className="mt-3 space-y-1.5 text-sm">
                      <p className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" /> {r.distanceKm.toLocaleString()} km
                      </p>
                      <p className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" /> {formatDuration(r.durationMin)}
                      </p>
                      <p className="flex items-center gap-2 text-muted-foreground">
                        <Flag className="h-3.5 w-3.5" /> {r.stops} delivery stops
                      </p>
                      <p className="flex items-center gap-2 text-muted-foreground">
                        <DollarSign className="h-3.5 w-3.5" /> ${r.cost.toLocaleString()} est. cost
                      </p>
                    </div>
                    <div className="mt-3 border-t border-border/60 pt-3">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Efficiency score</span>
                        <span className="font-semibold tabular-nums">{r.efficiency}/100</span>
                      </div>
                      <Progress
                        value={r.efficiency}
                        className="mt-1 h-1.5"
                        indicatorClassName={r.efficiency > 80 ? 'bg-emerald-500' : r.efficiency > 60 ? 'bg-blue-500' : 'bg-amber-500'}
                      />
                    </div>
                  </motion.button>
                ))}
              </div>

              {active && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Card>
                    <CardContent className="p-5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h2 className="text-sm font-semibold">
                          Route Preview — {active.label}
                          <Badge variant="outline" className="ml-2">{active.traffic} traffic</Badge>
                        </h2>
                        <p className="text-xs text-muted-foreground">
                          {origin} → {destination}
                        </p>
                      </div>
                      <svg viewBox="0 0 540 240" className="mt-3 w-full" role="img" aria-label="Simulated route preview">
                        <defs>
                          <linearGradient id="route-sel" x1="0" y1="0" x2="1" y2="0">
                            <stop stopColor="#3B82F6" />
                            <stop offset="1" stopColor="#06B6D4" />
                          </linearGradient>
                        </defs>
                        {routes
                          .filter((r) => r.id !== active.id)
                          .map((r) => (
                            <path key={r.id} d={r.path} fill="none" stroke="hsl(var(--border))" strokeWidth="2" strokeDasharray="5 6" />
                          ))}
                        <motion.path
                          d={active.path}
                          fill="none"
                          stroke="url(#route-sel)"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeDasharray="8 6"
                          className="animate-dash-flow"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                        />
                        <circle cx="40" cy="200" r="8" fill="#3B82F6" stroke="hsl(var(--card))" strokeWidth="2.5" />
                        <circle cx="500" cy={150 + (parseInt(active.id.slice(2)) - 1) * 36 - 30} r="8" fill="#06B6D4" stroke="hsl(var(--card))" strokeWidth="2.5" />
                        <text x="40" y="226" textAnchor="middle" fontSize="10" fontWeight="600" fill="hsl(var(--foreground))">Origin</text>
                        <text x="500" y="196" textAnchor="middle" fontSize="10" fontWeight="600" fill="hsl(var(--foreground))">Destination</text>
                      </svg>
                      <div className="mt-2 grid grid-cols-2 gap-3 border-t border-border/60 pt-4 sm:grid-cols-4">
                        {[
                          { icon: Zap, label: 'Distance', value: `${active.distanceKm.toLocaleString()} km` },
                          { icon: Clock, label: 'Duration', value: formatDuration(active.durationMin) },
                          { icon: Fuel, label: 'Est. Cost', value: `$${active.cost.toLocaleString()}` },
                          { icon: CheckCircle2, label: 'Efficiency', value: `${active.efficiency}/100` },
                        ].map((s) => (
                          <div key={s.label} className="text-center">
                            <s.icon className="mx-auto h-4 w-4 text-muted-foreground" />
                            <p className="mt-1 font-semibold tabular-nums">{s.value}</p>
                            <p className="text-[11px] text-muted-foreground">{s.label}</p>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 flex items-start gap-2 rounded-lg border border-blue-500/25 bg-blue-500/[0.06] p-3 text-xs text-muted-foreground">
                        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-500" />
                        Route Optimization Demo — selection does not dispatch a vehicle. Dispatch
                        assignment will be connected in a future version.
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
