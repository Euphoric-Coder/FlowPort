'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  BarChart3,
  CalendarRange,
  DollarSign,
  Download,
  Gauge,
  Target,
  TrendingUp,
  Warehouse as WarehouseIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/layout/page-header';
import {
  AreaMini,
  ChartCard,
  ChartSkeleton,
  Donut,
  DualLine,
  HorizontalBars,
} from '@/components/shared/charts';
import { KpiCard } from '@/components/shared/kpi-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import { costBreakdown, regionalPerformance, slaCompliance } from '@/data/mock';
import { cn } from '@/lib/utils';

type Range = '7d' | '30d' | '90d';

const revenueTrend: Record<Range, Array<{ label: string; revenue: number; shipments: number }>> = {
  '7d': [
    { label: 'Mon', revenue: 18400, shipments: 312 },
    { label: 'Tue', revenue: 20100, shipments: 348 },
    { label: 'Wed', revenue: 22800, shipments: 402 },
    { label: 'Thu', revenue: 21900, shipments: 389 },
    { label: 'Fri', revenue: 26400, shipments: 456 },
    { label: 'Sat', revenue: 17200, shipments: 298 },
    { label: 'Sun', revenue: 14900, shipments: 241 },
  ],
  '30d': [
    { label: 'W1', revenue: 92400, shipments: 2140 },
    { label: 'W2', revenue: 101200, shipments: 2360 },
    { label: 'W3', revenue: 98800, shipments: 2290 },
    { label: 'W4', revenue: 112400, shipments: 2680 },
    { label: 'Today', revenue: 28600, shipments: 640 },
  ],
  '90d': [
    { label: 'Aug', revenue: 342000, shipments: 8100 },
    { label: 'Sep', revenue: 366000, shipments: 8600 },
    { label: 'Oct', revenue: 398000, shipments: 9200 },
    { label: 'Nov (MTD)', revenue: 142000, shipments: 3400 },
  ],
};

const completionTrend = [
  { label: 'Mon', completed: 94.2, target: 95 },
  { label: 'Tue', completed: 95.1, target: 95 },
  { label: 'Wed', completed: 93.8, target: 95 },
  { label: 'Thu', completed: 96.2, target: 95 },
  { label: 'Fri', completed: 95.7, target: 95 },
  { label: 'Sat', completed: 97.1, target: 95 },
  { label: 'Sun', completed: 96.4, target: 95 },
];

const warehouseEfficiency = [
  { name: 'WH-001 New York', picks: 1240, utilization: 72 },
  { name: 'WH-002 Chicago', picks: 1610, utilization: 94 },
  { name: 'WH-003 Dallas', picks: 420, utilization: 31 },
  { name: 'WH-004 Atlanta', picks: 1080, utilization: 63 },
  { name: 'WH-005 Denver', picks: 890, utilization: 58 },
  { name: 'WH-007 Los Angeles', picks: 960, utilization: 66 },
];

