
'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import type { Activity } from '@/lib/types';
import Image from 'next/image';
import { Calendar, Clock, MapPin, Building, Users, Link as LinkIcon, Share2, Bell, Plus, Bookmark } from 'lucide-react';
import { useUser } from '@/firebase/auth/use-user';
import { useFirestore } from '@/firebase/provider';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

interface ActivitySheetProps {
  activity: Activity | null;
  onSave: () => void;
}

export function ActivitySheet({ activity, onSave }: ActivitySheetProps) {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isRsvpd, setIsRsvpd] = React.useState(false);

  React.useEffect(() => {
    if (activity && user) {
      setIsRsvpd(activity.rsvps?.includes(user.uid));
    }
  }, [activity, user]);

  const handleRsvp = async () => {
    if (!activity || !user || !firestore) return;

    const activityRef = doc(firestore, 'activities', activity.activityId);
    const newRsvpState = !isRsvpd;

    const payload = {
        rsvps: newRsvpState ? arrayUnion(user.uid) : arrayRemove(user.uid)
    };

    try {
        await updateDoc(activityRef, payload);
        setIsRsvpd(newRsvpState);
        toast({
            title: newRsvpState ? 'RSVP Confirmed!' : 'RSVP Removed',
            description: `You are ${newRsvpState ? 'now' : 'no longer'} attending "${activity.title}".`
        });
    } catch (serverError) {
        const permissionError = new FirestorePermissionError({
            path: activityRef.path,
            operation: 'update',
            requestResourceData: payload,
        });
        errorEmitter.emit('permission-error', permissionError);
         toast({
            variant: 'destructive',
            title: 'Failed to update RSVP',
            description: 'Please check your connection and try again.'
        });
    }
  };

  if (!activity) {
    return (
      <div>
        <SheetHeader>
          <SheetTitle>No Activity Selected</SheetTitle>
        </SheetHeader>
        <div className="p-4 text-muted-foreground">Please select an activity to see the details.</div>
      </div>
    );
  }

  const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activity.location)}`;

  return (
    <div className="flex flex-col h-full">
        <SheetHeader className="p-4">
            {activity.imageUrl && (
                 <div className="relative h-40 w-full mb-4">
                    <Image src={activity.imageUrl} alt={activity.title} layout="fill" className="rounded-md object-cover" />
                 </div>
            )}
            <SheetTitle className="text-2xl">{activity.title}</SheetTitle>
            <div className="flex flex-wrap gap-2 pt-2">
                {activity.tags?.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
            </div>
        </SheetHeader>

        <div className="overflow-y-auto flex-1 p-4 space-y-4">
            <div className="space-y-3">
                <InfoItem icon={Calendar} label="Date" content={format(new Date(activity.startDatetime), 'EEEE, MMMM d, yyyy')} />
                <InfoItem icon={Clock} label="Time" content={`${format(new Date(activity.startDatetime), 'p')} - ${format(new Date(activity.endDatetime), 'p')}`} />
                <InfoItem icon={MapPin} label="Location" content={<a href={mapLink} target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">{activity.location}</a>} />
                <InfoItem icon={Building} label="Organizer" content={activity.organizer} />
                <InfoItem icon={Users} label="Attendees" content={`${activity.rsvps?.length || 0} going`} />
                {activity.link && <InfoItem icon={LinkIcon} label="More Info" content={<a href={activity.link} target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80 line-clamp-1">{activity.link}</a>} />}
            </div>
            
            <Separator />
            
            <div>
                <h3 className="font-semibold mb-2">About this event</h3>
                <SheetDescription>{activity.description}</SheetDescription>
            </div>

             <Separator />

             <div>
                <h3 className="font-semibold mb-2">Actions</h3>
                 <div className="grid grid-cols-2 gap-2">
                     <Button variant="outline" onClick={handleRsvp}>
                        <Bookmark className={`mr-2 h-4 w-4 ${isRsvpd ? 'fill-current' : ''}`} />
                        {isRsvpd ? 'I\'m Going' : 'Interested'}
                    </Button>
                    <Button><Plus className="mr-2 h-4 w-4" /> Add to Timetable</Button>
                    <Button variant="outline"><Bell className="mr-2 h-4 w-4" /> Add Reminder</Button>
                    <Button variant="outline"><Share2 className="mr-2 h-4 w-4" /> Share</Button>
                 </div>
            </div>
        </div>
    </div>
  );
}

function InfoItem({ icon: Icon, label, content }: { icon: React.ElementType, label: string, content: React.ReactNode }) {
    return (
        <div className="flex items-start gap-3">
            <Icon className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="flex flex-col">
                <span className="text-sm font-medium text-muted-foreground">{label}</span>
                <span className="text-base">{content}</span>
            </div>
        </div>
    );
}
    