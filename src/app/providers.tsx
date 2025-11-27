'use client';

import { QuestionnaireProvider } from '@/context/QuestionnaireProvider';
import type { ReactNode } from 'react';

import { FirebaseClientProvider } from '@/firebase/client-provider';
import { ThemeProvider } from '@/components/ThemeProvider';

/**
 * If you use next-intl in your project, uncomment the import and the NextIntlClientProvider
 * lines below. You previously had a TS error "Cannot find module 'next-intl'".
 *
 * Install it first if needed:
 *   npm install next-intl
 *
 * Then uncomment:
 *
// import { NextIntlClientProvider } from 'next-intl';
 */

export function Providers({
  children,
  // locale and messages are optional — only needed if you enable NextIntlClientProvider
  locale,
  messages,
}: {
  children: ReactNode;
  locale?: string;
  messages?: any;
}) {
  // If you enable NextIntlClientProvider, wrap the content with it and pass locale/messages.
  // For now we return the provider tree without next-intl to avoid TS errors when the package
  // is not installed.
  return (
    <FirebaseClientProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <QuestionnaireProvider>{children}</QuestionnaireProvider>
      </ThemeProvider>
    </FirebaseClientProvider>
  );
}

/* Example with next-intl (uncomment when next-intl is installed)
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
*/
