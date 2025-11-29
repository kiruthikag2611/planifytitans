
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Plus, Check, Clock, Edit, Users, MapPin, Building, Calendar as CalendarIcon, Bookmark } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { EventForm } from "@/components/calendar/EventForm";
import { useFirestore } from "@/firebase/provider";
import { collection, query } from "firebase/firestore";
import { useCollection } from "@/firebase/firestore/use-collection";
import type { Activity } from "@/lib/types";
import { ActivitySheet } from "@/components/calendar/ActivitySheet";
import Image from "next/image";
import { format, isToday, isFuture, isPast, formatDistanceToNow } from 'date-fns';
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Local extended Activity type to avoid TS errors while rebasing.
 * It includes both possible field names used across branches.
 */
type ActivityWithTimes = Activity & {
  startTime?: string | null;
  endTime?: string | null;
  startDatetime?: string | null;
  endDatetime?: string | null;
};

const tasks = [
  {
    subject: "Math",
    type: "Assignment",
    title: "Complete Chapter 5 exercises",
    dueDate: "2024-11-22T10:00:00",
    progress: 40,
    priority: "High"
  },
  {
    subject: "Physics",
    type: "Exam Prep",
    title: "Review electromagnetism concepts",
    dueDate: "2024-11-25T14:00:00",
    progress: 0,
    priority: "Medium"
  },
  {
    subject: "History",
    type: "Class Prep",
    title: "Read Chapter 12 for discussion",
    dueDate: "2024-11-21T09:00:00",
    progress: 100,
    priority: "Low"
  },
];

const sampleActivities: ActivityWithTimes[] = [
    {
        activityId: 'sample-1',
        title: 'Tech Fest 2024',
        description: 'The annual technology festival featuring coding competitions, robotics exhibitions, and talks from industry leaders. A must-attend for all tech enthusiasts!',
        location: 'Main Auditorium',
        startDatetime: '2024-12-05T09:00:00',
        endDatetime: '2024-12-06T17:00:00',
        organizer: 'Computer Science Dept.',
        imageUrl: 'https://picsum.photos/seed/techfest/400/300',
        tags: ['fest', 'tech', 'competition'],
        rsvps: [],
    },
    {
        activityId: 'sample-2',
        title: 'Workshop on Artificial Intelligence',
        description: 'A hands-on workshop covering the fundamentals of AI and Machine Learning. Laptops are required. Limited seats available.',
        location: 'Seminar Hall B',
        startDatetime: '2024-12-10T11:00:00',
        endDatetime: '2024-12-10T13:00:00',
        organizer: 'AI Club',
        imageUrl: 'https://picsum.photos/seed/aiworkshop/400/300',
        link: 'https://example.com/ai-workshop',
        tags: ['workshop', 'ai', 'learning'],
        rsvps: [],
    },
];

