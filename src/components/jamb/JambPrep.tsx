import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GraduationCap, 
  Calculator, 
  Clock, 
  Flag, 
  Bookmark, 
  BookmarkCheck, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ArrowLeft, 
  ArrowRight, 
  RotateCcw, 
  Trophy, 
  Award, 
  History, 
  Grid, 
  ChevronRight, 
  Sliders, 
  Check, 
  X, 
  Sparkles, 
  BookOpen, 
  Share2, 
  Trash2, 
  HelpCircle,
  BarChart3,
  Layers,
  ChevronDown,
  Wifi,
  WifiOff,
  Download,
  RefreshCw,
  HardDrive
} from 'lucide-react';
import { 
  JAMB_SUBJECTS, 
  JAMB_YEARS, 
  JAMB_QUESTIONS, 
  JambQuestion, 
  getJambQuestionsByFilter 
} from '../../data/jambQuestions';
import JambCalculator from './JambCalculator';
import { jambService, JambExamAttempt, BookmarkedJambQuestion } from '../../services/jambService';
import { jambOfflineDb, DownloadedSubjectMeta } from '../../services/jambOfflineDb';
import { useAuth } from '../../contexts/AuthContext';

interface JambPrepProps {
  onBack?: () => void;
  setView?: (v: any) => void;
}

type JambMode = 'setup' | 'exam' | 'results' | 'history' | 'bookmarks';

