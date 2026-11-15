'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  BrainCircuit,
  Check,
  LineChart as LineChartIcon,
  Route as RouteIcon,
  Sparkles,
  Target,
  TriangleAlert,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/layout/page-header';
import { AssistantChat, InsightHighlights } from '@/components/dashboard/ai/assistant-chat';
import { DualLine, ChartCard } from '@/components/shared/charts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { demandForecast, insights } from '@/data/mock';
import { cn } from '@/lib/utils';
import type { Insight } from '@/types';

const severityStyle: Record<Insight['severity'], { badge: string; bar: string }> = {
  Low: { badge: 'border-slate-500/30 bg-slate-500/10 text-slate-600 dark:text-slate-400', bar: 'bg-slate-400' },
  Medium: { badge: 'border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400', bar: 'bg-blue-500' },
  High: { badge: 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400', bar: 'bg-amber-500' },
  Critical: { badge: 'border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400', bar: 'bg-red-500' },
};

const overviewCards = [
  { icon: Target, label: 'Demand Forecasting', value: '+14%', hint: 'Eastern region, next 10 days (simulated)', tone: 'text-blue-500 bg-blue-500/10' },
  { icon: RouteIcon, label: 'Route Intelligence', value: '2 corridors', hint: 'With consolidation opportunities', tone: 'text-cyan-500 bg-cyan-500/10' },
  { icon: TriangleAlert, label: 'Inventory Risk', value: '1 critical', hint: 'SKU-9072 stock-out at WH-003', tone: 'text-red-500 bg-red-500/10' },
  { icon: Activity, label: 'Operational Anomalies', value: '1 anomaly', hint: 'Dwell time above baseline at WH-002', tone: 'text-amber-500 bg-amber-500/10' },
];

export default function AiControlTowerPage() {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [reviewing, setReviewing] = useState<Insight | null>(null);
  const [handled, setHandled] = useState<Set<string>>(new Set());

  const dismiss = (insight: Insight) => {
    setDismissed((s) => new Set(s).add(insight.id));
    setHandled((s) => new Set(s).add(insight.id));
    toast.info('Recommendation dismissed', {
      description: `“${insight.title}” was hidden from the feed. No operational data was changed.`,
    });
  };

  const visible = insights.filter((i) => !dismissed.has(i.id));

  return (
    <>
      <PageHeader
        title="FlowPort Intelligence"
        subtitle="Your AI-powered command center for intelligent logistics operations."
        actions={
          <Badge variant="outline" className="gap-1.5 border-blue-500/30 bg-blue-500/[0.07] px-3 py-1.5 text-blue-500">
            <Sparkles className="h-3.5 w-3.5" />
            Simulated intelligence — no live AI inference
          </Badge>
        }
      />

      {/* A. AI Overview */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {overviewCards.map((c, i) => (
          <motion.div key={c.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <p className="text-[13px] font-medium text-muted-foreground">{c.label}</p>
                  <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg', c.tone)}>
                    <c.icon className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-2 text-2xl font-semibold tracking-tight">{c.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{c.hint}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* B + C */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div>
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            <BrainCircuit className="h-4 w-4 text-primary" />
            Intelligent Insights Feed
          </h2>
          <div className="space-y-3">
            {visible.length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
                  <Check className="h-8 w-8 text-emerald-500" />
                  <p className="font-medium">All caught up</p>
                  <p className="text-sm text-muted-foreground">Every insight has been reviewed or dismissed.</p>
                </CardContent>
              </Card>
            )}
            {visible.map((ins, i) => {
              const sev = severityStyle[ins.severity];
              return (
                <motion.div
                  key={ins.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="overflow-hidden">
                    <div className={cn('h-1 w-full', sev.bar)} />
                    <CardContent className="p-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className={cn('text-[11px]', sev.badge)}>
                          {ins.severity}
                        </Badge>
                        <Badge variant="outline" className="text-[11px]">{ins.category}</Badge>
                        <span className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
                          Confidence
                          <span className="font-semibold tabular-nums text-foreground">{ins.confidence}%</span>
                        </span>
                      </div>
                      <h3 className="mt-2.5 text-sm font-semibold">{ins.title}</h3>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{ins.explanation}</p>
                      <div className="mt-3 rounded-lg border border-primary/20 bg-primary/[0.05] p-3">
                        <p className="text-xs font-medium text-primary">Recommended action</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{ins.recommendation}</p>
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <Button size="sm" variant="outline" onClick={() => setReviewing(ins)}>
                          Review
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => dismiss(ins)}>
                          <X className="mr-1 h-3.5 w-3.5" />
                          Dismiss
                        </Button>
                        <span className="ml-auto text-[11px] text-muted-foreground/70">{ins.timestamp}</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div>
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            <LineChartIcon className="h-4 w-4 text-primary" />
            Predictive Demand
          </h2>
          <ChartCard
            title="Demand Forecast"
            description="Solid = historical sample data · Dashed = simulated projection"
            className="mb-4"
            contentClassName="pb-2"
          >
            <DualLine
              data={demandForecast}
              xKey="label"
              series={[
                { key: 'actual', color: 'hsl(217 91% 60%)', name: 'Historical (mock)' },
                { key: 'forecast', color: 'hsl(189 94% 43%)', name: 'Projected (mock)', dashed: true },
              ]}
              height={240}
            />
          </ChartCard>
          <AssistantChat />
        </div>
      </div>

      {/* E. Action recommendations */}
      <div className="mt-6">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          <Sparkles className="h-4 w-4 text-primary" />
          Action Recommendations
        </h2>
        <Card>
          <CardContent className="divide-y divide-border/60 p-0">
            {[
              {
                id: 'REC-01',
                title: 'Consider redistributing inventory from WH-002 to WH-004.',
                detail: 'Chicago is at 94% capacity while Atlanta has 37% headroom. Moving ~120 pallets of fast-moving SKUs rebalances both facilities.',
                impact: 'Frees ~8% capacity at WH-002 · 45 min transit between sites',
              },
              {
                id: 'REC-02',
                title: 'Consolidate RT-018 into a single weekday double-trailer run.',
                detail: 'Two partially-filled vehicles cover the same Atlanta → Jacksonville corridor. One consolidated run removes ~$1,400/week in simulated fuel and labor cost.',
                impact: '−$1,400/wk simulated · −1 vehicle on corridor',
              },
              {
                id: 'REC-03',
                title: 'Trigger replenishment transfer for SKU-9072 from WH-007.',
                detail: 'Cold Pack Meds are out of stock at WH-003 with 4 open orders. WH-007 Los Angeles holds 340 units with no reservations.',
                impact: 'Prevents 4 late deliveries · 2-day transfer lead time',
              },
            ].map((r) => (
              <div key={r.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{r.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{r.detail}</p>
                  <p className="mt-1 text-[11px] font-medium text-primary">{r.impact}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const match = insights.find((i) => i.title.toLowerCase().includes(r.title.toLowerCase().slice(10, 30).split(' ')[0]));
                      setReviewing(match ?? insights[0]);
                    }}
                  >
                    Review
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => toast.info('Recommendation dismissed', { description: `“${r.title}” — no operational data was changed.` })}
                  >
                    Dismiss
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <p className="mt-2 text-xs text-muted-foreground">
          Review opens a detail panel. No recommendation autonomously changes operational data in
          this version.
        </p>
      </div>

      {/* Review dialog */}
      <Dialog open={!!reviewing} onOpenChange={(v) => !v && setReviewing(null)}>
        <DialogContent className="max-w-lg">
          {reviewing && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  {reviewing.title}
                </DialogTitle>
                <DialogDescription>
                  Simulated AI Insight — {reviewing.category} · {reviewing.confidence}% confidence
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Analysis</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{reviewing.explanation}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Recommended action</p>
                  <div className="mt-1 rounded-lg border border-primary/20 bg-primary/[0.05] p-3 text-sm text-muted-foreground">
                    {reviewing.recommendation}
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Model confidence (simulated)</span>
                    <span className="font-semibold tabular-nums text-foreground">{reviewing.confidence}%</span>
                  </div>
                  <Progress value={reviewing.confidence} className="mt-1.5 h-2" />
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Reviewing an insight does not modify any operational data in this demo version.
                </p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
