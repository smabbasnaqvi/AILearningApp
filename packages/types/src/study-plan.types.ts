import type { Subject } from './user.types';

export interface DailyGoal {
  date: Date;
  targetMinutes: number;
  targetQuestions: number;
  completedMinutes: number;
  completedQuestions: number;
  completed: boolean;
}

export interface StudySession {
  id: string;
  studyPlanId: string;
  date: Date;
  subjectId: string;
  topicIds: string[];
  durationMinutes: number;
  type: 'lesson' | 'practice' | 'review' | 'mock';
  completed: boolean;
}

export interface StudyPlan {
  id: string;
  userId: string;
  examDate?: Date;
  subjects: Subject[];
  weeklyMinutes: number;
  dailyGoals: DailyGoal[];
  sessions: StudySession[];
  createdAt: Date;
  updatedAt: Date;
}
