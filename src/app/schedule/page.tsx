
'use client';

import { Download, Info, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useUser } from '@/firebase/auth/use-user';
import { useFirestore } from '@/firebase/provider';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { format, addDays, startOfWeek } from 'date-fns';

type ScheduleEvent = {
  title: string;
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
  startTime: string; // "HH:MM"
  endTime: string; // "HH:MM"
  type: "Class" | "Study" | "Revision" | "Break" | "Meal" | "Commute" | "Gym" | "Sleep" | "Task" | "Lab" | "Practical" | "Meeting" | "Personal";
  description?: string;
};

type ScheduleData = {
    schedule: ScheduleEvent[];
    summary: string;
}

const exampleSchedule: ScheduleData = {
  summary: "This is a sample schedule to demonstrate the timetable feature. You can generate your own personalized schedule by completing the questionnaire.",
  schedule: [
    { title: "Mathematics", day: "Monday", startTime: "09:00", endTime: "10:00", type: "Class", description: "Chapter 5: Algebra" },
    { title: "Study: Math", day: "Monday", startTime: "10:00", endTime: "11:00", type: "Study", description: "Review lecture notes" },
    { title: "Physics", day: "Monday", startTime: "11:00", endTime: "12:00", type: "Class", description: "Chapter 3: Motion" },
    { title: "Lunch Break", day: "Monday", startTime: "12:00", endTime: "13:00", type: "Meal", description: "Cafeteria" },
    { title: "Study: Physics", day: "Monday", startTime: "13:00", endTime: "14:30", type: "Study", description: "Problem set 2" },
    { title: "Short Break", day: "Monday", startTime: "14:30", endTime: "15:00", type: "Break" },
    { title: "History", day: "Monday", startTime: "15:00", endTime: "16:00", type: "Class", description: "The World Wars" },

    { title: "Chemistry", day: "Tuesday", startTime: "10:00", endTime: "11:30", type: "Class", description: "Organic Chemistry Intro" },
    { title: "Lunch Break", day: "Tuesday", startTime: "12:00", endTime: "13:00", type: "Meal" },
    { title: "Chemistry Lab", day: "Tuesday", startTime: "13:00", endTime: "15:00", type: "Lab" },
    { title: "Tea Break", day: "Tuesday", startTime: "15:00", endTime: "15:30", type: "Break" },
    { title: "Study: History", day: "Tuesday", startTime: "15:30", endTime: "17:00", type: "Study", description: "Read Chapter 4" },
    
    { title: "Gym Session", day: "Wednesday", startTime: "08:00", endTime: "09:00", type: "Gym" },
    { title: "Physics", day: "Wednesday", startTime: "10:00", endTime: "11:00", type: "Class" },
    { title: "Lunch Break", day: "Wednesday", startTime: "12:00", endTime: "13:00", type: "Meal" },
    { title: "Project Meeting", day: "Wednesday", startTime: "14:00", endTime: "15:00", type: "Meeting", description: "Final year project" },
    { title: "Study: Math", day: "Wednesday", startTime: "15:00", endTime: "17:00", type: "Study", description: "Advanced calculus" },

    { title: "History", day: "Thursday", startTime: "09:00", endTime: "10:00", type: "Class" },
    { title: "Study: Chemistry", day: "Thursday", startTime: "10:30", endTime: "12:00", type: "Revision" },
    { title: "Lunch Break", day: "Thursday", startTime: "12:00", endTime: "13:00", type: "Meal" },
    { title: "Mathematics", day: "Thursday", startTime: "13:00", endTime: "14:00", type: "Class" },
    { title: "Personal Task", day: "Thursday", startTime: "15:00", endTime: "16:00", type: "Task", description: "Bank appointment" },
    
    { title: "Chemistry", day: "Friday", startTime: "11:00", endTime: "12:30", type: "Class" },
    { title: "Lunch Break", day: "Friday", startTime: "12:30", endTime: "13:30", type: "Meal" },
    { title: "Revision: All Subjects", day: "Friday", startTime: "14:00", endTime: "16:00", type: "Revision", description: "Weekly review" },
    { title: "Commute", day: "Friday", startTime: "16:30", endTime: "17:00", type: "Commute", description: "Travel back home" }
  ]
};

