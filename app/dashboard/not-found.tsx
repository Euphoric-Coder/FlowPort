'use client';

import { PageHeader } from '@/components/layout/page-header';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <PageHeader title="Page not found" subtitle="The page you are looking for does not exist in this workspace." />
      <a
        href="/dashboard"
        className="mt-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
      >
        Back to Dashboard
      </a>
    </div>
  );
}
