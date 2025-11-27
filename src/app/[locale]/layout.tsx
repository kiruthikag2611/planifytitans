import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { getMessages } from 'next-intl/server';

import { Providers } from '../providers';
import { AppLayout } from '@/components/AppLayout';

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  let messages;
  try {
    messages = await getMessages({ locale });
  } catch (error) {
    notFound();
  }

  return (
    <Providers locale={locale} messages={messages}>
      <AppLayout>{children}</AppLayout>
    </Providers>
  );
}
