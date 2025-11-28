
"use client";

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuestionnaire } from '@/context/QuestionnaireProvider';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '../ui/checkbox';
import { Slider } from '../ui/slider';
import { preferredTimes, studyBlockSizes } from '@/lib/questions';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

const FormSchema = z.object({
    preferred_study_times: z.array(z.string()).optional(),
    study_block_sizes: z.array(z.number()).optional(),
    max_continuous_study_minutes: z.number().min(10),
    min_break_minutes: z.number().min(5),
    preference_weight: z.enum(['conservative', 'aggressive']),
});

export function Step5_StudyPreferences({ onNext, onBack }: { onNext: () => void, onBack: () => void }) {
  const { answers, updateAnswers } = useQuestionnaire();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      preferred_study_times: answers.preferred_study_times || [],
      study_block_sizes: answers.study_block_sizes || [],
      max_continuous_study_minutes: answers.max_continuous_study_minutes || 90,
      min_break_minutes: answers.min_break_minutes || 10,
      preference_weight: answers.preference_weight || 'conservative',
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    updateAnswers(data);
    onNext();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <h2 className="text-lg font-semibold">Study Preferences</h2>

        <FormField
          control={form.control}
          name="preferred_study_times"
          render={() => (
            <FormItem>
              <FormLabel>Preferred study times</FormLabel>
              <div className="flex gap-4 flex-wrap">
                {preferredTimes.map((item) => (
                  <FormField
                    key={item}
                    control={form.control}
                    name="preferred_study_times"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(item)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...(field.value || []), item])
                                : field.onChange(field.value?.filter((value) => value !== item));
                            }}
                          />
                        </FormControl>
                        <div className="flex flex-col">
                            <FormLabel className="font-normal">{item}</FormLabel>
                            {item === 'Early Morning' && <p className="text-xs text-muted-foreground -mt-1">The early bird gets the worm!</p>}
                        </div>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <FormDescription>Select when you feel most productive.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
         <FormField
          control={form.control}
          name="study_block_sizes"
          render={() => (
            <FormItem>
              <FormLabel>Preferred block sizes (in minutes)</FormLabel>
               <div className="flex gap-4 flex-wrap">
                {studyBlockSizes.map((item) => (
                  <FormField
                    key={item}
                    control={form.control}
                    name="study_block_sizes"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(item)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...(field.value || []), item])
                                : field.onChange(field.value?.filter((value) => value !== item));
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">{item} min</FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <FormDescription>How long do you like your study sessions to be?</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
                control={form.control}
                name="max_continuous_study_minutes"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Max continuous study: {field.value} mins</FormLabel>
                        <FormControl>
                            <Slider
                                defaultValue={[field.value || 90]}
                                onValueChange={(value) => field.onChange(value[0])}
                                max={180}
                                step={10}
                            />
                        </FormControl>
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="min_break_minutes"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Min break: {field.value} mins</FormLabel>
                        <FormControl>
                            <Slider
                                defaultValue={[field.value || 10]}
                                onValueChange={(value) => field.onChange(value[0])}
                                max={30}
                                step={5}
                            />
                        </FormControl>
                    </FormItem>
                )}
            />
        </div>

         <FormField
            control={form.control}
            name="preference_weight"
            render={({ field }) => (
                <FormItem className="space-y-3">
                    <FormLabel>Preference Weight</FormLabel>
                    <FormControl>
                        <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                        >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl><RadioGroupItem value="conservative" /></FormControl>
                            <FormLabel className="font-normal">Conservative (respect current habits)</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl><RadioGroupItem value="aggressive" /></FormControl>
                            <FormLabel className="font-normal">Aggressive (prioritize meeting due dates)</FormLabel>
                        </FormItem>
                        </RadioGroup>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />

        <div className="flex justify-between">
            <Button type="button" variant="ghost" onClick={onBack}>Previous Question</Button>
            <Button type="submit">Next</Button>
        </div>
      </form>
    </Form>
  );
}
