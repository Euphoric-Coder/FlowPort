'use client';

import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

export interface KpiCardProps {
  label: string;
  value: string;
  change?: number;
  suffix?: string;
  icon: LucideIcon;
  accent?: 'blue' | 'cyan' | 'emerald' | 'amber' | 'red' | 'violet';
  progress?: number;
  hint?: string;
  className?: string;
}

const accentStyles: Record<NonNullable<KpiCardProps['accent']>, { icon: string; ring: string }> = {
  blue: { icon: 'text-blue-500 bg-blue-500/10', ring: 'from-blue-500/20' },
  cyan: { icon: 'text-cyan-500 bg-cyan-500/10', ring: 'from-cyan-500/20' },
  emerald: { icon: 'text-emerald-500 bg-emerald-500/10', ring: 'from-emerald-500/20' },
  amber: { icon: 'text-amber-500 bg-amber-500/10', ring: 'from-amber-500/20' },
  red: { icon: 'text-red-500 bg-red-500/10', ring: 'from-red-500/20' },
  violet: { icon: 'text-violet-500 bg-violet-500/10', ring: 'from-violet-500/20' },
};

export function KpiCard({
  label,
  value,
  change,
  suffix = '%',
  icon: Icon,
  accent = 'blue',
  progress,
  hint,
  className,
}: KpiCardProps) {
  const styles = accentStyles[accent];
  const up = (change ?? 0) >= 0;
  return (
    <Card className={cn('relative overflow-hidden', className)}>
      <div
        className={cn(
          'pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r to-transparent',
          styles.ring
        )}
      />
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-[13px] font-medium text-muted-foreground">{label}</p>
            <p className="mt-1.5 text-2xl font-semibold tracking-tight tabular-nums">{value}</p>
          </div>
          <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg', styles.icon)}>
            <Icon className="h-[18px] w-[18px]" />
          </div>
        </div>
        {progress !== undefined ? (
          <div className="mt-3 space-y-1">
            <Progress value={progress} className="h-1.5" />
            {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
          </div>
        ) : change !== undefined ? (
          <div className="mt-2 flex items-center gap-1.5">
            <span
              className={cn(
                'inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-medium',
                up ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-red-500/10 text-red-600 dark:text-red-400'
              )}
            >
              {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              {Math.abs(change)}%
            </span>
            <span className="text-xs text-muted-foreground">{hint ?? 'vs. last week'}</span>
          </div>
        ) : hint ? (
          <p className="mt-2 text-xs text-muted-foreground">{hint}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function KpiCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-5 space-y-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-20" />
      </CardContent>
    </Card>
  );
}
