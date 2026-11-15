'use client';

import { useMemo, useState } from 'react';
import {
  BatteryCharging,
  Fuel,
  Gauge,
  MapPin,
  Package,
  Search,
  Truck,
  Wrench,
  X,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { StatusBadge } from '@/components/shared/status-badge';
import { KpiCard } from '@/components/shared/kpi-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { vehicles } from '@/data/mock';
import { cn } from '@/lib/utils';
import type { Vehicle } from '@/types';

export default function FleetPage() {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState<Vehicle | null>(null);

  const filtered = useMemo(() => {
    let list = vehicles;
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (v) =>
          v.name.toLowerCase().includes(q) ||
          v.driver.toLowerCase().includes(q) ||
          v.routeName.toLowerCase().includes(q) ||
          v.location.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== 'all') list = list.filter((v) => v.status === statusFilter);
    return list;
  }, [query, statusFilter]);

  const stats = useMemo(
    () => ({
      total: vehicles.length,
      available: vehicles.filter((v) => v.status === 'Available').length,
      transit: vehicles.filter((v) => v.status === 'In Transit' || v.status === 'On Route').length,
      maintenance: vehicles.filter((v) => v.status === 'Maintenance').length,
    }),
    []
  );

  const loadPct = (v: Vehicle) => Math.round((v.loadKg / v.capacityKg) * 100);

  return (
    <>
      <PageHeader
        title="Fleet Management"
        subtitle="Vehicles, drivers, capacity, and operational status across the demo fleet."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Total Vehicles" value={String(stats.total)} icon={Truck} accent="blue" hint="In demo workspace" />
        <KpiCard label="Available" value={String(stats.available)} icon={Gauge} accent="emerald" hint="Ready for dispatch" />
        <KpiCard label="In Transit / On Route" value={String(stats.transit)} icon={MapPin} accent="cyan" hint="Moving now" />
        <KpiCard label="Under Maintenance" value={String(stats.maintenance)} icon={Wrench} accent="amber" hint="Unavailable" />
      </div>

      {/* Fleet activity visualization */}
      <Card className="mt-6">
        <CardContent className="p-5">
          <h2 className="text-sm font-semibold">Fleet Activity — Load & Fuel Snapshot</h2>
          <p className="text-xs text-muted-foreground">
            Each bar shows current load and fuel or charge level per vehicle (simulated telemetry).
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {vehicles.map((v) => {
              const load = loadPct(v);
              return (
                <button
                  key={v.id}
                  onClick={() => setSelected(v)}
                  className="rounded-lg border border-border/60 bg-elevated p-3 text-left transition-colors hover:border-primary/40"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold">{v.name}</span>
                    <span className="text-[10px] text-muted-foreground">{v.type.split(' ')[0]}</span>
                  </div>
                  <div className="mt-2 space-y-1.5">
                    <div>
                      <div className="flex justify-between text-[10px] text-muted-foreground">
                        <span>Load</span><span>{load}%</span>
                      </div>
                      <Progress value={load} className="h-1" indicatorClassName={load > 90 ? 'bg-amber-500' : 'bg-blue-500'} />
                    </div>
                    <div>
                      <div className="flex justify-between text-[10px] text-muted-foreground">
                        <span>{v.fuelKind === 'Electric' ? 'Charge' : 'Fuel'}</span><span>{v.fuelLevel}%</span>
                      </div>
                      <Progress value={v.fuelLevel} className="h-1" indicatorClassName={v.fuelLevel < 30 ? 'bg-red-500' : 'bg-emerald-500'} />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardContent className="p-0">
          <div className="flex flex-col gap-3 border-b border-border/60 p-4 lg:flex-row lg:items-center">
            <div className="relative w-full lg:max-w-xs">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search vehicle, driver, route…"
                className="pl-8"
              />
            </div>
            <div className="flex flex-1 flex-wrap items-center gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {['Available', 'In Transit', 'On Route', 'Maintenance', 'Charging'].map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {(query || statusFilter !== 'all') && (
                <Button variant="ghost" size="sm" onClick={() => { setQuery(''); setStatusFilter('all'); }}>
                  <X className="mr-1 h-3.5 w-3.5" />
                  Clear
                </Button>
              )}
              <span className="ml-auto text-xs text-muted-foreground">{filtered.length} vehicles</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Assigned Route</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="w-[130px]">Fuel / Charge</TableHead>
                  <TableHead className="text-right">Capacity</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="h-32 text-center text-sm text-muted-foreground">
                      No vehicles match your search.
                    </TableCell>
                  </TableRow>
                )}
                {filtered.map((v) => (
                  <TableRow key={v.id} className="cursor-pointer" onClick={() => setSelected(v)}>
                    <TableCell className="font-mono text-xs font-medium text-primary">{v.name}</TableCell>
                    <TableCell className="text-sm">{v.type}</TableCell>
                    <TableCell className="text-sm">{v.driver}</TableCell>
                    <TableCell className="text-sm">
                      {v.routeId !== '—' ? (
                        <>
                          <span className="font-medium">{v.routeId}</span>
                          <span className="block text-xs text-muted-foreground">{v.routeName}</span>
                        </>
                      ) : (
                        <span className="text-muted-foreground">Unassigned</span>
                      )}
                    </TableCell>
                    <TableCell className="max-w-[180px] truncate text-sm text-muted-foreground">{v.location}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        {v.fuelKind === 'Electric' ? (
                          <BatteryCharging className="h-3.5 w-3.5 text-emerald-500" />
                        ) : (
                          <Fuel className="h-3.5 w-3.5 text-muted-foreground" />
                        )}
                        <span className={cn('text-sm tabular-nums', v.fuelLevel < 30 && 'font-medium text-red-500')}>
                          {v.fuelLevel}%
                        </span>
                        <span className="text-[10px] text-muted-foreground">{v.fuelKind}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-xs tabular-nums">
                      {v.loadKg.toLocaleString()} / {v.capacityKg.toLocaleString()} kg
                    </TableCell>
                    <TableCell><StatusBadge status={v.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selected} onOpenChange={(v) => !v && setSelected(null)}>
        <DialogContent className="max-w-lg">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <span className="font-mono text-primary">{selected.name}</span>
                  <StatusBadge status={selected.status} />
                </DialogTitle>
                <DialogDescription>{selected.type} · {selected.fuelKind}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Driver', value: selected.driver, icon: Truck },
                    { label: 'Current Location', value: selected.location, icon: MapPin },
                    { label: 'Assigned Route', value: `${selected.routeId} — ${selected.routeName}`, icon: MapPin },
                    { label: 'Current Load', value: `${selected.loadKg.toLocaleString()} / ${selected.capacityKg.toLocaleString()} kg (${loadPct(selected)}%)`, icon: Package },
                    { label: 'Odometer', value: `${selected.odometerKm.toLocaleString()} km`, icon: Gauge },
                    { label: 'Last Service', value: selected.lastServiceDate, icon: Wrench },
                  ].map((d) => (
                    <div key={d.label} className="rounded-lg border border-border/60 bg-elevated p-3">
                      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <d.icon className="h-3 w-3" />
                        {d.label}
                      </p>
                      <p className="mt-0.5 text-sm font-medium">{d.value}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{selected.fuelKind === 'Electric' ? 'Battery' : 'Fuel'}</span>
                      <span className="tabular-nums">{selected.fuelLevel}%</span>
                    </div>
                    <Progress value={selected.fuelLevel} className="h-1.5" indicatorClassName={selected.fuelLevel < 30 ? 'bg-red-500' : 'bg-emerald-500'} />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Capacity utilization</span>
                      <span className="tabular-nums">{loadPct(selected)}%</span>
                    </div>
                    <Progress value={loadPct(selected)} className="h-1.5" indicatorClassName={loadPct(selected) > 90 ? 'bg-amber-500' : 'bg-blue-500'} />
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
