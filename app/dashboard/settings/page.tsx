'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Building2, Moon, Save, Sun, User } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const PERSONAS = [
  'Operations Manager',
  'Warehouse Manager',
  'Fleet Manager',
  'Merchant / Customer',
  'Administrator',
];

const NOTIFICATION_PREFS = [
  { key: 'delivery', label: 'Delivery alerts', desc: 'Delays, exceptions, completed deliveries' },
  { key: 'warehouse', label: 'Warehouse warnings', desc: 'Capacity and fulfillment queue alerts' },
  { key: 'inventory', label: 'Inventory alerts', desc: 'Low stock and reorder thresholds' },
  { key: 'fleet', label: 'Fleet updates', desc: 'Vehicle status and maintenance reminders' },
  { key: 'ai', label: 'AI recommendations', desc: 'Simulated insight feed notifications' },
];

const APPEARANCES = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
];

function usePersistentState<T extends string>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  useEffect(() => {
    const stored = localStorage.getItem(key);
    if (stored) setValue(stored as T);
  }, [key]);
  const update = (v: T) => {
    setValue(v);
    localStorage.setItem(key, v);
  };
  return [value, update] as const;
}

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [name, setName] = useState('Alex Morgan');
  const [email, setEmail] = useState('alex.morgan@flowport.demo');
  const [persona, setPersona] = usePersistentState<string>('fp-persona', 'Operations Manager');
  const [prefs, setPrefs] = usePersistentState<string>('fp-notif-mode', 'all');
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    delivery: true, warehouse: true, inventory: true, fleet: false, ai: true,
  });

  const saveProfile = () => {
    toast.success('Profile saved (demo)', { description: 'Preferences are stored locally in your browser only.' });
  };

  return (
    <>
      <PageHeader title="Settings" subtitle="Account preferences, workspace information, and demo persona selection." />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="h-4 w-4 text-primary" />
              Account Preferences
            </CardTitle>
            <CardDescription>Demo profile — nothing is sent to a server.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Demo persona</Label>
              <Select value={persona} onValueChange={(v) => { setPersona(v); toast.info(`Persona switched to ${v} (demo)`); }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PERSONAS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Persona selection changes the demo role indicator; it does not alter permissions.
              </p>
            </div>
            <Button onClick={saveProfile}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Building2 className="h-4 w-4 text-primary" />
              Workspace Information
            </CardTitle>
            <CardDescription>Details of the demo workspace.</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="space-y-3 text-sm">
              {[
                ['Workspace', 'FlowPort Demo Workspace'],
                ['Plan', 'Enterprise (demo)'],
                ['Region', 'US Multi-Region (simulated)'],
                ['Facilities', '24 warehouses (8 detailed in demo)'],
                ['Vehicles', '320 connected (10 detailed in demo)'],
                ['Data Mode', 'Mock dataset — no live backend'],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between gap-4 border-b border-border/60 pb-3 last:border-0 last:pb-0">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="text-right font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Appearance</CardTitle>
            <CardDescription>Theme preference is saved to your browser.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {APPEARANCES.map((a) => (
                <button
                  key={a.value}
                  onClick={() => setTheme(a.value)}
                  className={cn(
                    'flex flex-col items-center gap-2 rounded-xl border p-4 text-sm font-medium transition-colors',
                    theme === a.value
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border/70 text-muted-foreground hover:bg-accent'
                  )}
                >
                  <a.icon className="h-5 w-5" />
                  {a.label}
                </button>
              ))}
            </div>
            <Separator className="my-4" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Compact density</p>
                <p className="text-xs text-muted-foreground">Tighter table rows and card spacing</p>
              </div>
              <Switch checked={prefs === 'compact'} onCheckedChange={(v) => setPrefs(v ? 'compact' : 'all')} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Notification Preferences</CardTitle>
            <CardDescription>Choose which alerts appear in your notification center.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1">
            {NOTIFICATION_PREFS.map((p) => (
              <div key={p.key} className="flex items-center justify-between gap-4 py-2.5">
                <div>
                  <p className="text-sm font-medium">{p.label}</p>
                  <p className="text-xs text-muted-foreground">{p.desc}</p>
                </div>
                <Switch
                  checked={toggles[p.key]}
                  onCheckedChange={(v) => setToggles((t) => ({ ...t, [p.key]: v }))}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
