// src/app/providers.tsx
'use client';

import { QuestionnaireProvider } from '@/context/QuestionnaireProvider';
import type { ReactNode } from 'react';

import { FirebaseClientProvider } from '@/firebase/client-provider';
import { ThemeProvider } from '@/components/ThemeProvider';

/**
 * Providers wrapper
 *
 * - children is required (ReactNode)
 * - locale and messages are optional and only needed if you enable next-intl
 *
 * If you want next-intl enabled, install it and uncomment the NextIntlClientProvider import
 * and the wrapper below.
 *
 *   npm install next-intl
 *
 * Then uncomment the lines that reference NextIntlClientProvider.
 */

/* Uncomment if you install next-intl
import { NextIntlClientProvider } from 'next-intl';
*/

export function Providers({
  children,
  locale,
  messages,
}: {
  children: ReactNode;
  locale?: string;
  messages?: any;
}) {
  // If you enable next-intl in your project, wrap the returned tree with
  // NextIntlClientProvider and pass locale/messages. For now we avoid that
  // to prevent TS errors if the package isn't installed.
  return (
    <FirebaseClientProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <QuestionnaireProvider>{children}</QuestionnaireProvider>
      </ThemeProvider>
    </FirebaseClientProvider>
  );
}

/* Example with next-intl (uncomment the import and this function if you install next-intl)
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
