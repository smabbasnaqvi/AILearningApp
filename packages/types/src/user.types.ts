export type ExamType = 'SAT' | 'ACT' | 'A_LEVELS' | 'IB';

export type Subject =
  | 'Math'
  | 'Reading'
  | 'Writing'
  | 'Science'
  | 'English'
  | 'History'
  | 'Physics'
  | 'Chemistry'
  | 'Biology'
  | 'Economics'
  | 'Psychology'
  | 'Computer Science';

export interface User {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  userId: string;
  displayName: string;
  avatarUrl?: string;
  examType: ExamType;
  examDate?: Date;
  subjects: Subject[];
  xp: number;
  subscriptionTier: 'free' | 'pro' | 'premium';
}

export interface OnboardingState {
  step: 'welcome' | 'exam-type' | 'subject-selection' | 'exam-date' | 'diagnostic-quiz' | 'diagnostic-results' | 'account-creation' | 'complete';
  selectedExamType?: ExamType;
  selectedSubjects?: Subject[];
  examDate?: Date;
  diagnosticComplete?: boolean;
}
