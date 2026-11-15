'use client';

import { useMemo, useState } from 'react';
import { CalendarRange, Download, Map, Package, Sparkles, Truck } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/layout/page-header';
import { ActivityFeed, AiInsightCards } from '@/components/dashboard/activity-insights';
import { NetworkMap } from '@/components/dashboard/network-map';
import { AreaMini, ChartCard, Donut, StackedBars } from '@/components/shared/charts';
import { KpiCard } from '@/components/shared/kpi-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  deliveryPerformance,
  fleetUtilizationData,
  kpis,
  shipmentVolume,
  statusDistribution,
} from '@/data/mock';
import { cn } from '@/lib/utils';
import {
  Activity,
  Boxes,
  ClipboardList,
  Gauge,
  PackageCheck,
  Route,
} from 'lucide-react';

export default function DashboardPage() {
  const [range, setRange] = useState<'7d' | '30d'>('7d');
  const data = shipmentVolume[range];

  const exportReport = () => {
    const rows = [
      ['Metric', 'Value', 'Change %'],
      ['Total Shipments', kpis.totalShipments.value, kpis.totalShipments.change],
      ['Active Deliveries', kpis.activeDeliveries.value, kpis.activeDeliveries.change],
      ['On-Time Delivery Rate', `${kpis.onTimeRate.value}%`, kpis.onTimeRate.change],
      ['Pending Orders', kpis.pendingOrders.value, kpis.pendingOrders.change],
      ['Fleet Utilization', `${kpis.fleetUtilization.value}%`, kpis.fleetUtilization.change],
      ['Warehouse Capacity', `${kpis.warehouseCapacity.value}%`, kpis.warehouseCapacity.change],
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'flowport-overview-report.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Report exported', { description: 'Operations overview downloaded as CSV (mock data).' });
  };

  return (
    <>
      <PageHeader
        title="Operations Overview"
        subtitle="Monitor your logistics network, deliveries, and supply chain performance."
        actions={
          <>
            <Select value={range} onValueChange={(v) => setRange(v as '7d' | '30d')}>
              <SelectTrigger className="w-[150px]">
                <CalendarRange className="mr-1 h-4 w-4 text-muted-foreground" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={exportReport}>
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <KpiCard label="Total Shipments" value={kpis.totalShipments.value.toLocaleString()} change={kpis.totalShipments.change} icon={Package} accent="blue" />
        <KpiCard label="Active Deliveries" value={kpis.activeDeliveries.value.toLocaleString()} change={kpis.activeDeliveries.change} icon={Truck} accent="cyan" />
        <KpiCard label="On-Time Delivery Rate" value={`${kpis.onTimeRate.value}%`} change={kpis.onTimeRate.change} icon={PackageCheck} accent="emerald" />
        <KpiCard label="Pending Orders" value={kpis.pendingOrders.value.toLocaleString()} change={kpis.pendingOrders.change} icon={ClipboardList} accent="amber" />
        <KpiCard label="Fleet Utilization" value={`${kpis.fleetUtilization.value}%`} change={kpis.fleetUtilization.change} icon={Gauge} accent="violet" progress={84.6} />
        <KpiCard label="Warehouse Capacity" value={`${kpis.warehouseCapacity.value}%`} change={kpis.warehouseCapacity.change} icon={Boxes} accent="red" progress={72.4} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-5">
        <ChartCard
          title="Shipment Volume"
          description="Daily shipments vs. completed deliveries"
          icon={Truck}
          className="lg:col-span-3"
          actions={
            <div className="flex rounded-lg border border-border p-0.5">
              {(['7d', '30d'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={cn(
                    'rounded-md px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground',
                    range === r && 'bg-primary/10 text-primary'
                  )}
                >
                  {r === '7d' ? '7 days' : '30 days'}
                </button>
              ))}
            </div>
          }
        >
          <AreaMini
            data={data}
            xKey="label"
            series={[
              { key: 'shipments', color: 'hsl(217 91% 60%)', name: 'Shipments' },
              { key: 'delivered', color: 'hsl(160 84% 39%)', name: 'Delivered' },
            ]}
          />
        </ChartCard>

        <ChartCard title="Shipment Status Distribution" description="All shipments in the current window" icon={Activity} className="lg:col-span-2">
          <Donut
            data={statusDistribution}
            centerValue="12,846"
            centerLabel="Total Shipments"
          />
        </ChartCard>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-5">
        <ChartCard
          title="Network Map — Simulated"
          description="Logistics nodes and active corridors"
          icon={Map}
          className="lg:col-span-3"
          contentClassName="pt-0"
        >
          <NetworkMap />
        </ChartCard>

        <div className="flex flex-col gap-4 lg:col-span-2">
          <ChartCard title="Delivery Performance" description="Completed, delayed, and pending by day" icon={Route}>
            <StackedBars
              data={deliveryPerformance}
              xKey="label"
              series={[
                { key: 'completed', color: 'hsl(217 91% 60%)', name: 'Completed' },
                { key: 'delayed', color: 'hsl(38 92% 50%)', name: 'Delayed' },
                { key: 'pending', color: 'hsl(199 89% 48%)', name: 'Pending' },
              ]}
              height={220}
            />
          </ChartCard>
          <ChartCard title="Fleet Utilization" description="By vehicle class" icon={Gauge} contentClassName="pt-4">
            <div className="space-y-3">
              {fleetUtilizationData.map((f) => (
                <div key={f.label} className="flex items-center gap-3">
                  <span className="w-28 shrink-0 truncate text-xs text-muted-foreground">{f.label}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-border/60">
                    <div
                      className={cn(
                        'h-full rounded-full',
                        f.utilization > 88 ? 'bg-amber-500' : f.utilization > 70 ? 'bg-emerald-500' : 'bg-blue-500'
                      )}
                      style={{ width: `${f.utilization}%` }}
                    />
                  </div>
                  <span className="w-16 text-right text-xs tabular-nums text-muted-foreground">
                    {f.utilization}% · {f.vehicles}
                  </span>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>
      </div>

      <div className="mt-6">
        <div className="mb-3 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            AI Operational Insights
          </h2>
          <Badge variant="outline" className="text-[10px] uppercase tracking-wide">
            Simulated AI Insight
          </Badge>
        </div>
        <AiInsightCards />
      </div>

      <div className="mt-6">
        <ActivityFeed />
      </div>
    </>
  );
}
