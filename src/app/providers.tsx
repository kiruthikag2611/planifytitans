
"use client";

import { QuestionnaireProvider } from '@/context/QuestionnaireProvider';
import type { ReactNode } from 'react';

import { FirebaseClientProvider } from '@/firebase/client-provider';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <FirebaseClientProvider>
      <QuestionnaireProvider>
        {children}
      </QuestionnaireProvider>
    </FirebaseClientProvider>
  );
}

