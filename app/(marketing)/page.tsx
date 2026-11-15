'use client';

import Link from 'next/link';
import Image from 'next/image';
import iconImg from '@/public/icon.png';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  BarChart3,
  Boxes,
  CheckCircle2,
  ClipboardList,
  Eye,
  Gauge,
  LayoutDashboard,
  MapPinned,
  PackageSearch,
  Route,
  Sparkles,
  Warehouse,
} from 'lucide-react';
import { HeroVisual } from '@/components/marketing/hero-visual';
import { WaveDivider } from '@/components/marketing/wave-divider';
import { Button } from '@/components/ui/button';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.55 },
};

const metrics = [
  { value: '12.8K', label: 'Shipments Monitored' },
  { value: '98.2%', label: 'On-Time Delivery' },
  { value: '24', label: 'Active Warehouses' },
  { value: '320', label: 'Connected Vehicles' },
];

const features = [
  { icon: ClipboardList, title: 'Smart Order Management', desc: 'Manage orders from creation to fulfillment through a unified workflow.', tint: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400' },
  { icon: MapPinned, title: 'Real-Time Shipment Tracking', desc: 'Stay informed with shipment updates and delivery milestones.', tint: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400' },
  { icon: Warehouse, title: 'Warehouse Management', desc: 'Monitor warehouse capacity, inventory, and fulfillment operations.', tint: 'bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400' },
  { icon: Gauge, title: 'Fleet Management', desc: 'Coordinate vehicles, drivers, and transportation activities.', tint: 'bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400' },
  { icon: Sparkles, title: 'AI-Powered Insights', desc: 'Discover trends, identify risks, and support smarter decisions.', tint: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400' },
  { icon: Route, title: 'Intelligent Route Planning', desc: 'Compare delivery routes and explore optimization opportunities.', tint: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' },
  { icon: Boxes, title: 'Inventory Intelligence', desc: 'Track stock levels, monitor availability, and identify inventory risks.', tint: 'bg-teal-100 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300' },
  { icon: BarChart3, title: 'Analytics & Reporting', desc: 'Understand operational performance through actionable dashboards.', tint: 'bg-cyan-50 text-[#0E7490] dark:bg-cyan-500/10 dark:text-cyan-300' },
];

const workflow = [
  { icon: ClipboardList, title: 'Create Order', desc: 'Orders enter the platform with validated items and priorities.' },
  { icon: Boxes, title: 'Reserve Inventory', desc: 'Stock is reserved at the optimal warehouse automatically.' },
  { icon: Warehouse, title: 'Process in Warehouse', desc: 'Fulfillment teams pick, pack, and stage every shipment.' },
  { icon: Gauge, title: 'Assign Delivery', desc: 'Vehicles and drivers are matched to routes by capacity.' },
  { icon: MapPinned, title: 'Track Shipment', desc: 'Live milestones stream in as parcels move across the network.' },
  { icon: CheckCircle2, title: 'Complete Delivery', desc: 'Proof of delivery closes the order with a full audit trail.' },
];

const principles = [
  {
    icon: Eye,
    title: 'Connected Operations',
    desc: 'Orders, warehouses, and fleets share one live source of operational truth.',
    tint: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400',
  },
  {
    icon: Sparkles,
    title: 'Smarter Decisions',
    desc: 'Simulated intelligence surfaces trends, risks, and recommended actions.',
    tint: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400',
  },
  {
    icon: Eye,
    title: 'Complete Visibility',
    desc: 'Every milestone from order creation to doorstep is tracked and auditable.',
    tint: 'bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400',
  },
];

const ctaButtons = [
  { label: 'Get Started', href: '/register', icon: ArrowRight, primary: true },
  { label: 'Explore Dashboard', href: '/dashboard', icon: LayoutDashboard, primary: false },
  { label: 'Track Shipment', href: '/dashboard/shipments', icon: PackageSearch, primary: false },
  { label: 'Learn More', href: '#features', icon: ArrowRight, primary: false, scroll: true },
];

export default function LandingPage() {
  const reduce = useReducedMotion();
  const anim = (delay = 0) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  const handleScrollClick = (e: React.MouseEvent, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      document.querySelector(href)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
    }
  };

  return (
    <>
      {/* ============ HERO ============ */}
      <section
        className="relative -mt-16 overflow-hidden"
        style={{
          background:
            'linear-gradient(135deg, #075985 0%, #0891B2 55%, #22D3EE 130%)',
        }}
      >
        {/* Soft decorative glows */}
        <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -right-32 h-[28rem] w-[28rem] rounded-full bg-[#67E8F9]/15 blur-3xl" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-[42rem] -translate-x-1/2 rounded-full bg-white/[0.06] blur-3xl" />

        {/* Subtle connected-node accents */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.12]"
          aria-hidden="true"
        >
          <g stroke="#fff" strokeWidth="1" fill="none">
            <path d="M 60 140 Q 180 60 300 180 T 560 120" />
            <path d="M 1100 90 Q 980 190 860 130" />
          </g>
          {[
            [60, 140], [300, 180], [560, 120], [1100, 90], [860, 130],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="4" fill="#fff" stroke="none" />
          ))}
        </svg>

        <div className="relative mx-auto max-w-6xl px-4 pb-8 pt-20 text-center sm:px-6 lg:pb-12 lg:pt-28">
          {/* Logo mark */}
          <motion.div {...anim(0)} className="flex justify-center">
            <span
              className="flex h-[104px] w-[104px] items-center justify-center rounded-full border border-white/25 bg-white/10 shadow-xl backdrop-blur-sm sm:h-[118px] sm:w-[118px]"
              style={{ boxShadow: '0 0 0 8px rgb(255 255 255 / 0.06), 0 20px 45px -15px rgb(7 89 133 / 0.6)' }}
            >
              <Image
                src={iconImg}
                alt="FlowPort"
                className="h-14 w-14 rounded-2xl object-contain sm:h-16 sm:w-16"
                priority
              />
            </span>
          </motion.div>

          {/* Product name */}
          <motion.h1
            {...anim(0.1)}
            className="mt-8 text-[46px] font-bold leading-none tracking-tight text-white sm:text-[64px] lg:text-[88px]"
          >
            FlowPort
          </motion.h1>

          {/* Tagline */}
          <motion.p
            {...anim(0.2)}
            className="mt-5 text-[26px] font-medium leading-tight text-white/95 sm:text-[32px] lg:text-[40px]"
          >
            Move Smarter. Deliver Better.
          </motion.p>

          {/* Description */}
          <motion.p
            {...anim(0.3)}
            className="mx-auto mt-5 max-w-[720px] text-base leading-relaxed text-white/80 sm:text-lg"
          >
            Manage shipments, warehouses, fleets, and deliveries in one intelligent platform.
            Simplify logistics, optimize operations, and stay connected at every step.
          </motion.p>

          {/* CTAs */}
          <motion.div
            {...anim(0.4)}
            className="mx-auto mt-9 flex max-w-2xl flex-wrap items-center justify-center gap-3"
          >
            {ctaButtons.map((b) =>
              b.primary ? (
                <Button
                  key={b.label}
                  asChild
                  className="h-11 rounded-full bg-white px-6 text-[15px] font-semibold text-[#0369A1] shadow-lg hover:bg-[#F0F9FF] hover:shadow-xl"
                >
                  <Link href={b.href}>
                    {b.label}
                    <b.icon className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              ) : b.scroll ? (
                <a
                  key={b.label}
                  href={b.href}
                  onClick={(e) => handleScrollClick(e, b.href)}
                  className="inline-flex h-11 items-center justify-center rounded-full border border-white/40 bg-white/10 px-6 text-[15px] font-medium text-white backdrop-blur transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                >
                  {b.label}
                  <b.icon className="ml-2 h-4 w-4" />
                </a>
              ) : (
                <Button
                  key={b.label}
                  asChild
                  className="h-11 rounded-full border border-white/40 bg-white/10 px-6 text-[15px] font-medium text-white backdrop-blur hover:bg-white/20"
                >
                  <Link href={b.href!}>
                    {b.label}
                    <b.icon className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              )
            )}
          </motion.div>

          {/* Metrics */}
          <motion.div
            {...anim(0.55)}
            className="mx-auto mt-16 max-w-4xl rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur-sm sm:p-8"
          >
            <p className="text-[11px] font-medium uppercase tracking-widest text-white/60">
              Illustrative demo data
            </p>
            <div className="mt-5 grid grid-cols-2 gap-6 lg:grid-cols-4">
              {metrics.map((m) => (
                <div key={m.label}>
                  <p className="text-3xl font-semibold tabular-nums text-white sm:text-4xl">{m.value}</p>
                  <p className="mt-1 text-xs text-white/70 sm:text-sm">{m.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Wave divider into features */}
        <svg
          className="relative block w-full"
          viewBox="0 0 1440 90"
          preserveAspectRatio="none"
          style={{ height: '70px', marginBottom: '-1px' }}
          aria-hidden="true"
        >
          <path
            d="M0,48 C240,90 480,10 720,42 C960,74 1200,20 1440,52 L1440,90 L0,90 Z"
            className="fill-[hsl(210_45%_98.5%)] dark:fill-[hsl(216_36%_10%)]"
          />
        </svg>
      </section>

      {/* ============ FEATURES ============ */}
      <section id="features" className="scroll-mt-20 bg-[hsl(210_45%_98.5%)] pb-20 pt-8 dark:bg-background lg:pb-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div {...fadeUp} className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-foreground sm:text-4xl">
              Powerful Features
            </h2>
            <p className="mt-3 text-muted-foreground">
              Everything you need to manage, monitor, and optimize your logistics operations.
            </p>
          </motion.div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                {...fadeUp}
                transition={{ duration: 0.5, delay: (i % 4) * 0.06 }}
              >
                <div className="h-full rounded-2xl border border-slate-200/80 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#0E7490]/30 hover:shadow-lg hover:shadow-sky-600/[0.08] dark:border-border dark:bg-card">
                  <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${f.tint}`}>
                    <f.icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 font-semibold text-slate-900 dark:text-foreground">{f.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-500 dark:text-muted-foreground">
                    {f.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <WaveDivider
        from="bg-[hsl(210_45%_98.5%)] dark:bg-background"
        to="fill-white dark:fill-[hsl(216_32%_13.5%)]"
      />
      <section className="bg-white pb-20 pt-8 dark:bg-card lg:pb-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div {...fadeUp} className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-foreground sm:text-4xl">
              How FlowPort Works
            </h2>
            <p className="mt-3 text-muted-foreground">
              From order placement to final delivery, everything stays connected.
            </p>
          </motion.div>

          <div className="relative mt-14">
            <div className="absolute left-0 right-0 top-6 hidden h-px bg-gradient-to-r from-transparent via-[#0E7490]/40 to-transparent lg:block" />
            <ol className="grid gap-10 sm:grid-cols-2 lg:grid-cols-6">
              {workflow.map((s, i) => (
                <motion.li
                  key={s.title}
                  {...fadeUp}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="relative text-center lg:text-left"
                >
                  <div className="relative mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#0E7490]/25 bg-white shadow-sm dark:bg-card lg:mx-0">
                    <s.icon className="h-5 w-5 text-[#0E7490] dark:text-primary" />
                    <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#0369A1] text-[10px] font-bold text-white">
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="mt-4 text-sm font-semibold text-slate-900 dark:text-foreground">{s.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-muted-foreground">
                    {s.desc}
                  </p>
                </motion.li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ============ ABOUT ============ */}
      <WaveDivider
        from="bg-white dark:bg-card"
        to="fill-[hsl(210_45%_98.5%)] dark:fill-[hsl(216_36%_10%)]"
        variant="b"
      />
      <section id="about" className="scroll-mt-20 bg-[hsl(210_45%_98.5%)] pb-20 pt-8 dark:bg-background lg:pb-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div {...fadeUp} className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-foreground sm:text-4xl">
              Simplifying Logistics Through Intelligence
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              FlowPort brings order management, warehouse operations, fleet coordination, and
              intelligent analytics together in one connected ecosystem. Designed for modern supply
              chains, it helps teams coordinate efficiently and make informed decisions.
            </p>
          </motion.div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {principles.map((p, i) => (
              <motion.div
                key={p.title}
                {...fadeUp}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="rounded-2xl border border-slate-200/80 bg-white p-6 text-center dark:border-border dark:bg-card"
              >
                <span className={`mx-auto flex h-12 w-12 items-center justify-center rounded-xl ${p.tint}`}>
                  <p.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 font-semibold text-slate-900 dark:text-foreground">{p.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-500 dark:text-muted-foreground">
                  {p.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PLATFORM PREVIEW ============ */}
      <WaveDivider
        from="bg-[hsl(210_45%_98.5%)] dark:bg-background"
        to="fill-white dark:fill-[hsl(216_32%_13.5%)]"
      />
      <section className="bg-white pb-20 pt-8 dark:bg-card lg:pb-24">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
          <motion.div {...fadeUp} className="mx-auto max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-foreground sm:text-4xl">
              Your Operations, At A Glance
            </h2>
            <p className="mt-3 text-muted-foreground">
              A live look at the FlowPort operations dashboard, running on realistic demo data.
            </p>
          </motion.div>

          <motion.div {...fadeUp} className="mt-12">
            <HeroVisual />
            <Button
              asChild
              className="mt-8 h-11 rounded-full bg-[#0369A1] px-7 text-[15px] font-semibold text-white shadow-md hover:bg-[#0891B2]"
            >
              <Link href="/dashboard">
                Explore Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <WaveDivider
        from="bg-white dark:bg-card"
        to="fill-[hsl(210_45%_98.5%)] dark:fill-[hsl(216_36%_10%)]"
        variant="b"
      />
      <section className="bg-[hsl(210_45%_98.5%)] pb-20 pt-8 dark:bg-background lg:pb-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <motion.div
            {...fadeUp}
            className="relative overflow-hidden rounded-3xl px-6 py-14 text-center sm:px-12"
            style={{
              background: 'linear-gradient(135deg, #075985 0%, #0891B2 55%, #22D3EE 130%)',
            }}
          >
            <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-[#67E8F9]/20 blur-3xl" />
            <h2 className="relative text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Ready to Simplify Your Logistics?
            </h2>
            <p className="relative mx-auto mt-3 max-w-md text-white/80">
              Bring your shipments, warehouses, and deliveries together with FlowPort.
            </p>
            <div className="relative mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button
                asChild
                className="h-11 rounded-full bg-white px-7 text-[15px] font-semibold text-[#0369A1] hover:bg-[#F0F9FF]"
              >
                <Link href="/register">Get Started</Link>
              </Button>
              <Button
                asChild
                className="h-11 rounded-full border border-white/40 bg-white/10 px-7 text-[15px] font-medium text-white backdrop-blur hover:bg-white/20"
              >
                <Link href="/dashboard">Explore Platform</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
