
'use client';

import { QuestionnaireProvider } from '@/context/QuestionnaireProvider';
import type { ReactNode } from 'react';

import { FirebaseClientProvider } from '@/firebase/client-provider';
import { ThemeProvider } from '@/components/ThemeProvider';
import { NextIntlClientProvider } from 'next-intl';

export function Providers({
  children,
  locale,
  messages,
}: {
  children: ReactNode;
  locale: string;
  messages: any;
}) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <FirebaseClientProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <QuestionnaireProvider>{children}</QuestionnaireProvider>
        </ThemeProvider>
      </FirebaseClientProvider>
    </NextIntlClientProvider>
  );
}
