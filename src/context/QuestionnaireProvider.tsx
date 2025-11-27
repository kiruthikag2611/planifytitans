"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { addWeeks, format } from "date-fns";

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
  activities: any[]; // To be defined more strictly later
  avoid_times: any[]; // To be defined more strictly later
  max_daily_study_minutes?: number;
  allow_auto_reschedule: boolean;
  notifications_default: number;
  preference_weight: "conservative" | "aggressive";
};

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
    // If no subCategory and not personal, we can't produce a detailed payload
    if (!subCategory && category !== "personal") return null;

    const today = new Date();
    const term_start = (answers.term_start as string) || format(today, "yyyy-MM-dd");
    const term_end =
      (answers.term_end as string) || format(addWeeks(new Date(term_start), 12), "yyyy-MM-dd");

    // Simple default mapping; can be expanded to more detailed payloads
    if (category === "personal") {
      return {
        category: "Personal",
        // Use available answers where possible
        timezone: answers.timezone ?? "Asia/Kolkata",
        workHours: answers.working_hours ?? defaultWorkingHours,
        preferredTime: answers.preferred_study_times ?? ["Evening"],
        // keep other fields to allow downstream processing
        ...answers,
      };
    }

    // Academics branch
    let payload: any = {
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

    // Add subcategory-specific placeholders or extracted values
    switch (subCategory) {
      case "student":
        payload = {
          ...payload,
          subCategory: "Student",
          // Example placeholders — replace with actual answers mapping
          collegeName: (answers as any).collegeName ?? undefined,
          department: (answers as any).department ?? undefined,
          scheduleDetails: {
            classes: answers.classes,
            tasks: answers.tasks,
          },
        };
        break;

      case "professor":
        payload = {
          ...payload,
          subCategory: "Professor",
          // professor-specific fields (placeholders)
          officeHours: (answers as any).officeHours ?? undefined,
        };
        break;

      case "management":
        payload = {
          ...payload,
          subCategory: "Management",
          // management-specific fields (placeholders)
          responsibilities: (answers as any).responsibilities ?? undefined,
        };
        break;

      default:
        break;
    }

    return payload;
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
