'use client';

import { format } from 'date-fns';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarPlus, MapPin, Users, Check, Star } from 'lucide-react';
import Image from 'next/image';

export function ActivityCard({ activity }: { activity: any }) {
    const isToday = new Date(activity.startTime).toDateString() === new Date().toDateString();
    const now = new Date();
    const startTime = new Date(activity.startTime);
    const endTime = new Date(activity.endTime);
    const isOngoing = now >= startTime && now <= endTime;
    const isUpcoming = now < startTime;

    const formattedDate = format(startTime, 'eee, MMM d');
    const formattedTime = `${format(startTime, 'h:mm a')} - ${format(endTime, 'h:mm a')}`;
    
    return (
        <Card className="overflow-hidden transition-all hover:shadow-lg">
            <div className="flex flex-col sm:flex-row">
                 {activity.imageUrl && (
                    <div className="w-full h-32 sm:w-48 sm:h-auto relative">
                        <Image src={activity.imageUrl} alt={activity.title} fill className="object-cover" />
                    </div>
                )}
                <div className="flex-1">
                    <CardHeader>
                        <div className="flex justify-between items-start">
                             <CardTitle className="text-lg">{activity.title}</CardTitle>
                             <div className="flex gap-2">
                                {isOngoing ? (
                                    <Badge variant="destructive" className="animate-pulse">Ongoing</Badge>
                                ) : isToday ? (
                                    <Badge variant="secondary">Today</Badge>
                                ) : isUpcoming ? (
                                    <Badge variant="outline">Upcoming</Badge>
                                ) : null}
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground pt-1">{formattedDate} • {formattedTime}</p>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{activity.description}</p>
                        <div className="flex flex-wrap gap-2 text-xs">
                            <Badge variant="outline" className="flex items-center gap-1"><MapPin size={12}/>{activity.location}</Badge>
                            <Badge variant="outline" className="flex items-center gap-1"><Users size={12}/>{activity.organizer}</Badge>
                        </div>
                    </CardContent>
                    <CardFooter className="gap-2 justify-end">
                        <Button variant="outline" size="sm"><Star className="mr-2 h-4 w-4" /> Interested</Button>
                        <Button size="sm"><CalendarPlus className="mr-2 h-4 w-4" /> Add to Timetable</Button>
                    </CardFooter>
                </div>
            </div>
        </Card>
    );
}
