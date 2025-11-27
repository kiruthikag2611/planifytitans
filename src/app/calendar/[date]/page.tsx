
'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { format, parse, startOfDay, addHours, isSameDay } from 'date-fns';
import { useUser } from '@/firebase/auth/use-user';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query, where } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, Clock, Plus, Bot, Check, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CalendarEvent } from '@/lib/types';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { EventForm } from '@/components/calendar/EventForm';

const eventColorMapping: { [key: string]: string } = {
  Class: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/50 dark:text-blue-200 dark:border-blue-700',
  Assignment: 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/50 dark:text-orange-200 dark:border-orange-700',
  Exam: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/50 dark:text-red-200 dark:border-red-700',
  Task: 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/50 dark:text-green-200 dark:border-green-700',
  'Study Time': 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/50 dark:text-green-200 dark:border-green-700',
  Personal: 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/50 dark:text-purple-200 dark:border-purple-700',
  Custom: 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-700/50 dark:text-gray-200 dark:border-gray-600',
};

export default function DailyTimetablePage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const firestore = useFirestore();

  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const [selectedEvent, setSelectedEvent] = React.useState<CalendarEvent | null>(null);

  const dateParam = Array.isArray(params.date) ? params.date[0] : params.date;
  const selectedDate = parse(dateParam, 'yyyy-MM-dd', new Date());

  const eventsQuery = React.useMemo(() => {
    if (!user || !firestore) return null;
    return query(
      collection(firestore, 'calendarEvents'),
      where('userId', '==', user.uid),
      where('date', '==', format(selectedDate, 'yyyy-MM-dd'))
    );
  }, [user, firestore, selectedDate]);

  const { data: events, loading } = useCollection<CalendarEvent>(eventsQuery);

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getEventForHour = (hour: number) => {
    return events?.find(e => {
        const startHour = parseInt(e.startTime.split(':')[0], 10);
        return startHour === hour;
    });
  }

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsSheetOpen(true);
  };
  
  const handleAddEvent = () => {
    setSelectedEvent(null);
    setIsSheetOpen(true);
  }

  const getEventStyle = (event: CalendarEvent) => {
    const [startHour, startMinute] = event.startTime.split(':').map(Number);
    const [endHour, endMinute] = event.endTime.split(':').map(Number);
    
    const top = (startHour + startMinute / 60) * 60; // 60px per hour
    const height = ((endHour + endMinute / 60) - (startHour + startMinute / 60)) * 60;

    return {
        top: `${top}px`,
        height: `${height}px`,
    };
  };

  return (
    <div className="flex flex-col h-screen">
       <header className="p-4 border-b flex items-center justify-between sticky top-0 bg-background/95 z-10">
         <Button variant="ghost" size="icon" onClick={() => router.back()}>
           <ArrowLeft className="h-5 w-5" />
         </Button>
         <h2 className="text-lg sm:text-xl font-bold text-center">
           {format(selectedDate, 'EEEE, MMMM d')}
         </h2>
         <div className="w-8"></div>
       </header>

      <ScrollArea className="flex-1">
        <div className="relative p-2 sm:p-4">
          {hours.map(hour => (
            <div key={hour} className="relative h-[60px] border-t border-dashed">
              <span className="absolute -top-3 left-0 text-xs text-muted-foreground">
                {format(addHours(startOfDay(selectedDate), hour), 'ha')}
              </span>
            </div>
          ))}
          
          {events?.map(event => (
             <Card 
                key={event.eventId} 
                className={cn('absolute w-[calc(100%-3.5rem)] sm:w-[calc(100%-4rem)] left-10 sm:left-12 p-2 rounded-lg shadow-md cursor-pointer transition-all hover:shadow-lg', eventColorMapping[event.type] || eventColorMapping.Custom)}
                style={getEventStyle(event)}
                onClick={() => handleEventClick(event)}
             >
                <p className="font-bold text-xs sm:text-sm truncate">{event.title}</p>
                <p className="text-[10px] sm:text-xs truncate">{event.startTime} - {event.endTime}</p>
                {event.description && <p className="text-[10px] sm:text-xs truncate text-muted-foreground">{event.description}</p>}
             </Card>
          ))}
          
           {/* Example auto-scheduled block */}
          <Card 
            className={cn('absolute w-[calc(100%-3.5rem)] sm:w-[calc(100%-4rem)] left-10 sm:left-12 p-2 rounded-lg shadow-md cursor-pointer transition-all hover:shadow-lg', eventColorMapping['Study Time'])}
            style={{top: `${14*60}px`, height: '50px'}}
          >
             <div className="flex justify-between items-center">
                 <p className="font-bold text-xs sm:text-sm truncate">Study Physics</p>
                 <span className="text-[10px] sm:text-xs font-semibold inline-flex items-center gap-1"><Bot size={12}/> Suggested</span>
             </div>
             <p className="text-[10px] sm:text-xs truncate">2:00 PM - 2:50 PM</p>
          </Card>
        </div>
      </ScrollArea>
      
      <footer className="p-2 border-t flex justify-around items-center sticky bottom-0 bg-background/95 z-10">
        <Button variant="outline" size="sm" className="text-xs px-2"><Sparkles className="mr-1 h-3 w-3"/>Auto-Fill</Button>
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button size="sm" onClick={handleAddEvent} className="text-xs px-2"><Plus className="mr-1 h-3 w-3" /> Add Task</Button>
          </SheetTrigger>
          <SheetContent className="w-full max-w-full sm:max-w-lg">
            <SheetHeader>
              <SheetTitle>{selectedEvent ? 'Edit Event' : 'Add New Event'}</SheetTitle>
            </SheetHeader>
            <EventForm event={selectedEvent} onSave={() => setIsSheetOpen(false)} selectedDate={selectedDate}/>
          </SheetContent>
        </Sheet>
        <Button variant="secondary" size="sm" className="text-xs px-2"><Check className="mr-1 h-3 w-3"/>Confirm</Button>
      </footer>
    </div>
  );
}
