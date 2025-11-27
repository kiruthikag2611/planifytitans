// src/ai/flows/personalized-schedule-generation.ts
'use server';

/**
 * Placeholder schedule generation flow (safe during rebase)
 *
 * - Keeps all Zod schemas and TS types so the rest of your app compiles.
 * - Uses a small deterministic generator so TS/TSX parsing errors from prompt templates are avoided.
 * - TODO: After rebase, replace the placeholder logic below with the real AI prompt invocation.
 */

import { z } from 'genkit';

/* ---------- Schemas (kept as before) ---------- */

const StudentInputSchema = z.object({
  role: z.literal('Student'),
  classInfo: z.string().describe("The student's class, year, or semester."),
  subjects: z.string().describe('A comma-separated list of subjects the student is taking.'),
  hoursPerSubject: z.string().describe('The number of hours the student wants to dedicate to each subject per week.'),
  studyTime: z.string().describe("The student's preferred study time (e.g., morning, afternoon, evening, night)."),
  availability: z.string().describe("The student's available days and time slots for studying."),
  breakPreferences: z.string().describe("The student's preferred break duration and frequency (e.g., 15 mins every hour)."),
  prioritySubjects: z.string().describe('A list of subjects prioritized as high, medium, or low.'),
  deadlines: z.string().describe('Information about upcoming exams or assignment deadlines.'),
  routines: z.string().describe("Information about the student's additional routines like sleep schedule, meal times, commute, gym, etc."),
});

const TeacherInputSchema = z.object({
  role: z.literal('Teacher'),
  subjects: z.string().describe('A comma-separated list of subjects the teacher teaches.'),
  weeklyClasses: z.string().describe('The number of weekly classes for each subject.'),
  classNames: z.string().describe('The names of the classes or sections the teacher handles (e.g., 10A, 10B).'),
  availability: z.string().describe("The teacher's available days and time slots for teaching."),
  teachingHours: z.string().describe("The teacher's preferred teaching hours."),
  restrictedHours: z.string().describe('Time slots that are restricted due to meetings, duties, or breaks.'),
  maxClassesPerDay: z.string().describe("The maximum number of classes the teacher can handle in a single day."),
  minGap: z.string().describe('The minimum gap required between consecutive classes.'),
  specialSessions: z.string().describe('Information about any special sessions like labs, practicals, or extra classes.'),
});

const PersonalSchema = z.object({
  category: z.literal('Personal'),
  careerPath: z.string().describe("The user's desired career path."),
  workHours: z.string().describe('The number of extra hours the user works.'),
  preferredTime: z.string().describe("The user's preferred time for activities."),
  scheduleDetails: z.string().optional().describe('Additional details about tasks and preferences in JSON format.'),
});

const AcademicsStudentSchema = z.object({
  category: z.literal('Academics'),
  subCategory: z.literal('Student'),
  collegeName: z.string().describe('The name of the college.'),
  rollNumber: z.string().describe("The student's roll number."),
  emailId: z.string().describe("The student's email ID."),
  department: z.string().describe("The student's department."),
  hardSubject: z.string().describe('The subject the student finds difficult.'),
  scheduleDetails: z.string().optional().describe('A JSON string containing all the detailed schedule info like classes, tasks, and preferences.'),
});

const AcademicsProfessorSchema = z.object({
  category: z.literal('Academics'),
  subCategory: z.literal('Professor'),
  collegeName: z.string().describe('The name of the college.'),
  subjectHandled: z.string().describe('The subject the professor handles.'),
  emailId: z.string().describe("The professor's email ID."),
  availableDays: z.string().describe('The days of the week the professor is available.'),
  preferredTimeSlots: z.string().describe('The preferred time slots for the professor (Morning/Afternoon).'),
  hoursPerWeek: z.string().describe('The number of hours per week the professor needs.'),
  specialLabHours: z.string().describe('Whether the professor needs special lab hours.'),
  otherDepartmentClasses: z.string().describe('Whether the professor handles other department classes.'),
  regularDuties: z.string().describe('Any regular duties the professor has (NSS, NCC, Exam Cell, Counseling Hour).'),
});

const AcademicsManagementSchema = z.object({
  category: z.literal('Academics'),
  subCategory: z.literal('Management'),
  collegeName: z.string().describe('The name of the college.'),
  university: z.string().describe('The university under which the college falls.'),
  coursesOffered: z.string().describe('The courses offered by the college.'),
  numberOfDepartments: z.string().describe('The number of departments in the college.'),
  workingDays: z.string().describe('The number of working days in the semester.'),
  sectionsPerDepartment: z.string().describe('The number of sections per department.'),
  staffAllocation: z.string().describe('The staff allocation per department.'),
  collegeTiming: z.string().describe('The college timing.'),
  hoursPerDay: z.string().describe('The number of hours per day.'),
  periodDuration: z.string().describe('The duration of each period.'),
  breakLunchTime: z.string().describe('The break and lunch time.'),
  numberOfClassrooms: z.string().describe('The number of classrooms.'),
  studentsPerClassroom: z.string().describe('The number of students per classroom.'),
});

