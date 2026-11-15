'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, CloudRain, PackageCheck, Sparkles, TriangleAlert } from 'lucide-react';
import { activityFeed } from '@/data/mock';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const kindStyles: Record<string, { icon: React.ElementType; className: string }> = {
  order: { icon: PackageCheck, className: 'bg-blue-500/10 text-blue-500' },
  shipment: { icon: Clock, className: 'bg-cyan-500/10 text-cyan-500' },
  delivery: { icon: CheckCircle2, className: 'bg-emerald-500/10 text-emerald-500' },
  warehouse: { icon: TriangleAlert, className: 'bg-amber-500/10 text-amber-500' },
  fleet: { icon: CloudRain, className: 'bg-violet-500/10 text-violet-500' },
};

export function ActivityFeed() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base">Operational Activity</CardTitle>
        <CardDescription>Recent events across your network (simulated)</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3.5 w-2/3" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <ol className="relative space-y-5 before:absolute before:left-[15px] before:top-2 before:h-[calc(100%-8px)] before:w-px before:bg-border">
            {activityFeed.map((e, i) => {
              const style = kindStyles[e.kind] ?? kindStyles.order;
              return (
                <motion.li
                  key={e.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="relative flex gap-3"
                >
                  <div className={cn('z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', style.className)}>
                    <style.icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{e.title}</p>
                    <p className="text-xs leading-relaxed text-muted-foreground">{e.detail}</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground/70">{e.timestamp}</p>
                  </div>
                </motion.li>
              );
            })}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}

const insights = [
  {
    icon: Sparkles,
    text: 'Demand is projected to increase in the Eastern distribution region.',
    detail: 'Pre-position fast-moving SKUs at WH-001 and WH-004.',
    tone: 'text-blue-500 bg-blue-500/10 border-blue-500/25',
    severity: 'Medium',
  },
  {
    icon: TriangleAlert,
    text: 'Warehouse WH-003 may experience higher-than-usual capacity utilization.',
    detail: 'Divert 8–10 inbound shipments to WH-005 Denver.',
    tone: 'text-amber-500 bg-amber-500/10 border-amber-500/25',
    severity: 'High',
  },
  {
    icon: Sparkles,
    text: 'Route cluster RT-018 has potential optimization opportunities.',
    detail: 'Consolidate two overlapping corridors into one run.',
    tone: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/25',
    severity: 'Medium',
  },
];

export function AiInsightCards() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {insights.map((ins, i) => (
        <motion.div
          key={ins.text}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 + i * 0.12 }}
        >
          <Card className={`h-full border ${ins.tone.split(' ')[2]}`}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${ins.tone.split(' ').slice(0, 2).join(' ')}`}>
                  <ins.icon className="h-4 w-4" />
                </div>
                <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                  {ins.severity}
                </span>
              </div>
              <p className="mt-3 text-sm font-medium leading-snug">{ins.text}</p>
              <p className="mt-1.5 text-xs text-muted-foreground">{ins.detail}</p>
              <p className="mt-3 border-t border-border/60 pt-2.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground/70">
                Simulated AI Insight
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
