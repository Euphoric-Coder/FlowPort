import { FlowPortLogo, Wordmark } from '@/components/shared/logo';
import { ThemeToggle } from '@/components/shared/theme-toggle';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6">
          <a href="/" className="flex items-center gap-2.5">
            <FlowPortLogo />
            <Wordmark className="text-lg" />
          </a>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="pointer-events-none fixed inset-0 panel-glow" />
        {children}
      </main>
      <footer className="border-t border-border/60 py-4 text-center text-xs text-muted-foreground">
        © 2026 FlowPort — product demo interface. No real credentials are stored.
      </footer>
    </div>
  );
}
