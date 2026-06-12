import type { ExamType, Subject } from './user.types';

export type { ExamType, Subject };

export interface Topic {
  id: string;
  subjectId: string;
  examType: ExamType;
  name: string;
  description?: string;
  order: number;
}

export interface Subtopic {
  id: string;
  topicId: string;
  name: string;
  description?: string;
  order: number;
}

export type QuestionType = 'MCQ' | 'SHORT_ANSWER';
export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface MCQQuestion {
  id: string;
  type: 'MCQ';
  subtopicId: string;
  text: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  difficulty: DifficultyLevel;
  examType: ExamType;
}

export interface ShortAnswerQuestion {
  id: string;
  type: 'SHORT_ANSWER';
  subtopicId: string;
  text: string;
  sampleAnswer: string;
  keywords: string[];
  difficulty: DifficultyLevel;
  examType: ExamType;
}

export type Question = MCQQuestion | ShortAnswerQuestion;

export interface Flashcard {
  id: string;
  subtopicId: string;
  front: string;
  back: string;
  tags: string[];
  examType: ExamType;
}
