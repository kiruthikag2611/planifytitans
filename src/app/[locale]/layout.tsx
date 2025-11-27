import type { Metadata } from 'next';
import '../globals.css';
import { Providers } from '../providers';
import { AppLayout } from '@/components/AppLayout';
import { useLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { getMessages } from 'next-intl/server';


export const metadata: Metadata = {
  title: 'Planify',
  description: 'Smarter Schedule, Smoother Days.',
};

export default async function LocaleLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const locale = useLocale();

  // Show a 404 error if the user requests an unknown locale
  if (params.locale !== locale) {
    notFound();
  }

  // Providing the messages which have been defined in `i18n.ts`
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Poppins:wght@600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body 
        className="font-body antialiased"
      >
        <Providers locale={locale} messages={messages}>
          <AppLayout>
            {children}
          </AppLayout>
        </Providers>
      </body>
    </html>
  );
}
