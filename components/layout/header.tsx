'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Bell,
  Check,
  ChevronDown,
  ChevronsUpDown,
  LogOut,
  Menu,
  Search,
  Settings,
  User,
} from 'lucide-react';
import { FlowPortLogo } from '@/components/shared/logo';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { notifications } from '@/data/mock';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import { LayoutDashboard, ClipboardList, Truck, Warehouse, Boxes, Gauge, MapPinned, BarChart3, Sparkles, Settings as SettingsIcon, Building2 } from 'lucide-react';

const breadcrumbs: Record<string, string> = {
  dashboard: 'Dashboard',
  orders: 'Orders',
  shipments: 'Shipments',
  warehouses: 'Warehouses',
  inventory: 'Inventory',
  fleet: 'Fleet Management',
  routes: 'Route Planning',
  analytics: 'Analytics',
  'ai-control-tower': 'AI Control Tower',
  notifications: 'Notifications',
  settings: 'Settings',
};

const searchIndex: Array<{ label: string; href: string; icon: LucideIcon; hint: string }> = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, hint: 'Operations overview' },
  { label: 'Orders', href: '/dashboard/orders', icon: ClipboardList, hint: 'Order management' },
  { label: 'Shipments', href: '/dashboard/shipments', icon: Truck, hint: 'Shipment tracking' },
  { label: 'Warehouses', href: '/dashboard/warehouses', icon: Warehouse, hint: 'Facility operations' },
  { label: 'Inventory', href: '/dashboard/inventory', icon: Boxes, hint: 'Stock management' },
  { label: 'Fleet Management', href: '/dashboard/fleet', icon: Gauge, hint: 'Vehicles and drivers' },
  { label: 'Route Planning', href: '/dashboard/routes', icon: MapPinned, hint: 'Route optimization' },
  { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart3, hint: 'Business intelligence' },
  { label: 'AI Control Tower', href: '/dashboard/ai-control-tower', icon: Sparkles, hint: 'Intelligence center' },
  { label: 'Settings', href: '/dashboard/settings', icon: SettingsIcon, hint: 'Workspace preferences' },
];

export function DashboardHeader({ onOpenMobileNav }: { onOpenMobileNav: () => void }) {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const results = useMemo(() => {
    if (!query.trim()) return searchIndex;
    const q = query.toLowerCase();
    return searchIndex.filter((s) => s.label.toLowerCase().includes(q) || s.hint.toLowerCase().includes(q));
  }, [query]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={onOpenMobileNav} aria-label="Open navigation">          <Menu className="h-5 w-5" />
        </Button>

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="hidden items-center gap-1.5 text-sm sm:flex">
          <Link href="/dashboard" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground">
            <FlowPortLogo className="h-4 w-4" />
            FlowPort
          </Link>
          {segments.map((seg, i) => (
            <span key={seg} className="flex items-center gap-1.5">
              <span className="text-border">/</span>
              <span className={cn(i === segments.length - 1 ? 'font-medium text-foreground' : 'text-muted-foreground')}>
                {breadcrumbs[seg] ?? seg}
              </span>
            </span>
          ))}
        </nav>

        {/* Search */}
        <div className="relative ml-auto w-full max-w-xs">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            placeholder="Search platform…"
            className="h-9 bg-elevated pl-8 pr-12"
          />
          <kbd className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 rounded border border-border bg-muted px-1.5 text-[10px] font-medium text-muted-foreground sm:block">
            /
          </kbd>
          {open && (
            <>
              <button className="fixed inset-0 z-40 cursor-default" onClick={() => setOpen(false)} tabIndex={-1} aria-label="Close search" />
              <div className="absolute right-0 z-50 mt-2 w-[340px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border bg-popover shadow-xl">
                <p className="border-b border-border/60 px-3 py-2 text-xs font-medium text-muted-foreground">
                  {query.trim() ? `${results.length} results` : 'Quick navigation'}
                </p>
                <ul className="max-h-80 overflow-y-auto p-1.5">
                  {results.length === 0 && (
                    <li className="px-3 py-6 text-center text-sm text-muted-foreground">
                      No matches for “{query}”. Try “orders”, “fleet”, or “AI”.
                    </li>
                  )}
                  {results.map((r) => (
                    <li key={r.href}>
                      <Link
                        href={r.href}
                        onClick={() => { setOpen(false); setQuery(''); }}
                        className="flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm hover:bg-accent"
                      >
                        <r.icon className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{r.label}</span>
                        <span className="ml-auto text-xs text-muted-foreground">{r.hint}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>

        {/* Workspace selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="hidden h-9 gap-2 lg:inline-flex">
              <FlowPortLogo className="h-4 w-4" />
              <span className="max-w-[120px] truncate text-xs font-medium">FlowPort Demo</span>
              <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Workspaces (demo)</DropdownMenuLabel>
            <DropdownMenuItem>
              <FlowPortLogo className="mr-2 h-4 w-4" />
              FlowPort Demo
              <Check className="ml-auto h-4 w-4 text-primary" />
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
              <Building2 className="mr-2 h-4 w-4" />
              Acme Logistics
              <Badge variant="outline" className="ml-auto text-[10px]">Planned</Badge>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative" asChild>
          <Link href="/dashboard/notifications" aria-label="Notifications">
            <Bell className="h-[18px] w-[18px]" />
            {unreadCount > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                {unreadCount}
              </span>
            )}
          </Link>
        </Button>

        <ThemeToggle />

        {/* Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-lg px-1.5 py-1.5 transition-colors hover:bg-accent" aria-label="Open profile menu">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-gradient-to-br from-blue-600 to-cyan-500 text-xs font-semibold text-white">
                  AM
                </AvatarFallback>
              </Avatar>
              <div className="hidden text-left lg:block">
                <p className="text-sm font-medium leading-none">Alex Morgan</p>
                <p className="mt-0.5 text-xs text-muted-foreground">Operations Manager</p>
              </div>
              <ChevronDown className="hidden h-4 w-4 text-muted-foreground lg:block" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel>
              <p className="text-sm font-medium">Alex Morgan</p>
              <p className="text-xs font-normal text-muted-foreground">alex.morgan@flowport.demo</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings">
                <User className="mr-2 h-4 w-4" />
                Profile & Preferences
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings">
                <Settings className="mr-2 h-4 w-4" />
                Workspace Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/login">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

