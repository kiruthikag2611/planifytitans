
"use client";

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuestionnaire } from '@/context/QuestionnaireProvider';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '../ui/switch';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';
import { Loader2 } from 'lucide-react';

const FormSchema = z.object({
  allow_auto_reschedule: z.boolean(),
  notifications_default: z.coerce.number(),
  // `avoid_times` would be more complex, skipping for this UI example
});

export function Step8_Constraints({ onFinish, isGenerating }: { onFinish: () => void; isGenerating: boolean }) {
  const { answers, updateAnswers } = useQuestionnaire();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      allow_auto_reschedule: answers.allow_auto_reschedule,
      notifications_default: answers.notifications_default,
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    updateAnswers(data);
    onFinish();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <h2 className="text-lg font-semibold">Constraints & Special Rules</h2>
        
        <FormField
            control={form.control}
            name="allow_auto_reschedule"
            render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                        <FormLabel>Allow Auto-Reschedule</FormLabel>
                        <FormDescription>Allow the AI to move tasks around if your schedule changes?</FormDescription>
                    </div>
                    <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                </FormItem>
            )}
        />
        
        <FormField
            control={form.control}
            name="notifications_default"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Default Notification Time</FormLabel>
                     <Select onValueChange={(val) => field.onChange(parseInt(val))} defaultValue={String(field.value)}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a reminder time" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="5">5 minutes before</SelectItem>
                            <SelectItem value="10">10 minutes before</SelectItem>
                            <SelectItem value="15">15 minutes before</SelectItem>
                            <SelectItem value="30">30 minutes before</SelectItem>
                            <SelectItem value="60">1 hour before</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormDescription>You can override this for individual events.</FormDescription>
                    <FormMessage />
                </FormItem>
            )}
        />

        <div className="flex justify-end pt-8">
            <Button type="submit" size="lg" disabled={isGenerating}>
                 {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generate my timetable
            </Button>
        </div>
      </form>
    </Form>
  );
}