export default function AnalyticsPage() {
  const [range, setRange] = useState<Range>('30d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, [range]);

  const trend = revenueTrend[range];
  const totals = useMemo(() => {
    const revenue = trend.reduce((s, d) => s + d.revenue, 0);
    const shipments = trend.reduce((s, d) => s + d.shipments, 0);
    const cost = costBreakdown.reduce((s, c) => s + c.value, 0);
    return { revenue, shipments, cost, margin: Math.round(((revenue - cost) / revenue) * 1000) / 10 };
  }, [trend]);

  const exportCsv = () => {
    const rows: string[][] = [
      ['Section', 'Label', 'Revenue', 'Shipments', 'On-Time %', 'Cost'],
      ...regionalPerformance.map((r) => ['Regional', r.region, String(r.revenue), String(r.shipments), String(r.onTime), String(r.cost)]),
      ...costBreakdown.map((c) => ['Cost', c.label, String(c.value), '', '', '']),
      ...slaCompliance.map((s) => ['SLA', s.label, '', '', `${s.actual}`, '']),
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'flowport-analytics-export.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Analytics exported', { description: 'Mock analytics data downloaded as CSV.' });
  };

  return (
    <>
      <PageHeader
        title="Analytics"
        subtitle="Business intelligence across revenue, regions, cost, and service levels. (Sample data)"
        actions={
          <>
            <Select value={range} onValueChange={(v) => setRange(v as Range)}>
              <SelectTrigger className="w-[150px]">
                <CalendarRange className="mr-1 h-4 w-4 text-muted-foreground" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={exportCsv}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Revenue" value={`$${(totals.revenue / 1000).toFixed(1)}K`} change={6.2} icon={DollarSign} accent="emerald" hint={`vs. previous ${range}`} />
        <KpiCard label="Shipments" value={totals.shipments.toLocaleString()} change={4.8} icon={BarChart3} accent="blue" hint={`vs. previous ${range}`} />
        <KpiCard label="Operating Cost" value={`$${(totals.cost / 1000).toFixed(1)}K`} change={-2.4} icon={Gauge} accent="amber" hint="Fuel, labor, facilities" />
        <KpiCard label="Gross Margin" value={`${totals.margin}%`} change={1.9} icon={TrendingUp} accent="cyan" hint="Revenue minus operating cost" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-5">
        <ChartCard title="Revenue Overview" description="Revenue by period (sample data)" icon={DollarSign} className="lg:col-span-3">
          {loading ? (
            <ChartSkeleton height={280} />
          ) : (
            <AreaMini
              data={trend}
              xKey="label"
              series={[{ key: 'revenue', color: 'hsl(160 84% 39%)', name: 'Revenue' }]}
              height={280}
            />
          )}
        </ChartCard>

        <ChartCard title="Operational Costs" description="Cost structure (sample data)" icon={Gauge} className="lg:col-span-2">
          {loading ? (
            <ChartSkeleton height={280} />
          ) : (
            <HorizontalBars
              data={costBreakdown}
              labelKey="label"
              valueKey="value"
              color="hsl(38 92% 50%)"
              height={280}
            />
          )}
        </ChartCard>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <ChartCard title="Delivery Completion vs. Target" description="Daily completion rate against 95% target" icon={Target}>
          {loading ? (
            <ChartSkeleton height={260} />
          ) : (
            <DualLine
              data={completionTrend}
              xKey="label"
              series={[
                { key: 'completed', color: 'hsl(217 91% 60%)', name: 'Completed %' },
                { key: 'target', color: 'hsl(var(--muted-foreground))', name: 'Target %', dashed: true },
              ]}
              height={260}
              valueSuffix="%"
            />
          )}
        </ChartCard>

        <ChartCard title="SLA Compliance" description="Target vs. actual by service tier" icon={Target}>
          {loading ? (
            <ChartSkeleton height={260} />
          ) : (
            <div className="space-y-4 pt-2">
              {slaCompliance.map((s) => {
                const ok = s.actual >= s.target;
                return (
                  <div key={s.label}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{s.label}</span>
                      <span className="flex items-center gap-2 text-xs text-muted-foreground">
                        target {s.target}%
                        <Badge
                          variant="outline"
                          className={cn(
                            ok
                              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                              : 'border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400'
                          )}
                        >
                          {s.actual}%
                        </Badge>
                      </span>
                    </div>
                    <div className="relative mt-1.5 h-2 overflow-hidden rounded-full bg-border/60">
                      <div
                        className={cn('h-full rounded-full', ok ? 'bg-emerald-500' : 'bg-red-500')}
                        style={{ width: `${s.actual}%` }}
                      />
                      <div
                        className="absolute top-0 h-full w-0.5 bg-foreground/60"
                        style={{ left: `${s.target}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ChartCard>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-5">
        <ChartCard title="Regional Performance" description="Revenue, volume, and service by region" icon={BarChart3} className="lg:col-span-3" contentClassName="pb-4">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Region</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-right">Shipments</TableHead>
                  <TableHead className="text-right">On-Time</TableHead>
                  <TableHead className="text-right">Cost</TableHead>
                  <TableHead className="text-right">Margin</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {regionalPerformance.map((r) => {
                  const margin = Math.round(((r.revenue - r.cost) / r.revenue) * 1000) / 10;
                  return (
                    <TableRow key={r.region}>
                      <TableCell className="font-medium">{r.region}</TableCell>
                      <TableCell className="text-right tabular-nums">${r.revenue.toLocaleString()}</TableCell>
                      <TableCell className="text-right tabular-nums">{r.shipments.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <span className={cn('tabular-nums', r.onTime < 97.5 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400')}>
                          {r.onTime}%
                        </span>
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-muted-foreground">${r.cost.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-medium tabular-nums">{margin}%</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </ChartCard>

        <div className="flex flex-col gap-4 lg:col-span-2">
          <ChartCard title="Warehouse Efficiency" description="Daily pick volume by facility" icon={WarehouseIcon}>
            {loading ? (
              <ChartSkeleton height={200} />
            ) : (
              <HorizontalBars
                data={warehouseEfficiency}
                labelKey="name"
                valueKey="picks"
                color="hsl(199 89% 48%)"
                height={200}
              />
            )}
          </ChartCard>
          <ChartCard title="Fleet Performance Mix" description="Share of distance by fleet class" icon={Activity} contentClassName="pt-0">
            <Donut
              data={[
                { name: 'Long-haul', value: 41, color: 'hsl(217 91% 60%)' },
                { name: 'Regional', value: 33, color: 'hsl(199 89% 48%)' },
                { name: 'Last-mile', value: 19, color: 'hsl(160 84% 39%)' },
                { name: 'Cold chain', value: 7, color: 'hsl(38 92% 50%)' },
              ]}
              height={200}
            />
          </ChartCard>
        </div>
      </div>
    </>
  );
}
