
import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { AppLayout } from '@/components/AppLayout';


export const metadata: Metadata = {
  title: 'Planify',
  description: 'Smarter Schedule, Smoother Days.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
