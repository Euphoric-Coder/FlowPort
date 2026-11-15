'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const schema = z.object({
  name: z.string().min(2, 'Enter your full name'),
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  company: z.string().min(2, 'Enter your company name'),
  role: z.string().min(1, 'Select your primary role'),
  password: z
    .string()
    .min(8, 'Use at least 8 characters')
    .regex(/[A-Z]/, 'Include at least one uppercase letter')
    .regex(/[0-9]/, 'Include at least one number'),
});

type FormValues = z.infer<typeof schema>;

const perks = [
  'Full platform demo with realistic sample data',
  'Every module unlocked — orders, fleet, AI control tower',
  'No credit card or real credentials required',
];

export default function RegisterPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    await new Promise((r) => setTimeout(r, 800));
    toast.success('Demo workspace created', {
      description: `${values.name} (${values.role}) — opening the simulated platform (no account is really created).`,
    });
    router.push('/dashboard');
  };

  return (
    <div className="relative grid w-full max-w-4xl items-center gap-10 lg:grid-cols-2">
      <div className="hidden lg:block">
        <h1 className="text-3xl font-semibold tracking-tight">
          Start moving <span className="text-gradient">smarter.</span>
        </h1>
        <p className="mt-3 text-muted-foreground">
          Create your FlowPort workspace and explore the full logistics platform in demo mode.
        </p>
        <ul className="mt-8 space-y-3">
          {perks.map((p) => (
            <li key={p} className="flex items-start gap-2.5 text-sm text-muted-foreground">
              <span className="mt-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-emerald-500/15">
                <Check className="h-3 w-3 text-emerald-500" />
              </span>
              {p}
            </li>
          ))}
        </ul>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>Free demo — no credit card, no real data stored</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" placeholder="Alex Morgan" {...register('name')} />
                {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="company">Company</Label>
                <Input id="company" placeholder="Acme Logistics" {...register('company')} />
                {errors.company && <p className="text-xs text-red-500">{errors.company.message}</p>}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Work email</Label>
              <Input id="email" type="email" placeholder="you@company.com" {...register('email')} />
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Primary role</Label>
              <input type="hidden" {...register('role')} />
              <Select onValueChange={(v) => setValue('role', v, { shouldValidate: true })}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Operations Manager">Operations Manager</SelectItem>
                  <SelectItem value="Warehouse Manager">Warehouse Manager</SelectItem>
                  <SelectItem value="Fleet Manager">Fleet Manager</SelectItem>
                  <SelectItem value="Merchant / Customer">Merchant / Customer</SelectItem>
                  <SelectItem value="Administrator">Administrator</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && <p className="text-xs text-red-500">{errors.role.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Min 8 chars, 1 uppercase, 1 number"
                {...register('password')}
              />
              {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isSubmitting ? 'Creating workspace…' : 'Create Account'}
            </Button>
          </form>
          <p className="mt-5 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
