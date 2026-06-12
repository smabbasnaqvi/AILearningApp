import { create } from 'zustand';
import type { ExamType, Subject, StudyPlan, Streak } from '@ailearningapp/types';

interface StudyState {
  currentExamType: ExamType | null;
  subjects: Subject[];
  examDate: Date | null;
  studyPlan: StudyPlan | null;
  streak: Streak | null;
  xp: number;
  setExamType: (examType: ExamType) => void;
  setSubjects: (subjects: Subject[]) => void;
  setExamDate: (date: Date) => void;
  setStudyPlan: (plan: StudyPlan) => void;
  setStreak: (streak: Streak) => void;
  addXP: (amount: number) => void;
  resetStudyData: () => void;
}

export const useStudyStore = create<StudyState>((set) => ({
  currentExamType: null,
  subjects: [],
  examDate: null,
  studyPlan: null,
  streak: null,
  xp: 0,

  setExamType: (examType) => set({ currentExamType: examType }),
  setSubjects: (subjects) => set({ subjects }),
  setExamDate: (date) => set({ examDate: date }),
  setStudyPlan: (plan) => set({ studyPlan: plan }),
  setStreak: (streak) => set({ streak }),
  addXP: (amount) => set((state) => ({ xp: state.xp + amount })),

  resetStudyData: () =>
    set({
      currentExamType: null,
      subjects: [],
      examDate: null,
      studyPlan: null,
      streak: null,
      xp: 0,
    }),
}));
