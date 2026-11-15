'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  Bell,
  Boxes,
  ChevronLeft,
  ClipboardList,
  Gauge,
  LayoutDashboard,
  MapPinned,
  Settings,
  Sparkles,
  Truck,
  Warehouse,
  BarChart3,
} from 'lucide-react';
import { FlowPortLogo, Wordmark } from '@/components/shared/logo';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

export const navGroups = [
  {
    section: 'Overview',
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, exact: true },
      { href: '/dashboard/orders', label: 'Orders', icon: ClipboardList },
      { href: '/dashboard/shipments', label: 'Shipments', icon: Truck },
    ],
  },
  {
    section: 'Operations',
    items: [
      { href: '/dashboard/warehouses', label: 'Warehouses', icon: Warehouse },
      { href: '/dashboard/inventory', label: 'Inventory', icon: Boxes },
      { href: '/dashboard/fleet', label: 'Fleet Management', icon: Gauge },
      { href: '/dashboard/routes', label: 'Route Planning', icon: MapPinned },
    ],
  },
  {
    section: 'Intelligence',
    items: [
      { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
      { href: '/dashboard/ai-control-tower', label: 'AI Control Tower', icon: Sparkles },
    ],
  },
  {
    section: 'System',
    items: [
      { href: '/dashboard/notifications', label: 'Notifications', icon: Bell },
      { href: '/dashboard/settings', label: 'Settings', icon: Settings },
    ],
  },
];

function NavLinks({ collapsed, onNavigate }: { collapsed: boolean; onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
      {navGroups.map((group) => (
        <div key={group.section}>
          {collapsed ? (
            <div className="mx-auto mb-2 h-px w-8 bg-border" />
          ) : (
            <p className="px-2.5 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
              {group.section}
            </p>
          )}
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
              const link = (
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground',
                    active && 'bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary',
                    collapsed && 'justify-center px-2'
                  )}
                >
                  <item.icon className={cn('h-[18px] w-[18px] shrink-0', active && 'text-primary')} />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Link>
              );
              return collapsed ? (
                <li key={item.href}>
                  <Tooltip>
                    <TooltipTrigger asChild>{link}</TooltipTrigger>
                    <TooltipContent side="right" sideOffset={8}>
                      {item.label}
                    </TooltipContent>
                  </Tooltip>
                </li>
              ) : (
                <li key={item.href}>{link}</li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function SidebarFooter({ collapsed }: { collapsed: boolean }) {
  return (
    <div className={cn('border-t border-border/60 p-3', collapsed && 'px-2')}>
      <div className={cn('rounded-lg bg-elevated p-3', collapsed && 'p-2')}>
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border border-border">
            <AvatarFallback className="bg-gradient-to-br from-blue-600 to-cyan-500 text-xs font-semibold text-white">
              AM
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">Alex Morgan</p>
              <p className="truncate text-xs text-muted-foreground">Operations Manager</p>
            </div>
          )}
        </div>
        {!collapsed && (
          <>
            <div className="mt-3 flex items-center justify-between rounded-md border border-border/60 bg-background px-2.5 py-1.5">
              <span className="truncate text-xs text-muted-foreground">FlowPort Demo Workspace</span>
              <span className="ml-2 h-1.5 w-1.5 shrink-0 animate-pulse-dot rounded-full bg-emerald-500" />
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 w-full justify-start text-muted-foreground"
              asChild
            >
              <Link href="/dashboard/settings">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

function BrandHeader({ collapsed }: { collapsed?: boolean }) {
  return (
    <div className={cn('flex h-16 items-center gap-2.5 border-b border-border/60 px-4', collapsed && 'justify-center px-2')}>
      <Link href="/" className="flex items-center gap-2.5">
        <FlowPortLogo />
        {!collapsed && <Wordmark className="text-base" />}
      </Link>
    </div>
  );
}

export function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      data-collapsed={collapsed}
      className={cn(
        'sticky top-0 hidden h-screen shrink-0 flex-col border-r border-border/60 bg-sidebar transition-[width] duration-200 md:flex',
        collapsed ? 'w-[68px]' : 'w-60'
      )}
    >
      <BrandHeader collapsed={collapsed} />
      <NavLinks collapsed={collapsed} />
      <SidebarFooter collapsed={collapsed} />
      <button
        onClick={() => setCollapsed((v) => !v)}
        className="absolute -right-3.5 top-[68px] z-10 hidden h-7 w-7 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm transition-colors hover:text-foreground lg:flex"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <ChevronLeft className={cn('h-4 w-4 transition-transform', collapsed && 'rotate-180')} />
      </button>
    </aside>
  );
}

export function MobileSidebar({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-72 bg-sidebar p-0">
        <SheetTitle className="sr-only">Navigation</SheetTitle>
        <div className="flex h-full flex-col">
          <BrandHeader />
          <NavLinks collapsed={false} onNavigate={() => onOpenChange(false)} />
          <SidebarFooter collapsed={false} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
