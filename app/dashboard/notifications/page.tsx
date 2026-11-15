'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, CheckCheck, PackageCheck, Sparkles, Truck, TriangleAlert, Boxes } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/layout/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { notifications as seed } from '@/data/mock';
import type { AppNotification, NotificationCategory } from '@/types';

const CATEGORIES: NotificationCategory[] = ['Delivery Alert', 'Warehouse Warning', 'Inventory Alert', 'Fleet Update', 'AI Recommendation'];

const categoryIcon: Record<NotificationCategory, React.ElementType> = {
  'Delivery Alert': Truck,
  'Warehouse Warning': TriangleAlert,
  'Inventory Alert': Boxes,
  'Fleet Update': PackageCheck,
  'AI Recommendation': Sparkles,
};

const severityStyle: Record<AppNotification['severity'], string> = {
  info: 'text-blue-500 bg-blue-500/10',
  success: 'text-emerald-500 bg-emerald-500/10',
  warning: 'text-amber-500 bg-amber-500/10',
  danger: 'text-red-500 bg-red-500/10',
};

export default function NotificationsPage() {
  const [items, setItems] = useState<AppNotification[]>(seed);
  const [category, setCategory] = useState<'all' | NotificationCategory>('all');
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filtered = useMemo(
    () =>
      items.filter(
        (n) => (category === 'all' || n.category === category) && (filter === 'all' || !n.read)
      ),
    [items, category, filter]
  );

  const unread = items.filter((n) => !n.read).length;

  const markAllRead = () => {
    setItems((list) => list.map((n) => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  };

  const toggleRead = (id: string) => {
    setItems((list) => list.map((n) => (n.id === id ? { ...n, read: !n.read } : n)));
  };

  return (
    <>
      <PageHeader
        title="Notifications"
        subtitle="Delivery alerts, warehouse warnings, inventory, fleet updates, and AI recommendations."
        actions={
          <Button variant="outline" onClick={markAllRead} disabled={unread === 0}>
            <CheckCheck className="mr-2 h-4 w-4" />
            Mark all as read
          </Button>
        }
      />

      <div className="mb-5 flex flex-wrap items-center gap-2">
        <Button
          size="sm"
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
          className="rounded-full"
        >
          All
        </Button>
        <Button
          size="sm"
          variant={filter === 'unread' ? 'default' : 'outline'}
          onClick={() => setFilter('unread')}
          className="rounded-full"
        >
          Unread
          {unread > 0 && (
            <Badge variant="secondary" className="ml-1.5 h-4 px-1 text-[10px]">
              {unread}
            </Badge>
          )}
        </Button>
        <div className="mx-2 hidden h-5 w-px bg-border sm:block" />
        <Button
          size="sm"
          variant={category === 'all' ? 'secondary' : 'ghost'}
          onClick={() => setCategory('all')}
          className="rounded-full"
        >
          <Bell className="mr-1.5 h-3.5 w-3.5" />
          All categories
        </Button>
        {CATEGORIES.map((c) => {
          const Icon = categoryIcon[c];
          return (
            <Button
              key={c}
              size="sm"
              variant={category === c ? 'secondary' : 'ghost'}
              onClick={() => setCategory(category === c ? 'all' : c)}
              className="rounded-full"
            >
              <Icon className="mr-1.5 h-3.5 w-3.5" />
              {c}
            </Button>
          );
        })}
      </div>

      <Card>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-16 text-center">
              <Bell className="h-8 w-8 text-muted-foreground/50" />
              <p className="font-medium">No notifications here</p>
              <p className="text-sm text-muted-foreground">
                {filter === 'unread' ? "You're all caught up — no unread notifications." : 'Try a different category filter.'}
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-border/60">
              <AnimatePresence initial={false}>
                {filtered.map((n) => {
                  const Icon = categoryIcon[n.category];
                  return (
                    <motion.li
                      key={n.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={cn(
                        'flex cursor-pointer items-start gap-3.5 p-4 transition-colors hover:bg-accent/50',
                        !n.read && 'bg-primary/[0.035]'
                      )}
                      onClick={() => toggleRead(n.id)}
                    >
                      <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg', severityStyle[n.severity])}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className={cn('text-sm', n.read ? 'text-muted-foreground' : 'font-semibold')}>
                            {n.title}
                          </p>
                          <Badge variant="outline" className="text-[10px]">
                            {n.category}
                          </Badge>
                          {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                        </div>
                        <p className="mt-0.5 text-sm text-muted-foreground">{n.message}</p>
                      </div>
                      <span className="shrink-0 text-xs text-muted-foreground/70">{n.timestamp}</span>
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </ul>
          )}
        </CardContent>
      </Card>
    </>
  );
}
