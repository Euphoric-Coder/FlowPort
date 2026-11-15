import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { InventoryStatus, NotificationSeverity, ShipmentStatus, VehicleStatus, WarehouseStatus } from '@/types';

type Tone = 'success' | 'info' | 'warning' | 'danger' | 'neutral' | 'progress';

const toneClasses: Record<Tone, string> = {
  success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25',
  info: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/25',
  warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25',
  danger: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/25',
  progress: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/25',
  neutral: 'bg-muted text-muted-foreground border-border',
};

const dotClasses: Record<Tone, string> = {
  success: 'bg-emerald-500',
  info: 'bg-blue-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
  progress: 'bg-cyan-500',
  neutral: 'bg-slate-400',
};

export interface StatusBadgeProps {
  status: string;
  className?: string;
  withDot?: boolean;
}

const TONE_MAP: Record<string, Tone> = {
  // Orders
  Created: 'neutral',
  Confirmed: 'info',
  Processing: 'progress',
  Packed: 'progress',
  Dispatched: 'info',
  Delivered: 'success',
  Cancelled: 'danger',
  // Shipments
  Pending: 'neutral',
  'In Warehouse': 'neutral',
  'In Transit': 'info',
  'Out for Delivery': 'progress',
  Delayed: 'warning',
  Exception: 'danger',
  // Warehouse
  Operational: 'success',
  'High Load': 'warning',
  Maintenance: 'neutral',
  // Inventory
  'In Stock': 'success',
  'Low Stock': 'warning',
  Critical: 'danger',
  'Out of Stock': 'danger',
  // Vehicles
  Available: 'success',
  'On Route': 'info',
  Charging: 'warning',
};

export function StatusBadge({ status, className, withDot = true }: StatusBadgeProps) {
  const tone = TONE_MAP[status] ?? 'neutral';
  return (
    <Badge variant="outline" className={cn('gap-1.5 font-medium', toneClasses[tone], className)}>
      {withDot && <span className={cn('h-1.5 w-1.5 rounded-full', dotClasses[tone])} />}
      {status}
    </Badge>
  );
}

export function severityTone(severity: NotificationSeverity): Tone {
  switch (severity) {
    case 'success': return 'success';
    case 'warning': return 'warning';
    case 'danger': return 'danger';
    default: return 'info';
  }
}

export { toneClasses, dotClasses };
export type { Tone };
