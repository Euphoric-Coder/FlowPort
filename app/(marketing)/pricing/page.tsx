'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.55 },
};

const plans = [
  {
    name: 'Starter',
    blurb: 'For small operations getting their first real visibility.',
    monthly: 0,
    annual: 0,
    cta: 'Start Free',
    featured: false,
    features: [
      'Up to 250 shipments / month',
      '1 warehouse facility',
      'Order and shipment tracking',
      'Core analytics dashboard',
      'Community support',
    ],
  },
  {
    name: 'Growth',
    blurb: 'For scaling teams running multi-region fulfillment.',
    monthly: 79,
    annual: 63,
    cta: 'Start 14-Day Trial',
    featured: true,
    features: [
      'Up to 5,000 shipments / month',
      'Up to 10 warehouse facilities',
      'Fleet and dispatch management',
      'Route optimization demo suite',
      'AI insights (simulated models)',
      'Priority email support',
    ],
  },
  {
    name: 'Enterprise',
    blurb: 'For networks that need the full control tower.',
    monthly: null,
    annual: null,
    cta: 'Talk to Us',
    featured: false,
    features: [
      'Unlimited shipments and facilities',
      'AI Operations Control Tower',
      'Demand forecasting models',
      'Custom role-based access',
      'Dedicated success manager',
      'SLA-backed support (planned)',
    ],
  },
];

export default function PricingPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 panel-glow" />
        <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:py-20">
          <motion.div {...fadeUp}>
            <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/[0.07] text-emerald-500">
              Pricing
            </Badge>
            <h1 className="mx-auto mt-5 max-w-2xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              Simple pricing that <span className="text-gradient">scales with volume</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Start free, upgrade when your shipment count does. Prices shown for illustration in
              this product demo.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {plans.map((p, i) => (
            <motion.div key={p.name} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.1 }}>
              <Card
                className={cn(
                  'relative h-full',
                  p.featured && 'border-primary/50 shadow-lg shadow-primary/10'
                )}
              >
                {p.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="gap-1 bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
                      <Sparkles className="h-3 w-3" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{p.name}</CardTitle>
                  <CardDescription>{p.blurb}</CardDescription>
                  <div className="mt-4 flex items-baseline gap-1.5">
                    {p.monthly === null ? (
                      <span className="text-4xl font-semibold tracking-tight">Custom</span>
                    ) : (
                      <>
                        <span className="text-4xl font-semibold tracking-tight tabular-nums">
                          ${p.annual}
                        </span>
                        <span className="text-sm text-muted-foreground">/ mo per workspace</span>
                      </>
                    )}
                  </div>
                  {p.monthly !== null && p.monthly > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Billed annually (${p.monthly} month-to-month)
                    </p>
                  )}
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-2.5">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className={cn('w-full', p.featured && 'shadow-md shadow-primary/25')}
                    variant={p.featured ? 'default' : 'outline'}
                    asChild
                  >
                    <Link href="/register">{p.cta}</Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mx-auto mt-16 max-w-3xl rounded-xl border border-border/60 bg-card p-6 text-center">
          <h2 className="font-semibold">All plans in this demo include</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            The complete Version 0.1 experience — every module, every page, all running on realistic
            sample data. No payment is processed and no account is really created; checkout is
            disabled in this product demo.
          </p>
        </div>
      </section>
    </>
  );
}
