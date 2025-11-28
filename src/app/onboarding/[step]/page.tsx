
'use client';

import { useRouter, useParams } from 'next/navigation';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { Step1_Timezone } from '@/components/onboarding/Step1_Timezone';
import { Step2_TermDates } from '@/components/onboarding/Step2_TermDates';
import { Step3_Classes } from '@/components/onboarding/Step3_Classes';
import { Step4_Availability } from '@/components/onboarding/Step4_Availability';
import { Step5_StudyPreferences } from '@/components/onboarding/Step5_StudyPreferences';
import { Step6_Tasks } from '@/components/onboarding/Step6_Tasks';
import { Step7_Activities } from '@/components/onboarding/Step7_Activities';
import { Step8_Constraints } from '@/components/onboarding/Step8_Constraints';
import { useQuestionnaire } from '@/context/QuestionnaireProvider';
import { generateSchedule } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

export default function OnboardingPage() {
  const router = useRouter();
  const params = useParams();
  const { getFormattedAnswers, category, subCategory } = useQuestionnaire();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const step = parseInt(Array.isArray(params.step) ? params.step[0] : params.step || '1', 10);

  const handleNext = () => {
    if (step < 8) {
      router.push(`/onboarding/${step + 1}`);
    } else {
      handleFinish();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      router.push(`/onboarding/${step - 1}`);
    } else {
      router.push('/category');
    }
  }
  
  const handleFinish = async () => {
    setIsGenerating(true);
    toast({
      title: 'Generating your timetable...',
      description: 'The AI is working its magic. This may take a few seconds.',
    });
    
    const answers = getFormattedAnswers(category, subCategory);
    
    try {
      const result = await generateSchedule(answers);
      if (result.success && result.data?.schedule) {
        // The AI result is nested, so we extract the schedule array
        sessionStorage.setItem('scheduleData', JSON.stringify(result.data.schedule));
        toast({
          title: 'Timetable generated successfully!',
          description: 'Redirecting you to your dashboard.',
        });
        router.push('/dashboard');
      } else {
        // Handle failure but still redirect
        console.error('Failed to generate schedule:', result.error);
        toast({
          variant: 'destructive',
          title: 'Could not generate timetable',
          description: 'Using a default schedule for now. You can try again later.',
        });
        router.push('/dashboard');
      }
    } catch (error) {
      // Handle exception but still redirect
      console.error('Failed to generate schedule:', error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'Using a default schedule for now. You can try again later.',
      });
      router.push('/dashboard');
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <Step1_Timezone onNext={handleNext} />;
      case 2:
        return <Step2_TermDates onNext={handleNext} onBack={handleBack} />;
      case 3:
        return <Step3_Classes onNext={handleNext} onBack={handleBack} />;
      case 4:
        return <Step4_Availability onNext={handleNext} onBack={handleBack} />;
      case 5:
        return <Step5_StudyPreferences onNext={handleNext} onBack={handleBack} />;
      case 6:
        return <Step6_Tasks onNext={handleNext} onBack={handleBack} />;
      case 7:
        return <Step7_Activities onNext={handleNext} onBack={handleBack} />;
      case 8:
        return <Step8_Constraints onFinish={handleFinish} onBack={handleBack} isGenerating={isGenerating}/>;
      default:
        return <div>Invalid Step</div>;
    }
  };

  return (
    <OnboardingLayout>
      {renderStep()}
    </OnboardingLayout>
  );
}
