'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BarChart3,
  Gauge,
  LineChart,
  MapPinned,
  Route,
  Sparkles,
  Warehouse,
  ClipboardList,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.55 },
};

const modules = [
  {
    icon: ClipboardList,
    title: 'Smart Order Management',
    tagline: 'From click to fulfillment without friction',
    desc: 'Every order flows through a configurable lifecycle — created, confirmed, processing, packed, dispatched, delivered — with validation, prioritization, and customer context attached at each step.',
    points: ['Order lifecycle with seven tracked states', 'Priority handling: Same-Day to Economy', 'Customer and destination intelligence', 'Full order timeline and audit trail'],
  },
  {
    icon: MapPinned,
    title: 'Real-Time Shipment Visibility',
    tagline: 'Know where everything is, always',
    desc: 'Granular event timelines for every shipment across carriers, with progress tracking, estimated arrival, and immediate escalation when something slips.',
    points: ['Carrier and vehicle assignment view', 'Progress and ETA per shipment', 'Exception and delay states', 'Event-level history per parcel'],
  },
  {
    icon: Warehouse,
    title: 'Warehouse Intelligence',
    tagline: 'Every distribution center on one screen',
    desc: 'Capacity utilization, inbound and outbound flow, fulfillment queues, and operational status for the entire network — with drill-downs per facility.',
    points: ['Live capacity visualization', 'Incoming vs. outgoing balance', 'Fulfillment queue depth', 'Regional facility comparison'],
  },
  {
    icon: Gauge,
    title: 'Fleet & Dispatch Management',
    tagline: 'The right vehicle on the right route',
    desc: 'Track vehicles, drivers, fuel or battery levels, and load factors. Spot underused capacity and keep maintenance from becoming downtime.',
    points: ['Vehicle and driver rosters', 'Fuel, EV charge, and load monitoring', 'Maintenance and availability states', 'Fleet utilization analytics'],
  },
  {
    icon: LineChart,
    title: 'AI Demand Forecasting',
    tagline: 'See the spike before it happens',
    desc: 'Simulated forecasting overlays projected demand on historical volume so procurement and inventory positioning happen ahead of the curve.',
    points: ['Historical vs. projected demand charts', 'Regional demand shift detection', 'Confidence-scored projections', 'Clearly labeled simulated models'],
  },
  {
    icon: Route,
    title: 'Intelligent Route Optimization',
    tagline: 'Three ways to go. One best way to move.',
    desc: 'Compare route alternatives by distance, speed, cost, and efficiency score, tuned to your preference — shortest, fastest, balanced, or fuel-lean.',
    points: ['Four optimization preferences', 'Side-by-side route comparison', 'Efficiency scoring per route', 'Deterministic demo optimization'],
  },
  {
    icon: BarChart3,
    title: 'Supply Chain Analytics',
    tagline: 'Decision-ready intelligence',
    desc: 'Revenue by region, operational cost breakdowns, SLA compliance, and warehouse efficiency rendered into charts an operations manager can act on.',
    points: ['Regional performance tables', 'Cost structure breakdowns', 'SLA target vs. actual tracking', 'Exportable mock reports'],
  },
  {
    icon: Sparkles,
    title: 'AI Operations Control Tower',
    tagline: 'A copilot for the whole network',
    desc: 'A conversational command center that connects demand, inventory, routing, and fleet signals into insights, recommendations, and answers.',
    points: ['Severity-ranked insight feed', 'Confidence-scored explanations', 'Recommended actions with review flow', 'Grounded Q&A assistant'],
  },
];

export default function FeaturesPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 panel-glow" />
        <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:py-20">
          <motion.div {...fadeUp}>
            <Badge variant="outline" className="border-blue-500/30 bg-blue-500/[0.07] text-blue-500">
              Platform Features
            </Badge>
            <h1 className="mx-auto mt-5 max-w-2xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              Eight modules. One <span className="text-gradient">operational truth.</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              FlowPort covers the full logistics lifecycle — orders, shipments, warehouses, fleet,
              routes, analytics, and AI-assisted operations.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl space-y-4 px-4 pb-24 sm:px-6">
        {modules.map((m, i) => (
          <motion.div key={m.title} {...fadeUp} transition={{ duration: 0.5, delay: 0.03 * i }}>
            <Card className="overflow-hidden">
              <CardContent className="grid gap-6 p-6 lg:grid-cols-[1fr_1.1fr] lg:gap-10 lg:p-8">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <m.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold">{m.title}</h2>
                      <p className="text-xs text-muted-foreground">{m.tagline}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{m.desc}</p>
                </div>
                <div className="grid content-center gap-2.5 sm:grid-cols-2">
                  {m.points.map((p) => (
                    <div key={p} className="rounded-lg border border-border/60 bg-elevated px-3 py-2.5 text-xs font-medium text-muted-foreground">
                      {p}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        <div className="pt-10 text-center">
          <Button size="lg" asChild className="h-11 px-8 shadow-lg shadow-primary/25">
            <Link href="/dashboard">
              Explore the Platform
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
