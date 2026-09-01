export type ViewType = 'home' | 'subjects' | 'practice' | 'tutor' | 'profile' | 'admin' | 'opportunities';

export interface Subject {
  id: string;
  name: string;
  progress: number;
  topics: number;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface ChatMessage {
  role: 'user' | 'tutor';
  text: string;
  attachments?: any[];
}

export interface TutorConversation {
  id: string;
  title: string;
  subject: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
  lastOpened: number;
  pinned?: boolean;
  bookmarked?: boolean;
}

export interface SubjectHistory {
  id: string;
  subject: string;
  subjectId?: string;
  name?: string;
  category?: string;
  topic?: string;
  lastOpened: number;
  totalTimeStudied: number;
  completedQuestions: number;
  averageScore: number;
}
