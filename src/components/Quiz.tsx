import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  XCircle, 
  BrainCircuit, 
  AlertCircle, 
  Loader2, 
  Settings, 
  ArrowLeft, 
  ArrowRight, 
  Flag, 
  Menu, 
  X, 
  Clock, 
  Search, 
  BookOpen,
  Trophy,
  RotateCcw,
  Sparkles,
  Award,
  HelpCircle,
  Eye,
  Check,
  ChevronRight,
  Calculator,
  Bookmark,
  BookmarkCheck,
  CheckSquare,
  Wifi,
  WifiOff,
  Download,
  History
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { db, cleanFirestoreData } from '../lib/firebase';
import { collection, addDoc, serverTimestamp, doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { SUBJECT_DATA, ALL_SUBJECTS } from '../data/subjects';
import JambCalculator from './jamb/JambCalculator';
import { jambService } from '../services/jambService';
import { jambOfflineDb } from '../services/jambOfflineDb';
import { jambQuestionEngine } from '../services/jambQuestionEngine';
import { getUnifiedQuestionsForPractice } from '../data/jambQuestions';
import { practiceHistoryService, PracticeHistorySession } from '../services/practiceHistoryService';

export interface Question {
  id?: string;
  question: string;
  passage?: string;
  options: string[];
  correctAnswerIndex?: number;
  correctAnswer?: any;
  explanation: string;
  difficulty: string;
  topic: string;
  subject?: string;
  subjectId?: string;
  year?: number | string;
  questionNumber?: number;
  isAIgenerated?: boolean;
  sourceType?: 'official_past_question' | 'ai_generated' | 'curated_bank';
  fingerprint?: string;
}

export interface QuizProps {
  onBack?: () => void;
  setView?: (v: any) => void;
  initialMode?: 'standard' | 'jamb-cbt' | 'jamb-practice' | 'topic-practice' | 'history-review';
  initialConfig?: {
    subject?: string;
    subjectId?: string;
    subjects?: string[];
    topic?: string;
    year?: number | 'all';
    amount?: number;
    ordering?: 'random' | 'sequential';
    timerDuration?: number; // in minutes, 0 for untimed
    isUntimed?: boolean;
    questions?: Question[];
    examType?: 'JAMB' | 'WAEC' | 'General';
    resumeSession?: any;
    reviewSession?: {
      id?: string;
      questions: Question[];
      answers: Record<number | string, number>;
      score: number;
      totalQuestions: number;
      percentage: number;
      timeUsedSeconds: number;
      subject?: string;
      subjectId?: string;
      subjectName?: string;
      topic?: string;
      difficulty?: string;
      year?: number | string;
      isJambCbt?: boolean;
      subjects?: string[];
    };
  };
}

let cachedInternalSession: any = null;

export default function Quiz({ onBack, setView, initialMode, initialConfig }: QuizProps) {
  const { user, getToken, settings, userProfile, awardQuestionProgress } = useAuth();

  const getNormalizedCorrectIndex = (question: any): number => {
    let correctValue = question?.correctAnswerIndex !== undefined ? question.correctAnswerIndex : question?.correctAnswer;
    if (correctValue === undefined) return -1;

    if (typeof correctValue === 'number') {
      return correctValue;
    }
    if (typeof correctValue === 'string') {
      const normalizedStr = correctValue.trim().toLowerCase();
      if (['a', 'b', 'c', 'd'].includes(normalizedStr)) {
        return normalizedStr.charCodeAt(0) - 97;
      }
      if (question.options) {
        const foundIndex = question.options.findIndex((opt: string) => opt.trim().toLowerCase() === normalizedStr);
        if (foundIndex !== -1) return foundIndex;
      }
      if (!isNaN(Number(normalizedStr))) {
        return Number(normalizedStr);
      }
    }
    return -1;
  };

  const isOptionCorrect = (question: any, index: number | null | undefined) => {
    if (index === null || index === undefined || index === -1) return false;
    return getNormalizedCorrectIndex(question) === index;
  };

  // Helper to cleanly format option text ensuring "A. option text" pattern without double prefixes
  const formatOptionText = (option: string) => {
    if (!option) return '';
    return option.replace(/^[A-Da-d][.)\:\-]\s*/, '').trim();
  };

  const [setupMode, setSetupMode] = useState(cachedInternalSession ? cachedInternalSession.setupMode : true);
  const [setupStep, setSetupStep] = useState(() => {
    if (localStorage.getItem('zetadu_target_subject_id')) return 2;
    return 1;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<Question[]>(cachedInternalSession ? cachedInternalSession.questions : []);
  const [currentQIndex, setCurrentQIndex] = useState(cachedInternalSession ? cachedInternalSession.currentQIndex : 0);
  
  // View mode: 'practice' (taking quiz), 'results' (summary after submit), 'review' (stepping through answers)
  const [viewMode, setViewMode] = useState<'practice' | 'results' | 'review'>(
    cachedInternalSession?.isSubmitted ? 'results' : 'practice'
  );

  // CBT State
  const [answers, setAnswers] = useState<Record<number, number>>(cachedInternalSession ? cachedInternalSession.answers : {});
  const [markedForReview, setMarkedForReview] = useState<Record<number, boolean>>(cachedInternalSession ? cachedInternalSession.markedForReview : {});
  const [awardedQuestionIndices, setAwardedQuestionIndices] = useState<Set<number>>(() => {
    if (cachedInternalSession?.awardedQuestionIndices && Array.isArray(cachedInternalSession.awardedQuestionIndices)) {
      return new Set(cachedInternalSession.awardedQuestionIndices);
    }
    return new Set();
  });
  const [timerDuration, setTimerDuration] = useState<number>(() => {
    if (initialConfig?.timerDuration !== undefined) return initialConfig.timerDuration;
    return cachedInternalSession ? cachedInternalSession.timerDuration : 30;
  }); // in minutes
  const [timerRemaining, setTimerRemaining] = useState<number>(cachedInternalSession ? cachedInternalSession.timerRemaining : 1800); // in seconds
  const [isUntimed, setIsUntimed] = useState<boolean>(() => {
    if (initialConfig?.isUntimed !== undefined) return initialConfig.isUntimed;
    if (initialConfig?.timerDuration === 0) return true;
    return false;
  });
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [isSubmitted, setIsSubmitted] = useState(cachedInternalSession ? cachedInternalSession.isSubmitted : false);
  const [score, setScore] = useState(cachedInternalSession ? cachedInternalSession.score : 0);
  const [timeUsedSeconds, setTimeUsedSeconds] = useState<number>(() => {
    if (cachedInternalSession?.timeUsedSeconds) return cachedInternalSession.timeUsedSeconds;
    return 0;
  });

  // Shortfall / Exact Question Count modal state
  const [poolShortfallState, setPoolShortfallState] = useState<{
    requested: number;
    available: number;
    shortfall: number;
    subjects: string[];
    pendingQuestions: Question[];
  } | null>(null);
  const [isGeneratingShortfall, setIsGeneratingShortfall] = useState(false);

  // Offline & sync state
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [isPoolLow, setIsPoolLow] = useState<boolean>(false);
  const [unansweredPoolCount, setUnansweredPoolCount] = useState<number>(0);
  const [isDownloadingMore, setIsDownloadingMore] = useState<boolean>(false);
  const [downloadFeedback, setDownloadFeedback] = useState<string | null>(null);

  // Monitor online status and auto-sync pending offline data
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      jambService.syncPendingData().catch(() => {});
    };
    const handleOffline = () => {
      setIsOnline(false);
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load user's bookmarks from jambService on mount
  useEffect(() => {
    jambService.getBookmarks().then(bm => {
      setBookmarkedIds(new Set(bm.map(b => b.questionId)));
    }).catch(() => {});
  }, []);

  // Form state
  const [level, setLevel] = useState<string>(() => {
    if (cachedInternalSession?.level) return cachedInternalSession.level;
    return userProfile?.educationLevel || 'Secondary';
  });
  const [selectedClass, setSelectedClass] = useState<string>(() => {
    if (cachedInternalSession?.selectedClass) return cachedInternalSession.selectedClass;
    if (level === 'Primary') return 'Primary 6';
    if (level === 'Secondary') return 'SSS 3';
    return '100 Level';
  });
  const [subjectId, setSubjectId] = useState<string>(() => {
    if (initialConfig?.subjectId) return initialConfig.subjectId;
    if (cachedInternalSession?.subjectId) return cachedInternalSession.subjectId;
    const targetId = localStorage.getItem('zetadu_target_subject_id');
    if (targetId) return targetId;
    return 'mathematics';
  });
  
  const [subject, setSubject] = useState(() => {
    if (initialConfig?.subject) return initialConfig.subject;
    if (cachedInternalSession?.subject) return cachedInternalSession.subject;
    const targetId = localStorage.getItem('zetadu_target_subject_id');
    if (targetId) {
      const found = ALL_SUBJECTS.find(s => s.id === targetId);
      if (found) return found.name;
    }
    const target = localStorage.getItem('zetadu_target_subject');
    return target || 'Mathematics';
  });
  const [topic, setTopic] = useState(() => {
    if (initialConfig?.topic) return initialConfig.topic;
    if (cachedInternalSession?.topic) return cachedInternalSession.topic;
    return localStorage.getItem('zetadu_target_topic') || '';
  });
  const [difficulty, setDifficulty] = useState(cachedInternalSession ? cachedInternalSession.difficulty : (settings?.defaultPracticeDifficulty || 'Medium'));
  const [amount, setAmount] = useState(initialConfig?.amount || (cachedInternalSession ? cachedInternalSession.amount : 60));
  const [practiceMode, setPracticeMode] = useState(cachedInternalSession ? cachedInternalSession.practiceMode || 'Custom Practice' : 'Custom Practice');

  const [hasRestored, setHasRestored] = useState(!!cachedInternalSession);
  const [showLeavePrompt, setShowLeavePrompt] = useState(false);
  const [showSubmitPrompt, setShowSubmitPrompt] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [practiceHistoryList, setPracticeHistoryList] = useState<PracticeHistorySession[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const loadPracticeHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const list = await practiceHistoryService.getHistory();
      setPracticeHistoryList(list);
    } catch (err) {
      console.warn("Failed to load practice history:", err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleOpenPracticeHistoryItem = (session: PracticeHistorySession) => {
    setShowHistoryModal(false);
    const qList = session.answeredQuestions && session.answeredQuestions.length > 0 ? session.answeredQuestions : [];
    setQuestions(qList);

    const normAnswers: Record<number, number> = {};
    if (session.answers && typeof session.answers === 'object') {
      qList.forEach((q, idx) => {
        if (session.answers[idx] !== undefined) {
          normAnswers[idx] = Number(session.answers[idx]);
        } else if (session.answers[String(idx)] !== undefined) {
          normAnswers[idx] = Number(session.answers[String(idx)]);
        } else if (q.id && session.answers[q.id] !== undefined) {
          normAnswers[idx] = Number(session.answers[q.id]);
        } else if ((q as any).userAnswerIndex !== undefined && (q as any).userAnswerIndex !== null) {
          normAnswers[idx] = Number((q as any).userAnswerIndex);
        }
      });
    }
    setAnswers(normAnswers);
    setScore(session.score || 0);
    setTimeUsedSeconds(session.timeUsedSeconds || 0);
    setIsSubmitted(true);
    setViewMode('review');
    setCurrentQIndex(0);
    setSetupMode(false);
    setHasRestored(true);
    if (session.subject) setSubject(session.subjectName || session.subject);
    if (session.topic) setTopic(session.topic);
    if (session.difficulty) setDifficulty(session.difficulty);
  };
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedTimerRef = useRef<number>(timerRemaining);
  const questionCardRef = useRef<HTMLDivElement | null>(null);

  // Directly initialize when initialConfig prop is passed (e.g. launched from JAMB Prep Hub)
  useEffect(() => {
    let isCancelled = false;

    async function loadConfiguredQuestions() {
      if (!initialConfig) return;

      // Check if this is a historical review session
      if (initialConfig.reviewSession) {
        const rs = initialConfig.reviewSession;
        const qList = rs.questions && rs.questions.length > 0 ? rs.questions : [];
        setQuestions(qList);

        const normAnswers: Record<number, number> = {};
        if (rs.answers && typeof rs.answers === 'object') {
          qList.forEach((q, idx) => {
            if (rs.answers[idx] !== undefined) {
              normAnswers[idx] = Number(rs.answers[idx]);
            } else if (rs.answers[String(idx)] !== undefined) {
              normAnswers[idx] = Number(rs.answers[String(idx)]);
            } else if (q.id && rs.answers[q.id] !== undefined) {
              normAnswers[idx] = Number(rs.answers[q.id]);
            } else if ((q as any).userAnswerIndex !== undefined && (q as any).userAnswerIndex !== null) {
              normAnswers[idx] = Number((q as any).userAnswerIndex);
            }
          });
        }
        setAnswers(normAnswers);
        setScore(typeof rs.score === 'number' ? rs.score : 0);
        setTimeUsedSeconds(typeof rs.timeUsedSeconds === 'number' ? rs.timeUsedSeconds : 0);
        setIsSubmitted(true);
        setViewMode('review');
        setCurrentQIndex(0);
        setSetupMode(false);
        setHasRestored(true);
        if (rs.subject) setSubject(rs.subject);
        if (rs.subjectId) setSubjectId(rs.subjectId);
        if (rs.topic) setTopic(rs.topic);
        if (rs.difficulty) setDifficulty(rs.difficulty);
        return;
      }

      // Check if continuing an unfinished active session
      if (initialConfig.resumeSession) {
        const sess = initialConfig.resumeSession;
        const qList = sess.questions && Array.isArray(sess.questions) ? sess.questions : [];
        if (qList.length > 0) {
          setQuestions(qList);
          setAnswers(sess.answers || {});
          setMarkedForReview(sess.markedForReview || {});
          setCurrentQIndex(typeof sess.currentQIndex === 'number' ? sess.currentQIndex : 0);
          setTimerRemaining(typeof sess.timerRemaining === 'number' ? sess.timerRemaining : (sess.timerDuration ? sess.timerDuration * 60 : 1800));
          setIsUntimed(!!sess.isUntimed);
          setTimeUsedSeconds(typeof sess.timeUsedSeconds === 'number' ? sess.timeUsedSeconds : 0);
          setIsSubmitted(false);
          setViewMode('practice');
          setSetupMode(false);
          setHasRestored(true);
          if (sess.subject) setSubject(sess.subject);
          if (sess.subjectId) setSubjectId(sess.subjectId);
          if (sess.topic) setTopic(sess.topic);
          return;
        }
      }

      let loadedQ: Question[] = [];
      let poolLow = false;
      let unanswered = 0;

      const reqCount = initialConfig.amount || 20;

      if (initialConfig.questions && initialConfig.questions.length > 0) {
        loadedQ = initialConfig.questions;
      } else {
        try {
          // Use offline-first jambService to retrieve questions, respecting ordering and prioritizing unanswered
          const res = await jambService.getPracticeQuestions({
            subjects: initialConfig.subjects,
            subject: initialConfig.subjectId || initialConfig.subject,
            topic: initialConfig.topic,
            year: initialConfig.year,
            count: reqCount,
            order: initialConfig.ordering || 'random'
          });
          loadedQ = res.questions;
          poolLow = res.isPoolLow;
          unanswered = res.unansweredCount;
        } catch (err) {
          console.warn('Failed to load questions via jambService, falling back:', err);
          loadedQ = getUnifiedQuestionsForPractice({
            subjects: initialConfig.subjects,
            subject: initialConfig.subjectId || initialConfig.subject,
            topic: initialConfig.topic,
            year: initialConfig.year,
            count: reqCount,
            order: initialConfig.ordering || 'random'
          });
        }
      }

      // If loaded questions is fewer than requested and online, attempt automated backfill replenishment
      if (loadedQ.length < reqCount && typeof navigator !== 'undefined' && navigator.onLine) {
        try {
          const subjectsToReplenish = initialConfig.subjects && initialConfig.subjects.length > 0 
            ? initialConfig.subjects 
            : [initialConfig.subjectId || initialConfig.subject || 'English Language'];
          const missing = reqCount - loadedQ.length;
          const perSub = Math.max(1, Math.ceil(missing / subjectsToReplenish.length));

          for (const s of subjectsToReplenish) {
            if (loadedQ.length >= reqCount) break;
            const subMissing = Math.min(perSub, reqCount - loadedQ.length);
            await jambService.generateAndDownloadMoreQuestions(s, 'General', subMissing);
          }

          const refreshed = await jambService.getPracticeQuestions({
            subjects: initialConfig.subjects,
            subject: initialConfig.subjectId || initialConfig.subject,
            topic: initialConfig.topic,
            year: initialConfig.year,
            count: reqCount,
            order: initialConfig.ordering || 'random'
          });
          loadedQ = refreshed.questions;
          poolLow = refreshed.isPoolLow;
          unanswered = refreshed.unansweredCount;
        } catch (e) {
          console.warn("Online auto-replenish error:", e);
        }
      }

      if (isCancelled) return;

      setIsPoolLow(poolLow || loadedQ.length < reqCount);
      setUnansweredPoolCount(unanswered);

      // CRITICAL: The session must NEVER contain fewer questions than the number selected.
      // If we cannot meet the exact count, show the Shortfall Prompt and DO NOT start session.
      if (loadedQ.length < reqCount) {
        setPoolShortfallState({
          requested: reqCount,
          available: loadedQ.length,
          shortfall: reqCount - loadedQ.length,
          subjects: initialConfig.subjects || [initialConfig.subjectId || initialConfig.subject || 'General'],
          pendingQuestions: loadedQ
        });
        setSetupMode(false);
        return;
      }

      // Exact count guaranteed
      const exactQuestions = loadedQ.slice(0, reqCount);
      setQuestions(exactQuestions);
      setPoolShortfallState(null);
      setSetupMode(false);
      setIsSubmitted(false);
      setViewMode('practice');
      setCurrentQIndex(0);
      setAnswers({});
      setMarkedForReview({});
      setAwardedQuestionIndices(new Set());
      const dur = initialConfig.timerDuration !== undefined ? initialConfig.timerDuration : 30;
      setTimerDuration(dur);
      const untimed = initialConfig.isUntimed || dur === 0;
      setIsUntimed(untimed);
      setTimerRemaining(dur * 60);
      setTimeUsedSeconds(0);
      if (initialConfig.subject) setSubject(initialConfig.subject);
      if (initialConfig.subjectId) setSubjectId(initialConfig.subjectId);
      if (initialConfig.topic) setTopic(initialConfig.topic);
      setHasRestored(true);
    }

    loadConfiguredQuestions();

    return () => {
      isCancelled = true;
    };
  }, [initialConfig]);

  // Restore session data helper
  const restoreSessionData = useCallback((data: any) => {
    setLevel(data.level || 'Secondary');
    setSelectedClass(data.selectedClass || 'SSS 3');
    setSubjectId(data.subjectId || 'mathematics');
    setSubject(data.subject || 'Mathematics');
    setTopic(data.topic || '');
    setDifficulty(data.difficulty || 'Medium');
    setAmount(data.amount || 20);
    setTimerDuration(data.timerDuration || 30);
    setTimerRemaining(data.timerRemaining !== undefined ? data.timerRemaining : (data.timerDuration * 60));
    setQuestions(data.questions || []);
    setCurrentQIndex(data.currentQIndex || 0);
    setAnswers(data.answers || {});
    setMarkedForReview(data.markedForReview || {});
    setIsSubmitted(data.isSubmitted || false);
    setScore(data.score || 0);
    if (data.isSubmitted) {
      setViewMode('results');
      setTimeUsedSeconds(data.timeUsedSeconds || Math.max(0, (data.timerDuration * 60) - (data.timerRemaining || 0)));
    } else {
      setViewMode('practice');
    }
    setSetupMode(false);
  }, []);

  // Load session on mount (memory -> IndexedDB -> localStorage -> Firestore)
  useEffect(() => {
    const loadSession = async () => {
      if (cachedInternalSession && !cachedInternalSession.setupMode && cachedInternalSession.questions?.length > 0) {
        setHasRestored(true);
        return;
      }

      let foundSession = false;

      // 1. Check IndexedDB for offline saved active session
      try {
        const idbSession = await jambOfflineDb.getActiveSession();
        if (idbSession && !idbSession.setupMode && idbSession.questions && idbSession.questions.length > 0) {
          if (!idbSession.uid || !user || idbSession.uid === user.uid) {
            restoreSessionData(idbSession);
            foundSession = true;
          }
        }
      } catch (e) {
        console.warn("Failed to check IndexedDB session:", e);
      }

      // 2. Check localStorage fallback
      if (!foundSession) {
        const localData = localStorage.getItem('practice_session');
        if (localData) {
          try {
            const parsed = JSON.parse(localData);
            if (parsed && !parsed.setupMode && parsed.questions && parsed.questions.length > 0) {
              if (!parsed.uid || !user || parsed.uid === user.uid) {
                restoreSessionData(parsed);
                foundSession = true;
              }
            }
          } catch (e) {
            console.warn("Failed to parse local session", e);
          }
        }
      }
      
      // 3. Check Firestore only if online
      if (!foundSession && user && typeof navigator !== 'undefined' && navigator.onLine) {
        try {
          const docRef = doc(db, 'practice_sessions', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data && !data.setupMode && data.questions && data.questions.length > 0 && !data.isSubmitted) {
              restoreSessionData(data);
            }
          }
        } catch (err) {
          // Gracefully handle Firestore warnings without disturbing student
          console.warn("Silent load warning from firestore", err);
        }
      }
      setHasRestored(true);
    };
    
    if (!hasRestored) {
      loadSession();
    }
  }, [user, hasRestored, restoreSessionData]);

  // Handle Search navigation targets (Direct Question or Topic selection)
  useEffect(() => {
    const targetQStr = localStorage.getItem('zetadu_target_question');
    if (targetQStr) {
      localStorage.removeItem('zetadu_target_question');
      try {
        const parsed = JSON.parse(targetQStr);
        if (parsed && (parsed.question || parsed.text)) {
          const qText = parsed.question || parsed.text;
          const qObj: Question = {
            question: qText,
            options: parsed.options && parsed.options.length > 0 ? parsed.options : ['Option A', 'Option B', 'Option C', 'Option D'],
            correctAnswerIndex: parsed.correctAnswer ?? 0,
            explanation: parsed.explanation || 'Review topic notes and syllabus for full derivation.',
            difficulty: parsed.difficulty || 'Medium',
            topic: parsed.topic || topic || 'General Practice'
          };
          if (parsed.subject) setSubject(parsed.subject);
          if (parsed.subjectId) setSubjectId(parsed.subjectId);
          if (parsed.topic) setTopic(parsed.topic);
          setQuestions([qObj]);
          setCurrentQIndex(0);
          setAnswers({});
          setMarkedForReview({});
          setIsSubmitted(false);
          setScore(0);
          setSetupMode(false);
          setViewMode('practice');
          setTimerRemaining(15 * 60);
          return;
        }
      } catch (e) {
        console.warn('Failed to parse search target question:', e);
      }
    }

    const targetTopic = localStorage.getItem('zetadu_target_topic');
    const targetSubj = localStorage.getItem('zetadu_target_subject');
    const targetSubjId = localStorage.getItem('zetadu_target_subject_id');
    if (targetTopic || targetSubj) {
      if (targetTopic) {
        setTopic(targetTopic);
        localStorage.removeItem('zetadu_target_topic');
      }
      if (targetSubj) {
        setSubject(targetSubj);
        localStorage.removeItem('zetadu_target_subject');
      }
      if (targetSubjId) {
        setSubjectId(targetSubjId);
        localStorage.removeItem('zetadu_target_subject_id');
      }
      setSetupStep(2);
      setSetupMode(true);
      setViewMode('practice');
    }
  }, []);

  // Persist session state helper (saves to memory, IndexedDB, localStorage, and Firestore)
  const persistSessionToFirebase = useCallback(async (overrides?: Partial<any>) => {
    if (setupMode || questions.length === 0 || isSubmitted) return;

    const validQuestions = (questions || []).map(q => cleanFirestoreData(q));
    const sessionData: Record<string, any> = {
      setupMode: false,
      difficulty: difficulty || 'Medium',
      amount: validQuestions.length || amount || 20,
      timerDuration: timerDuration || 15,
      timerRemaining: typeof timerRemaining === 'number' ? timerRemaining : (timerDuration || 15) * 60,
      questions: validQuestions,
      currentQIndex: typeof currentQIndex === 'number' ? currentQIndex : 0,
      answers: answers || {},
      markedForReview: markedForReview || {},
      isSubmitted: false,
      score: typeof score === 'number' ? score : 0,
      updatedAt: Date.now()
    };

    if (user?.uid) sessionData.uid = user.uid;
    if (level) sessionData.level = level;
    if (selectedClass) sessionData.selectedClass = selectedClass;
    if (subjectId) sessionData.subjectId = subjectId;
    if (subject) sessionData.subject = subject;
    if (topic) sessionData.topic = topic;

    if (overrides) {
      for (const [k, v] of Object.entries(overrides)) {
        if (v !== undefined) {
          sessionData[k] = v;
        }
      }
    }

    cachedInternalSession = sessionData;
    
    // Save to IndexedDB (offline database)
    try {
      await jambOfflineDb.saveActiveSession(sessionData);
    } catch (idbErr) {
      console.warn("IndexedDB session save warning", idbErr);
    }

    try {
      localStorage.setItem('practice_session', JSON.stringify(sessionData));
    } catch (e) {
      console.warn("Local storage write error", e);
    }

    if (user && !isSubmitted && typeof navigator !== 'undefined' && navigator.onLine) {
      try {
        const firestorePayload = cleanFirestoreData({
          ...sessionData,
          updatedAt: serverTimestamp()
        });
        await setDoc(doc(db, 'practice_sessions', user.uid), firestorePayload, { merge: true });
      } catch (err) {
        // Silently catch firestore errors to prevent popups/crashes
        console.warn("Silent save session to firestore warning", err);
      }
    }
  }, [setupMode, questions, isSubmitted, user, level, selectedClass, subjectId, subject, topic, difficulty, amount, timerDuration, timerRemaining, currentQIndex, answers, markedForReview, score]);

  // Save on significant state changes (answers, marked-for-review, question index change)
  useEffect(() => {
    if (!hasRestored || setupMode || questions.length === 0 || isSubmitted) return;
    persistSessionToFirebase();
  }, [answers, markedForReview, currentQIndex, hasRestored, setupMode, questions.length, isSubmitted, persistSessionToFirebase]);

  // Timer effect
  useEffect(() => {
    if (setupMode || isSubmitted || questions.length === 0 || viewMode !== 'practice') {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    if (isUntimed) {
      timerRef.current = setInterval(() => {
        setTimeUsedSeconds(prev => prev + 1);
      }, 1000);
      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }

    timerRef.current = setInterval(() => {
      setTimerRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleTimeUp();
          return 0;
        }
        const updated = prev - 1;
        
        // Save to localStorage every second (instant and quota-free)
        try {
          const cached = localStorage.getItem('practice_session');
          if (cached) {
            const parsed = JSON.parse(cached);
            parsed.timerRemaining = updated;
            localStorage.setItem('practice_session', JSON.stringify(parsed));
          }
        } catch (e) {}

        return updated;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [setupMode, isSubmitted, questions.length, viewMode, isUntimed, user]);

  const clearSession = async () => {
    cachedInternalSession = null;
    try {
      await jambOfflineDb.clearActiveSession();
    } catch (e) {}
    localStorage.removeItem('practice_session');
    localStorage.removeItem('zetadu_target_subject_id');
    localStorage.removeItem('zetadu_target_subject');
    localStorage.removeItem('zetadu_target_topic');
    if (user && typeof navigator !== 'undefined' && navigator.onLine) {
      try {
        await deleteDoc(doc(db, 'practice_sessions', user.uid));
      } catch(e) {
        console.warn("Silent delete session warning", e);
      }
    }
  };

  const handleLeavePractice = async () => {
    setShowLeavePrompt(false);
    await clearSession();
    setSetupMode(true);
    setViewMode('practice');
    setIsSubmitted(false);
    if (onBack) {
      onBack();
    }
  };

  const handleStartNew = async () => {
    await clearSession();
    setSetupMode(true);
    setSetupStep(1);
    setQuestions([]);
    setAnswers({});
    setMarkedForReview({});
    setIsSubmitted(false);
    setViewMode('practice');
  };

  const handleRetake = () => {
    setAnswers({});
    setMarkedForReview({});
    setCurrentQIndex(0);
    setScore(0);
    setTimerRemaining(timerDuration * 60);
    setTimeUsedSeconds(0);
    setIsSubmitted(false);
    setViewMode('practice');
    // Save fresh retake session
    const resetData = {
      answers: {},
      markedForReview: {},
      currentQIndex: 0,
      isSubmitted: false,
      score: 0,
      timerRemaining: timerDuration * 60
    };
    persistSessionToFirebase(resetData);
  };

  const handleDownloadMoreQuestions = async () => {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      setDownloadFeedback("Connect to the internet to get more questions.");
      return;
    }
    setIsDownloadingMore(true);
    setDownloadFeedback(null);
    try {
      const activeSubjId = subjectId || (questions[currentQIndex]?.subjectId) || 'english';
      const res = await jambService.generateAndDownloadMoreQuestions(activeSubjId, topic || 'General', 5);
      setDownloadFeedback(`Added ${res.addedCount} new questions to offline question bank (${res.totalOfflineCount} total available).`);
      setIsPoolLow(false);
      setUnansweredPoolCount(prev => prev + res.addedCount);
    } catch (e: any) {
      setDownloadFeedback(e?.message || "Connect to the internet to get more questions.");
    } finally {
      setIsDownloadingMore(false);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    try {
      let loadedQuestions: Question[] = [];
      let poolIsLow = false;
      let unanswered = 0;

      // 1. First retrieve questions from offline/unified bank via jambService
      try {
        const res = await jambService.getPracticeQuestions({
          subject: subjectId || subject.toLowerCase(),
          topic: topic || undefined,
          count: amount,
          order: 'random'
        });
        loadedQuestions = res.questions;
        poolIsLow = res.isPoolLow;
        unanswered = res.unansweredCount;
      } catch (err) {
        console.warn("Failed to get practice questions from jambService, falling back:", err);
        loadedQuestions = getUnifiedQuestionsForPractice({
          subject: subjectId || subject.toLowerCase(),
          topic: topic || undefined,
          count: amount,
          order: 'random'
        });
      }

      // 2. If pool has fewer questions than requested and user is online, attempt replenishment
      if (loadedQuestions.length < amount && typeof navigator !== 'undefined' && navigator.onLine) {
        try {
          const missing = amount - loadedQuestions.length;
          await jambService.generateAndDownloadMoreQuestions(
            subjectId || subject.toLowerCase(),
            topic || 'General',
            missing
          );
          const refreshed = await jambService.getPracticeQuestions({
            subject: subjectId || subject.toLowerCase(),
            topic: topic || undefined,
            count: amount,
            order: 'random'
          });
          loadedQuestions = refreshed.questions;
          poolIsLow = refreshed.isPoolLow;
          unanswered = refreshed.unansweredCount;
        } catch (apiErr) {
          console.warn("Question auto-replenish error:", apiErr);
        }
      }

      // 3. Strict exact count enforcement: never launch with fewer questions than requested
      if (loadedQuestions.length < amount) {
        setPoolShortfallState({
          requested: amount,
          available: loadedQuestions.length,
          shortfall: amount - loadedQuestions.length,
          subjects: [subjectId || subject],
          pendingQuestions: loadedQuestions
        });
        setIsPoolLow(true);
        return;
      }

      const exactQuestions = loadedQuestions.slice(0, amount);
      setIsPoolLow(false);
      setUnansweredPoolCount(unanswered);
      setQuestions(exactQuestions);
      setPoolShortfallState(null);
      setScore(0);
      setCurrentQIndex(0);
      setAnswers({});
      setMarkedForReview({});
      setAwardedQuestionIndices(new Set());
      setTimerRemaining(timerDuration * 60);
      setTimeUsedSeconds(0);
      setSetupMode(false);
      setIsSubmitted(false);
      setViewMode('practice');

      // Initialize persistent session immediately
      const validLoadedQuestions = loadedQuestions.map(q => cleanFirestoreData(q));
      const initialSession: Record<string, any> = {
        setupMode: false,
        difficulty: difficulty || 'Medium',
        amount: validLoadedQuestions.length || amount || 20,
        practiceMode: practiceMode || 'standard',
        timerDuration: timerDuration || 15,
        timerRemaining: (timerDuration || 15) * 60,
        questions: validLoadedQuestions,
        currentQIndex: 0,
        answers: {},
        markedForReview: {},
        isSubmitted: false,
        score: 0,
        updatedAt: Date.now()
      };
      if (user?.uid) initialSession.uid = user.uid;
      if (level) initialSession.level = level;
      if (selectedClass) initialSession.selectedClass = selectedClass;
      if (subjectId) initialSession.subjectId = subjectId;
      if (subject) initialSession.subject = subject;
      if (topic) initialSession.topic = topic;

      cachedInternalSession = initialSession;
      try {
        localStorage.setItem('practice_session', JSON.stringify(initialSession));
      } catch (e) {}

      if (user) {
        try {
          const firestoreInitial = cleanFirestoreData({
            ...initialSession,
            updatedAt: serverTimestamp()
          });
          await setDoc(doc(db, 'practice_sessions', user.uid), firestoreInitial);
        } catch (dbErr) {
          console.warn("Silent initialize session in firestore warning", dbErr);
        }

        try {
          const metadata: Record<string, any> = {
            amount: validLoadedQuestions.length,
            questions: validLoadedQuestions
          };
          if (subject) metadata.subject = subject;
          if (topic) metadata.topic = topic;
          if (difficulty) metadata.difficulty = difficulty;

          const resolvedSubject = subject || subjectId || 'JAMB Practice';
          const aiHistoryPayload: Record<string, any> = {
            uid: user.uid,
            type: 'question_generation',
            subject: resolvedSubject,
            content: `Generated ${validLoadedQuestions.length} questions for ${resolvedSubject}${topic ? ' - ' + topic : ''}`,
            details: `Practice session generated with ${validLoadedQuestions.length} questions`,
            metadata,
            createdAt: serverTimestamp(),
            timestamp: new Date().toISOString()
          };
          if (topic) aiHistoryPayload.topic = topic;

          await addDoc(collection(db, 'ai_history'), cleanFirestoreData(aiHistoryPayload));
        } catch (dbErr) {
          console.warn("Silent log history warning", dbErr);
        }
      }
    } catch (err: any) {
      console.warn("Question generation error:", err);
      alert(err.message || 'An error occurred while generating questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateShortfall = async () => {
    if (!poolShortfallState) return;
    setIsGeneratingShortfall(true);
    try {
      const { shortfall, subjects, requested } = poolShortfallState;
      const targetSubs = subjects.length > 0 ? subjects : [subjectId || subject || 'English Language'];
      const perSub = Math.max(1, Math.ceil(shortfall / targetSubs.length));

      for (const s of targetSubs) {
        await jambService.generateAndDownloadMoreQuestions(s, 'General', perSub);
      }

      const refreshed = await jambService.getPracticeQuestions({
        subjects: targetSubs.length > 1 ? targetSubs : undefined,
        subject: targetSubs.length === 1 ? targetSubs[0] : undefined,
        topic: topic || undefined,
        year: initialConfig?.year,
        count: requested,
        order: 'random'
      });

      if (refreshed.questions.length >= requested) {
        const exactQuestions = refreshed.questions.slice(0, requested);
        setQuestions(exactQuestions);
        setPoolShortfallState(null);
        setSetupMode(false);
        setIsSubmitted(false);
        setViewMode('practice');
        setCurrentQIndex(0);
        setAnswers({});
        setMarkedForReview({});
        setAwardedQuestionIndices(new Set());
      } else {
        setPoolShortfallState(prev => prev ? {
          ...prev,
          available: refreshed.questions.length,
          shortfall: Math.max(0, requested - refreshed.questions.length),
          pendingQuestions: refreshed.questions
        } : null);
      }
    } catch (e: any) {
      alert(e?.message || "Failed to generate missing questions. Ensure you have an active internet connection.");
    } finally {
      setIsGeneratingShortfall(false);
    }
  };

  const handleStartWithAvailable = () => {
    if (!poolShortfallState || poolShortfallState.pendingQuestions.length === 0) return;
    const exact = poolShortfallState.pendingQuestions;
    setQuestions(exact);
    setPoolShortfallState(null);
    setSetupMode(false);
    setIsSubmitted(false);
    setViewMode('practice');
    setCurrentQIndex(0);
    setAnswers({});
    setMarkedForReview({});
    setAwardedQuestionIndices(new Set());
  };

  const handleOptionClick = (index: number) => {
    if (isSubmitted || viewMode !== 'practice') return;
    const newAnswers = {
      ...answers,
      [currentQIndex]: index
    };
    setAnswers(newAnswers);

    const q = questions[currentQIndex];
    const isCorrect = isOptionCorrect(q, index);

    // Track every question the student actually answers.
    // Update XP/progress immediately after a valid answer.
    // Do not award XP multiple times for the same question.
    if (!awardedQuestionIndices.has(currentQIndex)) {
      const nextAwarded = new Set(awardedQuestionIndices);
      nextAwarded.add(currentQIndex);
      setAwardedQuestionIndices(nextAwarded);

      const xpEarned = isCorrect ? 10 : 2; // 10 XP for correct, 2 XP for effort
      if (awardQuestionProgress) {
        awardQuestionProgress({
          xpToAdd: xpEarned,
          questionId: q?.id,
          isCorrect,
          subject: q?.subject || subject
        }).catch(err => console.warn("XP Award warning:", err));
      }

      // Instant background save including awardedQuestionIndices
      persistSessionToFirebase({ 
        answers: newAnswers,
        awardedQuestionIndices: Array.from(nextAwarded)
      });
    } else {
      // Instant background save for answer modification without duplicate XP award
      persistSessionToFirebase({ answers: newAnswers });
    }

    // Track every question the student answers in userQuestionHistory
    if (user && q?.id) {
      jambQuestionEngine.recordQuestionAnswer(
        user.uid,
        cachedInternalSession?.sessionId || 'active_practice_session',
        q.id,
        index,
        isCorrect,
        10,
        {
          ...(q.subjectId || subjectId ? { subjectId: q.subjectId || subjectId } : {}),
          ...(q.topic || topic ? { topicId: q.topic || topic } : {})
        }
      ).catch(err => console.warn("Failed recording question answer:", err));
    }
  };

  const toggleMarkReview = () => {
    if (isSubmitted || viewMode !== 'practice') return;
    const newMarked = {
      ...markedForReview,
      [currentQIndex]: !markedForReview[currentQIndex]
    };
    setMarkedForReview(newMarked);
    // Instant background save
    persistSessionToFirebase({ markedForReview: newMarked });
  };

  const jumpToQuestion = (index: number) => {
    if (index >= 0 && index < questions.length) {
      setCurrentQIndex(index);
      setShowMobileNav(false);
      // Smoothly bring question card into view if needed
      if (questionCardRef.current) {
        questionCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  };

  const handleNext = () => {
    if (currentQIndex < questions.length - 1) {
      jumpToQuestion(currentQIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentQIndex > 0) {
      jumpToQuestion(currentQIndex - 1);
    }
  };

  const calculateScore = useCallback(() => {
    let s = 0;
    questions.forEach((q, i) => {
      if (answers[i] !== undefined && isOptionCorrect(q, answers[i])) {
        s++;
      }
    });
    return s;
  }, [questions, answers]);

  const confirmSubmit = async () => {
    setShowSubmitPrompt(false);
    const finalScore = calculateScore();
    const usedSeconds = isUntimed ? timeUsedSeconds : Math.max(0, (timerDuration * 60) - timerRemaining);
    setScore(finalScore);
    setTimeUsedSeconds(usedSeconds);
    setIsSubmitted(true);
    setViewMode('results');
    
    // Save practice attempt to unified practiceHistoryService (local + firestore)
    const resolvedSub = subjectId || subject || 'general';
    const resolvedSubName = subject || JAMB_SUBJECTS.find(s => s.id === resolvedSub)?.name || resolvedSub;

    try {
      await practiceHistoryService.saveSession({
        uid: user?.uid,
        subject: resolvedSub,
        subjectName: resolvedSubName,
        topic: topic || 'General',
        difficulty: difficulty || 'Medium',
        score: finalScore,
        totalQuestions: questions.length,
        percentage: questions.length > 0 ? Math.round((finalScore / questions.length) * 100) : 0,
        timeUsedSeconds: usedSeconds,
        answeredQuestions: questions.map((q, i) => cleanFirestoreData({
          ...q,
          userAnswerIndex: answers[i] !== undefined ? answers[i] : null
        })),
        answers: answers || {},
        examType: initialConfig?.examType || (initialMode?.startsWith('jamb') ? 'JAMB' : 'General')
      });
    } catch (practiceHistErr) {
      console.warn("Silent save practice history error:", practiceHistErr);
    }

    if (user) {
      try {
        const learningDataPayload = cleanFirestoreData({
          uid: user.uid,
          subject: resolvedSubName,
          topic: topic || 'General',
          difficulty: difficulty || 'Medium',
          score: finalScore,
          totalQuestions: questions.length,
          answeredQuestionsCount: Object.keys(answers).length,
          percentage: questions.length > 0 ? Math.round((finalScore / questions.length) * 100) : 0,
          timeUsedSeconds: usedSeconds,
          answeredQuestions: questions.map((q, i) => cleanFirestoreData({
            ...q,
            userAnswerIndex: answers[i] !== undefined ? answers[i] : null
          })),
          updatedAt: serverTimestamp()
        });
        await addDoc(collection(db, 'learning_data'), learningDataPayload);
      } catch (err) {
        console.warn("Silent save learning data warning:", err);
      }
    }

    if (initialMode?.startsWith('jamb') || initialConfig?.examType === 'JAMB') {
      try {
        await jambService.saveAttempt({
          subject: resolvedSub,
          subjectName: resolvedSubName,
          year: typeof initialConfig?.year === 'number' ? initialConfig.year : 2024,
          score: finalScore,
          totalQuestions: questions.length,
          percentage: questions.length > 0 ? Math.round((finalScore / questions.length) * 100) : 0,
          timeSpentSeconds: usedSeconds,
          answers: answers || {},
          questions: questions.map(q => cleanFirestoreData(q)) as any
        });
      } catch (err) {
        console.warn("Silent save jamb attempt warning:", err);
      }
    }

    await clearSession();
  };

  const handleTimeUp = () => {
    const finalScore = calculateScore();
    const usedSeconds = timerDuration * 60;
    setScore(finalScore);
    setTimeUsedSeconds(usedSeconds);
    setIsSubmitted(true);
    setViewMode('results');
    confirmSubmit();
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    
    if (h > 0) {
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const formatTimeSpentString = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    if (m >= 60) {
      const h = Math.floor(m / 60);
      const remM = m % 60;
      return `${h}h ${remM}m ${s}s`;
    }
    return `${m}m ${s}s`;
  };

  // Group questions by subject for multi-subject CBT
  const subjectTabs = useMemo(() => {
    if (!questions || questions.length === 0) return [];
    
    const map = new Map<string, { name: string; startIndex: number; endIndex: number; count: number }>();
    
    questions.forEach((q, idx) => {
      const subName = q.subject || subject || 'General';
      if (!map.has(subName)) {
        map.set(subName, { name: subName, startIndex: idx, endIndex: idx, count: 1 });
      } else {
        const item = map.get(subName)!;
        item.endIndex = idx;
        item.count += 1;
      }
    });

    if (map.size <= 1) return [];

    return Array.from(map.values()).map(tab => {
      let answeredInTab = 0;
      let correctInTab = 0;
      for (let i = tab.startIndex; i <= tab.endIndex; i++) {
        if (answers[i] !== undefined) {
          answeredInTab++;
          if (isOptionCorrect(questions[i], answers[i])) {
            correctInTab++;
          }
        }
      }
      return {
        ...tab,
        answeredCount: answeredInTab,
        correctCount: correctInTab
      };
    });
  }, [questions, answers, subject]);

  const currentSubjectTab = useMemo(() => {
    if (subjectTabs.length === 0) return null;
    const currentTab = subjectTabs.find(t => currentQIndex >= t.startIndex && currentQIndex <= t.endIndex);
    return currentTab || subjectTabs[0];
  }, [subjectTabs, currentQIndex]);

  // Current Question and derived statistics
  const question = questions[currentQIndex] || questions[0];
  const answeredCount = Object.keys(answers).length;
  const unansweredCount = Math.max(0, questions.length - answeredCount);
  const correctCount = calculateScore();
  const incorrectCount = Math.max(0, questions.length - correctCount);
  const percentage = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;

  const toggleBookmarkCurrent = async () => {
    if (!question) return;
    const qId = question.id || `q-${currentQIndex}`;
    const nowBookmarked = !bookmarkedIds.has(qId);
    
    setBookmarkedIds(prev => {
      const next = new Set(prev);
      if (nowBookmarked) next.add(qId);
      else next.delete(qId);
      return next;
    });

    try {
      await jambService.toggleBookmark({
        id: qId,
        subject: question.subjectId || subjectId || 'english',
        subjectName: question.subject || subject || 'General',
        year: typeof question.year === 'number' ? question.year : 2024,
        questionNumber: question.questionNumber || (currentQIndex + 1),
        topic: question.topic || 'General',
        question: question.question,
        options: question.options,
        correctAnswer: getNormalizedCorrectIndex(question),
        explanation: question.explanation
      });
    } catch (err) {
      console.warn("Bookmark toggle error:", err);
    }
  };

  // Determine subjects based on level
  let availableSubjects: string[] = [];
  if (level === 'Primary') {
    availableSubjects = SUBJECT_DATA.Primary.subjects;
  } else if (level === 'Secondary') {
    if (selectedClass.startsWith('JSS')) {
      availableSubjects = SUBJECT_DATA.Secondary.subjects.JSS;
    } else {
      availableSubjects = SUBJECT_DATA.Secondary.subjects.SSS;
    }
  }

  // Render 1: Setup Mode (Subject Picker & Options)
  if (setupMode || questions.length === 0) {
    if (setupStep === 1) {
      const filtered = ALL_SUBJECTS.filter(s => 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        s.category.toLowerCase().includes(searchQuery.toLowerCase())
      );

      return (
        <div className="w-full max-w-7xl mx-auto pb-12 flex flex-col px-3 sm:px-4 min-w-0">
          <div className="mb-6 sm:mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 shrink-0">
            <div className="flex items-center gap-3 sm:gap-4">
              <button 
                id="quiz-back-button"
                onClick={() => {
                  if (onBack) {
                    onBack();
                  } else if (window.history.length > 1) {
                    window.history.back();
                  } else if (setView) {
                    setView('home');
                  }
                }} 
                className="p-2 sm:p-2.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors self-start cursor-pointer"
                title="Go back"
                aria-label="Go back"
              >
                <ArrowLeft size={22} />
              </button>
              <div>
                <p className="text-xs font-bold tracking-widest text-blue-600 dark:text-blue-400 uppercase mb-1">
                  Practice Session
                </p>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Select a Subject
                </h2>
              </div>
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-80 min-w-0">
                <input 
                  id="quiz-search-subjects-input"
                  type="text" 
                  placeholder="Search subjects..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-xs text-sm sm:text-base"
                />
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
              <button
                id="quiz-history-btn"
                type="button"
                onClick={() => {
                  loadPracticeHistory();
                  setShowHistoryModal(true);
                }}
                className="px-3.5 sm:px-4 py-3 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 shadow-xs"
                title="Practice History"
              >
                <History size={18} className="text-blue-600 dark:text-blue-400" />
                <span>History</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 flex-1 pb-8 w-full min-w-0">
            {filtered.map((sub) => (
              <button
                key={sub.id}
                id={`quiz-subject-${sub.id}`}
                onClick={() => {
                  setSubjectId(sub.id);
                  setSubject(sub.name);
                  setSetupStep(2);
                }}
                className="bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 border-2 border-slate-100 dark:border-slate-700/60 hover:border-blue-500 dark:hover:border-blue-500 shadow-xs hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between text-left relative min-w-0"
              >
                <div>
                  <div className="flex justify-between items-start mb-4 sm:mb-5">
                    <div className={`p-3 sm:p-4 rounded-2xl text-white shadow-sm ${sub.color} group-hover:scale-105 transition-transform duration-200`}>
                      <BookOpen size={24} />
                    </div>
                  </div>
                  
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                    {sub.name}
                  </h3>
                  <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">{sub.category}</p>
                </div>
              </button>
            ))}
            
            {filtered.length === 0 && (
              <div className="col-span-full py-20 text-center flex flex-col items-center">
                 <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-400">
                   <Search size={32} />
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No subjects found</h3>
                 <p className="text-slate-500 dark:text-slate-400">Try adjusting your search query.</p>
              </div>
            )}
          </div>

          {/* Practice History Modal */}
          {showHistoryModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
              <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl max-w-xl w-full p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 max-h-[85vh] flex flex-col min-w-0">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <History size={20} className="text-blue-600 dark:text-blue-400" />
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Your Practice History</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowHistoryModal(false)}
                    className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="overflow-y-auto flex-1 pr-1 space-y-3">
                  {isLoadingHistory ? (
                    <div className="py-12 text-center text-slate-500">
                      <Loader2 className="animate-spin mx-auto mb-2 text-blue-600" size={24} />
                      <p className="text-xs">Loading practice history...</p>
                    </div>
                  ) : practiceHistoryList.length === 0 ? (
                    <div className="py-10 text-center space-y-2">
                      <p className="font-bold text-slate-700 dark:text-slate-300">No practice attempts yet</p>
                      <p className="text-xs text-slate-500">Completed practice sessions will automatically appear here for review.</p>
                    </div>
                  ) : (
                    practiceHistoryList.map(session => (
                      <button
                        key={session.id}
                        type="button"
                        onClick={() => handleOpenPracticeHistoryItem(session)}
                        className="w-full text-left p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 hover:border-blue-300 dark:hover:border-blue-700 transition-all flex items-center justify-between gap-4 cursor-pointer group"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-slate-900 dark:text-white text-sm">
                              {session.subjectName || session.subject}
                            </span>
                            <span className="text-xs text-slate-400">
                              • {session.topic || 'General'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500">
                            {new Date(session.completedAt).toLocaleDateString()} • {Math.floor(session.timeUsedSeconds / 60)}m {session.timeUsedSeconds % 60}s
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <span className="text-base font-black text-blue-600 dark:text-blue-400">
                              {session.score} / {session.totalQuestions}
                            </span>
                            <p className="text-[11px] font-bold text-slate-500">{session.percentage}%</p>
                          </div>
                          <ChevronRight size={18} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="w-full max-w-2xl mx-auto pb-12 px-3 sm:px-4 min-w-0">
        <div className="mb-6 sm:mb-8 flex items-center justify-between gap-3">
          <button 
            id="quiz-back-to-step1"
            onClick={() => setSetupStep(1)} 
            className="p-2 sm:p-2.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors shrink-0 cursor-pointer"
          >
            <ArrowLeft size={22} />
          </button>
          <div className="text-center flex-1 min-w-0">
            <p className="text-xs font-bold tracking-wider text-blue-600 dark:text-blue-400 uppercase mb-1">
              Setup Practice
            </p>
            <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white truncate">Learndean Practice Session</h2>
          </div>
          <div className="w-9 shrink-0" />
        </div>
        
        <form onSubmit={handleGenerate} className="bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-5 sm:space-y-6 w-full min-w-0">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 rounded-2xl flex items-center gap-3">
            <BookOpen size={24} className="text-blue-600 dark:text-blue-400 shrink-0" />
            <div>
               <p className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider mb-0.5">Selected Subject</p>
               <p className="text-lg font-bold text-slate-900 dark:text-white">{subject}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Practice Mode</label>
              <select 
                value={practiceMode} 
                onChange={(e) => setPracticeMode(e.target.value)} 
                className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white font-medium"
              >
                <option>Quick Practice</option>
                <option>Topic Practice</option>
                <option>Random Practice</option>
                <option>Mistake Practice</option>
                <option>Custom Practice</option>
                <option>Timed Practice</option>
                <option>Exam Simulation</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Education Level</label>
              <select 
                value={level} 
                onChange={(e) => {
                  setLevel(e.target.value);
                  if (e.target.value === 'Primary') setSelectedClass('Primary 6');
                  else if (e.target.value === 'Secondary') setSelectedClass('SSS 3');
                  else setSelectedClass('100 Level');
                }} 
                className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white font-medium"
              >
                <option>Primary</option>
                <option>Secondary</option>
                <option>University</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Class / Level</label>
              {level === 'Primary' && (
                <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white font-medium">
                  {SUBJECT_DATA.Primary.classes.map(c => <option key={c}>{c}</option>)}
                </select>
              )}
              {level === 'Secondary' && (
                <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white font-medium">
                  {SUBJECT_DATA.Secondary.classes.map(c => <option key={c}>{c}</option>)}
                </select>
              )}
              {level === 'University' && (
                <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white font-medium">
                  {SUBJECT_DATA.University.classes.map(c => <option key={c}>{c}</option>)}
                </select>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Topic (Optional)</label>
              <input 
                type="text" 
                value={topic} 
                onChange={(e) => setTopic(e.target.value)} 
                placeholder="e.g., Algebra, Cellular Respiration" 
                className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white font-medium outline-none focus:border-blue-500" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Difficulty</label>
              <select 
                value={difficulty} 
                onChange={(e) => setDifficulty(e.target.value)} 
                className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white font-medium"
              >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
                <option>Mixed</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Number of Questions</label>
              <select 
                value={amount} 
                onChange={(e) => setAmount(Number(e.target.value))} 
                className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white font-medium"
              >
                <option value={20}>20 Questions</option>
                <option value={40}>40 Questions</option>
                <option value={60}>60 Questions</option>
                <option value={80}>80 Questions</option>
                <option value={100}>100 Questions</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Timer</label>
              <select 
                value={timerDuration} 
                onChange={(e) => setTimerDuration(Number(e.target.value))} 
                className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white font-medium"
              >
                <option value={10}>10 minutes</option>
                <option value={20}>20 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>60 minutes</option>
                <option value={90}>90 minutes</option>
              </select>
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-4 rounded-2xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm text-base"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Settings size={20} />}
            {loading ? 'Generating Questions...' : 'Start Practice Session'}
          </button>
        </form>
      </div>
    );
  }

  // Render 1.5: Insufficient Questions / Shortfall Notice (Guarantees CBT never starts with fewer questions)
  if (poolShortfallState) {
    return (
      <div className="w-full max-w-xl mx-auto p-4 sm:p-6 my-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-xl text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center mb-5">
            <AlertCircle size={32} />
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-2">
            Exam Question Pool Notice
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">
            You requested <span className="font-bold text-slate-900 dark:text-white">{poolShortfallState.requested} questions</span>, but only <span className="font-bold text-amber-600 dark:text-amber-400">{poolShortfallState.available} unique questions</span> are currently downloaded offline for this subject combination.
          </p>

          <div className="bg-slate-50 dark:bg-slate-900/60 rounded-2xl p-4 mb-6 text-left border border-slate-200 dark:border-slate-800 space-y-2 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex justify-between font-medium">
              <span>Target Question Count:</span>
              <span className="font-bold text-slate-900 dark:text-white">{poolShortfallState.requested} questions</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Downloaded Offline Pool:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">{poolShortfallState.available} questions</span>
            </div>
            <div className="flex justify-between font-medium border-t border-slate-200 dark:border-slate-800 pt-2">
              <span>Shortfall to Generate:</span>
              <span className="font-bold text-rose-600 dark:text-rose-400">{poolShortfallState.shortfall} questions</span>
            </div>
          </div>

          <div className="space-y-3">
            <button
              type="button"
              disabled={isGeneratingShortfall}
              onClick={handleGenerateShortfall}
              className="w-full py-4 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-2xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm text-sm sm:text-base"
            >
              {isGeneratingShortfall ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Generating {poolShortfallState.shortfall} Questions Online...</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  <span>Generate Missing {poolShortfallState.shortfall} Questions with AI</span>
                </>
              )}
            </button>

            {poolShortfallState.available > 0 && (
              <button
                type="button"
                disabled={isGeneratingShortfall}
                onClick={handleStartWithAvailable}
                className="w-full py-3.5 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white font-bold rounded-2xl transition-colors text-sm cursor-pointer"
              >
                Start Practice with Available ({poolShortfallState.available} Questions)
              </button>
            )}

            <button
              type="button"
              disabled={isGeneratingShortfall}
              onClick={() => {
                setPoolShortfallState(null);
                if (onBack) onBack();
                else setSetupMode(true);
              }}
              className="w-full py-3 px-4 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-semibold text-xs transition-colors cursor-pointer"
            >
              Cancel & Adjust Combination / Count
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Render 2: Dedicated Results Page (Requirement 11)
  if (viewMode === 'results') {
    const isJambCbt = subjectTabs.length > 1 || initialMode === 'jamb-cbt';
    const aggregateJambScore = Math.round((correctCount / (questions.length || 1)) * 400);

    return (
      <div className="w-full max-w-4xl mx-auto pb-16 px-3 sm:px-4 min-w-0">
        {/* Results Card */}
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-10 border border-slate-200 dark:border-slate-700 shadow-md text-center relative overflow-hidden w-full min-w-0"
        >
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs sm:text-sm font-bold mb-4 sm:mb-6">
            <Trophy size={18} className="text-blue-600 dark:text-blue-400" />
            {isJambCbt ? 'JAMB Mock CBT Completed' : 'Practice Session Completed'}
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
            {isJambCbt ? 'JAMB UTME Mock Exam Results' : subject}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-base font-medium mb-6 sm:mb-8">
            {isJambCbt 
              ? `${subjectTabs.length} Subjects • 400 Marks Total • Real CBT Marking`
              : `${topic ? `${topic} • ` : ''}${difficulty} Difficulty • ${questions.length} Questions`}
          </p>

          {/* Main Percentage & Score Display */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 py-5 sm:py-6 mb-6 sm:mb-8 border-y border-slate-100 dark:border-slate-700/60 w-full min-w-0">
            <div className="flex flex-col items-center shrink-0">
              <div className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full border-8 flex flex-col items-center justify-center ${
                percentage >= 70 
                  ? 'border-emerald-500 text-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/20' 
                  : percentage >= 50 
                    ? 'border-blue-500 text-blue-600 bg-blue-50/50 dark:bg-blue-950/20' 
                    : 'border-amber-500 text-amber-600 bg-amber-50/50 dark:bg-amber-950/20'
              }`}>
                <span className="text-2xl sm:text-3xl font-black">{isJambCbt ? aggregateJambScore : `${percentage}%`}</span>
                <span className="text-xs uppercase font-bold tracking-wider opacity-80">
                  {isJambCbt ? '/ 400' : 'Score'}
                </span>
              </div>
            </div>

            <div className="text-center sm:text-left space-y-2 min-w-0">
              <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                {percentage >= 75 ? 'Outstanding Performance!' : percentage >= 50 ? 'Good Effort!' : 'Keep Practicing!'}
              </p>
              <p className="text-slate-600 dark:text-slate-400 max-w-sm text-sm sm:text-base">
                You correctly answered <span className="font-bold text-slate-900 dark:text-white">{correctCount}</span> out of <span className="font-bold text-slate-900 dark:text-white">{questions.length}</span> questions ({percentage}%).
              </p>
            </div>
          </div>

          {/* If Multi-Subject CBT, render per-subject breakdown */}
          {subjectTabs.length > 1 && (
            <div className="mb-10 text-left">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <BookOpen size={18} className="text-blue-600" />
                Subject Performance Breakdown (Scaled to 100 per subject)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {subjectTabs.map((tab, idx) => {
                  const tabPct = Math.round((tab.correctCount / (tab.count || 1)) * 100);
                  return (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700">
                      <p className="font-bold text-sm text-slate-900 dark:text-white truncate">{tab.name}</p>
                      <div className="flex items-baseline justify-between mt-2">
                        <span className="text-2xl font-black text-blue-600 dark:text-blue-400">{tabPct}</span>
                        <span className="text-xs text-slate-500 font-medium">{tab.correctCount}/{tab.count} correct</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full mt-2 overflow-hidden">
                        <div 
                          className="bg-blue-600 h-full rounded-full transition-all" 
                          style={{ width: `${tabPct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-10 text-left w-full min-w-0">
            <div className="p-3 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 text-slate-500 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-1 truncate">
                <Award size={15} className="text-blue-500 shrink-0" /> <span className="truncate">Total Score</span>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                {correctCount} <span className="text-xs sm:text-sm font-medium text-slate-400">/ {questions.length}</span>
              </p>
            </div>

            <div className="p-3 sm:p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 text-emerald-600 dark:text-emerald-400 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-1 truncate">
                <CheckCircle2 size={15} className="shrink-0" /> <span className="truncate">Correct</span>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-emerald-700 dark:text-emerald-400">
                {correctCount}
              </p>
            </div>

            <div className="p-3 sm:p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 text-rose-600 dark:text-rose-400 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-1 truncate">
                <XCircle size={15} className="shrink-0" /> <span className="truncate">Incorrect</span>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-rose-700 dark:text-rose-400">
                {incorrectCount}
              </p>
            </div>

            <div className="p-3 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 text-slate-500 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-1 truncate">
                <Clock size={15} className="text-purple-500 shrink-0" /> <span className="truncate">Time Used</span>
              </div>
              <p className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white truncate">
                {formatTimeSpentString(timeUsedSeconds)}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center w-full min-w-0">
            <button
              id="quiz-results-review-button"
              onClick={() => {
                setCurrentQIndex(0);
                setViewMode('review');
              }}
              className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-colors shadow-sm flex items-center justify-center gap-2.5 text-sm sm:text-base cursor-pointer"
            >
              <Eye size={20} /> Review Answers
            </button>

            {initialConfig?.reviewSession ? (
              <button
                id="quiz-results-back-history-btn"
                onClick={() => {
                  if (onBack) onBack();
                  else setSetupMode(true);
                }}
                className="w-full sm:w-auto px-6 py-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white font-bold rounded-2xl transition-colors flex items-center justify-center gap-2 text-base cursor-pointer"
              >
                <ArrowLeft size={18} /> Back to History
              </button>
            ) : (
              <>
                <button
                  id="quiz-results-retake-button"
                  onClick={handleRetake}
                  className="w-full sm:w-auto px-6 py-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white font-bold rounded-2xl transition-colors flex items-center justify-center gap-2 text-base cursor-pointer"
                >
                  <RotateCcw size={18} /> Retake Practice
                </button>

                <button
                  id="quiz-results-new-button"
                  onClick={handleStartNew}
                  className="w-full sm:w-auto px-6 py-4 border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-2xl transition-colors flex items-center justify-center gap-2 text-base cursor-pointer"
                >
                  <Sparkles size={18} /> New Subject
                </button>
              </>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  // Reusable Questions Panel (Used for both Desktop sidebar and Mobile drawer)
  const renderQuestionsPanel = () => (
    <div className="bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-700 p-3 sm:p-5 flex flex-col h-full shadow-xs w-full min-w-0">
      <div className="flex justify-between items-center mb-3 sm:mb-4 shrink-0">
        <div>
          <h3 className="font-extrabold text-slate-900 dark:text-white text-sm sm:text-base">Questions</h3>
          <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
            {viewMode === 'review' ? 'Review questions' : `${answeredCount} of ${questions.length} Answered`}
          </p>
        </div>
        {showMobileNav && (
          <button 
            id="quiz-close-mobile-drawer"
            onClick={() => setShowMobileNav(false)} 
            className="lg:hidden p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Grid of question numbers */}
      <div className="flex-1 overflow-y-auto pr-1 min-h-0 py-1 w-full">
        <div className="grid grid-cols-5 gap-1.5 sm:gap-2 w-full min-w-0">
          {questions.map((q, i) => {
            const isAnswered = answers[i] !== undefined;
            const isMarked = markedForReview[i];
            const isCurrent = currentQIndex === i;
            
            let btnClass = "w-full aspect-square min-w-0 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center transition-all relative shrink-0 cursor-pointer ";
            
            if (isCurrent) {
              btnClass += "border-2 border-blue-600 ring-2 ring-blue-500/30 text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 font-black ";
            } else {
              btnClass += "border border-slate-200 dark:border-slate-700/80 ";
            }

            if (viewMode === 'review') {
              const isCorrect = isOptionCorrect(q, answers[i]);
              if (isCorrect) {
                btnClass += "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300 ";
              } else if (!isAnswered) {
                btnClass += "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 ";
              } else {
                btnClass += "bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-300 ";
              }
            } else {
              if (isAnswered) {
                btnClass += "bg-blue-600 text-white dark:bg-blue-600 dark:text-white border-blue-600 font-bold shadow-xs ";
              } else {
                btnClass += "bg-white text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 ";
              }
            }

            return (
              <button
                key={i}
                id={`quiz-question-number-${i + 1}`}
                onClick={() => jumpToQuestion(i)}
                className={btnClass}
              >
                {i + 1}
                {isMarked && viewMode !== 'review' && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border-2 border-white dark:border-slate-800 shadow-xs" />
                )}
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Legend & Summary (NO duplicate submit button here) */}
      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 shrink-0">
        {viewMode === 'review' ? (
          <div className="space-y-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-md bg-emerald-500 text-white flex items-center justify-center text-[9px] font-black">✓</div>
              <span>Correct ({correctCount})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-md bg-rose-500 text-white flex items-center justify-center text-[9px] font-black">✕</div>
              <span>Incorrect ({incorrectCount})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-md bg-slate-200 dark:bg-slate-700"></div>
              <span>Unanswered ({unansweredCount})</span>
            </div>
          </div>
        ) : (
          <div className="space-y-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-md bg-blue-600 border border-blue-600"></div>
                <span>Answered</span>
              </div>
              <span className="font-bold text-slate-900 dark:text-white">{answeredCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-md bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600"></div>
                <span>Unanswered</span>
              </div>
              <span className="font-bold text-slate-900 dark:text-white">{unansweredCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-amber-400"></div>
                <span>Marked for Review</span>
              </div>
              <span className="font-bold text-slate-900 dark:text-white">{Object.values(markedForReview).filter(Boolean).length}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-6xl mx-auto pb-12 flex flex-col relative px-3 sm:px-4">
      {/* Leave Prompt Modal */}
      {showLeavePrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border border-slate-100 dark:border-slate-700"
          >
            <div className="w-14 h-14 bg-rose-100 dark:bg-rose-900/30 text-rose-600 rounded-2xl flex items-center justify-center mb-5 mx-auto">
              <AlertCircle size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white text-center mb-2">Leave Session?</h3>
            <p className="text-slate-500 text-sm text-center mb-6">
              Your active progress will be discarded. Are you sure you want to exit?
            </p>
            <div className="flex gap-3">
              <button 
                id="quiz-leave-cancel-btn"
                onClick={() => setShowLeavePrompt(false)}
                className="flex-1 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold rounded-xl transition-colors text-sm cursor-pointer"
              >
                Continue Quiz
              </button>
              <button 
                id="quiz-leave-confirm-btn"
                onClick={handleLeavePractice}
                className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition-colors text-sm cursor-pointer"
              >
                Exit
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Submit Prompt Modal */}
      {showSubmitPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border border-slate-100 dark:border-slate-700"
          >
            <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-2xl flex items-center justify-center mb-5 mx-auto">
              <CheckCircle2 size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white text-center mb-2">Submit Quiz?</h3>
            <p className="text-slate-500 text-sm text-center mb-6">
              You have answered <span className="font-bold text-slate-900 dark:text-white">{answeredCount}</span> of <span className="font-bold text-slate-900 dark:text-white">{questions.length}</span> questions.
              {unansweredCount > 0 && (
                <span className="block mt-1 text-amber-600 dark:text-amber-400 font-medium">
                  {unansweredCount} question{unansweredCount > 1 ? 's' : ''} left unanswered.
                </span>
              )}
            </p>
            <div className="flex gap-3">
              <button 
                id="quiz-submit-modal-cancel"
                onClick={() => setShowSubmitPrompt(false)}
                className="flex-1 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold rounded-xl transition-colors text-sm cursor-pointer"
              >
                Keep Answering
              </button>
              <button 
                id="quiz-submit-modal-confirm"
                onClick={confirmSubmit}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors text-sm cursor-pointer"
              >
                Yes, Submit
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex items-center justify-between mb-6 shrink-0 gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <button 
            id="quiz-header-back-button"
            onClick={() => {
              if (initialConfig?.reviewSession) {
                if (onBack) onBack();
                else setSetupMode(true);
              } else if (viewMode === 'review') {
                setViewMode('results');
              } else {
                setShowLeavePrompt(true);
              }
            }}
            className="p-2.5 rounded-2xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={initialConfig?.reviewSession ? "Back to History" : "Go back"}
          >
            <ArrowLeft size={22} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                {currentSubjectTab?.name || subject}
              </h2>
              {viewMode === 'review' && (
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 text-xs font-bold">
                  Review Mode
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              {topic ? `${topic} • ` : ''}{difficulty} Difficulty
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* On-screen Calculator Button */}
          <button
            id="quiz-open-calculator-btn"
            type="button"
            onClick={() => setIsCalculatorOpen(prev => !prev)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-bold transition-colors cursor-pointer shadow-2xs"
            title="JAMB Calculator"
          >
            <Calculator size={16} className="text-blue-600 dark:text-blue-400" />
            <span className="hidden sm:inline">Calculator</span>
          </button>

          {/* Mobile Questions Sheet Trigger */}
          <button
            id="quiz-mobile-nav-toggle-btn"
            type="button"
            onClick={() => setShowMobileNav(true)}
            className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold cursor-pointer"
          >
            <Menu size={16} />
            <span>{answeredCount}/{questions.length}</span>
          </button>

          {viewMode === 'practice' ? (
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-2xl text-slate-700 dark:text-slate-300 font-mono font-bold text-sm shadow-2xs">
              <Clock size={16} className={!isUntimed && timerRemaining <= 180 ? 'text-rose-500 animate-pulse' : 'text-blue-600'} />
              <span className={!isUntimed && timerRemaining <= 180 ? 'text-rose-600 dark:text-rose-400' : ''}>
                {isUntimed ? `Untimed • ${formatTime(timeUsedSeconds)}` : formatTime(timerRemaining)}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300">
                <Clock size={14} className="text-blue-500" />
                <span>{formatTime(timeUsedSeconds)}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200/50 dark:border-emerald-800/40">
                <span>Score: {score}/{questions.length}</span>
              </div>
              <button
                id="quiz-back-to-results-btn"
                onClick={() => setViewMode('results')}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl text-xs sm:text-sm font-bold hover:bg-blue-100 transition-colors cursor-pointer"
              >
                Summary
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Multi-Subject Tabs (for JAMB CBT Mock with 4 subjects) */}
      {subjectTabs.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 no-scrollbar">
          {subjectTabs.map((tab, idx) => {
            const isActive = currentQIndex >= tab.startIndex && currentQIndex <= tab.endIndex;
            return (
              <button
                key={idx}
                type="button"
                id={`quiz-subject-tab-${idx}`}
                onClick={() => jumpToQuestion(tab.startIndex)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-xs' 
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                }`}
              >
                <span>{tab.name}</span>
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-black ${
                  isActive ? 'bg-blue-700 text-blue-100' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
                }`}>
                  {tab.answeredCount}/{tab.count}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Offline Status & Question Bank Management Banner */}
      <div id="jamboffline" className="space-y-2 mb-4">
        {!isOnline && (
          <div className="px-4 py-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3 text-xs font-semibold text-amber-800 dark:text-amber-200">
            <div className="flex items-center gap-2.5">
              <WifiOff size={16} className="shrink-0 text-amber-600 dark:text-amber-400" />
              <span>
                {isPoolLow 
                  ? "Connect to the internet to get more questions." 
                  : "Offline Mode: Practicing downloaded JAMB questions. Answers & history are saved locally and will sync when connected."}
              </span>
            </div>
            {unansweredPoolCount > 0 && (
              <span className="hidden sm:inline-block px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-900 dark:text-amber-100 font-bold text-[11px]">
                {unansweredPoolCount} new questions available
              </span>
            )}
          </div>
        )}

        {isOnline && isPoolLow && (
          <div className="px-4 py-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 flex flex-wrap items-center justify-between gap-3 text-xs font-semibold text-blue-800 dark:text-blue-200">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="shrink-0 text-blue-600 dark:text-blue-400" />
              <span>Offline question bank is running low for this subject.</span>
            </div>
            <button
              id="download-more-questions-btn"
              type="button"
              disabled={isDownloadingMore}
              onClick={handleDownloadMoreQuestions}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              {isDownloadingMore ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
              <span>Download More Questions (AI Powered)</span>
            </button>
          </div>
        )}

        {downloadFeedback && (
          <div className="px-4 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs font-bold text-emerald-800 dark:text-emerald-200 flex items-center justify-between">
            <span>{downloadFeedback}</span>
            <button type="button" onClick={() => setDownloadFeedback(null)} className="text-slate-400 hover:text-slate-600">
              <X size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Main Content Layout: Question Area + Desktop Sidebar */}
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 items-start w-full min-w-0">
        
        {/* Main Question Area (No internal scrollbar clamp) */}
        <div className="flex-1 w-full min-w-0" ref={questionCardRef}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-slate-200 dark:border-slate-700 shadow-xs w-full min-w-0"
            >
              {/* Question Card Header */}
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100 dark:border-slate-700/60 gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="inline-block px-3.5 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs sm:text-sm font-bold">
                    Question {currentQIndex + 1} of {questions.length}
                  </span>
                  {question.subject && (
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 hidden sm:inline">
                      {question.subject}
                    </span>
                  )}
                  {question.isAIgenerated || (question as any).sourceType === 'ai_generated' ? (
                    <span className="px-2 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-[11px] font-bold border border-indigo-200 dark:border-indigo-800/60 inline-flex items-center gap-1">
                      <Sparkles size={11} /> AI Practice Drill
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-[11px] font-bold border border-blue-200 dark:border-blue-800/60">
                      JAMB {question.year || 'Past Paper'}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {/* Bookmark Button */}
                  <button
                    id="quiz-toggle-bookmark-btn"
                    type="button"
                    onClick={toggleBookmarkCurrent}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
                      bookmarkedIds.has(question.id || `q-${currentQIndex}`)
                        ? 'bg-amber-100 text-amber-900 dark:bg-amber-950/50 dark:text-amber-300'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                    }`}
                    title="Bookmark Question"
                  >
                    <Bookmark size={15} className={bookmarkedIds.has(question.id || `q-${currentQIndex}`) ? 'fill-current text-amber-600' : ''} />
                    <span className="hidden sm:inline">
                      {bookmarkedIds.has(question.id || `q-${currentQIndex}`) ? 'Bookmarked' : 'Bookmark'}
                    </span>
                  </button>

                  {viewMode === 'practice' && (
                    <button 
                      id="quiz-toggle-mark-review"
                      onClick={toggleMarkReview}
                      className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
                        markedForReview[currentQIndex] 
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' 
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                      }`}
                    >
                      <Flag size={15} className={markedForReview[currentQIndex] ? 'fill-current' : ''} />
                      <span>{markedForReview[currentQIndex] ? 'Marked' : 'Mark for Review'}</span>
                    </button>
                  )}

                  {viewMode === 'review' && (
                    <div className="flex items-center gap-2">
                      {answers[currentQIndex] === undefined ? (
                        <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold">
                          Unanswered
                        </span>
                      ) : isOptionCorrect(question, answers[currentQIndex]) ? (
                        <span className="px-3 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-1">
                          <Check size={14} /> Correct
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-lg bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center gap-1">
                          <X size={14} /> Incorrect
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Comprehension Passage / Context if available (English/Literature) */}
              {question.passage && (
                <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 text-slate-800 dark:text-slate-200">
                  <p className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 mb-2">
                    Reading Passage / Context
                  </p>
                  <div className="text-sm sm:text-base leading-relaxed whitespace-pre-line italic">
                    {question.passage}
                  </div>
                </div>
              )}

              {/* Question Text (Full and clearly visible) */}
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-8 leading-relaxed break-words">
                {question.question}
              </h3>

              {/* Answer Options: Large clickable cards with "A. option text", etc. (Requirements 2, 3, 4, 12) */}
              <div className="space-y-3.5 mb-8">
                {question.options.map((option, index) => {
                  const letter = String.fromCharCode(65 + index);
                  const isSelected = answers[currentQIndex] === index;
                  const isCorrect = isOptionCorrect(question, index);
                  const isWrongSelection = isSelected && !isCorrect;
                  const cleanedText = formatOptionText(option);

                  let cardStyle = "border-2 transition-all duration-150 rounded-2xl p-3.5 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 cursor-pointer text-left w-full ";

                  if (viewMode === 'practice') {
                    if (isSelected) {
                      cardStyle += "border-blue-600 bg-blue-50/90 dark:bg-blue-950/40 text-blue-950 dark:text-blue-100 ring-2 ring-blue-600/30 shadow-xs ";
                    } else {
                      cardStyle += "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-slate-50/80 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 ";
                    }
                  } else {
                    // Review Mode Styling (Requirement 12)
                    if (isSelected && isCorrect) {
                      cardStyle += "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 ring-2 ring-emerald-500/20 ";
                    } else if (isSelected && !isCorrect) {
                      cardStyle += "border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-950 dark:text-rose-100 ring-2 ring-rose-500/20 ";
                    } else if (isCorrect) {
                      cardStyle += "border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 border-dashed ";
                    } else {
                      cardStyle += "border-slate-200 dark:border-slate-700 opacity-60 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 ";
                    }
                  }

                  return (
                    <button
                      key={index}
                      id={`quiz-option-${letter}`}
                      type="button"
                      disabled={viewMode === 'review'}
                      onClick={() => handleOptionClick(index)}
                      className={cardStyle}
                    >
                      <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                        {/* Letter Prefix: A. B. C. D. */}
                        <div className={`w-8 h-8 rounded-xl font-black text-sm flex items-center justify-center shrink-0 transition-colors ${
                          viewMode === 'practice'
                            ? (isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200')
                            : (isSelected && isCorrect ? 'bg-emerald-600 text-white' : isSelected && !isCorrect ? 'bg-rose-600 text-white' : isCorrect ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500')
                        }`}>
                          {letter}
                        </div>
                        
                        {/* Option Text */}
                        <span className="font-semibold text-base sm:text-lg leading-snug break-words">
                          {cleanedText}
                        </span>
                      </div>

                      {/* Right Indicator / Badges */}
                      <div className="shrink-0 flex items-center gap-2">
                        {viewMode === 'practice' ? (
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                            isSelected 
                              ? 'border-blue-600 bg-blue-600 text-white' 
                              : 'border-slate-300 dark:border-slate-600'
                          }`}>
                            {isSelected && <Check size={13} strokeWidth={3} />}
                          </div>
                        ) : (
                          <>
                            {isSelected && isCorrect && (
                              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 text-xs font-bold">
                                <Check size={14} /> Your Answer (Correct)
                              </span>
                            )}
                            {isSelected && !isCorrect && (
                              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-200 text-xs font-bold">
                                <X size={14} /> Your Answer (Incorrect)
                              </span>
                            )}
                            {!isSelected && isCorrect && (
                              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-100/80 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                                <Check size={14} /> Correct Answer
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Review Mode: Short Explanation & Flashcard (Requirement 12) */}
              {viewMode === 'review' && (
                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700">
                  <div className="p-5 sm:p-6 rounded-2xl bg-blue-50/70 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 space-y-3">
                    <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                      <BrainCircuit size={18} />
                      <h4 className="font-extrabold text-sm uppercase tracking-wider">Explanation</h4>
                    </div>

                    <div 
                      className="text-slate-800 dark:text-slate-200 text-sm sm:text-base leading-relaxed break-words"
                      dangerouslySetInnerHTML={{ __html: question.explanation || 'No explanation available.' }} 
                    />

                    {/* Turn Into Flashcard button for mistakes */}
                    {(!isOptionCorrect(question, answers[currentQIndex]) || answers[currentQIndex] === undefined) && (
                      <div className="pt-3 flex justify-end">
                        <button
                          id="quiz-turn-into-flashcard"
                          onClick={() => {
                            const correctIdx = getNormalizedCorrectIndex(question);
                            const flashcardData = {
                              subject,
                              topic,
                              front: question.question,
                              back: question.options[correctIdx] ? formatOptionText(question.options[correctIdx]) : '',
                              explanation: question.explanation
                            };
                            localStorage.setItem('zetadu_draft_flashcard', JSON.stringify(flashcardData));
                            if (setView) setView('flashcards');
                          }}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                        >
                          <BookOpen size={15} /> Turn Mistake into Flashcard
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Bottom Navigation Controls Bar */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-white dark:bg-slate-800 p-3.5 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
            {/* Previous and Next Buttons (Requirement 7) */}
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <button
                id="quiz-nav-prev-btn"
                onClick={handlePrev}
                disabled={currentQIndex === 0}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 sm:px-6 py-3 min-h-[44px] rounded-xl font-bold text-sm sm:text-base transition-colors bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ArrowLeft size={18} /> <span>Previous</span>
              </button>

              <button
                id="quiz-nav-next-btn"
                onClick={handleNext}
                disabled={currentQIndex === questions.length - 1}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 sm:px-6 py-3 min-h-[44px] rounded-xl font-bold text-sm sm:text-base transition-colors bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <span>Next</span> <ArrowRight size={18} />
              </button>
            </div>

            {/* Middle/Right: Mobile Questions Panel Toggle & ONLY ONE Submit Button (Requirements 5 & 14) */}
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
              {/* Mobile Drawer Trigger (Hidden on Desktop) */}
              <button 
                id="quiz-open-mobile-drawer-btn"
                onClick={() => setShowMobileNav(true)}
                className="lg:hidden flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3 sm:px-4 py-3 min-h-[44px] rounded-xl font-bold text-xs sm:text-sm transition-colors bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200 cursor-pointer"
              >
                <Menu size={18} />
                <span>Questions ({answeredCount}/{questions.length})</span>
              </button>

              {/* The ONLY Submit Quiz button in the entire view (Requirement 5) */}
              {viewMode === 'practice' && (
                <button
                  id="quiz-submit-single-button"
                  onClick={() => setShowSubmitPrompt(true)}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 sm:px-6 py-3 min-h-[44px] rounded-xl font-bold text-sm sm:text-base transition-colors bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer"
                >
                  <CheckCircle2 size={18} />
                  <span>Submit Quiz</span>
                </button>
              )}

              {viewMode === 'review' && (
                <button
                  id="quiz-review-back-to-summary"
                  onClick={() => setViewMode('results')}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 sm:px-5 py-3 min-h-[44px] rounded-xl font-bold text-sm transition-colors bg-blue-600 hover:bg-blue-700 text-white shadow-xs cursor-pointer"
                >
                  <span>Results Summary</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Desktop Sidebar Navigator (Hidden on Mobile screens, Sticky) */}
        <div className="hidden lg:block w-72 xl:w-80 shrink-0 sticky top-6 self-start">
          <div className="max-h-[calc(100vh-6rem)] flex flex-col">
            {renderQuestionsPanel()}
          </div>
        </div>

        {/* Mobile Collapsible Drawer Navigator (Requirement 14) */}
        <AnimatePresence>
          {showMobileNav && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 lg:hidden flex justify-end bg-slate-900/60 backdrop-blur-xs"
              onClick={() => setShowMobileNav(false)}
            >
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 26, stiffness: 280 }}
                className="w-[88vw] max-w-[320px] sm:max-w-sm bg-white dark:bg-slate-900 h-full p-2.5 sm:p-4 shadow-2xl overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {renderQuestionsPanel()}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* On-Screen Standard JAMB Calculator */}
      <JambCalculator 
        isOpen={isCalculatorOpen} 
        onClose={() => setIsCalculatorOpen(false)} 
      />
    </div>
  );
}
