import type { ExamType, Subject } from '@ailearningapp/types';

export interface ExamConfig {
  type: ExamType;
  label: string;
  description: string;
  subjects: Subject[];
  color: string;
}

export const EXAM_CONFIGS: ExamConfig[] = [
  {
    type: 'SAT',
    label: 'SAT',
    description: 'Scholastic Assessment Test',
    subjects: ['Math', 'Reading', 'Writing'],
    color: '#6C63FF',
  },
  {
    type: 'ACT',
    label: 'ACT',
    description: 'American College Testing',
    subjects: ['Math', 'Reading', 'Writing', 'Science', 'English'],
    color: '#FF6584',
  },
  {
    type: 'A_LEVELS',
    label: 'A-Levels',
    description: 'Advanced Level Qualifications',
    subjects: [
      'Math',
      'Physics',
      'Chemistry',
      'Biology',
      'History',
      'Economics',
      'Psychology',
      'Computer Science',
      'English',
    ],
    color: '#4CAF50',
  },
  {
    type: 'IB',
    label: 'IB',
    description: 'International Baccalaureate',
    subjects: [
      'Math',
      'Physics',
      'Chemistry',
      'Biology',
      'History',
      'Economics',
      'Psychology',
      'Computer Science',
      'English',
    ],
    color: '#FF9800',
  },
];

export function getExamConfig(examType: ExamType): ExamConfig | undefined {
  return EXAM_CONFIGS.find((c) => c.type === examType);
}

export function getSubjectsForExam(examType: ExamType): Subject[] {
  return getExamConfig(examType)?.subjects ?? [];
}
