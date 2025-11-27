
"use client";

import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuestionnaire, type Class } from '@/context/QuestionnaireProvider';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Plus, Trash } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Switch } from '../ui/switch';

const classSchema = z.object({
    id: z.string(),
    title: z.string().min(1, "Title is required."),
    days: z.array(z.number()).min(1, "At least one day is required."),
    startTime: z.string().min(1, "Start time is required."),
    endTime: z.string().min(1, "End time is required."),
    location: z.string().optional(),
    priority: z.number().min(1).max(5),
    fixed: z.boolean(),
});

const FormSchema = z.object({
  classes: z.array(classSchema),
});

const daysOfWeek = [
    { id: 0, label: 'Sun' }, { id: 1, label: 'Mon' }, { id: 2, label: 'Tue' },
    { id: 3, label: 'Wed' }, { id: 4, label: 'Thu' }, { id: 5, label: 'Fri' },
    { id: 6, label: 'Sat' }
];

export function Step3_Classes({ onNext }: { onNext: () => void }) {
  const { answers, updateAnswers } = useQuestionnaire();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      classes: answers.classes,
    },
  });
  
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "classes",
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    updateAnswers(data);
    onNext();
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">What are your regular classes?</h2>
            <Button type="button" size="sm" onClick={() => append({ id: `class_${Date.now()}`, title: '', days: [], startTime: '', endTime: '', priority: 5, fixed: true })}>
                <Plus className="mr-2 h-4 w-4" /> Add Class
            </Button>
        </div>
        <FormDescription>Tap '+' to add multiple classes quickly.</FormDescription>
        
        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {fields.map((field, index) => (
                <div key={field.id} className="p-4 border rounded-md relative">
                    <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => remove(index)}>
                        <Trash className="h-4 w-4" />
                    </Button>
                    <FormField
                        control={form.control}
                        name={`classes.${index}.title`}
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Class Title</FormLabel>
                            <FormControl><Input placeholder="e.g. Calculus 101" {...field} /></FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <FormField
                            control={form.control}
                            name={`classes.${index}.startTime`}
                            render={({ field }) => (
                                <FormItem><FormLabel>Start Time</FormLabel><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name={`classes.${index}.endTime`}
                            render={({ field }) => (
                                <FormItem><FormLabel>End Time</FormLabel><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name={`classes.${index}.days`}
                        render={({ field }) => (
                            <FormItem className="mt-4">
                                <FormLabel>Days of Week</FormLabel>
                                <div className="flex gap-2 flex-wrap">
                                {daysOfWeek.map((day) => (
                                    <FormField
                                        key={day.id}
                                        control={form.control}
                                        name={`classes.${index}.days`}
                                        render={({ field }) => {
                                            return (
                                            <FormItem key={day.id} className="flex flex-row items-start space-x-2 space-y-0">
                                                <FormControl>
                                                <Checkbox
                                                    checked={field.value?.includes(day.id)}
                                                    onCheckedChange={(checked) => {
                                                    return checked
                                                        ? field.onChange([...(field.value || []), day.id])
                                                        : field.onChange(
                                                            field.value?.filter(
                                                            (value) => value !== day.id
                                                            )
                                                        )
                                                    }}
                                                />
                                                </FormControl>
                                                <FormLabel className="font-normal">{day.label}</FormLabel>
                                            </FormItem>
                                            )
                                        }}
                                    />
                                ))}
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name={`classes.${index}.fixed`}
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mt-4">
                                <div className="space-y-0.5">
                                    <FormLabel>Fixed Event</FormLabel>
                                    <FormDescription>Is this class at a fixed time?</FormDescription>
                                </div>
                                <FormControl>
                                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                            </FormItem>
                        )}
                        />
                </div>
            ))}
        </div>
        
        {fields.length === 0 && (
            <p className="text-muted-foreground text-center py-8">No classes added yet. Click 'Add Class' to start.</p>
        )}

        <div className="flex justify-end">
            <Button type="submit">Next</Button>
        </div>
      </form>
    </Form>
  );
}
