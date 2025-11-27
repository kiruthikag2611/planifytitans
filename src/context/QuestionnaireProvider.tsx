
"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { addWeeks, format } from 'date-fns';

<<<<<<< HEAD
type Category = 'academics' | null;
type SubCategory = 'student' | 'teacher' | null;
type Answers = { [key: string]: string };
=======
type Category = 'academics' | 'personal' | null;
type SubCategory = 'student' | 'professor' | 'management' | null;

export type Class = {
  id: string;
  title: string;
  days: number[];
  startTime: string;
  endTime: string;
  location?: string;
  priority: number;
  fixed: boolean;
};

export type Task = {
  id: string;
  title: string;
  estimatedMinutes: number;
  dueDate: string;
  priority: number;
  flexible: boolean;
  preferredWindows?: any[];
};

type WorkingHours = {
  [key: string]: { start: string; end: string } | null;
};

type OnboardingAnswers = {
  timezone: string;
  term_start?: string;
  term_end?: string;
  classes: Class[];
  working_hours: WorkingHours;
  preferred_study_times: string[];
  study_block_sizes: number[];
  max_continuous_study_minutes: number;
  min_break_minutes: number;
  tasks: Task[];
  activities: any[]; // To be defined
  avoid_times: any[]; // To be defined
  max_daily_study_minutes?: number;
  allow_auto_reschedule: boolean;
  notifications_default: number;
  preference_weight: 'conservative' | 'aggressive';
};
>>>>>>> ffc861d (Feature: Onboarding → AI Timetable Generation)

interface QuestionnaireContextType {
  category: Category;
  setCategory: (category: Category) => void;
  subCategory: SubCategory;
  setSubCategory: (subCategory: SubCategory) => void;
  answers: Partial<OnboardingAnswers>;
  updateAnswers: (newAnswers: Partial<OnboardingAnswers>) => void;
  reset: () => void;
  getFormattedAnswers: () => any;
}

const defaultWorkingHours: WorkingHours = {
  monday: { start: '08:00', end: '22:00' },
  tuesday: { start: '08:00', end: '22:00' },
  wednesday: { start: '08:00', end: '22:00' },
  thursday: { start: '08:00', end: '22:00' },
  friday: { start: '08:00', end: '22:00' },
  saturday: { start: '09:00', end: '18:00' },
  sunday: null,
};

const initialState: Partial<OnboardingAnswers> = {
  timezone: 'Asia/Kolkata',
  classes: [],
  working_hours: defaultWorkingHours,
  preferred_study_times: ['Evening'],
  study_block_sizes: [25, 50, 90],
  max_continuous_study_minutes: 90,
  min_break_minutes: 10,
  tasks: [],
  activities: [],
  avoid_times: [],
  allow_auto_reschedule: true,
  notifications_default: 10,
  preference_weight: 'conservative',
};


const QuestionnaireContext = createContext<QuestionnaireContextType | undefined>(undefined);

export const QuestionnaireProvider = ({ children }: { children: ReactNode }) => {
  const [category, setCategory] = useState<Category>(null);
  const [subCategory, setSubCategory] = useState<SubCategory>(null);
  const [answers, setAnswers] = useState<Partial<OnboardingAnswers>>(initialState);

  const updateAnswers = (newAnswers: Partial<OnboardingAnswers>) => {
    setAnswers(prev => ({ ...prev, ...newAnswers }));
  };

  const reset = useCallback(() => {
    setCategory(null);
    setSubCategory(null);
    setAnswers(initialState);
  }, []);

  const getFormattedAnswers = () => {
<<<<<<< HEAD
    if (!subCategory) return null;

    const allAnswers = { ...answers };
    const role = subCategory.charAt(0).toUpperCase() + subCategory.slice(1);
    
    return {
        role,
        ...allAnswers,
    };
=======
    // This will be built out later to match the PRD
    const today = new Date();
    const term_start = answers.term_start || format(today, 'yyyy-MM-dd');
    const term_end = answers.term_end || format(addWeeks(new Date(term_start), 12), 'yyyy-MM-dd');

    const payload = {
      userId: 'user_123', // Placeholder
      timezone: answers.timezone,
      term_start,
      term_end,
      working_hours: answers.working_hours,
      classes: answers.classes,
      tasks: answers.tasks,
      activities: answers.activities,
      preferences: {
        max_continuous_study_minutes: answers.max_continuous_study_minutes,
        min_break_minutes: answers.min_break_minutes,
        study_block_sizes: answers.study_block_sizes,
        preferred_study_times: answers.preferred_study_times,
        avoid_times: answers.avoid_times,
        auto_reschedule: answers.allow_auto_reschedule,
        respect_sleep: true,
      },
      constraints: {
        no_overlaps_with_classes: true,
        respect_activity_rsvp: true,
        max_daily_study_minutes: answers.max_daily_study_minutes,
      },
    };
    return payload;
>>>>>>> ffc861d (Feature: Onboarding → AI Timetable Generation)
  };

  return (
    <QuestionnaireContext.Provider value={{
      category,
      setCategory,
      subCategory,
      setSubCategory,
      answers,
      updateAnswers,
      reset,
      getFormattedAnswers
    }}>
      {children}
    </QuestionnaireContext.Provider>
  );
};

export const useQuestionnaire = () => {
  const context = useContext(QuestionnaireContext);
  if (context === undefined) {
    throw new Error('useQuestionnaire must be used within a QuestionnaireProvider');
  }
  return context;
};
