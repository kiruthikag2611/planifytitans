import type { Metadata } from 'next';
import './globals.css';
import { Inter, Poppins } from 'next/font/google';
import { Providers } from './providers';
import { AppLayout } from '@/components/AppLayout';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'Planify',
  description: 'Smarter Schedule, Smoother Days.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${poppins.variable} font-body antialiased`}>
        <Providers>
          <AppLayout>{children}</AppLayout>
        </Providers>
      </body>
    </html>
  );
}
