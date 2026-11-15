'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Building2, Gauge, ShoppingCart, Users, Warehouse, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.55 },
};

const solutions = [
  {
    icon: ShoppingCart,
    title: 'Merchants & Online Sellers',
    desc: 'Give your customers accurate delivery promises. Manage order volume, prioritize same-day shipments, and watch fulfillment happen in real time.',
    bullets: ['Order and return management', 'Delivery promise tracking', 'Multi-warehouse stock visibility'],
    color: 'text-blue-500 bg-blue-500/10',
  },
  {
    icon: Building2,
    title: 'Enterprise Shippers',
    desc: 'Operate a multi-region network from one control plane. Standardize processes, compare facility performance, and keep SLA discipline.',
    bullets: ['Regional network oversight', 'SLA compliance reporting', 'Cost and revenue analytics'],
    color: 'text-cyan-500 bg-cyan-500/10',
  },
  {
    icon: Warehouse,
    title: 'Warehouse Operators',
    desc: 'Balance capacity across facilities, keep fulfillment queues moving, and get early warning before inbound flow overwhelms the dock.',
    bullets: ['Capacity and queue monitoring', 'Inventory reservations', 'Low-stock early warnings'],
    color: 'text-emerald-500 bg-emerald-500/10',
  },
  {
    icon: Gauge,
    title: 'Fleet & Dispatch Teams',
    desc: 'Keep every vehicle earning. Assign routes by capacity and proximity, track fuel and charge states, and schedule maintenance without guesswork.',
    bullets: ['Live fleet status board', 'Route and load assignment', 'Maintenance scheduling signals'],
    color: 'text-amber-500 bg-amber-500/10',
  },
  {
    icon: Users,
    title: 'Operations Leadership',
    desc: 'Run the weekly review from one dashboard: volumes, on-time rates, regional revenue, and where the AI thinks you should act next.',
    bullets: ['Executive KPI overview', 'Simulated AI insights feed', 'Exportable operational reports'],
    color: 'text-violet-500 bg-violet-500/10',
  },
  {
    icon: Wrench,
    title: 'IT & Platform Teams',
    desc: 'A clean frontend architecture with a mock service layer — built so real backends, APIs, and AI services slot in without a rewrite.',
    bullets: ['Typed data models end-to-end', 'Repository pattern for data access', 'Demo-mode by design'],
    color: 'text-red-500 bg-red-500/10',
  },
];

export default function SolutionsPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 panel-glow" />
        <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:py-20">
          <motion.div {...fadeUp}>
            <Badge variant="outline" className="border-cyan-500/30 bg-cyan-500/[0.07] text-cyan-500">
              Solutions
            </Badge>
            <h1 className="mx-auto mt-5 max-w-2xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              One platform for <span className="text-gradient">every role</span> in logistics
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              From the storefront to the loading dock, FlowPort adapts to the way each team works.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {solutions.map((s, i) => (
            <motion.div key={s.title} {...fadeUp} transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}>
              <Card className="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10">
                <CardContent className="p-6">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${s.color}`}>
                    <s.icon className="h-5 w-5" />
                  </div>
                  <h2 className="mt-4 font-semibold">{s.title}</h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
                  <ul className="mt-4 space-y-2">
                    {s.bullets.map((b) => (
                      <li key={b} className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                        <span className="h-1 w-1 rounded-full bg-primary" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="pt-14 text-center">
          <Button size="lg" asChild className="h-11 px-8 shadow-lg shadow-primary/25">
            <Link href="/dashboard">
              See It In Action
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