export default function TasksAndActivitiesPage() {
  const [activeTab, setActiveTab] = useState<'tasks' | 'activities'>('activities');
  const [isEventSheetOpen, setEventSheetOpen] = useState(false);
  const [isActivitySheetOpen, setActivitySheetOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<ActivityWithTimes | null>(null);

  const handleAddNew = () => {
    if (activeTab === 'tasks') {
        setActivitySheetOpen(false);
        setEventSheetOpen(true);
    } else {
        setSelectedActivity(null);
        setEventSheetOpen(false);
        setActivitySheetOpen(true);
    }
  };
  
  const handleTabChange = (value: string) => {
    setActiveTab(value as 'tasks' | 'activities');
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
       <Tabs defaultValue={activeTab} onValueChange={handleTabChange} className="w-full">
        <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Tasks & Activities</h2>
            <div className="flex items-center space-x-2">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="tasks">Tasks</TabsTrigger>
                    <TabsTrigger value="activities">Activities</TabsTrigger>
                </TabsList>
                 <Button onClick={handleAddNew}>
                    <Plus className="mr-2 h-4 w-4" /> Add New
                </Button>
            </div>
        </div>

        <TabsContent value="tasks">
          <TasksView />
        </TabsContent>

        <TabsContent value="activities">
          <ActivitiesView onAddActivity={handleAddNew} />
        </TabsContent>
      </Tabs>

      <Sheet open={isEventSheetOpen || isActivitySheetOpen} onOpenChange={(open) => {
          if (!open) {
              setEventSheetOpen(false);
              setActivitySheetOpen(false);
          }
      }}>
        <SheetTrigger asChild>
          <Button className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg" onClick={handleAddNew}>
            <Plus className="h-8 w-8" />
          </Button>
        </SheetTrigger>
        <SheetContent className="sm:max-w-lg">
            {isEventSheetOpen && (
                <>
                    <SheetHeader>
                        <SheetTitle>Add New Task</SheetTitle>
                    </SheetHeader>
                    <EventForm onSave={() => setEventSheetOpen(false)} />
                </>
            )}
            {isActivitySheetOpen && (
                 <ActivitySheet activity={selectedActivity} onSave={() => setActivitySheetOpen(false)} />
            )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

/* -------------------------
   Tasks UI
   ------------------------- */

function TasksView() {
  return (
    <Tabs defaultValue="all" className="mt-4">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="pending">Pending</TabsTrigger>
        <TabsTrigger value="overdue">Overdue</TabsTrigger>
        <TabsTrigger value="completed">Completed</TabsTrigger>
      </TabsList>
      <TabsContent value="all">
        <TaskList tasks={tasks} />
      </TabsContent>
      <TabsContent value="pending">
        <TaskList tasks={tasks.filter(t => t.progress < 100 && new Date(t.dueDate) > new Date())} />
      </TabsContent>
      <TabsContent value="overdue">
        <TaskList tasks={tasks.filter(t => t.progress < 100 && new Date(t.dueDate) < new Date())} />
      </TabsContent>
      <TabsContent value="completed">
        <TaskList tasks={tasks.filter(t => t.progress === 100)} />
      </TabsContent>
    </Tabs>
  );
}

function TaskList({ tasks }: { tasks: any[] }) {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">No tasks here yet.</p>
        <Button className="mt-4" size="sm">Add Task</Button>
      </div>
    );
  }
  return (
    <div className="space-y-4 mt-4">
      {tasks.map((task, index) => (
        <TaskCard key={index} task={task} />
      ))}
    </div>
  );
}

function TaskCard({ task }: { task: any }) {
  const [dueDate, setDueDate] = useState<string | null>(null);

  useEffect(() => {
    setDueDate(
      `Due ${new Date(task.dueDate).toLocaleDateString()} • ${new Date(
        task.dueDate
      ).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    );
  }, [task.dueDate]);

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div>
            <Badge>{task.subject} - {task.type}</Badge>
            <CardTitle className="mt-2 text-lg">{task.title}</CardTitle>
          </div>
          <Badge variant={task.priority === "High" ? "destructive" : "secondary"}>{task.priority}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center text-sm text-muted-foreground h-5">
          <Clock className="mr-2 h-4 w-4" />
          {dueDate ? (
            <span>{dueDate}</span>
          ) : (
            <div className="h-4 w-48 rounded-md bg-muted animate-pulse" />
          )}
        </div>
        {task.progress > 0 && <Progress value={task.progress} />}
        <div className="flex items-center justify-end space-x-2 pt-2 border-t mt-2 -mb-2">
          <Button variant="ghost" size="sm"><Check className="mr-1 h-4 w-4" /> Mark Done</Button>
          <Button variant="ghost" size="sm"><Edit className="mr-1 h-4 w-4" /> Edit</Button>
        </div>
      </CardContent>
    </Card>
  );
}

/* -------------------------
   Activities UI (Firestore-backed)
   ------------------------- */

function ActivitiesView({ onAddActivity }: { onAddActivity: () => void }) {
  const firestore = useFirestore();
  const [selectedActivity, setSelectedActivity] = useState<ActivityWithTimes | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const activitiesQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'activities'));
  }, [firestore]);

  const { data: fetchedActivities, loading } = useCollection<ActivityWithTimes>(activitiesQuery);

  const activities = useMemo(() => {
    if (loading) return [];
    if (fetchedActivities && fetchedActivities.length > 0) {
        return fetchedActivities;
    }
    return sampleActivities;
  }, [fetchedActivities, loading]);


  const handleActivityClick = (activity: ActivityWithTimes) => {
    setSelectedActivity(activity);
    setIsSheetOpen(true);
  };
  
  const handleOpenSheet = (activity: ActivityWithTimes | null = null) => {
    setSelectedActivity(activity);
    setIsSheetOpen(true);
  };

  const upcomingActivities = useMemo(
    () => activities?.filter(a => isFuture(new Date(a.startTime || a.startDatetime || ''))) || [],
    [activities]
  );
  const pastActivities = useMemo(
    () => activities?.filter(a => isPast(new Date(a.startTime || a.startDatetime || ''))) || [],
    [activities]
  );

  if (loading) {
    return (
      <div className="space-y-4 mt-4">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-4">
      {(upcomingActivities.length > 0 || pastActivities.length > 0) ? (
        <>
            {upcomingActivities.length > 0 && (
                <div>
                <h3 className="text-lg font-semibold mb-2">Upcoming Activities</h3>
                <div className="space-y-4">
                    {upcomingActivities.map(activity => (
                    <ActivityCard key={activity.activityId} activity={activity} onClick={handleActivityClick} />
                    ))}
                </div>
                </div>
            )}
            {pastActivities.length > 0 && (
                 <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-2">Past Activities</h3>
                    <div className="space-y-4">
                        {pastActivities.map(activity => (
                        <ActivityCard key={activity.activityId} activity={activity} onClick={handleActivityClick} />
                        ))}
                    </div>
                </div>
            )}
        </>
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground">No activities found.</p>
          <Button className="mt-4" size="sm" onClick={() => handleOpenSheet()}>Add Activity</Button>
        </div>
      )}

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-lg">
          <ActivitySheet activity={selectedActivity} onSave={() => setIsSheetOpen(false)} />
        </SheetContent>
      </Sheet>
    </div>
  );
}

/* Rich ActivityCard used in ActivitiesView */
function ActivityCard({ activity, onClick }: { activity: ActivityWithTimes, onClick: (activity: ActivityWithTimes) => void }) {
  const start = activity.startTime ?? activity.startDatetime;
  const end = activity.endTime ?? activity.endDatetime;
  const isOngoing = new Date() >= new Date(start || 0) && new Date() <= new Date(end || 0);
  const badgeText = isOngoing ? 'Ongoing' : isToday(new Date(start || 0)) ? 'Today' : `in ${formatDistanceToNow(new Date(start || 0))}`;

  return (
    <Card className="hover:bg-accent/50 transition-all cursor-pointer" onClick={() => onClick(activity)}>
      <CardContent className="p-4 flex gap-4">
        {activity.imageUrl && (
          <Image src={activity.imageUrl} alt={activity.title} width={80} height={80} className="rounded-md object-cover hidden sm:block" data-ai-hint="college event" />
        )}
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg mb-1">{activity.title}</CardTitle>
            <Badge variant={isOngoing ? 'destructive' : 'secondary'}>{badgeText}</Badge>
          </div>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            {start ? `${format(new Date(start), 'EEE, MMM d, p')} - ${end ? format(new Date(end), 'p') : ''}` : 'Date TBD'}
          </p>
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{activity.description}</p>
          <div className="flex flex-wrap gap-2 mt-3 text-xs">
            <Badge variant="outline"><MapPin className="h-3 w-3 mr-1" /> {activity.location}</Badge>
            <Badge variant="outline"><Building className="h-3 w-3 mr-1" /> {activity.organizer}</Badge>
          </div>
        </div>
      </CardContent>
      <div className="px-4 pb-3 flex justify-end gap-2 border-t pt-3">
        <Button variant="outline" size="sm"><Bookmark className="h-4 w-4 mr-1" /> Interested</Button>
        <Button variant="default" size="sm"><Plus className="h-4 w-4 mr-1" /> Add to Timetable</Button>
      </div>
    </Card>
  );
}