const eventColorMapping: { [key: string]: string } = {
  Class: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/50 dark:text-blue-200 dark:border-blue-700',
  Study: 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/50 dark:text-green-200 dark:border-green-700',
  Revision: 'bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-900/50 dark:text-indigo-200 dark:border-indigo-700',
  Break: 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-700/50 dark:text-gray-200 dark:border-gray-600',
  Meal: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/50 dark:text-amber-200 dark:border-amber-700',
  Personal: 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/50 dark:text-purple-200 dark:border-purple-700',
  Gym: 'bg-pink-100 text-pink-800 border-pink-300 dark:bg-pink-900/50 dark:text-pink-200 dark:border-pink-700',
  Sleep: 'bg-slate-200 text-slate-800 border-slate-300 dark:bg-slate-800/50 dark:text-slate-200 dark:border-slate-600',
  Task: 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/50 dark:text-yellow-200 dark:border-yellow-700',
  Lab: 'bg-cyan-100 text-cyan-800 border-cyan-300 dark:bg-cyan-900/50 dark:text-cyan-200 dark:border-cyan-700',
  Practical: 'bg-cyan-100 text-cyan-800 border-cyan-300 dark:bg-cyan-900/50 dark:text-cyan-200 dark:border-cyan-700',
  Meeting: 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-900/50 dark:text-rose-200 dark:border-rose-700',
  Commute: 'bg-stone-100 text-stone-800 border-stone-300 dark:bg-stone-700/50 dark:text-stone-200 dark:border-stone-600',
  Custom: 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-700/50 dark:text-gray-200 dark:border-gray-600',
};


