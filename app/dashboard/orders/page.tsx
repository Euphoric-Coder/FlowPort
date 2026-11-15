'use client';

import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ArrowUpDown,
  ClipboardList,
  Filter,
  Plus,
  Search,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/layout/page-header';
import { StatusBadge } from '@/components/shared/status-badge';
import { KpiCard } from '@/components/shared/kpi-card';
import { Badge } from '@/components/ui/badge';
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
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import {
  customers,
  orders as seedOrders,
  products,
  warehouses,
} from '@/data/mock';
import { cn } from '@/lib/utils';
import type { DeliveryPriority, Order, OrderStatus } from '@/types';

const PAGE_SIZE = 8;
const STATUSES: OrderStatus[] = ['Created', 'Confirmed', 'Processing', 'Packed', 'Dispatched', 'Delivered', 'Cancelled'];

const createSchema = z.object({
  customer: z.string().min(1, 'Select a customer'),
  warehouse: z.string().min(1, 'Select a warehouse'),
  priority: z.string().min(1, 'Select a priority'),
  product: z.string().min(1, 'Select a product'),
  quantity: z.coerce.number().int('Whole units only').min(1, 'Minimum 1 unit').max(5000, 'Max 5,000 units'),
  destination: z.string().min(2, 'Enter a destination city'),
});

type CreateForm = z.infer<typeof createSchema>;

