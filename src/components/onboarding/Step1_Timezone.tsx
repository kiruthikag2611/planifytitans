
"use client";

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuestionnaire } from '@/context/QuestionnaireProvider';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { timezones } from '@/lib/questions';

const FormSchema = z.object({
  timezone: z.string().min(1, 'Please select a timezone.'),
});

export function Step1_Timezone({ onNext }: { onNext: () => void }) {
  const { answers, updateAnswers } = useQuestionnaire();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      timezone: answers.timezone,
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    updateAnswers(data);
    onNext();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="timezone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-semibold">What’s your time zone?</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your timezone" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="max-h-60">
                  {timezones.map((tz) => (
                    <SelectItem key={tz} value={tz}>
                      {tz.replace(/_/g, ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Used to store and schedule timestamps correctly.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-between">
            <Button type="button" variant="ghost" onClick={onNext}>Skip & use defaults</Button>
            <Button type="submit">Next</Button>
        </div>
      </form>
    </Form>
  );
}
