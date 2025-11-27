
'use client';

import { useRouter, usePathname } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card } from '../ui/card';

const totalSteps = 8;

export function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const currentStep = parseInt(pathname.split('/').pop() || '1', 10);
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-muted/20">
      <Card className="w-full max-w-2xl shadow-2xl animate-fade-in">
        <div className="p-6 border-b">
          {currentStep > 1 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="absolute top-6 left-6"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          )}
           <h1 className="text-2xl font-bold text-center font-headline mt-8">Let's build your perfect study plan</h1>
          <p className="text-center text-muted-foreground mt-2">Tell us a bit about your classes, study style and deadlines.</p>
        </div>
        <div className="p-6">
          <Progress value={progress} className="w-full mb-6" />
          {children}
        </div>
      </Card>
    </div>
  );
}
