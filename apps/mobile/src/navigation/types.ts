import type { StackScreenProps } from '@react-navigation/stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';

export type AuthStackParamList = {
  Welcome: undefined;
  ExamTypeSelection: undefined;
  SubjectSelection: undefined;
  ExamDate: undefined;
  DiagnosticQuiz: undefined;
  DiagnosticResults: { score: number; total: number };
  AccountCreation: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Learn: undefined;
  Practice: undefined;
  Progress: undefined;
  Profile: undefined;
};

export type LearnStackParamList = {
  LearnHome: undefined;
  TopicList: { subjectId: string; subjectName: string };
  AIChat: { topicId?: string; subtopicId?: string; title?: string };
};

export type PracticeStackParamList = {
  PracticeHub: undefined;
  Flashcard: { subtopicId: string; title: string };
  Quiz: { subtopicId?: string; topicId?: string; title: string };
  QuizResults: { score: number; total: number; xpEarned: number; subtopicId?: string };
};

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthScreenProps<T extends keyof AuthStackParamList> = StackScreenProps<
  AuthStackParamList,
  T
>;

export type MainTabScreenProps<T extends keyof MainTabParamList> = BottomTabScreenProps<
  MainTabParamList,
  T
>;

export type LearnStackScreenProps<T extends keyof LearnStackParamList> = CompositeScreenProps<
  StackScreenProps<LearnStackParamList, T>,
  BottomTabScreenProps<MainTabParamList>
>;

export type PracticeStackScreenProps<T extends keyof PracticeStackParamList> = CompositeScreenProps<
  StackScreenProps<PracticeStackParamList, T>,
  BottomTabScreenProps<MainTabParamList>
>;
