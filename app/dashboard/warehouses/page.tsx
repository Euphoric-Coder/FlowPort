'use client';

import { useState } from 'react';
import { ArrowDownToLine, ArrowUpFromLine, Boxes, MapPin, Truck, User, Warehouse as WarehouseIcon } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { StatusBadge } from '@/components/shared/status-badge';
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
import { warehouses } from '@/data/mock';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { ActivityFeed } from '@/components/dashboard/activity-insights';

export default function WarehousesPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const selected = warehouses.find((w) => w.id === selectedId) ?? null;

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <PageHeader
        title="Warehouses"
        subtitle="Monitor capacity, flow, and operational status across your distribution network."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-48 rounded-xl" />)
          : warehouses.map((w) => {
              const tone =
                w.utilization > 88 ? 'bg-amber-500' : w.utilization > 60 ? 'bg-emerald-500' : 'bg-blue-500';
              return (
                <Card
                  key={w.id}
                  className="cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/10"
                  onClick={() => setSelectedId(w.id)}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <WarehouseIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-semibold">{w.id}</p>
                          <p className="text-xs text-muted-foreground">{w.name}</p>
                        </div>
                      </div>
                      <StatusBadge status={w.status} />
                    </div>

                    <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {w.city} · {w.region}
                    </p>

                    <div className="mt-4 space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Capacity utilization</span>
                        <span className="font-medium tabular-nums">{w.utilization}%</span>
                      </div>
                      <Progress value={w.utilization} indicatorClassName={tone} className="h-2" />
                      <p className="text-[11px] text-muted-foreground tabular-nums">
                        {w.usedPallets.toLocaleString()} / {w.capacityPallets.toLocaleString()} pallets
                      </p>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border/60 pt-3 text-center">
                      {[
                        { icon: ArrowDownToLine, label: 'Inbound', value: w.incoming },
                        { icon: ArrowUpFromLine, label: 'Outbound', value: w.outgoing },
                        { icon: Boxes, label: 'Queue', value: w.pendingFulfillment },
                      ].map((m) => (
                        <div key={m.label}>
                          <m.icon className="mx-auto h-3.5 w-3.5 text-muted-foreground" />
                          <p className="mt-1 text-sm font-semibold tabular-nums">{m.value}</p>
                          <p className="text-[10px] text-muted-foreground">{m.label}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
      </div>

      <div className="mt-6 max-w-2xl">
        <ActivityFeed />
      </div>

      <Dialog open={!!selected} onOpenChange={(v) => !v && setSelectedId(null)}>
        <DialogContent className="max-w-2xl">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  {selected.id} — {selected.name}
                  <StatusBadge status={selected.status} />
                </DialogTitle>
                <DialogDescription>
                  {selected.city}, {selected.region} · Managed by {selected.manager}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <div className="mb-1.5 flex justify-between text-sm">
                    <span className="text-muted-foreground">Capacity</span>
                    <span className="font-medium tabular-nums">
                      {selected.usedPallets.toLocaleString()} / {selected.capacityPallets.toLocaleString()} pallets ({selected.utilization}%)
                    </span>
                  </div>
                  <Progress value={selected.utilization} className="h-2.5" indicatorClassName={selected.utilization > 88 ? 'bg-amber-500' : 'bg-blue-500'} />
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    { label: 'Incoming', value: selected.incoming, icon: ArrowDownToLine },
                    { label: 'Outgoing', value: selected.outgoing, icon: ArrowUpFromLine },
                    { label: 'Pending Fulfillment', value: selected.pendingFulfillment, icon: Boxes },
                    { label: 'On-Time Rate', value: `${Math.round(selected.onTimeRate * 10) / 10}%`, icon: Truck },
                  ].map((m) => (
                    <div key={m.label} className="rounded-lg border border-border/60 bg-elevated p-3 text-center">
                      <m.icon className="mx-auto h-4 w-4 text-muted-foreground" />
                      <p className="mt-1 text-lg font-semibold tabular-nums">{m.value}</p>
                      <p className="text-[11px] text-muted-foreground">{m.label}</p>
                    </div>
                  ))}
                </div>

                <div>
                  <h3 className="mb-2 text-sm font-semibold">Inventory Summary</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
                    {[
                      ['Electronics', '4 SKUs'],
                      ['Grocery', '3 SKUs'],
                      ['Pharma', '2 SKUs'],
                      ['Tools', '3 SKUs'],
                      ['Apparel', '2 SKUs'],
                      ['Other', '10 SKUs'],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between rounded-md border border-border/60 bg-elevated px-3 py-2">
                        <span className="text-muted-foreground">{k}</span>
                        <span className="font-medium">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 text-sm font-semibold">Fulfillment Queue</h3>
                  <ul className="space-y-2">
                    {[
                      ['Priority pick — Express orders', `${Math.max(3, selected.pendingFulfillment - 8)} orders`],
                      ['Standard pick waves', `${Math.max(2, selected.pendingFulfillment - 4)} orders`],
                      ['Staged for dispatch', `${Math.min(9, selected.outgoing)} shipments`],
                    ].map(([k, v]) => (
                      <li key={k} className="flex items-center justify-between rounded-md border border-border/60 px-3 py-2 text-sm">
                        <span className="text-muted-foreground">{k}</span>
                        <span className="font-medium tabular-nums">{v}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