export default function JambPrep({ onBack, setView }: JambPrepProps) {
  const { user } = useAuth();

  // Mode state
  const [mode, setMode] = useState<JambMode>('setup');

  // Setup Form Options
  const [selectedSubject, setSelectedSubject] = useState<'english' | 'mathematics' | 'physics' | 'chemistry' | 'biology'>('mathematics');
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');
  const [questionCount, setQuestionCount] = useState<number>(20);
  const [examDurationMinutes, setExamDurationMinutes] = useState<number>(20); // 0 for untimed

  // Active Exam State
  const [questions, setQuestions] = useState<JambQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState<number>(1200);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState<boolean>(false);
  const [isPaletteOpen, setIsPaletteOpen] = useState<boolean>(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [timeSpentSeconds, setTimeSpentSeconds] = useState<number>(0);

  // Results State
  const [finalScore, setFinalScore] = useState<number>(0);
  const [reviewFilter, setReviewFilter] = useState<'all' | 'wrong' | 'correct' | 'flagged'>('all');

  // History & Bookmarks State
  const [historyList, setHistoryList] = useState<JambExamAttempt[]>([]);
  const [bookmarksList, setBookmarksList] = useState<BookmarkedJambQuestion[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [selectedHistoryAttempt, setSelectedHistoryAttempt] = useState<JambExamAttempt | null>(null);
  const [bookmarkSubjectFilter, setBookmarkSubjectFilter] = useState<string>('all');

  // Real Offline & Sync States
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [downloadedSubjects, setDownloadedSubjects] = useState<Map<string, DownloadedSubjectMeta>>(new Map());
  const [downloadProgress, setDownloadProgress] = useState<Record<string, { progress: number; current: number; total: number }>>({});
  const [unsyncedCount, setUnsyncedCount] = useState<number>(0);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncToastMessage, setSyncToastMessage] = useState<string | null>(null);
  const [offlineNoticeSubject, setOfflineNoticeSubject] = useState<string | null>(null);

  // Load initial bookmarks, history, and offline status
  useEffect(() => {
    loadHistoryAndBookmarks();
    loadDownloadedSubjects();
    loadUnsyncedCount();
  }, [user]);

  const loadDownloadedSubjects = async () => {
    try {
      const list = await jambOfflineDb.getDownloadedSubjects();
      const map = new Map<string, DownloadedSubjectMeta>();
      list.forEach(s => map.set(s.subjectId, s));
      setDownloadedSubjects(map);
    } catch (e) {
      console.warn('Failed to load downloaded subjects:', e);
    }
  };

  const loadUnsyncedCount = async () => {
    try {
      const count = await jambService.getUnsyncedCount();
      setUnsyncedCount(count);
    } catch (e) {
      console.warn('Failed to load unsynced count:', e);
    }
  };

  const loadHistoryAndBookmarks = async () => {
    try {
      const history = await jambService.getHistory();
      setHistoryList(history);

      const bookmarks = await jambService.getBookmarks();
      setBookmarksList(bookmarks);
      setBookmarkedIds(new Set(bookmarks.map(b => b.questionId)));
    } catch (e) {
      console.warn('Error loading JAMB history or bookmarks:', e);
    }
  };

  // Automatic Background Sync when internet returns (Strictly deduplicated)
  useEffect(() => {
    const handleOnlineEvent = async () => {
      setIsOnline(true);
      setIsSyncing(true);
      try {
        const res = await jambService.syncPendingData();
        if (res.syncedAttempts > 0 || res.syncedBookmarks > 0) {
          const totalSynced = res.syncedAttempts + res.syncedBookmarks;
          setSyncToastMessage(`Internet restored! Synced ${totalSynced} offline practice record${totalSynced > 1 ? 's' : ''} to Firebase.`);
          await loadHistoryAndBookmarks();
        }
      } catch (err) {
        console.warn('Auto sync on online failed:', err);
      } finally {
        setIsSyncing(false);
        loadUnsyncedCount();
      }
    };

    const handleOfflineEvent = () => {
      setIsOnline(false);
    };

    const handleSyncCompleteEvent = () => {
      loadHistoryAndBookmarks();
      loadUnsyncedCount();
    };

    window.addEventListener('online', handleOnlineEvent);
    window.addEventListener('offline', handleOfflineEvent);
    window.addEventListener('learndean-jamb-synced', handleSyncCompleteEvent);

    return () => {
      window.removeEventListener('online', handleOnlineEvent);
      window.removeEventListener('offline', handleOfflineEvent);
      window.removeEventListener('learndean-jamb-synced', handleSyncCompleteEvent);
    };
  }, []);

  // Background check for pending sync when online and user is active
  useEffect(() => {
    if (isOnline && user) {
      jambService.syncPendingData().then(res => {
        if (res.syncedAttempts > 0) {
          loadHistoryAndBookmarks();
        }
        loadUnsyncedCount();
      }).catch(() => {});
    }
  }, [user, isOnline]);

  // Auto-dismiss toast
  useEffect(() => {
    if (syncToastMessage) {
      const t = setTimeout(() => setSyncToastMessage(null), 5000);
      return () => clearTimeout(t);
    }
  }, [syncToastMessage]);

  // Manual Sync trigger
  const handleManualSync = async () => {
    if (!isOnline) {
      alert('You are currently offline. Please connect to the internet to sync offline records.');
      return;
    }
    setIsSyncing(true);
    try {
      const res = await jambService.syncPendingData();
      if (res.syncedAttempts > 0 || res.syncedBookmarks > 0) {
        setSyncToastMessage(`Synced ${res.syncedAttempts} attempts and ${res.syncedBookmarks} bookmarks to cloud!`);
      } else {
        setSyncToastMessage('All practice history is already synced with your cloud account.');
      }
      await loadHistoryAndBookmarks();
      await loadUnsyncedCount();
    } catch (e) {
      console.warn('Manual sync failed:', e);
    } finally {
      setIsSyncing(false);
    }
  };

  // Download Subject for Offline Practice
  const handleDownloadSubject = async (subjectId: string) => {
    const subjectMeta = JAMB_SUBJECTS.find(s => s.id === subjectId);
    setDownloadProgress(prev => ({
      ...prev,
      [subjectId]: { progress: 5, current: 0, total: subjectMeta?.totalStandardQuestions || 40 }
    }));

    try {
      await jambOfflineDb.downloadSubject(subjectId, (pct, current, total) => {
        setDownloadProgress(prev => ({
          ...prev,
          [subjectId]: { progress: pct, current, total }
        }));
      });
      await loadDownloadedSubjects();
      setSyncToastMessage(`${subjectMeta?.name || subjectId} downloaded and available offline.`);
    } catch (err: any) {
      console.error('Failed to download subject:', err);
      alert(`Could not download ${subjectMeta?.name}: ${err?.message || 'Please check your connection.'}`);
    } finally {
      setTimeout(() => {
        setDownloadProgress(prev => {
          const next = { ...prev };
          delete next[subjectId];
          return next;
        });
      }, 800);
    }
  };

  // Delete downloaded subject to free storage
  const handleDeleteSubjectDownload = async (subjectId: string) => {
    const subjectMeta = JAMB_SUBJECTS.find(s => s.id === subjectId);
    try {
      await jambOfflineDb.deleteDownloadedSubject(subjectId);
      await loadDownloadedSubjects();
      setSyncToastMessage(`Removed offline copy of ${subjectMeta?.name || subjectId}.`);
    } catch (err) {
      console.error('Failed to delete downloaded subject:', err);
    }
  };

  // Keyboard navigation for exam mode (A, B, C, D to answer, N for next, P for prev)
  useEffect(() => {
    if (mode !== 'exam' || questions.length === 0) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is in an input or calculator
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      const currentQ = questions[currentIndex];
      if (!currentQ) return;

      const key = e.key.toLowerCase();
      if (key === 'a' && currentQ.options[0]) handleSelectOption(currentQ.id, 0);
      else if (key === 'b' && currentQ.options[1]) handleSelectOption(currentQ.id, 1);
      else if (key === 'c' && currentQ.options[2]) handleSelectOption(currentQ.id, 2);
      else if (key === 'd' && currentQ.options[3]) handleSelectOption(currentQ.id, 3);
      else if (key === 'n' || key === 'arrowright') handleNextQuestion();
      else if (key === 'p' || key === 'arrowleft') handlePrevQuestion();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, questions, currentIndex, userAnswers]);

  // Exam Countdown Timer (runs independently of calculator)
  useEffect(() => {
    if (mode !== 'exam' || examDurationMinutes === 0) return;

    const timer = setInterval(() => {
      setTimeRemainingSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [mode, examDurationMinutes]);

  // Start CBT Exam
  const handleStartExam = async (customQuestions?: JambQuestion[], customTitle?: string) => {
    try {
      let examQuestions: JambQuestion[] = [];
      if (customQuestions) {
        examQuestions = customQuestions;
      } else {
        const res = await jambService.getQuestionsForExam(selectedSubject, selectedYear, questionCount);
        examQuestions = res.questions;
      }
      
      if (!examQuestions || examQuestions.length === 0) {
        alert('No questions found for the selected criteria. Please select a different year or subject.');
        return;
      }

      setQuestions(examQuestions);
      setCurrentIndex(0);
      setUserAnswers({});
      setFlaggedQuestions({});
      
      const duration = examDurationMinutes > 0 ? examDurationMinutes * 60 : 0;
      setTimeRemainingSeconds(duration);
      setStartTime(Date.now());
      setTimeSpentSeconds(0);
      setShowSubmitConfirm(false);
      setIsCalculatorOpen(false);
      setMode('exam');
    } catch (err: any) {
      const subj = JAMB_SUBJECTS.find(s => s.id === selectedSubject);
      setOfflineNoticeSubject(subj?.name || selectedSubject);
    }
  };

  // Start practicing bookmarked questions
  const handleStartBookmarkedExam = () => {
    const filtered = bookmarkSubjectFilter === 'all' 
      ? bookmarksList 
      : bookmarksList.filter(b => b.subject === bookmarkSubjectFilter);

    if (filtered.length === 0) {
      alert('You have no bookmarked questions in this category.');
      return;
    }

    const bookmarkedQuestions = filtered.map(b => b.question);
    handleStartExam(bookmarkedQuestions, 'Bookmarked Practice');
  };

  // Option selection
  const handleSelectOption = (questionId: string, optionIndex: number) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  // Navigation
  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleToggleFlag = (questionId: string) => {
    setFlaggedQuestions(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  // Bookmark Toggle
  const handleToggleBookmark = async (question: JambQuestion) => {
    try {
      const isNowSaved = await jambService.toggleBookmark(question);
      setBookmarkedIds(prev => {
        const next = new Set(prev);
        if (isNowSaved) next.add(question.id);
        else next.delete(question.id);
        return next;
      });
      // Refresh bookmarks list
      const updated = await jambService.getBookmarks();
      setBookmarksList(updated);
    } catch (e) {
      console.error('Failed to toggle bookmark:', e);
    }
  };

  // Submit Exam
  const handleSubmitExam = async () => {
    setShowSubmitConfirm(false);
    setIsCalculatorOpen(false);

    // Calculate score
    let score = 0;
    questions.forEach(q => {
      if (userAnswers[q.id] !== undefined && userAnswers[q.id] === q.correctAnswer) {
        score++;
      }
    });

    const total = questions.length;
    const percentage = Math.round((score / total) * 100);
    const elapsedSeconds = Math.max(1, Math.round((Date.now() - startTime) / 1000));

    setFinalScore(score);
    setTimeSpentSeconds(elapsedSeconds);

    const subjectMeta = JAMB_SUBJECTS.find(s => s.id === selectedSubject);

    // Save to practice history
    try {
      await jambService.saveAttempt({
        subject: selectedSubject,
        subjectName: subjectMeta?.name || selectedSubject,
        year: selectedYear,
        score,
        totalQuestions: total,
        percentage,
        timeSpentSeconds: elapsedSeconds,
        answers: userAnswers,
        questions
      });
      await loadHistoryAndBookmarks();
      await loadUnsyncedCount();
    } catch (e) {
      console.warn('Could not save attempt to history:', e);
    }

    setMode('results');
  };

  // Retake current exam
  const handleRetakeExam = () => {
    setCurrentIndex(0);
    setUserAnswers({});
    setFlaggedQuestions({});
    const duration = examDurationMinutes > 0 ? examDurationMinutes * 60 : 0;
    setTimeRemainingSeconds(duration);
    setStartTime(Date.now());
    setMode('exam');
  };

  // Format timer
  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = questions[currentIndex];
  const currentSubjectMeta = JAMB_SUBJECTS.find(s => s.id === (currentQuestion?.subject || selectedSubject));
  const answeredCount = Object.keys(userAnswers).length;
  const flaggedCount = Object.values(flaggedQuestions).filter(Boolean).length;
  const unansweredCount = questions.length - answeredCount;

  // -------------------------------------------------------------
  // RENDER: SETUP / HUB
  // -------------------------------------------------------------
  if (mode === 'setup') {
    return (
      <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8 space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                title="Back"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 uppercase tracking-wider">
                  UTME CBT Portal
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">Authentic Past Papers</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
                JAMB CBT Exam Prep
              </h1>
            </div>
          </div>

          {/* Quick Tab Switcher & Offline Status */}
          <div className="flex flex-wrap items-center gap-2">
            {!isOnline ? (
              <span className="px-2.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-xs font-bold flex items-center gap-1.5 shadow-2xs">
                <WifiOff size={13} className="text-amber-600" />
                <span>Offline Mode</span>
              </span>
            ) : unsyncedCount > 0 ? (
              <button
                type="button"
                onClick={handleManualSync}
                disabled={isSyncing}
                className="px-2.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors shadow-2xs"
                title="Click to sync offline attempts to Firebase"
              >
                <RefreshCw size={13} className={isSyncing ? "animate-spin text-blue-600" : "text-blue-600"} />
                <span>{unsyncedCount} unsynced • Sync</span>
              </button>
            ) : (
              <span className="hidden sm:flex px-2.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold items-center gap-1.5">
                <Wifi size={13} className="text-emerald-500" />
                <span>Cloud Connected</span>
              </span>
            )}

            <button
              type="button"
              onClick={() => setMode('history')}
              className="px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-blue-500 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <History size={16} className="text-blue-600 dark:text-blue-400" />
              <span>History</span>
              {historyList.length > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-700 text-[10px]">
                  {historyList.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setMode('bookmarks')}
              className="px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-amber-500 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Bookmark size={16} className="text-amber-500" />
              <span>Saved Questions</span>
              {bookmarksList.length > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 text-[10px] font-bold">
                  {bookmarksList.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Sync Toast Notification */}
        {syncToastMessage && (
          <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-between gap-3 text-xs text-blue-900 dark:text-blue-100 shadow-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-blue-600 dark:text-blue-400 shrink-0" />
              <span className="font-semibold">{syncToastMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setSyncToastMessage(null)}
              className="text-blue-400 hover:text-blue-600 p-1 cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* Offline Notice Dialog when subject not downloaded */}
        {offlineNoticeSubject && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
                <WifiOff size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Subject Not Downloaded Offline
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                  You are currently offline. <strong>{offlineNoticeSubject}</strong> hasn't been downloaded to your device yet.
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  Connect to the internet to download this subject, or choose a downloaded subject (marked with <span className="text-emerald-600 font-semibold">Available Offline</span>) to practice right now.
                </p>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setOfflineNoticeSubject(null)}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Got It
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Feature Highlights Banner */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={18} className="text-amber-300" />
              <span className="text-xs font-bold uppercase tracking-widest text-blue-200">
                Official Standard CBT Simulator
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mb-2">
              Master the 5 Key JAMB Subjects with Verified Solutions
            </h2>
            <p className="text-sm text-blue-100 mb-4 leading-relaxed">
              Practice authentic UTME questions organized by actual past years, experience the real exam timer, use the interactive Mathematics calculator, and bookmark challenging questions for targeted revision.
            </p>

            <div className="flex flex-wrap gap-2 text-xs font-medium">
              <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs flex items-center gap-1.5">
                <Calculator size={14} className="text-amber-300" />
                In-Question Calculator for Maths
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs flex items-center gap-1.5">
                <Clock size={14} className="text-emerald-300" />
                Standard CBT Countdown Timer
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-blue-300" />
                Step-by-Step Explanations
              </span>
            </div>
          </div>
        </div>

        {/* Exam Setup Configuration Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <Sliders size={20} className="text-blue-600 dark:text-blue-400" />
              <h3 className="font-bold text-slate-900 dark:text-white">Exam Configuration</h3>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">Step 1 of 1</span>
          </div>

          {/* 1. Subject Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              1. Select JAMB Subject
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {JAMB_SUBJECTS.map(subj => {
                const isSelected = selectedSubject === subj.id;
                const isDownloaded = downloadedSubjects.has(subj.id);
                const downloadState = downloadProgress[subj.id];
                const isDownloading = Boolean(downloadState);

                return (
                  <div
                    key={subj.id}
                    onClick={() => setSelectedSubject(subj.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedSubject(subj.id);
                      }
                    }}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/20 ring-2 ring-blue-600/30'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-800/60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`px-2 py-0.5 rounded-md text-[11px] font-extrabold border ${subj.badgeBg}`}>
                          {subj.code}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {subj.hasCalculator && (
                            <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1 bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">
                              <Calculator size={11} /> Calc Included
                            </span>
                          )}
                          {isSelected && (
                            <span className="text-blue-600 dark:text-blue-400 font-bold flex items-center gap-0.5 text-[11px]">
                              <Check size={14} /> Selected
                            </span>
                          )}
                        </div>
                      </div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-base">
                        {subj.name}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                        {subj.description}
                      </p>
                    </div>

                    {/* Offline Storage Status & Download Control */}
                    <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-700/60">
                      {isDownloading ? (
                        <div className="space-y-1.5 py-0.5">
                          <div className="flex items-center justify-between text-[11px] font-bold text-blue-600 dark:text-blue-400">
                            <span className="flex items-center gap-1">
                              <RefreshCw size={11} className="animate-spin" />
                              Downloading...
                            </span>
                            <span>{downloadState.progress}%</span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className="bg-blue-600 h-full transition-all duration-200 rounded-full" 
                              style={{ width: `${downloadState.progress}%` }} 
                            />
                          </div>
                        </div>
                      ) : isDownloaded ? (
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md border border-emerald-200/70 dark:border-emerald-800/40">
                            <CheckCircle2 size={12} className="text-emerald-600" />
                            Available Offline
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteSubjectDownload(subj.id);
                            }}
                            className="text-slate-400 hover:text-rose-500 p-1 rounded-md hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                            title="Remove offline questions to free storage"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-slate-400">
                            Paper: {subj.totalStandardQuestions} Qs
                          </span>
                          <button
                            type="button"
                            disabled={!isOnline}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownloadSubject(subj.id);
                            }}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                              isOnline
                                ? 'bg-slate-100 dark:bg-slate-700/80 hover:bg-blue-50 dark:hover:bg-blue-900/40 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-300 border border-slate-200/80 dark:border-slate-700 cursor-pointer'
                                : 'opacity-40 cursor-not-allowed text-slate-400 bg-slate-100 dark:bg-slate-800'
                            }`}
                            title={isOnline ? "Download subject questions and solutions for offline practice" : "Connect to internet to download"}
                          >
                            <Download size={11} />
                            <span>Download Offline</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. Year & Question Count Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
            {/* Year Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                2. Past Question Year
              </label>
              <select
                value={selectedYear}
                onChange={e => setSelectedYear(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
              >
                <option value="all">All Years (Comprehensive Mix)</option>
                {JAMB_YEARS.map(yr => (
                  <option key={yr} value={yr}>JAMB {yr} Past Paper</option>
                ))}
              </select>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
                Authentic examination questions from official UTME papers.
              </p>
            </div>

            {/* Question Count */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                3. Number of Questions
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[10, 20, 40, 60].map(count => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setQuestionCount(count)}
                    className={`py-2.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer text-center ${
                      questionCount === count
                        ? 'border-blue-600 bg-blue-600 text-white shadow-xs'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    {count} Qs
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
                {questionCount === 40 ? 'Standard JAMB Science/Math length' : questionCount === 60 ? 'Standard JAMB English length' : 'Quick revision drill'}
              </p>
            </div>

            {/* Timer Settings */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                4. Exam Timer
              </label>
              <select
                value={examDurationMinutes}
                onChange={e => setExamDurationMinutes(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
              >
                <option value={15}>15 Minutes (Speed Drill)</option>
                <option value={20}>20 Minutes (Recommended)</option>
                <option value={30}>30 Minutes (Standard)</option>
                <option value={45}>45 Minutes (Full UTME Pace)</option>
                <option value={60}>60 Minutes (Deep Practice)</option>
                <option value={0}>Untimed (Study Mode)</option>
              </select>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
                Simulates standard computer-based test countdown pressure.
              </p>
            </div>
          </div>

          {/* Launch Action */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>
                Ready to practice <strong>{questionCount} questions</strong> for{' '}
                <strong>{JAMB_SUBJECTS.find(s => s.id === selectedSubject)?.name}</strong>
              </span>
            </div>

            <button
              type="button"
              onClick={() => handleStartExam()}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.02]"
            >
              <span>Start CBT Exam</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* Recent Practice History Sneak Peek */}
        {historyList.length > 0 && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <History size={18} className="text-blue-600 dark:text-blue-400" />
                <h3 className="font-bold text-slate-900 dark:text-white">Recent JAMB CBT Attempts</h3>
              </div>
              <button
                type="button"
                onClick={() => setMode('history')}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                View all ({historyList.length})
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {historyList.slice(0, 3).map(attempt => (
                <div
                  key={attempt.id}
                  className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {attempt.subjectName}
                      </span>
                      <span className={`text-xs font-extrabold ${
                        attempt.percentage >= 70 ? 'text-emerald-600 dark:text-emerald-400' : 'text-blue-600 dark:text-blue-400'
                      }`}>
                        {attempt.percentage}%
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Score: {attempt.score} / {attempt.totalQuestions} • {new Date(attempt.completedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedHistoryAttempt(attempt);
                      setQuestions(attempt.questions);
                      setUserAnswers(attempt.answers);
                      setFinalScore(attempt.score);
                      setTimeSpentSeconds(attempt.timeSpentSeconds);
                      setMode('results');
                    }}
                    className="mt-3 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Review answers & explanations</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER: EXAM MODE (CBT EXAMINATION HALL)
  // -------------------------------------------------------------
  if (mode === 'exam' && currentQuestion) {
    const isCurrentFlagged = Boolean(flaggedQuestions[currentQuestion.id]);
    const isCurrentBookmarked = bookmarkedIds.has(currentQuestion.id);
    const selectedOption = userAnswers[currentQuestion.id];
    const isTimeUrgent = examDurationMinutes > 0 && timeRemainingSeconds < 300; // less than 5 min

    return (
      <div className="min-h-screen pb-24 max-w-5xl mx-auto px-3 sm:px-6 py-4 space-y-4">
        {/* Top Floating Exam Bar */}
        <div className="sticky top-2 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl p-3 sm:p-4 shadow-lg flex items-center justify-between gap-2">
          {/* Subject & Year */}
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-lg text-xs font-extrabold uppercase border ${currentSubjectMeta?.badgeBg}`}>
              {currentSubjectMeta?.code || 'JAMB'}
            </span>
            <div className="hidden sm:block">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-none">
                {currentQuestion.subjectName}
              </h3>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                JAMB {currentQuestion.year} • Q{currentIndex + 1} of {questions.length}
              </span>
            </div>
          </div>

          {/* Middle: Timer */}
          {examDurationMinutes > 0 ? (
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-sm sm:text-base font-extrabold border shadow-xs ${
              isTimeUrgent
                ? 'bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 animate-pulse'
                : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
            }`}>
              <Clock size={16} className={isTimeUrgent ? 'text-red-600 animate-spin' : 'text-slate-500'} />
              <span>{formatTimer(timeRemainingSeconds)}</span>
            </div>
          ) : (
            <div className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-500">
              Untimed Practice
            </div>
          )}

          {/* Right: Quick Tools */}
          <div className="flex items-center gap-1.5">
            {/* IN-QUESTION CALCULATOR BUTTON: Especially highlighted for Mathematics! */}
            <button
              type="button"
              onClick={() => setIsCalculatorOpen(prev => !prev)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                currentSubjectMeta?.hasCalculator
                  ? 'bg-blue-600 hover:bg-blue-700 text-white ring-2 ring-blue-400/40'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
              title="Open Scientific Calculator (Timer continues running)"
            >
              <Calculator size={15} />
              <span className="hidden sm:inline">Calculator</span>
            </button>

            {/* Bookmark Question */}
            <button
              type="button"
              onClick={() => handleToggleBookmark(currentQuestion)}
              className={`p-2 rounded-xl transition-colors cursor-pointer border ${
                isCurrentBookmarked
                  ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 text-amber-500'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
              title={isCurrentBookmarked ? 'Remove Bookmark' : 'Bookmark Question'}
            >
              {isCurrentBookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
            </button>

            {/* Question Palette Toggle */}
            <button
              type="button"
              onClick={() => setIsPaletteOpen(prev => !prev)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
              title="Toggle Question Navigation Grid"
            >
              <Grid size={18} />
            </button>

            {/* Submit Exam Button */}
            <button
              type="button"
              onClick={() => setShowSubmitConfirm(true)}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
            >
              Submit
            </button>
          </div>
        </div>

        {/* Question Palette Drawer (Collapsible) */}
        <AnimatePresence>
          {isPaletteOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-md overflow-hidden"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Grid size={14} />
                  Question Navigation ({answeredCount}/{questions.length} Answered)
                </h4>
                <div className="flex items-center gap-3 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span> Answered
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> Flagged
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span> Skipped
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 gap-1.5 max-h-48 overflow-y-auto p-1">
                {questions.map((q, idx) => {
                  const isAns = userAnswers[q.id] !== undefined;
                  const isFlg = flaggedQuestions[q.id];
                  const isCur = currentIndex === idx;

                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => {
                        setCurrentIndex(idx);
                        setIsPaletteOpen(false);
                      }}
                      className={`h-9 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center justify-center relative ${
                        isCur
                          ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900'
                          : ''
                      } ${
                        isFlg
                          ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-700'
                          : isAns
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {idx + 1}
                      {isFlg && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Question Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-8 shadow-sm space-y-6">
          {/* Question Header & Topic */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-3 py-1 rounded-xl border border-blue-200 dark:border-blue-900/50">
                Question {currentIndex + 1}
              </span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {currentQuestion.topic}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleToggleFlag(currentQuestion.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-colors cursor-pointer ${
                  isCurrentFlagged
                    ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-300 dark:border-purple-800 text-purple-600 dark:text-purple-300 font-bold'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-700'
                }`}
              >
                <Flag size={14} className={isCurrentFlagged ? 'fill-purple-500 text-purple-500' : ''} />
                <span>{isCurrentFlagged ? 'Flagged for Review' : 'Flag'}</span>
              </button>
            </div>
          </div>

          {/* Reading Passage if available */}
          {currentQuestion.passage && (
            <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/30 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-serif">
              <h5 className="font-sans font-bold text-xs uppercase tracking-wider text-amber-800 dark:text-amber-300 mb-2">
                Reading Passage
              </h5>
              <p>{currentQuestion.passage}</p>
            </div>
          )}

          {/* Question Text */}
          <div className="text-base sm:text-lg font-medium text-slate-900 dark:text-white leading-relaxed whitespace-pre-line">
            {currentQuestion.question}
          </div>

          {/* Options (A, B, C, D) */}
          <div className="space-y-3 pt-2">
            {currentQuestion.options.map((option, optIdx) => {
              const optLetter = String.fromCharCode(65 + optIdx); // A, B, C, D
              const isSelected = selectedOption === optIdx;

              return (
                <button
                  key={optIdx}
                  type="button"
                  onClick={() => handleSelectOption(currentQuestion.id, optIdx)}
                  className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3.5 ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/30 ring-2 ring-blue-600/30'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-850'
                  }`}
                >
                  <span className={`w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center shrink-0 border transition-colors ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}>
                    {optLetter}
                  </span>
                  <span className="text-sm sm:text-base font-normal text-slate-800 dark:text-slate-200 pt-0.5 leading-snug">
                    {option}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Clear Option if selected */}
          {selectedOption !== undefined && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setUserAnswers(prev => {
                    const copy = { ...prev };
                    delete copy[currentQuestion.id];
                    return copy;
                  });
                }}
                className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 underline cursor-pointer"
              >
                Clear choice
              </button>
            </div>
          )}
        </div>

        {/* Bottom Exam Navigation Controls */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={handlePrevQuestion}
            disabled={currentIndex === 0}
            className="px-5 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Previous</span>
          </button>

          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {answeredCount} of {questions.length} answered
          </div>

          {currentIndex < questions.length - 1 ? (
            <button
              type="button"
              onClick={handleNextQuestion}
              className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-colors flex items-center gap-2 cursor-pointer shadow-md shadow-blue-500/20"
            >
              <span>Next</span>
              <ArrowRight size={16} />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowSubmitConfirm(true)}
              className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-colors flex items-center gap-2 cursor-pointer shadow-md shadow-emerald-500/20"
            >
              <span>Review & Submit</span>
              <CheckCircle2 size={16} />
            </button>
          )}
        </div>

        {/* IN-QUESTION SCIENTIFIC CALCULATOR (Opens without leaving question or pausing timer) */}
        <JambCalculator
          isOpen={isCalculatorOpen}
          onClose={() => setIsCalculatorOpen(false)}
          initialMode="scientific"
        />

        {/* Submit Confirmation Dialog */}
        <AnimatePresence>
          {showSubmitConfirm && (
            <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5"
              >
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                    <AlertCircle size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      Confirm Examination Submission
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Are you sure you want to finish this CBT session?
                    </p>
                  </div>
                </div>

                {/* Breakdown */}
                <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 text-center">
                  <div>
                    <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{answeredCount}</span>
                    <p className="text-[10px] text-slate-500 uppercase font-semibold">Answered</p>
                  </div>
                  <div>
                    <span className="text-lg font-bold text-amber-500">{unansweredCount}</span>
                    <p className="text-[10px] text-slate-500 uppercase font-semibold">Unanswered</p>
                  </div>
                  <div>
                    <span className="text-lg font-bold text-purple-600 dark:text-purple-400">{flaggedCount}</span>
                    <p className="text-[10px] text-slate-500 uppercase font-semibold">Flagged</p>
                  </div>
                </div>

                {unansweredCount > 0 && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 p-2.5 rounded-xl border border-amber-200 dark:border-amber-900/40">
                    Warning: You still have {unansweredCount} unanswered questions. Unanswered questions receive 0 marks.
                  </p>
                )}

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowSubmitConfirm(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Return to Exam
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmitExam}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-md shadow-emerald-500/20"
                  >
                    Yes, Submit Now
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER: RESULTS & EXPLANATIONS SCREEN
  // -------------------------------------------------------------
  if (mode === 'results') {
    const total = questions.length;
    const percentage = Math.round((finalScore / total) * 100);
    // Scaled JAMB mark simulation (JAMB subjects are out of 100)
    const scaledScore = Math.round((finalScore / total) * 100);
    const correctCount = finalScore;
    const incorrectCount = answeredCount - correctCount;

    // Filter questions for review
    const filteredQuestions = questions.filter(q => {
      const userChoice = userAnswers[q.id];
      const isCorrect = userChoice === q.correctAnswer;
      const isFlagged = flaggedQuestions[q.id];

      if (reviewFilter === 'wrong') return userChoice !== undefined && !isCorrect;
      if (reviewFilter === 'correct') return isCorrect;
      if (reviewFilter === 'flagged') return isFlagged;
      return true;
    });

    return (
      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6">
        {/* Results Top Header */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setMode('setup')}
            className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Back to JAMB Hub</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRetakeExam}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw size={14} />
              <span>Retake Exam</span>
            </button>
          </div>
        </div>

        {/* Score Card Banner */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left space-y-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                Examination Report • {currentSubjectMeta?.name}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {percentage >= 70 ? 'Excellent Performance!' : percentage >= 50 ? 'Good Practice Session!' : 'Keep Practicing!'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md">
                Review your detailed question breakdowns below. Every question contains step-by-step verified explanations.
              </p>
            </div>

            {/* Score Display Circle / Badge */}
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center justify-center p-5 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-700 text-white shadow-xl shadow-blue-500/20 w-36 h-36">
                <span className="text-3xl font-extrabold tracking-tight leading-none">{percentage}%</span>
                <span className="text-xs font-medium text-blue-100 mt-1">{finalScore} / {total} Correct</span>
                <div className="mt-2 text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full">
                  Scaled: {scaledScore}/100
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{correctCount}</span>
              <p className="text-[11px] text-slate-500 font-medium">Correct Answers</p>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
              <span className="text-sm font-bold text-rose-500">{incorrectCount}</span>
              <p className="text-[11px] text-slate-500 font-medium">Incorrect</p>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
              <span className="text-sm font-bold text-amber-500">{unansweredCount}</span>
              <p className="text-[11px] text-slate-500 font-medium">Skipped</p>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                {Math.floor(timeSpentSeconds / 60)}m {timeSpentSeconds % 60}s
              </span>
              <p className="text-[11px] text-slate-500 font-medium">Time Taken</p>
            </div>
          </div>
        </div>

        {/* Detailed Solutions Section */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen size={18} className="text-blue-600 dark:text-blue-400" />
              <span>Step-by-Step Question Review & Solutions</span>
            </h3>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {[
                { id: 'all', label: `All (${questions.length})` },
                { id: 'wrong', label: `Incorrect (${incorrectCount})` },
                { id: 'correct', label: `Correct (${correctCount})` },
                { id: 'flagged', label: `Flagged (${flaggedCount})` }
              ].map(f => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setReviewFilter(f.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    reviewFilter === f.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* List of Explanations */}
          <div className="space-y-4">
            {filteredQuestions.map((q, idx) => {
              const userChoice = userAnswers[q.id];
              const isCorrect = userChoice === q.correctAnswer;
              const isBookmarked = bookmarkedIds.has(q.id);

              return (
                <div
                  key={q.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4"
                >
                  {/* Top Bar of Review Card */}
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs ${
                        isCorrect
                          ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400'
                          : userChoice === undefined
                          ? 'bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400'
                          : 'bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400'
                      }`}>
                        {idx + 1}
                      </span>
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        {q.topic} • JAMB {q.year}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        isCorrect
                          ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                          : userChoice === undefined
                          ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                          : 'bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                      }`}>
                        {isCorrect ? 'Correct' : userChoice === undefined ? 'Skipped' : 'Incorrect'}
                      </span>

                      {/* Bookmark action inside review */}
                      <button
                        type="button"
                        onClick={() => handleToggleBookmark(q)}
                        className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                          isBookmarked
                            ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 text-amber-500'
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600'
                        }`}
                        title={isBookmarked ? 'Bookmarked' : 'Bookmark this question'}
                      >
                        <Bookmark size={15} className={isBookmarked ? 'fill-amber-500' : ''} />
                      </button>
                    </div>
                  </div>

                  {/* Question Text */}
                  <div className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white leading-relaxed whitespace-pre-line">
                    {q.question}
                  </div>

                  {/* Options with Status */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options.map((opt, oIdx) => {
                      const optLetter = String.fromCharCode(65 + oIdx);
                      const isCorrectAnswer = oIdx === q.correctAnswer;
                      const isChosenAnswer = oIdx === userChoice;

                      let badgeStyle = 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300';
                      if (isCorrectAnswer) {
                        badgeStyle = 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-semibold ring-1 ring-emerald-500/30';
                      } else if (isChosenAnswer && !isCorrect) {
                        badgeStyle = 'border-rose-500 bg-rose-50/70 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 line-through';
                      }

                      return (
                        <div
                          key={oIdx}
                          className={`p-3 rounded-xl border text-xs sm:text-sm flex items-start gap-2.5 ${badgeStyle}`}
                        >
                          <span className="font-bold shrink-0">{optLetter}.</span>
                          <span className="leading-snug">{opt}</span>
                          {isCorrectAnswer && (
                            <CheckCircle2 size={16} className="text-emerald-600 ml-auto shrink-0" />
                          )}
                          {isChosenAnswer && !isCorrect && (
                            <XCircle size={16} className="text-rose-500 ml-auto shrink-0" />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Deep Step-by-Step Educational Explanation */}
                  <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700 dark:text-blue-300">
                      <Sparkles size={14} />
                      <span>JAMB Marking Guide & Explanation:</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-mono">
                      {q.explanation}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER: PRACTICE HISTORY
  // -------------------------------------------------------------
  if (mode === 'history') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setMode('setup')}
            className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Back to JAMB Hub</span>
          </button>
          <div className="flex items-center gap-2">
            {!isOnline ? (
              <span className="px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-xs font-bold flex items-center gap-1">
                <WifiOff size={12} /> Offline
              </span>
            ) : unsyncedCount > 0 ? (
              <button
                type="button"
                onClick={handleManualSync}
                disabled={isSyncing}
                className="px-2.5 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw size={12} className={isSyncing ? "animate-spin" : ""} />
                <span>Sync {unsyncedCount}</span>
              </button>
            ) : null}
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <History size={18} className="text-blue-600" />
              <span>Practice History</span>
            </h2>
          </div>
        </div>

        {/* Offline sync status banner */}
        {unsyncedCount > 0 && (
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200 font-semibold">
              <Clock size={16} className="text-amber-600 shrink-0" />
              <span>
                {unsyncedCount} practice exam{unsyncedCount > 1 ? 's' : ''} stored locally in IndexedDB. Will sync automatically when internet returns.
              </span>
            </div>
            {isOnline && (
              <button
                type="button"
                onClick={handleManualSync}
                disabled={isSyncing}
                className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                <RefreshCw size={13} className={isSyncing ? "animate-spin" : ""} />
                <span>Sync to Cloud Now</span>
              </button>
            )}
          </div>
        )}

        {historyList.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
              <History size={24} />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white">No Exam Attempts Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Complete your first JAMB CBT practice session to see your test scores, timings, and progress records here.
            </p>
            <button
              type="button"
              onClick={() => setMode('setup')}
              className="mt-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Start Practice Session
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {historyList.map(attempt => (
              <div
                key={attempt.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white text-base">
                      {attempt.subjectName}
                    </span>
                    <span className="text-xs text-slate-400">
                      • JAMB {attempt.year === 'all' ? 'Mix' : attempt.year}
                    </span>
                    {attempt.syncStatus === 'pending' ? (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center gap-1">
                        <Clock size={10} /> Saved Offline
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                        <Check size={10} /> Cloud Synced
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">
                    {new Date(attempt.completedAt).toLocaleString()} • {Math.floor(attempt.timeSpentSeconds / 60)}m {attempt.timeSpentSeconds % 60}s elapsed
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <div className="text-right">
                    <span className="text-lg font-extrabold text-blue-600 dark:text-blue-400">
                      {attempt.score} / {attempt.totalQuestions}
                    </span>
                    <p className="text-[11px] font-bold text-slate-400">{attempt.percentage}%</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedHistoryAttempt(attempt);
                      setQuestions(attempt.questions);
                      setUserAnswers(attempt.answers);
                      setFinalScore(attempt.score);
                      setTimeSpentSeconds(attempt.timeSpentSeconds);
                      setMode('results');
                    }}
                    className="px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-300 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Review Answers</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER: BOOKMARKED QUESTIONS HUB
  // -------------------------------------------------------------
  if (mode === 'bookmarks') {
    const filteredBookmarks = bookmarkSubjectFilter === 'all'
      ? bookmarksList
      : bookmarksList.filter(b => b.subject === bookmarkSubjectFilter);

    return (
      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setMode('setup')}
            className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Back to JAMB Hub</span>
          </button>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Bookmark size={18} className="text-amber-500 fill-amber-500" />
              <span>Saved Questions ({bookmarksList.length})</span>
            </h2>
          </div>
        </div>

        {/* Subject Filter Pills & Practice Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => setBookmarkSubjectFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                bookmarkSubjectFilter === 'all'
                  ? 'bg-amber-500 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              All Subjects ({bookmarksList.length})
            </button>
            {JAMB_SUBJECTS.map(s => {
              const count = bookmarksList.filter(b => b.subject === s.id).length;
              if (count === 0) return null;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setBookmarkSubjectFilter(s.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    bookmarkSubjectFilter === s.id
                      ? 'bg-amber-500 text-white'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {s.name} ({count})
                </button>
              );
            })}
          </div>

          {filteredBookmarks.length > 0 && (
            <button
              type="button"
              onClick={handleStartBookmarkedExam}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
            >
              <span>Practice These Questions</span>
              <ArrowRight size={14} />
            </button>
          )}
        </div>

        {filteredBookmarks.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-500 flex items-center justify-center mx-auto">
              <Bookmark size={24} />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white">No Bookmarked Questions</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Bookmark tough questions during your CBT practice exams to review solutions and re-practice them here anytime.
            </p>
            <button
              type="button"
              onClick={() => setMode('setup')}
              className="mt-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Start Practicing Now
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookmarks.map(({ question: q }) => (
              <div
                key={q.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-300">
                      {q.subjectName} • JAMB {q.year}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">{q.topic}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleBookmark(q)}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                    title="Remove from bookmarks"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white leading-relaxed">
                  {q.question}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {q.options.map((opt, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-xl text-xs flex items-center gap-2 border ${
                        idx === q.correctAnswer
                          ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 font-bold'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <span className="font-bold">{String.fromCharCode(65 + idx)}.</span>
                      <span>{opt}</span>
                      {idx === q.correctAnswer && (
                        <CheckCircle2 size={14} className="text-emerald-600 ml-auto shrink-0" />
                      )}
                    </div>
                  ))}
                </div>

                {/* Explanation */}
                <div className="p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 text-xs text-slate-700 dark:text-slate-300">
                  <span className="font-bold text-blue-700 dark:text-blue-400 mr-1">Explanation:</span>
                  {q.explanation}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return null;
}
