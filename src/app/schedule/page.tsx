
'use client';

import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useQuestionnaire } from '@/context/QuestionnaireProvider';
import { useRouter } from 'next/navigation';

type ScheduleEvent = {
  title: string;
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
  startTime: string; // "HH:MM"
  endTime: string; // "HH:MM"
  type: "Class" | "Assignment" | "Exam" | "Task" | "Study Time" | "Personal" | "Custom";
  description?: string;
};

const eventColorMapping: { [key: string]: string } = {
  Class: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/50 dark:text-blue-200 dark:border-blue-700',
  'Study Time': 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/50 dark:text-green-200 dark:border-green-700',
  Assignment: 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/50 dark:text-orange-200 dark:border-orange-700',
  Exam: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/50 dark:text-red-200 dark:border-red-700',
  Task: 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/50 dark:text-yellow-200 dark:border-yellow-700',
  Personal: 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/50 dark:text-purple-200 dark:border-purple-700',
  Custom: 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-700/50 dark:text-gray-200 dark:border-gray-600',
};

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const hours = Array.from({ length: 14 }, (_, i) => `${(i + 7).toString().padStart(2, '0')}:00`); // 7 AM to 8 PM

export default function SchedulePage() {
  const router = useRouter();
  const { category, subCategory, answers } = useQuestionnaire();
  const [schedule, setSchedule] = useState<ScheduleEvent[] | null>(null);

  useEffect(() => {
    const data = sessionStorage.getItem('scheduleData');
    if (data) {
      try {
        const parsedData = JSON.parse(data);
        if (parsedData && Array.isArray(parsedData.schedule)) {
          setSchedule(parsedData.schedule);
        }
      } catch (e) {
        console.error("Failed to parse schedule data", e);
      }
    }
  }, []);
  
  const lastQuestionIndex = Object.keys(answers).length - 1;
  const backLink = `/q/${category}/${subCategory}/${lastQuestionIndex >= 0 ? lastQuestionIndex : 0}`;


  const getEventStyle = (event: ScheduleEvent) => {
    const [startHour, startMinute] = event.startTime.split(':').map(Number);
    const [endHour, endMinute] = event.endTime.split(':').map(Number);
    
    // Adjust for grid starting at 7 AM
    const top = (startHour - 7 + startMinute / 60);
    const height = ((endHour + endMinute / 60) - (startHour + startMinute / 60));

    return {
        gridRowStart: Math.max(1, Math.floor(top * 2) + 1), // Assuming 30-min increments in grid
        gridRowEnd: Math.max(2, Math.ceil((top + height) * 2) + 1),
    };
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="flex items-center justify-between p-4 border-b sticky top-0 bg-background/95 z-20">
        <h1 className="text-md sm:text-xl font-bold font-headline">Your AI-Generated Timetable</h1>
        <div className="flex items-center gap-2">
           <Button variant="outline" size="sm" onClick={() => router.push('/dashboard')}>Dashboard</Button>
           <Button size="sm"><Download className="mr-2 h-4 w-4" /> Save</Button>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-2 sm:p-4">
        <div className="grid grid-cols-[auto_repeat(7,1fr)] gap-x-1 sm:gap-x-2 min-w-[800px]">
          {/* Time column */}
          <div className="grid grid-rows-[3rem_repeat(28,2rem)] text-right">
            <div/>
            {Array.from({ length: 14 * 2 }).map((_, i) => (
                <div key={i} className="text-xs text-muted-foreground pr-2 -translate-y-2">
                    {i % 2 === 0 ? `${(Math.floor(i / 2) + 7).toString().padStart(2, '0')}:00` : ''}
                </div>
            ))}
          </div>

          {/* Day columns */}
          {daysOfWeek.map((day, dayIndex) => (
            <div key={day} className="relative grid grid-rows-[3rem_repeat(28,2rem)]">
              <div className="text-center font-semibold sticky top-0 bg-background py-2 text-sm sm:text-base">{day}</div>
              
              {/* Grid lines */}
              {Array.from({ length: 14 * 2 + 1 }).map((_, i) => (
                <div key={i} className="h-full border-b border-dashed"></div>
              ))}

              {/* Events */}
              {schedule?.filter(e => e.day === day).map((event, eventIndex) => {
                 const [startHour, startMinute] = event.startTime.split(':').map(Number);
                 const [endHour, endMinute] = event.endTime.split(':').map(Number);
                 
                 const start = (startHour - 7) * 48 + startMinute * 0.8;
                 const duration = ((endHour + endMinute/60) - (startHour + startMinute/60)) * 48;

                return (
                    <Card
                        key={eventIndex}
                        className={cn(
                            'absolute w-[95%] left-1/2 -translate-x-1/2 p-2 rounded-lg shadow-md cursor-pointer transition-all hover:shadow-lg text-xs',
                             eventColorMapping[event.type] || eventColorMapping.Custom
                        )}
                        style={{
                            top: `${start + 48}px`, // 48px offset for header
                            height: `${duration}px`,
                        }}
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