const PersonalizedScheduleGenerationInputSchema = z.union([
  StudentInputSchema,
  TeacherInputSchema,
  PersonalSchema,
  AcademicsStudentSchema,
  AcademicsProfessorSchema,
  AcademicsManagementSchema,
]);

export type PersonalizedScheduleGenerationInput = z.infer<typeof PersonalizedScheduleGenerationInputSchema>;

const ScheduleEventSchema = z.object({
  title: z.string(),
  day: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
  type: z.enum(['Class', 'Study', 'Revision', 'Break', 'Meal', 'Commute', 'Gym', 'Sleep', 'Task', 'Lab', 'Practical', 'Meeting', 'Personal']),
  description: z.string().optional().describe('A brief description of the event.'),
});

const PersonalizedScheduleGenerationOutputSchema = z.object({
  schedule: z.array(ScheduleEventSchema).describe('An array of events for the generated personalized schedule.'),
  summary: z.string().describe('A short explanation of why the generated timetable is optimized for the user.'),
});

export type PersonalizedScheduleGenerationOutput = z.infer<typeof PersonalizedScheduleGenerationOutputSchema>;

/* ---------- Minimal deterministic generator (placeholder) ---------- */

/**
 * simple helper to create an event
 */
function makeEvent(title: string, day: string, start: string, end: string, type: string, description?: string) {
  return { title, day, startTime: start, endTime: end, type, description };
}

/**
 * Very small deterministic generator that uses some fields from input to
 * create a valid schedule output. This is intentionally simple and safe —
 * replace it later with your AI invocation.
 */
export async function generatePersonalizedSchedule(
  input: PersonalizedScheduleGenerationInput
): Promise<PersonalizedScheduleGenerationOutput> {
  // Pick a few sensible defaults
  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // base title / note derived from input
  const baseTitle = (() => {
    if ((input as any).role === 'Student') return 'Study Session';
    if ((input as any).role === 'Teacher') return 'Class / Teaching';
    if ((input as any).category === 'Personal') return 'Work / Personal';
    if ((input as any).category === 'Academics') return 'Academic Activity';
    return 'Planned Activity';
  })();

  // create a small set of events across the week (deterministic)
  const schedule = [
    makeEvent(`${baseTitle}: Focus 1`, weekDays[0], '09:00', '10:30', 'Study', 'Focused session'),
    makeEvent(`${baseTitle}: Class`, weekDays[0], '11:00', '12:00', 'Class', 'Scheduled class'),
    makeEvent('Lunch', weekDays[0], '12:00', '12:45', 'Meal', 'Lunch break'),
    makeEvent(`${baseTitle}: Practice`, weekDays[1], '17:00', '18:30', 'Study', 'Practice problems / assignments'),
    makeEvent('Gym / Exercise', weekDays[2], '07:00', '08:00', 'Gym', 'Morning exercise'),
    makeEvent('Revision', weekDays[3], '19:00', '20:30', 'Revision', 'Revision for upcoming exams'),
    makeEvent('Light Study', weekDays[4], '16:00', '17:00', 'Study', 'Light review and planning'),
    makeEvent('Personal Time', weekDays[5], '14:00', '16:00', 'Personal', 'Relaxation / leisure time'),
    makeEvent('Weekly Summary / Plan', weekDays[6], '18:00', '19:00', 'Task', 'Reflect & plan next week'),
  ];

  // ensure we meet schema types
  const validatedSchedule = schedule.map(evt => ({
    title: evt.title,
    day: evt.day as any,
    startTime: evt.startTime,
    endTime: evt.endTime,
    type: (['Class','Study','Revision','Break','Meal','Commute','Gym','Sleep','Task','Lab','Practical','Meeting','Personal'] as string[]).includes(evt.type) ? (evt.type as any) : 'Task',
    description: evt.description,
  }));

  const summary = `Generated a simple week of ${validatedSchedule.length} events based on the provided profile. Replace this placeholder with a full AI-generated schedule later.`;

  return {
    schedule: validatedSchedule,
    summary,
  };
}

/* TODO: Re-insert your AI prompt flow here after the rebase is complete.
   The safest approach once the repo is clean:
   - restore the ai.definePrompt(...) + ai.defineFlow(...) code
   - or call your genkit prompt runner in one central place
   If you want, after you finish the rebase I will help restore the AI flow exactly (or convert to the runtime API your genkit uses).
*/

