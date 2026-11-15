'use client';

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

const axisProps = {
  stroke: 'hsl(var(--muted-foreground))',
  tick: { fill: 'hsl(var(--muted-foreground))', fontSize: 11 },
  tickLine: false,
  axisLine: false,
} as const;

function TooltipBox({ active, payload, label, valueSuffix = '' }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-popover px-3 py-2 text-xs shadow-md">
      {label != null && <p className="mb-1 font-medium text-foreground">{label}</p>}
      {payload.map((p: any, i: number) => (
        <p key={i} className="flex items-center gap-1.5 text-muted-foreground">
          <span className="h-2 w-2 rounded-full" style={{ background: p.color || p.fill }} />
          {p.name}: <span className="font-medium text-foreground tabular-nums">{typeof p.value === 'number' ? p.value.toLocaleString() : p.value}{valueSuffix}</span>
        </p>
      ))}
    </div>
  );
}

export interface ChartCardProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  actions?: React.ReactNode;
  className?: string;
  contentClassName?: string;
  children: React.ReactNode;
}

export function ChartCard({ title, description, icon: Icon, actions, className, contentClassName, children }: ChartCardProps) {
  return (
    <Card className={cn('flex flex-col', className)}>
      {(title || actions) && (
        <CardHeader className="flex-row items-start justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-base">
              {Icon && <Icon className="h-4 w-4 text-primary" />}
              {title}
            </CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          {actions && <div className="shrink-0">{actions}</div>}
        </CardHeader>
      )}
      <CardContent className={cn('pt-2', contentClassName)}>{children}</CardContent>
    </Card>
  );
}

export function AreaMini({
  data,
  xKey,
  series,
  height = 260,
}: {
  data: any[];
  xKey: string;
  series: Array<{ key: string; color: string; name: string }>;
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 10, right: 8, left: -12, bottom: 0 }}>
        <defs>
          {series.map((s) => (
            <linearGradient key={s.key} id={`grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={s.color} stopOpacity={0.35} />
              <stop offset="100%" stopColor={s.color} stopOpacity={0.02} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
        <XAxis dataKey={xKey} {...axisProps} />
        <YAxis {...axisProps} width={48} />
        <Tooltip content={<TooltipBox />} cursor={{ stroke: 'hsl(var(--border))' }} />
        {series.map((s) => (
          <Area
            key={s.key}
            type="monotone"
            dataKey={s.key}
            name={s.name}
            stroke={s.color}
            strokeWidth={2}
            fill={`url(#grad-${s.key})`}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function StackedBars({
  data,
  xKey,
  series,
  height = 260,
}: {
  data: any[];
  xKey: string;
  series: Array<{ key: string; color: string; name: string }>;
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 10, right: 8, left: -12, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
        <XAxis dataKey={xKey} {...axisProps} />
        <YAxis {...axisProps} width={48} />
        <Tooltip content={<TooltipBox />} cursor={{ fill: 'hsl(var(--accent))' }} />
        <Legend
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 12, color: 'hsl(var(--muted-foreground))' }}
        />
        {series.map((s) => (
          <Bar key={s.key} dataKey={s.key} name={s.name} stackId="a" fill={s.color} radius={[0, 0, 0, 0]} maxBarSize={28} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

export function Donut({
  data,
  height = 260,
  centerLabel,
  centerValue,
}: {
  data: Array<{ name: string; value: number; color: string }>;
  height?: number;
  centerLabel?: string;
  centerValue?: string;
}) {
  const total = data.reduce((s, d) => s + d.value, 0);
  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius="62%"
            outerRadius="88%"
            paddingAngle={2}
            strokeWidth={0}
          >
            {data.map((d, i) => (
              <Cell key={i} fill={d.color} />
            ))}
          </Pie>
          <Tooltip content={<TooltipBox />} />
          <Legend
            iconType="circle"
            iconSize={8}
            layout="vertical"
            align="right"
            verticalAlign="middle"
            wrapperStyle={{ fontSize: 12, color: 'hsl(var(--muted-foreground))' }}
          />
        </PieChart>
      </ResponsiveContainer>
      {centerValue && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center pb-6 pr-24">
          <span className="text-2xl font-semibold tabular-nums">{centerValue}</span>
          {centerLabel && <span className="text-xs text-muted-foreground">{centerLabel}</span>}
        </div>
      )}
      <span className="sr-only">{`Distribution total ${total}`}</span>
    </div>
  );
}

export function DualLine({
  data,
  xKey,
  series,
  height = 280,
  valueSuffix = '',
}: {
  data: any[];
  xKey: string;
  series: Array<{ key: string; color: string; name: string; dashed?: boolean }>;
  height?: number;
  valueSuffix?: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 10, right: 8, left: -12, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
        <XAxis dataKey={xKey} {...axisProps} />
        <YAxis {...axisProps} width={48} />
        <Tooltip content={<TooltipBox valueSuffix={valueSuffix} />} cursor={{ stroke: 'hsl(var(--border))' }} />
        <Legend
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 12, color: 'hsl(var(--muted-foreground))' }}
        />
        {series.map((s) => (
          <Line
            key={s.key}
            type="monotone"
            dataKey={s.key}
            name={s.name}
            stroke={s.color}
            strokeWidth={2}
            strokeDasharray={s.dashed ? '6 5' : undefined}
            dot={false}
            connectNulls
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

export function HorizontalBars({
  data,
  labelKey,
  valueKey,
  color = 'hsl(217 91% 60%)',
  height = 240,
  valueSuffix = '',
}: {
  data: any[];
  labelKey: string;
  valueKey: string;
  color?: string;
  height?: number;
  valueSuffix?: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
        <XAxis type="number" {...axisProps} />
        <YAxis type="category" dataKey={labelKey} {...axisProps} width={110} />
        <Tooltip content={<TooltipBox valueSuffix={valueSuffix} />} cursor={{ fill: 'hsl(var(--accent))' }} />
        <Bar dataKey={valueKey} fill={color} radius={[0, 6, 6, 0]} maxBarSize={18} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function ChartSkeleton({ height = 260 }: { height?: number }) {
  return <Skeleton style={{ height }} className="w-full rounded-lg" />;
}
