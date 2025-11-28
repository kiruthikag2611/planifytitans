
'use client';

import { Download, Loader2, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
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

const exampleSchedule: ScheduleEvent[] = [
  { day: 'Monday', startTime: '09:00', endTime: '10:30', title: 'Calculus 101', type: 'Class', description: 'Room 201' },
  { day: 'Monday', startTime: '11:00', endTime: '12:00', title: 'Physics Lab', type: 'Class', description: 'Lab A' },
  { day: 'Monday', startTime: '12:00', endTime: '13:00', title: 'Lunch Break', type: 'Personal', description: 'Cafeteria' },
  { day: 'Monday', startTime: '14:00', endTime: '15:30', title: 'Study: Physics', type: 'Study Time', description: 'Prepare for quiz' },
  { day: 'Tuesday', startTime: '10:00', endTime: '11:30', title: 'Intro to CS', type: 'Class', description: 'Room 305' },
  { day: 'Tuesday', startTime: '12:00', endTime: '13:00', title: 'Lunch Break', type: 'Personal', description: 'Cafeteria' },
  { day: 'Tuesday', startTime: '13:00', endTime: '14:00', title: 'Group Project Meeting', type: 'Task', description: 'Discuss milestone 2' },
  { day: 'Wednesday', startTime: '09:00', endTime: '10:30', title: 'Calculus 101', type: 'Class', description: 'Room 201' },
  { day: 'Wednesday', startTime: '12:00', endTime: '13:00', title: 'Lunch Break', type: 'Personal', description: 'Cafeteria' },
  { day: 'Wednesday', startTime: '16:00', endTime: '17:00', title: 'Workout', type: 'Personal', description: 'Gym' },
  { day: 'Thursday', startTime: '10:00', endTime: '11:30', title: 'Intro to CS', type: 'Class', description: 'Room 305' },
  { day: 'Thursday', startTime: '12:00', endTime: '13:00', title: 'Lunch Break', type: 'Personal', description: 'Cafeteria' },
  { day: 'Thursday', startTime: '15:00', endTime: '16:30', title: 'Assignment: Calculus', type: 'Assignment', description: 'Problem Set 3 due' },
  { day: 'Friday', startTime: '09:00', endTime: '10:30', title: 'Calculus 101', type: 'Class', description: 'Room 201' },
  { day: 'Friday', startTime: '12:00', endTime: '13:00', title: 'Lunch Break', type: 'Personal', description: 'Cafeteria' },
  { day: 'Friday', startTime: '13:00', endTime: '15:00', title: 'Exam: Physics Midterm', type: 'Exam', description: 'Main Hall' },
  { day: 'Saturday', startTime: '10:00', endTime: '12:00', title: 'Review Week\'s Notes', type: 'Study Time', description: 'All subjects' },
];

export default function SchedulePage() {
  const router = useRouter();
  const [schedule, setSchedule] = useState<ScheduleEvent[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
        const storedSchedule = sessionStorage.getItem('scheduleData');
        if (storedSchedule) {
            setSchedule(JSON.parse(storedSchedule));
        } else {
            setSchedule(exampleSchedule);
        }
    } catch(e) {
        console.error("Failed to parse schedule data", e);
        setSchedule(exampleSchedule); // Fallback to example
    } finally {
        setLoading(false);
    }
  }, []);

  return (
    <div className="flex flex-col h-screen bg-background">
      <main className="flex-1 overflow-auto p-2 sm:p-4">
        {loading ? (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-4 text-muted-foreground">Loading your timetable...</p>
            </div>
        ) : !schedule || schedule.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
                <h2 className="text-2xl font-bold">No Schedule Found</h2>
                <p className="text-muted-foreground mt-2">There was a problem loading your timetable.</p>
                <Button onClick={() => router.push('/onboarding/1')} className="mt-6">Generate New Timetable</Button>
            </div>
        ) : (
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
            {daysOfWeek.map((day) => (
                <div key={day} className="relative grid grid-rows-[3rem_repeat(28,2rem)]">
                <div className="text-center font-semibold sticky top-0 bg-background py-2 text-sm sm:text-base z-10">{day}</div>
                
                {/* Grid lines */}
                {Array.from({ length: 14 * 2 + 1 }).map((_, i) => (
                    <div key={i} className="h-full border-b border-dashed"></div>
                ))}

                {/* Events */}
                {schedule?.filter(e => e.day === day).map((event, eventIndex) => {
                    const [startHour, startMinute] = event.startTime.split(':').map(Number);
                    const [endHour, endMinute] = event.endTime.split(':').map(Number);
                    
                    const top = (startHour - 7 + startMinute / 60) * 4; 
                    const height = ((endHour + endMinute / 60) - (startHour + startMinute / 60)) * 4;

                    return (
                        <Card
                            key={eventIndex}
                            className={cn(
                                'absolute w-[95%] left-1/2 -translate-x-1/2 p-2 rounded-lg shadow-md cursor-pointer transition-all hover:shadow-lg text-xs',
                                eventColorMapping[event.type] || eventColorMapping.Custom
                            )}
                            style={{
                                top: `calc(3rem + ${top}rem)`,
                                height: `${height}rem`,
                                minHeight: '2rem'
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
        )}
      </main>
    </div>
  );
}
