"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { addWeeks, format } from "date-fns";

/**
 * QuestionnaireProvider - cleaned final version
 *
 * - No merge markers
 * - No duplicate declarations
 * - Types and provider shape are consolidated
 */

/* ------------------------
   Local types
   ------------------------ */

type Category = "academics" | "personal" | null;
type SubCategory = "student" | "professor" | "management" | null;

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
  activities: any[];
  avoid_times: any[];
  max_daily_study_minutes?: number;
  allow_auto_reschedule: boolean;
  notifications_default: number;
  preference_weight: "conservative" | "aggressive";
};

/* ------------------------
   Context shape
   ------------------------ */

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

/* ------------------------
   Defaults
   ------------------------ */

const defaultWorkingHours: WorkingHours = {
  monday: { start: "08:00", end: "22:00" },
  tuesday: { start: "08:00", end: "22:00" },
  wednesday: { start: "08:00", end: "22:00" },
  thursday: { start: "08:00", end: "22:00" },
  friday: { start: "08:00", end: "22:00" },
  saturday: { start: "09:00", end: "18:00" },
  sunday: null,
};

const initialState: Partial<OnboardingAnswers> = {
  timezone: "Asia/Kolkata",
  classes: [],
  working_hours: defaultWorkingHours,
  preferred_study_times: ["Evening"],
  study_block_sizes: [25, 50, 90],
  max_continuous_study_minutes: 90,
  min_break_minutes: 10,
  tasks: [],
  activities: [],
  avoid_times: [],
  allow_auto_reschedule: true,
  notifications_default: 10,
  preference_weight: "conservative",
};

/* ------------------------
   Context & Provider
   ------------------------ */

const QuestionnaireContext = createContext<QuestionnaireContextType | undefined>(undefined);

export const QuestionnaireProvider = ({ children }: { children: ReactNode }) => {
  const [category, setCategory] = useState<Category>(null);
  const [subCategory, setSubCategory] = useState<SubCategory>(null);
  const [answers, setAnswers] = useState<Partial<OnboardingAnswers>>(initialState);

  const updateAnswers = (newAnswers: Partial<OnboardingAnswers>) => {
    setAnswers((prev) => ({ ...prev, ...newAnswers }));
  };

  const reset = useCallback(() => {
    setCategory(null);
    setSubCategory(null);
    setAnswers(initialState);
  }, []);

  const getFormattedAnswers = () => {
    // If not enough context, return minimal payload for safety
    if (!subCategory && category !== "personal") return null;

    const today = new Date();
    const term_start = (answers.term_start as string) ?? format(today, "yyyy-MM-dd");
    const term_end =
      (answers.term_end as string) ?? format(addWeeks(new Date(term_start), 12), "yyyy-MM-dd");

    if (category === "personal") {
      return {
        category: "Personal",
        timezone: answers.timezone ?? "Asia/Kolkata",
        working_hours: answers.working_hours ?? defaultWorkingHours,
        preferred_study_times: answers.preferred_study_times ?? [],
        ...answers,
      };
    }

    // Academics base payload
    const basePayload: any = {
      category: "Academics",
      term_start,
      term_end,
      timezone: answers.timezone ?? "Asia/Kolkata",
      classes: answers.classes ?? [],
      tasks: answers.tasks ?? [],
      preferences: {
        studyTimes: answers.preferred_study_times ?? [],
        blockSizes: answers.study_block_sizes ?? [],
        maxContinuous: answers.max_continuous_study_minutes ?? 90,
        minBreak: answers.min_break_minutes ?? 10,
        allowAutoReschedule: answers.allow_auto_reschedule ?? true,
      },
    };

    // Add subcategory-specific details
    switch (subCategory) {
      case "student":
        return {
          ...basePayload,
          subCategory: "Student",
          collegeName: (answers as any).collegeName ?? undefined,
          department: (answers as any).department ?? undefined,
          scheduleDetails: {
            classes: answers.classes,
            tasks: answers.tasks,
            preferences: {
              studyTimes: answers.preferred_study_times,
              blockSizes: answers.study_block_sizes,
            },
          },
        };

      case "professor":
        return {
          ...basePayload,
          subCategory: "Professor",
          officeHours: (answers as any).officeHours ?? undefined,
        };

      case "management":
        return {
          ...basePayload,
          subCategory: "Management",
          responsibilities: (answers as any).responsibilities ?? undefined,
        };

      default:
        return basePayload;
    }
  };

  return (
    <QuestionnaireContext.Provider
      value={{
        category,
        setCategory,
        subCategory,
        setSubCategory,
        answers,
        updateAnswers,
        reset,
        getFormattedAnswers,
      }}
    >
      {children}
    </QuestionnaireContext.Provider>
  );
};

export const useQuestionnaire = () => {
  const context = useContext(QuestionnaireContext);
  if (context === undefined) {
    throw new Error("useQuestionnaire must be used within a QuestionnaireProvider");
  }
  return context;
};