function sortIcon(isActive: boolean) {
  return cn('ml-1.5 inline-block h-3.5 w-3.5', isActive ? 'text-primary' : 'text-muted-foreground/40');
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(seedOrders);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('all');
  const [sortKey, setSortKey] = useState<'createdAt' | 'value' | 'customerName'>('createdAt');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Order | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = orders;
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.customerCompany.toLowerCase().includes(q) ||
          o.destinationCity.toLowerCase().includes(q)
      );
    }
    if (status !== 'all') list = list.filter((o) => o.status === status);
    if (dateRange !== 'all') {
      list = list.filter((o) => {
        const day = parseInt(o.createdAt.slice(8, 10), 10);
        if (dateRange === '7d') return day >= 5;
        if (dateRange === '30d') return true;
        return true;
      });
    }
    const dir = sortDir === 'asc' ? 1 : -1;
    return [...list].sort((a, b) => {
      if (sortKey === 'value') return (a.value - b.value) * dir;
      const av = sortKey === 'createdAt' ? a.createdAt : a.customerName;
      const bv = sortKey === 'createdAt' ? b.createdAt : b.customerName;
      return av.localeCompare(bv) * dir;
    });
  }, [orders, query, status, dateRange, sortKey, sortDir]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => setPage(1), [query, status, dateRange]);

  const summary = useMemo(() => {
    const open = orders.filter((o) => !['Delivered', 'Cancelled'].includes(o.status)).length;
    const delivered = orders.filter((o) => o.status === 'Delivered').length;
    const value = orders.reduce((s, o) => s + o.value, 0);
    return { open, delivered, value };
  }, [orders]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateForm>({ resolver: zodResolver(createSchema) });
  const [formCustomer, setFormCustomer] = useState('');
  const [formWarehouse, setFormWarehouse] = useState('');
  const [formPriority, setFormPriority] = useState('');
  const [formProduct, setFormProduct] = useState('');

  const onCreate = async (v: CreateForm) => {
    await new Promise((r) => setTimeout(r, 500));
    const customer = customers.find((c) => c.id === v.customer)!;
    const product = products.find((p) => p.id === v.product)!;
    const id = `ORD-${String(orders.length + 1).padStart(3, '0')}`;
    const order: Order = {
      id,
      orderNumber: `#${241100 + orders.length}`,
      customerId: customer.id,
      customerName: customer.name,
      customerCompany: customer.company,
      destinationCity: v.destination,
      items: [
        { productId: product.id, productName: product.name, sku: product.sku, quantity: v.quantity, unitPrice: product.unitValue },
      ],
      itemCount: v.quantity,
      value: v.quantity * product.unitValue,
      status: 'Created',
      priority: v.priority as DeliveryPriority,
      warehouseId: v.warehouse,
      createdAt: '2026-11-12 10:00',
      promisedDate: '2026-11-19',
    };
    setOrders((prev) => [order, ...prev]);
    setCreateOpen(false);
    reset();
    setFormCustomer(''); setFormWarehouse(''); setFormPriority(''); setFormProduct('');
    toast.success('Order created', {
      description: `${order.orderNumber} for ${customer.company} — ${v.quantity} × ${product.name}. Added to local demo state only.`,
    });
  };

  return (
    <>
      <PageHeader
        title="Orders"
        subtitle="Manage incoming orders, fulfillment status, and customer commitments."
        actions={
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Order
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Total Orders" value={String(orders.length)} icon={ClipboardList} accent="blue" hint="In current workspace" />
        <KpiCard label="Open Orders" value={String(summary.open)} icon={Filter} accent="cyan" hint="Not yet delivered" />
        <KpiCard label="Delivered" value={String(summary.delivered)} icon={ClipboardList} accent="emerald" hint="Completed lifecycle" />
        <KpiCard label="Order Value" value={`$${summary.value.toLocaleString()}`} icon={ArrowUpDown} accent="violet" hint="Sum of all mock orders" />
      </div>

      <Card className="mt-6">
        <CardContent className="p-0">
          <div className="flex flex-col gap-3 border-b border-border/60 p-4 lg:flex-row lg:items-center">
            <div className="relative w-full lg:max-w-xs">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search order #, customer, city…"
                className="pl-8"
              />
            </div>
            <div className="flex flex-1 flex-wrap items-center gap-2">
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Dates</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                </SelectContent>
              </Select>
              {(query || status !== 'all' || dateRange !== 'all') && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => { setQuery(''); setStatus('all'); setDateRange('all'); }}
                >
                  <X className="mr-1 h-3.5 w-3.5" />
                  Clear
                </Button>
              )}
              <span className="ml-auto text-xs text-muted-foreground">
                {filtered.length} of {orders.length} orders
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer" onClick={() => { setSortKey('createdAt'); setSortDir(sortKey === 'createdAt' && sortDir === 'desc' ? 'asc' : 'desc'); }}>
                    Order {sortIcon(sortKey === 'createdAt')}
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => { setSortKey('customerName'); setSortDir(sortKey === 'customerName' && sortDir === 'asc' ? 'desc' : 'asc'); }}>
                    Customer {sortIcon(sortKey === 'customerName')}
                  </TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead className="cursor-pointer text-right" onClick={() => { setSortKey('value'); setSortDir(sortKey === 'value' && sortDir === 'desc' ? 'asc' : 'desc'); }}>
                    Value {sortIcon(sortKey === 'value')}
                  </TableHead>
                  <TableHead className="text-right">Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-sm text-muted-foreground">
                      No orders match your filters. Try clearing search or choosing a different status.
                    </TableCell>
                  </TableRow>
                )}
                {paged.map((o) => (
                  <TableRow
                    key={o.id}
                    className="cursor-pointer"
                    onClick={() => setSelected(o)}
                  >
                    <TableCell className="font-medium">{o.orderNumber}</TableCell>
                    <TableCell>
                      <div className="font-medium">{o.customerCompany}</div>
                      <div className="text-xs text-muted-foreground">{o.customerName}</div>
                    </TableCell>
                    <TableCell>{o.destinationCity}</TableCell>
                    <TableCell><StatusBadge status={o.status} /></TableCell>
                    <TableCell><Badge variant="outline">{o.priority}</Badge></TableCell>
                    <TableCell className="text-right tabular-nums">${o.value.toLocaleString()}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{o.createdAt.slice(0, 10)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between border-t border-border/60 p-4">
            <p className="text-xs text-muted-foreground">
              Page {page} of {pageCount} — showing {paged.length} orders
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled={page >= pageCount} onClick={() => setPage((p) => p + 1)}>
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order detail drawer */}
      <Drawer open={!!selected} onOpenChange={(v) => !v && setSelected(null)}>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader>
            <DrawerTitle className="flex items-center gap-3">
              Order {selected?.orderNumber}
              {selected && <StatusBadge status={selected.status} />}
            </DrawerTitle>
            <DrawerDescription>{selected?.customerCompany} — {selected?.destinationCity}</DrawerDescription>
          </DrawerHeader>
          {selected && (
            <div className="overflow-y-auto px-4 pb-6">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardContent className="p-4">
                    <h3 className="text-sm font-semibold">Customer & Fulfillment</h3>
                    <dl className="mt-3 space-y-2 text-sm">
                      {[
                        ['Customer', selected.customerName],
                        ['Email', customers.find((c) => c.id === selected.customerId)?.email ?? '—'],
                        ['Destination', selected.destinationCity],
                        ['Fulfillment Warehouse', selected.warehouseId],
                        ['Priority', selected.priority],
                        ['Promised Date', selected.promisedDate],
                      ].map(([k, v]) => (
                        <div key={k} className="flex justify-between gap-4">
                          <dt className="text-muted-foreground">{k}</dt>
                          <dd className="text-right font-medium">{v}</dd>
                        </div>
                      ))}
                    </dl>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <h3 className="text-sm font-semibold">Order Timeline</h3>
                    <ol className="mt-3 space-y-3">
                      {[
                        ['Order Created', selected.createdAt],
                        ['Confirmed & Validated', selected.status !== 'Created' ? '2026-11-12 11:20' : null],
                        ['Picked & Packed', ['Packed', 'Dispatched', 'Delivered'].includes(selected.status) ? '2026-11-12 14:05' : null],
                        ['Dispatched', ['Dispatched', 'Delivered'].includes(selected.status) ? '2026-11-12 16:40' : null],
                        ['Delivered', selected.status === 'Delivered' ? selected.promisedDate : null],
                      ].map(([label, ts]) => (
                        <li key={label as string} className="flex items-start gap-2.5 text-sm">
                          <span
                            className={cn(
                              'mt-1 h-2 w-2 shrink-0 rounded-full',
                              ts ? 'bg-emerald-500' : 'bg-border'
                            )}
                          />
                          <div>
                            <p className={cn('font-medium', !ts && 'text-muted-foreground')}>{label}</p>
                            {ts && <p className="text-xs text-muted-foreground">{ts}</p>}
                          </div>
                        </li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>
              </div>
              <Card className="mt-4">
                <CardContent className="p-4">
                  <h3 className="text-sm font-semibold">Line Items</h3>
                  <div className="mt-3 overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>SKU</TableHead>
                          <TableHead>Product</TableHead>
                          <TableHead className="text-right">Qty</TableHead>
                          <TableHead className="text-right">Unit Price</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selected.items.map((it) => (
                          <TableRow key={it.sku}>
                            <TableCell className="font-mono text-xs">{it.sku}</TableCell>
                            <TableCell>{it.productName}</TableCell>
                            <TableCell className="text-right tabular-nums">{it.quantity}</TableCell>
                            <TableCell className="text-right tabular-nums">${it.unitPrice}</TableCell>
                            <TableCell className="text-right tabular-nums">${(it.quantity * it.unitPrice).toLocaleString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DrawerContent>
      </Drawer>

      {/* Create order modal */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Order</DialogTitle>
            <DialogDescription>
              The order is validated locally and added to demo state. No backend request is made.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onCreate)} className="space-y-4" noValidate>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Customer</Label>
                <input type="hidden" {...register('customer')} />
                <Select value={formCustomer} onValueChange={(v) => { setFormCustomer(v); setValue('customer', v, { shouldValidate: true }); }}>
                  <SelectTrigger><SelectValue placeholder="Select customer" /></SelectTrigger>
                  <SelectContent>
                    {customers.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.company}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.customer && <p className="text-xs text-red-500">{errors.customer.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>Fulfillment Warehouse</Label>
                <input type="hidden" {...register('warehouse')} />
                <Select value={formWarehouse} onValueChange={(v) => { setFormWarehouse(v); setValue('warehouse', v, { shouldValidate: true }); }}>
                  <SelectTrigger><SelectValue placeholder="Select warehouse" /></SelectTrigger>
                  <SelectContent>
                    {warehouses.map((w) => (
                      <SelectItem key={w.id} value={w.id}>{w.id} — {w.city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.warehouse && <p className="text-xs text-red-500">{errors.warehouse.message}</p>}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Priority</Label>
                <input type="hidden" {...register('priority')} />
                <Select value={formPriority} onValueChange={(v) => { setFormPriority(v); setValue('priority', v, { shouldValidate: true }); }}>
                  <SelectTrigger><SelectValue placeholder="Select priority" /></SelectTrigger>
                  <SelectContent>
                    {['Standard', 'Express', 'Same-Day', 'Economy'].map((p) => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.priority && <p className="text-xs text-red-500">{errors.priority.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>Destination City</Label>
                <Input id="destination" placeholder="e.g. Boston" {...register('destination')} />
                {errors.destination && <p className="text-xs text-red-500">{errors.destination.message}</p>}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
              <div className="space-y-1.5">
                <Label>Product</Label>
                <input type="hidden" {...register('product')} />
                <Select value={formProduct} onValueChange={(v) => { setFormProduct(v); setValue('product', v, { shouldValidate: true }); }}>
                  <SelectTrigger><SelectValue placeholder="Select product" /></SelectTrigger>
                  <SelectContent>
                    {products.map((p) => (
                      <SelectItem key={p.id} value={p.id}>{p.name} ({p.sku})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.product && <p className="text-xs text-red-500">{errors.product.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="quantity">Quantity</Label>
                <Input id="quantity" type="number" min={1} placeholder="10" {...register('quantity')} />
                {errors.quantity && <p className="text-xs text-red-500">{errors.quantity.message}</p>}
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating…' : 'Create Order'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
