'use client';

import { useMemo, useState } from 'react';
import { AlertTriangle, Boxes, Search, X } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { StatusBadge } from '@/components/shared/status-badge';
import { KpiCard } from '@/components/shared/kpi-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
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
import { inventory } from '@/data/mock';
import type { InventoryItem } from '@/types';

export default function InventoryPage() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [warehouse, setWarehouse] = useState('all');
  const [sortKey, setSortKey] = useState<'sku' | 'currentStock' | 'availableStock'>('sku');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [selected, setSelected] = useState<InventoryItem | null>(null);

  const warehouseOptions = useMemo(
    () => Array.from(new Set(inventory.map((i) => i.warehouseId))),
    []
  );

  const lowStock = inventory.filter((i) => i.status === 'Low Stock' || i.status === 'Critical' || i.status === 'Out of Stock');

  const filtered = useMemo(() => {
    let list = inventory;
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (i) =>
          i.sku.toLowerCase().includes(q) ||
          i.productName.toLowerCase().includes(q) ||
          i.category.toLowerCase().includes(q)
      );
    }
    if (status !== 'all') list = list.filter((i) => i.status === status);
    if (warehouse !== 'all') list = list.filter((i) => i.warehouseId === warehouse);
    const dir = sortDir === 'asc' ? 1 : -1;
    return [...list].sort((a, b) => {
      if (sortKey === 'sku') return a.sku.localeCompare(b.sku) * dir;
      return (a[sortKey] - b[sortKey]) * dir;
    });
  }, [query, status, warehouse, sortKey, sortDir]);

  const totals = useMemo(() => {
    const units = inventory.reduce((s, i) => s + i.currentStock, 0);
    const reserved = inventory.reduce((s, i) => s + i.reservedStock, 0);
    return { units, reserved, available: units - reserved };
  }, []);

  const toggleSort = (key: typeof sortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('asc'); }
  };

  return (
    <>
      <PageHeader
        title="Inventory"
        subtitle="Track stock levels, reservations, and reorder thresholds across all facilities."
      />

      {lowStock.length > 0 && (
        <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {lowStock.slice(0, 3).map((i) => (
            <Card key={i.id} className="border-amber-500/30 bg-amber-500/[0.04]">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-amber-500">
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{i.productName}</p>
                  <p className="text-xs text-muted-foreground">
                    {i.status} at {i.warehouseId} — {i.currentStock} left (threshold {i.reorderThreshold})
                  </p>
                </div>
                <StatusBadge status={i.status} className="ml-auto shrink-0" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard label="Total Units On Hand" value={totals.units.toLocaleString()} icon={Boxes} accent="blue" hint="Across all warehouses" />
        <KpiCard label="Reserved Units" value={totals.reserved.toLocaleString()} icon={Boxes} accent="amber" hint="Allocated to orders" />
        <KpiCard label="Available Units" value={totals.available.toLocaleString()} icon={Boxes} accent="emerald" hint="Ready to promise" />
      </div>

      <Card className="mt-6">
        <CardContent className="p-0">
          <div className="flex flex-col gap-3 border-b border-border/60 p-4 lg:flex-row lg:items-center">
            <div className="relative w-full lg:max-w-xs">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search SKU, product, category…"
                className="pl-8"
              />
            </div>
            <div className="flex flex-1 flex-wrap items-center gap-2">
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {['In Stock', 'Low Stock', 'Critical', 'Out of Stock'].map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={warehouse} onValueChange={setWarehouse}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Warehouse" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Warehouses</SelectItem>
                  {warehouseOptions.map((w) => (
                    <SelectItem key={w} value={w}>{w}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {(query || status !== 'all' || warehouse !== 'all') && (
                <Button variant="ghost" size="sm" onClick={() => { setQuery(''); setStatus('all'); setWarehouse('all'); }}>
                  <X className="mr-1 h-3.5 w-3.5" />
                  Clear
                </Button>
              )}
              <span className="ml-auto text-xs text-muted-foreground">{filtered.length} items</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer" onClick={() => toggleSort('sku')}>SKU</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Warehouse</TableHead>
                  <TableHead className="cursor-pointer text-right" onClick={() => toggleSort('currentStock')}>Current {sortKey === 'currentStock' ? (sortDir === 'asc' ? '↑' : '↓') : ''}</TableHead>
                  <TableHead className="text-right">Reserved</TableHead>
                  <TableHead className="cursor-pointer text-right" onClick={() => toggleSort('availableStock')}>Available {sortKey === 'availableStock' ? (sortDir === 'asc' ? '↑' : '↓') : ''}</TableHead>
                  <TableHead className="text-right">Reorder At</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="h-32 text-center text-sm text-muted-foreground">
                      No inventory items match your filters.
                    </TableCell>
                  </TableRow>
                )}
                {filtered.map((i) => (
                  <TableRow key={i.id} className="cursor-pointer" onClick={() => setSelected(i)}>
                    <TableCell className="font-mono text-xs">{i.sku}</TableCell>
                    <TableCell>
                      <div className="font-medium">{i.productName}</div>
                      <div className="text-xs text-muted-foreground">{i.category}</div>
                    </TableCell>
                    <TableCell>{i.warehouseId}</TableCell>
                    <TableCell className="text-right tabular-nums">{i.currentStock.toLocaleString()}</TableCell>
                    <TableCell className="text-right tabular-nums text-muted-foreground">{i.reservedStock.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-medium tabular-nums">{i.availableStock.toLocaleString()}</TableCell>
                    <TableCell className="text-right tabular-nums text-muted-foreground">{i.reorderThreshold}</TableCell>
                    <TableCell><StatusBadge status={i.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Drawer open={!!selected} onOpenChange={(v) => !v && setSelected(null)}>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader>
            <DrawerTitle className="flex items-center gap-3">
              {selected?.productName}
              {selected && <StatusBadge status={selected.status} />}
            </DrawerTitle>
            <DrawerDescription>
              {selected?.sku} · {selected?.category} · {selected?.warehouseName}
            </DrawerDescription>
          </DrawerHeader>
          {selected && (
            <div className="space-y-5 overflow-y-auto px-4 pb-6">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  ['Current Stock', selected.currentStock.toLocaleString()],
                  ['Reserved', selected.reservedStock.toLocaleString()],
                  ['Available', selected.availableStock.toLocaleString()],
                  ['Reorder Threshold', selected.reorderThreshold.toLocaleString()],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-lg border border-border/60 bg-elevated p-3 text-center">
                    <p className="text-lg font-semibold tabular-nums">{v}</p>
                    <p className="text-[11px] text-muted-foreground">{k}</p>
                  </div>
                ))}
              </div>
              <div>
                <div className="mb-1.5 flex justify-between text-sm">
                  <span className="text-muted-foreground">Stock health vs. reorder threshold</span>
                  <span className="font-medium tabular-nums">
                    {Math.min(100, Math.round((selected.currentStock / (selected.reorderThreshold * 3)) * 100))}%
                  </span>
                </div>
                <Progress
                  value={Math.min(100, (selected.currentStock / (selected.reorderThreshold * 3)) * 100)}
                  className="h-2.5"
                  indicatorClassName={selected.currentStock <= selected.reorderThreshold ? 'bg-amber-500' : 'bg-emerald-500'}
                />
                <p className="mt-1.5 text-xs text-muted-foreground">
                  Unit value ${selected.unitValue} · Stock value ${(selected.currentStock * selected.unitValue).toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}
