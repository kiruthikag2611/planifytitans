
"use client";

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuestionnaire } from '@/context/QuestionnaireProvider';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Plus, Trash } from 'lucide-react';
import { Switch } from '../ui/switch';

const taskSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required."),
  estimatedMinutes: z.coerce.number().min(1, "Estimated time is required."),
  dueDate: z.string().min(1, "Due date is required."),
  priority: z.coerce.number().min(1).max(5),
  flexible: z.boolean(),
});

const FormSchema = z.object({
  tasks: z.array(taskSchema),
});

export function Step6_Tasks({ onNext }: { onNext: () => void }) {
  const { answers, updateAnswers } = useQuestionnaire();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      tasks: answers.tasks,
    },
  });
  
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "tasks",
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    updateAnswers(data);
    onNext();
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Tasks & Deadlines</h2>
            <Button type="button" size="sm" onClick={() => append({ id: `task_${Date.now()}`, title: '', estimatedMinutes: 60, dueDate: '', priority: 3, flexible: true })}>
                <Plus className="mr-2 h-4 w-4" /> Add Task
            </Button>
        </div>
        <FormDescription>Add assignments, exams, or other todos.</FormDescription>
        
        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {fields.map((field, index) => (
                <div key={field.id} className="p-4 border rounded-md relative">
                    <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => remove(index)}>
                        <Trash className="h-4 w-4" />
                    </Button>
                    <FormField
                        control={form.control}
                        name={`tasks.${index}.title`}
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Task Title</FormLabel>
                            <FormControl><Input placeholder="e.g. Physics homework" {...field} /></FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <FormField
                            control={form.control}
                            name={`tasks.${index}.estimatedMinutes`}
                            render={({ field }) => (
                                <FormItem><FormLabel>Est. Minutes</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name={`tasks.${index}.dueDate`}
                            render={({ field }) => (
                                <FormItem><FormLabel>Due Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                            )}
                        />
                    </div>
                     <FormField
                        control={form.control}
                        name={`tasks.${index}.priority`}
                        render={({ field }) => (
                            <FormItem className="mt-4">
                                <FormLabel>Priority (1-5): {field.value}</FormLabel>
                                <FormControl><Input type="range" min="1" max="5" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name={`tasks.${index}.flexible`}
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mt-4">
                                <div className="space-y-0.5">
                                    <FormLabel>Flexible?</FormLabel>
                                    <FormDescription>Can the AI schedule this task freely?</FormDescription>
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
            <p className="text-muted-foreground text-center py-8">No tasks added yet. Click 'Add Task' to start.</p>
        )}

        <div className="flex justify-between">
            <Button type="button" variant="ghost" onClick={onNext}>Skip</Button>
            <Button type="submit">Next</Button>
        </div>
      </form>
    </Form>
  );
}
