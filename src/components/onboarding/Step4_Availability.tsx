
"use client";

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuestionnaire } from '@/context/QuestionnaireProvider';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card } from '../ui/card';
import { Switch } from '../ui/switch';
import { cn } from '@/lib/utils';

const FormSchema = z.object({
    working_hours: z.record(z.object({
        start: z.string(),
        end: z.string(),
    }).nullable())
});

const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export function Step4_Availability({ onNext, onBack }: { onNext: () => void, onBack: () => void }) {
  const { answers, updateAnswers } = useQuestionnaire();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      working_hours: answers.working_hours,
    },
  });

  const handleQuickSet = (type: 'light' | 'normal' | 'heavy') => {
    const hours = form.getValues('working_hours');
    const newHours = { ...hours };
    let range = { start: '09:00', end: '17:00'}; // Normal
    if (type === 'light') range = { start: '10:00', end: '16:00' };
    if (type === 'heavy') range = { start: '08:00', end: '22:00'};
    
    for (const day of daysOfWeek) {
        if (day !== 'sunday') {
            newHours[day] = range;
        }
    }
    form.setValue('working_hours', newHours);
  }

  function onSubmit(data: z.infer<typeof FormSchema>) {
    updateAnswers(data);
    onNext();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-lg font-semibold">How many hours per day can you study?</h2>
        <div>
            <FormLabel>Quick Set</FormLabel>
            <div className="flex gap-2 mt-2">
                <Button type="button" variant="outline" onClick={() => handleQuickSet('light')}>Light</Button>
                <Button type="button" variant="outline" onClick={() => handleQuickSet('normal')}>Normal</Button>
                <Button type="button" variant="outline" onClick={() => handleQuickSet('heavy')}>Heavy</Button>
            </div>
            <FormDescription>Light: 2-4h/day, Normal: 4-6h/day, Heavy: 6-8h/day</FormDescription>
        </div>

        <div className="space-y-4">
            {daysOfWeek.map((day) => (
                <Card key={day} className="p-4">
                    <div className="flex justify-between items-center">
                        <label className="capitalize font-medium">{day}</label>
                        <Switch
                            checked={!!form.watch(`working_hours.${day}`)}
                            onCheckedChange={(checked) => {
                                const currentHours = form.getValues('working_hours');
                                form.setValue(`working_hours`, {
                                    ...currentHours,
                                    [day]: checked ? { start: '09:00', end: '17:00' } : null
                                });
                            }}
                        />
                    </div>
                     {form.watch(`working_hours.${day}`) && (
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <FormField
                                control={form.control}
                                name={`working_hours.${day}.start`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>From</FormLabel>
                                        <FormControl><Input type="time" {...field} /></FormControl>
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name={`working_hours.${day}.end`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>To</FormLabel>
                                        <FormControl><Input type="time" {...field} /></FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                     )}
                </Card>
            ))}
        </div>

        <div className="flex justify-between">
            <Button type="button" variant="ghost" onClick={onBack}>Previous Question</Button>
            <Button type="submit">Next</Button>
        </div>
      </form>
    </Form>
  );
}
