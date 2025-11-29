/**
 * questions.ts
 * Cleaned file (merge markers removed). Exports types and some helper lists used by onboarding.
 */

export type Question = {
  id: string;
  question: string;
  type?: 'text' | 'number' | 'select' | 'multiselect' | 'time' | 'date';
  options?: string[];
  required?: boolean;
  description?: string;
};

export const questions: Question[] = [
  {
    id: 'q-1',
    question: 'What is your timezone?',
    type: 'select',
    options: ['Asia/Kolkata', 'UTC', 'America/New_York'],
    required: true,
    description: 'Used to generate local schedule times'
  },
  {
    id: 'q-2',
    question: 'When does your academic term start?',
    type: 'date',
    required: false
  },
  {
    id: 'q-3',
    question: 'When does your academic term end?',
    type: 'date',
    required: false
  },
  {
    id: 'q-4',
    question: 'What are your working / study hours on weekdays?',
    type: 'text',
    description: 'Example: 08:00-17:00'
  },
  {
    id: 'q-5',
    question: 'Which subjects do you want to prioritize?',
    type: 'multiselect',
    options: ['Math', 'Physics', 'Chemistry', 'CS', 'Biology']
  }
];

/**
 * Timezone list (small subset) — expand as needed.
 * Kept compact here for speed; you can replace with a full list later.
 */
export const timezones = [
  'Etc/GMT+12',
  'Pacific/Midway',
  'Pacific/Honolulu',
  'America/Anchorage',
  'America/Los_Angeles',
  'America/Chicago',
  'America/New_York',
  'Europe/London',
  'Europe/Berlin',
  'Asia/Kolkata',
  'Asia/Shanghai',
  'Asia/Tokyo',
  'Australia/Sydney',
];

/**
 * Preferred study times and block sizes used in onboarding UI
 */
export const preferredTimes = ['Early Morning', 'Morning', 'Afternoon', 'Evening', 'Night'];
export const studyBlockSizes = [25, 50, 90];

export default {
  questions,
  timezones,
  preferredTimes,
  studyBlockSizes,
};
