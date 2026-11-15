import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '@/components/shared/providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FlowPort — Intelligent Logistics & Supply Chain Management',
  description:
    'Move Smarter. Deliver Better. One platform for every shipment, warehouse, and delivery.',
  icons: {
    icon: [
      { url: '/icon.png?v=fp1', type: 'image/png', sizes: '512x512' },
      { url: '/favicon.ico?v=fp1', type: 'image/x-icon', sizes: '32x32' },
    ],
    shortcut: '/icon.png?v=fp1',
    apple: '/icon.png?v=fp1',
  },
  openGraph: {
    images: [
      {
        url: 'https://bolt.new/static/og_default.png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: [
      {
        url: 'https://bolt.new/static/og_default.png',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
