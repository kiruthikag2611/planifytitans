
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuestionnaire } from '@/context/QuestionnaireProvider';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const FormSchema = z.object({
  term_start: z.string().optional(),
  term_end: z.string().optional(),
});

export function Step2_TermDates({ onNext }: { onNext: () => void }) {
  const { answers, updateAnswers } = useQuestionnaire();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      term_start: answers.term_start,
      term_end: answers.term_end,
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    updateAnswers(data);
    onNext();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-lg font-semibold">Term dates (optional)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="term_start"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Term start date</FormLabel>
                <FormControl>
                    <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="term_end"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Term end date</FormLabel>
                <FormControl>
                    <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <FormDescription>If empty, we'll assume the next 12 weeks.</FormDescription>
        <div className="flex justify-between">
            <Button type="button" variant="ghost" onClick={onNext}>Skip</Button>
            <Button type="submit">Next</Button>
        </div>
      </form>
    </Form>
  );
}
