'use client';

import { QuestionnaireProvider } from '@/context/QuestionnaireProvider';
import type { ReactNode } from 'react';

import { FirebaseClientProvider } from '@/firebase/client-provider';
import { ThemeProvider } from '@/components/ThemeProvider';

export function Providers({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <FirebaseClientProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <QuestionnaireProvider>
          {children}
        </QuestionnaireProvider>
      </ThemeProvider>
    </FirebaseClientProvider>
  );
}

 