export type TutorRole = 'user' | 'assistant' | 'system';

export interface TutorMessage {
  id: string;
  role: TutorRole;
  content: string;
  timestamp: Date;
  hintLevel?: number;
  relatedQuestionId?: string;
}

export interface TutorConversation {
  id: string;
  userId: string;
  subtopicId?: string;
  topicId?: string;
  messages: TutorMessage[];
  startedAt: Date;
  updatedAt: Date;
  attemptCount: number;
}
