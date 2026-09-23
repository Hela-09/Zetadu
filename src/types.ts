export type ViewType = 'home' | 'learn' | 'subjects' | 'practice' | 'tutor' | 'profile' | 'admin' | 'daily_challenge' | 'flashcards' | 'journey' | 'weak_topics' | 'upload_notes' | 'jamb' | 'novels';

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

export interface NovelPracticeQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  topic?: string;
  year?: string;
  chapterIndex?: number;
  chapterNumber?: number;
  chapterTitle?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface NovelCharacter {
  name: string;
  role: string;
  description: string;
  traits?: string[];
}

export interface NovelStudyMaterial {
  id: string;
  title: string;
  type: 'summary' | 'themes' | 'characters' | 'literary_devices' | 'chapter_analysis' | 'key_quotes';
  content: string;
}

export interface NovelChapterCharacter {
  name: string;
  role: string;
  significance: string;
  traits?: string[];
}

export interface NovelChapterVocabulary {
  term: string;
  definition: string;
  contextInChapter?: string;
}

export interface NovelChapterQuestion {
  id: string;
  novelId: string;
  chapterIndex: number;
  chapterNumber: number;
  chapterTitle: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topic?: string;
  year?: string;
  isAIgenerated?: boolean;
  sourceType?: string;
  fingerprint?: string;
}

export interface NovelChapter {
  id: string;
  chapterNumber: number;
  title: string;
  wordCount: number;
  estimatedMinutes: number;
  hasFullTextPermission?: boolean; // True ONLY if LearnDean has permission to distribute the full book text
  content: string; // Full formatted text (if permitted) or comprehensive syllabus chapter analysis & guide
  summary: string;
  importantCharacters?: NovelChapterCharacter[];
  importantEvents?: string[];
  themes?: string[];
  importantVocabulary?: NovelChapterVocabulary[];
  keyPoints?: string[];
  questions?: NovelChapterQuestion[];
  practiceQuestions?: NovelPracticeQuestion[];
}

export interface Novel {
  id: string;
  title: string;
  author: string;
  year: number | string;
  genre: string;
  subject: 'JAMB Use of English' | 'JAMB Literature-in-English';
  category: 'Current JAMB Novel' | 'Drama' | 'Prose' | 'Poetry' | 'Recommended Textbooks';
  subCategory?: 'African Drama' | 'Non-African Drama' | 'African Prose' | 'Non-African Prose' | 'African Poetry' | 'Non-African Poetry' | 'General Principles' | 'Grammar & Lexis' | 'Literary Appreciation';
  coverImage?: string;
  coverGradient: string;
  description: string;
  syllabusRelevance?: string;
  themes: string[];
  characters?: NovelCharacter[];
  literaryDevices?: { device: string; explanation: string; example: string }[];
  studyNotes?: NovelStudyMaterial[];
  practiceQuestions?: NovelPracticeQuestion[];
  totalChapters: number;
  estimatedReadingTime: string;
  chapters: NovelChapter[];
  isFullTextIncluded?: boolean;
  distributionRights?: 'public_domain' | 'authorized_study_edition';
  distributionRightsLabel?: string;
  examSession?: string;
}

export interface NovelReadingProgress {
  id?: string;
  uid: string;
  novelId: string;
  novelTitle: string;
  currentChapterIndex: number;
  currentChapterTitle: string;
  scrollPercentage: number;
  completedChapters: number[];
  totalChapters: number;
  percentage: number;
  quizScore?: { correct: number; total: number; percentage: number };
  lastReadAt: number;
  updatedAt: number;
  syncStatus?: 'synced' | 'pending';
}

export interface NovelBookmark {
  id: string;
  uid: string;
  novelId: string;
  novelTitle: string;
  chapterIndex: number;
  chapterTitle: string;
  paragraphText: string;
  note?: string;
  createdAt: number;
  updatedAt: number;
  syncStatus?: 'synced' | 'pending';
}

export interface NovelQuestionBookmark {
  id: string;
  uid: string;
  novelId: string;
  novelTitle: string;
  chapterIndex: number;
  chapterTitle: string;
  questionId: string;
  question: NovelChapterQuestion;
  userNote?: string;
  createdAt: number;
  updatedAt: number;
  syncStatus?: 'synced' | 'pending';
}

export interface ChapterPerformanceSummary {
  chapterIndex: number;
  chapterTitle: string;
  totalInChapter: number;
  correctInChapter: number;
  accuracy: number;
}

export interface NovelPracticeAttempt {
  id: string;
  uid: string;
  novelId: string;
  novelTitle: string;
  mode?: 'sequential' | 'random' | 'timed' | 'untimed' | 'cbt';
  scope?: 'chapter' | 'multi_chapter' | 'all_chapters';
  selectedChapterIndices?: number[];
  chapterIndex?: number;
  chapterTitle?: string;
  totalQuestions: number;
  correctAnswers: number;
  scorePercentage: number;
  timeSpentSeconds: number;
  weakChapters?: ChapterPerformanceSummary[];
  completedChapterIndices?: number[];
  timestamp: number;
  syncStatus?: 'synced' | 'pending';
}




