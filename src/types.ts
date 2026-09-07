export type ViewType = 'home' | 'subjects' | 'practice' | 'tutor' | 'profile' | 'admin' | 'opportunities' | 'daily_challenge' | 'flashcards' | 'journey' | 'weak_topics' | 'upload_notes' | 'school_updates';

export interface StudyJourneyLearnData {
  mainConcept: string;
  importantPoints: string[];
  keyExamples: string[];
}

export interface StudyJourneyQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  userAnswer?: number;
  isCorrect?: boolean;
}

export interface StudyJourneyPracticeResult {
  total: number;
  correct: number;
  incorrect: number;
  accuracy: number;
  questions: StudyJourneyQuestion[];
  mistakes: StudyJourneyQuestion[];
}

export interface StudyJourneyRetestResult {
  total: number;
  correct: number;
  accuracy: number;
  questions: StudyJourneyQuestion[];
}

export interface StudyJourneyState {
  id: string;
  uid: string;
  educationLevel: string;
  examType: string;
  subject: string;
  subjectId: string;
  topic: string;
  step: 1 | 2 | 3 | 4 | 5 | 6; // 1: Learn, 2: Flashcards, 3: Practice, 4: Review Mistakes, 5: Retest, 6: Results
  learnData?: StudyJourneyLearnData;
  flashcardsStudied: number;
  flashcardsTotal: number;
  flashcardTargetCount?: number;
  practiceTargetCount?: number;
  practiceResults?: StudyJourneyPracticeResult;
  retestResults?: StudyJourneyRetestResult;
  topicMastery?: number;
  status: 'in_progress' | 'completed';
  createdAt: number;
  updatedAt: number;
}

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

export interface Flashcard {
  id: string;
  uid: string;
  subject: string;
  topic: string;
  deckName?: string;
  deckId?: string;
  front: string;
  back: string;
  explanation?: string;
  example?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard' | string;
  rating?: 'Again' | 'Hard' | 'Good' | 'Easy' | string;
  reviews?: number;
  lastReviewed?: number;
  nextReview?: number;
  bookmarked?: boolean;
  createdAt?: number;
}

export interface FlashcardDeck {
  id: string;
  name: string;
  subject: string;
  topic: string;
  cardCount: number;
  dueTodayCount: number;
  cards: Flashcard[];
  lastReviewed?: number;
  bookmarkedCount?: number;
}

export interface DailyStudyTask {
  id: string;
  type: 'flashcards' | 'questions' | 'review_mistakes';
  title: string;
  description: string;
  targetCount: number;
  currentCount: number;
  completed: boolean;
  topic?: string;
  subject?: string;
  subjectId?: string;
  actionText: string;
  mistakesCount?: number;
}

export interface DailyStudyPlan {
  uid: string;
  date: string; // YYYY-MM-DD
  tasks: DailyStudyTask[];
  primaryTopic?: string;
  primarySubject?: string;
  primarySubjectId?: string;
  primaryAccuracy?: number;
  completedCount: number;
  totalTasks: number;
  allCompleted: boolean;
  updatedAt: number;
}

export interface NoteAttachment {
  name: string;
  url: string;
  mimeType?: string;
  fileUri?: string;
  size?: number;
}

export interface NoteFlashcard {
  front: string;
  back: string;
  explanation?: string;
}

export interface NotePracticeQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface StudyNote {
  id: string;
  uid: string;
  title: string;
  subject?: string;
  topic?: string;
  content: string;
  attachments?: NoteAttachment[];
  createdAt: number;
  updatedAt: number;
  summary?: string;
  explanation?: string;
  flashcards?: NoteFlashcard[];
  practiceQuestions?: NotePracticeQuestion[];
}

export type SchoolUpdateCategory = 'Admissions' | 'Post-UTME' | 'School news' | 'Deadlines' | 'Important announcements';

export interface School {
  id: string;
  shortName: string;
  fullName: string;
  type: 'Federal' | 'State' | 'Private';
  location: string;
  state: string;
  cutOffMark?: number;
  popularFaculties: string[];
  logoBg: string;
  badgeText: string;
  website: string;
}

export interface SchoolUpdate {
  id: string;
  schoolId: string;
  schoolShortName: string;
  schoolFullName: string;
  category: SchoolUpdateCategory;
  title: string;
  summary: string;
  details?: string;
  date: string;
  timestamp: number;
  deadlineDate?: string;
  isUrgent?: boolean;
  portalUrl?: string;
  tags?: string[];
}



