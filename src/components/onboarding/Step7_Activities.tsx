
"use client";

import { useQuestionnaire } from '@/context/QuestionnaireProvider';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ActivityCard } from '../tasks/ActivityCard';

const activities = [
    {
        activityId: '1',
        title: 'Tech Fest 2024',
        description: 'Annual technology festival with coding competitions, workshops, and guest lectures.',
        location: 'Main Auditorium',
        startTime: '2024-12-05T09:00:00',
        endTime: '2024-12-06T17:00:00',
        organizer: 'Computer Science Dept.',
        tags: ['fest', 'tech'],
    },
    {
        activityId: '2',
        title: 'Workshop on AI',
        description: 'A hands-on workshop on the latest trends in Artificial Intelligence and Machine Learning.',
        location: 'Seminar Hall B',
        startTime: '2024-12-10T11:00:00',
        endTime: '2024-12-10T13:00:00',
        organizer: 'AI Club',
        tags: ['workshop', 'ai'],
    },
];

export function Step7_Activities({ onNext, onBack }: { onNext: () => void, onBack: () => void }) {
  const { answers, updateAnswers } = useQuestionnaire();

  // In a real app, this would fetch from the `activities` collection
  // and filter based on user's college, etc.

  const handleToggleActivity = (activity: any) => {
    const currentActivities = answers.activities || [];
    const isAlreadyAdded = currentActivities.some(a => a.activityId === activity.activityId);
    let newActivities;
    if (isAlreadyAdded) {
        newActivities = currentActivities.filter(a => a.activityId !== activity.activityId);
    } else {
        newActivities = [...currentActivities, activity];
    }
    updateAnswers({ activities: newActivities });
  };
  
  return (
    <div className="space-y-6">
        <h2 className="text-lg font-semibold">Activities & Events</h2>
        <p className="text-muted-foreground">Anything else happening on campus? Add events you're interested in so we can schedule around them.</p>

        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {activities.map((activity) => (
                <div key={activity.activityId} className="relative">
                    <ActivityCard activity={activity} />
                    <Button 
                        size="sm"
                        className="absolute bottom-6 right-6"
                        variant={answers.activities?.some(a => a.activityId === activity.activityId) ? 'secondary' : 'default'}
                        onClick={() => handleToggleActivity(activity)}
                    >
                         {answers.activities?.some(a => a.activityId === activity.activityId) ? 'Remove' : 'Add to my schedule'}
                    </Button>
                </div>
            ))}
        </div>

        <div className="flex justify-between">
            <Button type="button" variant="ghost" onClick={onBack}>Previous Question</Button>
            <Button type="button" onClick={onNext}>Next</Button>
        </div>
      </div>
  );
}
