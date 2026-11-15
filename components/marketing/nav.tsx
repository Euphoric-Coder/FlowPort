'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { FlowPortLogo, Wordmark } from '@/components/shared/logo';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/#features', label: 'Features' },
  { href: '/#about', label: 'About' },
];

export function MarketingNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Over the hero gradient the header renders transparent with light text;
  // once scrolled (or on inner pages) it becomes a solid frosted bar.
  const onHome = pathname === '/';
  const transparent = onHome && !scrolled && !open;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        transparent
          ? 'bg-transparent'
          : 'border-b border-border/70 bg-background/80 shadow-sm backdrop-blur-xl'
      )}
    >
      <div
        className={cn(
          'relative mx-auto flex h-16 max-w-6xl items-center justify-between px-4 transition-colors sm:px-6',
          transparent ? 'text-white' : 'text-foreground'
        )}
      >
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          aria-label="FlowPort home"
        >
          <FlowPortLogo />
          <Wordmark className="text-lg" onDark={transparent} />
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                'rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70',
                transparent
                  ? 'text-white/85 hover:bg-white/10 hover:text-white'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              {l.label}
            </Link>
          ))}
          <Button
            variant="ghost"
            asChild
            className={cn(transparent && 'text-white/90 hover:bg-white/10 hover:text-white')}
          >
            <Link href="/login">Sign In</Link>
          </Button>
          <ThemeToggle
            className={cn(transparent && 'text-white hover:bg-white/10 hover:text-white')}
          />
          <Button
            asChild
            className={cn(
              'rounded-full px-5',
              transparent
                ? 'bg-white text-[#0369A1] shadow-md hover:bg-[#F0F9FF]'
                : 'bg-[#0369A1] text-white shadow-sm hover:bg-[#0891B2]'
            )}
          >
            <Link href="/register">Get Started</Link>
          </Button>
        </nav>

        <div className="flex items-center gap-1.5 md:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className={cn('md:hidden', transparent && 'text-white hover:bg-white/10')}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border/70 bg-background/95 px-4 py-3 backdrop-blur-xl md:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground',
                  pathname === l.href && 'text-foreground'
                )}
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-2 flex gap-2 border-t border-border pt-3">
              <Button variant="outline" className="flex-1" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button className="flex-1 rounded-full bg-[#0369A1] text-white hover:bg-[#0891B2]" asChild>
                <Link href="/register">Get Started</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
