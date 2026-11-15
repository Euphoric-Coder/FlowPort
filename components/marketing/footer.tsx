import Link from 'next/link';
import { FlowPortLogo, Wordmark } from '@/components/shared/logo';

const groups = [
  {
    title: 'Platform',
    items: [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Orders', href: '/dashboard/orders' },
      { label: 'Shipments', href: '/dashboard/shipments' },
      { label: 'Warehouses', href: '/dashboard/warehouses' },
      { label: 'Fleet', href: '/dashboard/fleet' },
    ],
  },
  {
    title: 'Product',
    items: [
      { label: 'Features', href: '/features' },
      { label: 'Solutions', href: '/solutions' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'AI Control Tower', href: '/dashboard/ai-control-tower' },
    ],
  },
  {
    title: 'Account',
    items: [
      { label: 'Sign In', href: '/login' },
      { label: 'Create Account', href: '/register' },
      { label: 'Settings', href: '/dashboard/settings' },
    ],
  },
];

export function MarketingFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 dark:border-border dark:bg-card/50">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <div className="flex items-center gap-2.5">
              <FlowPortLogo />
              <Wordmark className="text-lg" />
            </div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-500 dark:text-muted-foreground">
              Move Smarter. Deliver Better. One intelligent platform for every shipment, warehouse,
              and delivery.
            </p>
          </div>
          {groups.map((g) => (
            <div key={g.title}>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-foreground">{g.title}</h3>
              <ul className="mt-3 space-y-2.5">
                {g.items.map((it) => (
                  <li key={it.label}>
                    <Link
                      href={it.href}
                      className="text-sm text-slate-500 transition-colors hover:text-[#0369A1] dark:text-muted-foreground dark:hover:text-primary"
                    >
                      {it.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 border-t border-slate-200 pt-6 text-xs text-slate-500 dark:border-border dark:text-muted-foreground">
          <p>© {new Date().getFullYear()} FlowPort. Product demonstration interface.</p>
          <p className="mt-1">
            All data shown is illustrative sample data — no live integrations, certifications, or
            customer results are claimed.
          </p>
        </div>
      </div>
    </footer>
  );
}