const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function SchedulePage() {
  const router = useRouter();
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [scheduleData, setScheduleData] = useState<ScheduleData | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const data = sessionStorage.getItem('scheduleData');
    if (data) {
      try {
        const parsedData = JSON.parse(data);
        if (parsedData && Array.isArray(parsedData.schedule)) {
          setScheduleData(parsedData);
        } else {
          setScheduleData(exampleSchedule);
        }
      } catch (e) {
        console.error("Failed to parse schedule data", e);
        setScheduleData(exampleSchedule);
      }
    } else {
       setScheduleData(exampleSchedule);
    }
  }, []);
  
  const handleSave = async () => {
    if (!scheduleData || !user || !firestore) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'You need to be logged in to save a schedule. No schedule data is available to save.',
      });
      return;
    }
    
    if (scheduleData === exampleSchedule) {
      toast({
        title: 'This is a Sample',
        description: "Generate your own schedule from the 'Get Started' button on the homepage to save it to your calendar.",
      });
      return;
    }
    
    setIsSaving(true);
    
    const { schedule } = scheduleData;
    const firstDayOfWeek = startOfWeek(new Date(), { weekStartsOn: 1 }); // Monday

    const promises = schedule.map(event => {
      const dayIndex = daysOfWeek.indexOf(event.day);
      const eventDate = addDays(firstDayOfWeek, dayIndex);

      const payload = {
        userId: user.uid,
        title: event.title,
        type: event.type as any, // Cast because AI generation might be slightly different
        description: event.description || '',
        date: format(eventDate, 'yyyy-MM-dd'),
        startTime: event.startTime,
        endTime: event.endTime,
        priority: 'medium' as const,
        difficultyLevel: 'moderate' as const,
        notificationEnabled: false,
        reminderTime: '10min' as const,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const collectionRef = collection(firestore, 'calendarEvents');
      return addDoc(collectionRef, payload).catch(serverError => {
        const permissionError = new FirestorePermissionError({
            path: collectionRef.path,
            operation: 'create',
            requestResourceData: payload,
        });
        errorEmitter.emit('permission-error', permissionError);
        // We'll throw to make sure Promise.all rejects
        throw serverError;
      });
    });

    try {
      await Promise.all(promises);
      toast({
        title: 'Schedule Saved!',
        description: 'Your AI-generated timetable has been saved to your calendar.',
      });
      // Clean up session storage after successful save
      sessionStorage.removeItem('scheduleData');
      router.push('/calendar');
    } catch (error) {
      console.error("Failed to save schedule to Firestore", error);
      toast({
        variant: 'destructive',
        title: 'Save Failed',
        description: 'Could not save all events to your calendar. Please check your connection or permissions.',
      });
    } finally {
      setIsSaving(false);
    }
  };


  if (!scheduleData) {
    return (
        <div className="flex items-center justify-center h-screen">
            <p>Loading your schedule...</p>
        </div>
    )
  }

  const { schedule, summary } = scheduleData;
  
  // Find min and max hours to create a dynamic timeline
  const allTimes = schedule.flatMap(e => [e.startTime, e.endTime]);
  const minHour = Math.floor(Math.min(...allTimes.map(t => parseInt(t.split(':')[0], 10))));
  const maxHour = Math.ceil(Math.max(...allTimes.map(t => parseInt(t.split(':')[0], 10))));
  const startHour = Math.max(0, Math.min(6, minHour - 1)); // start at least at 6am or earlier
  const endHour = Math.min(23, Math.max(20, maxHour + 1)); // end at least at 8pm or later
  const hourRange = Array.from({ length: endHour - startHour + 1 }, (_, i) => i + startHour);

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="flex items-center justify-between p-4 border-b sticky top-0 bg-background/95 z-20">
        <h1 className="text-md sm:text-xl font-bold font-headline">Your AI-Generated Timetable</h1>
        <div className="flex items-center gap-2">
           <Button variant="outline" size="sm" onClick={() => router.push('/calendar')}><Calendar className="mr-2 h-4 w-4"/> View Calendar</Button>
           <Button size="sm" onClick={handleSave} disabled={isSaving}>
            <Download className="mr-2 h-4 w-4" /> {isSaving ? 'Saving...' : 'Save to Calendar'}
            </Button>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-2 sm:p-4">
        {summary && (
             <Alert className="mb-4 bg-primary/5 border-primary/20">
                <Info className="h-4 w-4 text-primary" />
                <AlertTitle className="font-semibold text-primary">Optimization Summary</AlertTitle>
                <AlertDescription>
                    {summary}
                </AlertDescription>
            </Alert>
        )}

        <div className="grid grid-cols-[auto_repeat(7,1fr)] gap-x-1 sm:gap-x-2 min-w-[1200px] overflow-x-auto">
          {/* Time column */}
          <div className="grid" style={{ gridTemplateRows: `3rem repeat(${hourRange.length * 2}, 1.5rem)` }}>
            <div/>
             {hourRange.flatMap(hour => [
                <div key={`${hour}-00`} className="text-xs text-muted-foreground pr-2 text-right -translate-y-2">
                    {`${hour.toString().padStart(2, '0')}:00`}
                </div>,
                <div key={`${hour}-30`} />
            ])}
          </div>

          {/* Day columns */}
          {daysOfWeek.map((day) => (
            <div key={day} className="relative grid" style={{ gridTemplateRows: `3rem repeat(${hourRange.length * 2}, 1.5rem)` }}>
              <div className="text-center font-semibold sticky top-0 bg-background py-2 text-sm sm:text-base">{day}</div>
              
              {/* Grid lines */}
              {hourRange.flatMap((_, i) => [
                <div key={`${i}-line`} className="h-full border-b border-dashed"></div>,
                <div key={`${i}-half-line`} className="h-full border-b border-dotted"></div>
              ])}

              {/* Events */}
              {schedule?.filter(e => e.day === day).map((event, eventIndex) => {
                 const [startEventHour, startMinute] = event.startTime.split(':').map(Number);
                 const [endEventHour, endMinute] = event.endTime.split(':').map(Number);
                 
                 const startOffset = ((startEventHour - startHour) * 2) + (startMinute / 30);
                 const duration = ((endEventHour + endMinute/60) - (startEventHour + startMinute/60)) * 2;

                return (
                    <Card
                        key={eventIndex}
                        className={cn(
                            'absolute w-[95%] left-1/2 -translate-x-1/2 p-2 rounded-lg shadow-md cursor-pointer transition-all hover:shadow-lg text-xs z-10 overflow-hidden',
                             eventColorMapping[event.type as keyof typeof eventColorMapping] || eventColorMapping.Custom
                        )}
                        style={{
                            top: `calc(3rem + ${startOffset} * 1.5rem)`, 
                            height: `calc(${duration} * 1.5rem)`,
                            minHeight: '2rem'
                        }}
                        title={`${event.title} (${event.startTime} - ${event.endTime})`}
                    >
                        <p className="font-bold truncate">{event.title}</p>
                        <p className="truncate text-[10px]">{event.startTime} - {event.endTime}</p>
                        {event.description && <p className="truncate text-muted-foreground text-[10px]">{event.description}</p>}
                    </Card>
                )
              })}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
