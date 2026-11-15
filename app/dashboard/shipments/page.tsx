'use client';

import { useMemo, useState } from 'react';
import { Check, Circle, MapPin, Search, Truck, X } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { StatusBadge } from '@/components/shared/status-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
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
import { shipments } from '@/data/mock';
import { cn } from '@/lib/utils';
import type { Shipment, ShipmentStatus } from '@/types';

const STATUSES: ShipmentStatus[] = ['Pending', 'In Warehouse', 'Dispatched', 'In Transit', 'Out for Delivery', 'Delivered', 'Delayed', 'Exception'];

export default function ShipmentsPage() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<string>('all');
  const [selected, setSelected] = useState<Shipment | null>(null);

  const filtered = useMemo(() => {
    let list = shipments;
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (s) =>
          s.trackingId.toLowerCase().includes(q) ||
          s.orderNumber.toLowerCase().includes(q) ||
          s.customerName.toLowerCase().includes(q) ||
          s.destination.toLowerCase().includes(q) ||
          s.origin.toLowerCase().includes(q)
      );
    }
    if (status !== 'all') list = list.filter((s) => s.status === status);
    return list;
  }, [query, status]);

  return (
    <>
      <PageHeader
        title="Shipments"
        subtitle="Track every parcel across the network with live status and delivery progress."
      />

      <Card>
        <CardContent className="p-0">
          <div className="flex flex-col gap-3 border-b border-border/60 p-4 lg:flex-row lg:items-center">
            <div className="relative w-full lg:max-w-xs">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tracking ID, order, city…"
                className="pl-8"
              />
            </div>
            <div className="flex flex-1 flex-wrap items-center gap-2">
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {(query || status !== 'all') && (
                <Button variant="ghost" size="sm" onClick={() => { setQuery(''); setStatus('all'); }}>
                  <X className="mr-1 h-3.5 w-3.5" />
                  Clear
                </Button>
              )}
              <span className="ml-auto text-xs text-muted-foreground">{filtered.length} shipments</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tracking ID</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Carrier / Vehicle</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[160px]">Progress</TableHead>
                  <TableHead className="text-right">ETA</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-sm text-muted-foreground">
                      No shipments match your search. Try a tracking ID like “FPX-107717”.
                    </TableCell>
                  </TableRow>
                )}
                {filtered.map((s) => (
                  <TableRow key={s.id} className="cursor-pointer" onClick={() => setSelected(s)}>
                    <TableCell>
                      <div className="font-mono text-xs font-medium text-primary">{s.trackingId}</div>
                      <div className="text-xs text-muted-foreground">{s.orderNumber}</div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[220px] truncate text-sm font-medium">{s.origin}</div>
                      <div className="max-w-[220px] truncate text-xs text-muted-foreground">→ {s.destination}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{s.carrier}</div>
                      <div className="text-xs text-muted-foreground">{s.vehicleName} · {s.driver}</div>
                    </TableCell>
                    <TableCell><StatusBadge status={s.status} /></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={s.progress} className="h-1.5" />
                        <span className="w-9 text-right text-xs tabular-nums text-muted-foreground">{s.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-xs tabular-nums text-muted-foreground">
                      {s.estimatedArrival}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selected} onOpenChange={(v) => !v && setSelected(null)}>
        <DialogContent className="max-w-2xl">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-primary">{selected.trackingId}</span>
                  <StatusBadge status={selected.status} />
                </DialogTitle>
                <DialogDescription>
                  {selected.origin} → {selected.destination} · {selected.distanceKm.toLocaleString()} km · {selected.weightKg.toLocaleString()} kg
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { label: 'Carrier', value: selected.carrier },
                  { label: 'Vehicle', value: selected.vehicleName },
                  { label: 'Driver', value: selected.driver },
                ].map((d) => (
                  <div key={d.label} className="rounded-lg border border-border/60 bg-elevated p-3">
                    <p className="text-xs text-muted-foreground">{d.label}</p>
                    <p className="mt-0.5 text-sm font-medium">{d.value}</p>
                  </div>
                ))}
              </div>

              <div>
                <p className="mb-1 text-xs text-muted-foreground">Delivery progress</p>
                <div className="flex items-center gap-3">
                  <Progress value={selected.progress} className="h-2" />
                  <span className="text-sm font-medium tabular-nums">{selected.progress}%</span>
                </div>
                <p className="mt-1.5 text-xs text-muted-foreground">
                  Estimated arrival: <span className="font-medium text-foreground">{selected.estimatedArrival}</span>
                </p>
              </div>

              <div>
                <p className="mb-3 text-sm font-semibold">Shipment Timeline</p>
                <ol className="relative space-y-4 before:absolute before:left-[11px] before:top-2 before:h-[calc(100%-16px)] before:w-px before:bg-border">
                  {selected.events.map((e, i) => (
                    <li key={i} className="relative flex items-start gap-3.5">
                      <span
                        className={cn(
                          'z-10 mt-0.5 flex h-6 w-6 items-center justify-center rounded-full border-2',
                          e.completed
                            ? 'border-emerald-500 bg-emerald-500 text-white'
                            : 'border-border bg-card text-muted-foreground'
                        )}
                      >
                        {e.completed ? <Check className="h-3 w-3" /> : <Circle className="h-2 w-2" />}
                      </span>
                      <div className="min-w-0 flex-1 pb-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className={cn('text-sm font-medium', !e.completed && 'text-muted-foreground')}>
                            {e.label}
                          </p>
                          <Badge variant="outline" className="gap-1 text-[10px]">
                            <MapPin className="h-2.5 w-2.5" />
                            {e.location}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{e.description}</p>
                        <p className="text-[11px] text-muted-foreground/70">{e.timestamp}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
