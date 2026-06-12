export interface QuestionAttempt {
  questionId: string;
  correct: boolean;
  attemptedAt: Date;
  timeTakenMs: number;
}

export interface Session {
  id: string;
  userId: string;
  subtopicId?: string;
  topicId?: string;
  startedAt: Date;
  endedAt?: Date;
  durationMs: number;
  questionsAttempted: QuestionAttempt[];
  xpEarned: number;
}

export interface MasteryScore {
  userId: string;
  subjectId: string;
  topicId?: string;
  subtopicId?: string;
  score: number; // 0-100
  calculatedAt: Date;
}

export interface Streak {
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: Date;
  freezesAvailable: number;
  freezesUsed: number;
}

export type XPEventType = 'session_complete' | 'streak_bonus' | 'mastery_unlock' | 'diagnostic_bonus' | 'daily_goal';

export interface XPEvent {
  id: string;
  userId: string;
  type: XPEventType;
  amount: number;
  description: string;
  occurredAt: Date;
}

export interface WeaknessReport {
  userId: string;
  subjectId: string;
  weakTopicIds: string[];
  generatedAt: Date;
}
