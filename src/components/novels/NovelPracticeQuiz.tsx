import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Novel, NovelPracticeQuestion, NovelPracticeAttempt } from '../../types';
import {
  X,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Trophy,
  BookOpen,
  Award,
  ArrowRight,
  ArrowLeft,
  Clock,
  Shuffle,
  ListOrdered,
  Timer,
  Play,
  History,
  Calendar,
  Layers,
  ChevronRight,
  Sparkles,
  WifiOff
} from 'lucide-react';
import {
  getNovelPracticeQuestions,
  savePracticeAttempt,
  getUserPracticeHistory,
  isOnline
} from '../../services/novelService';
import { useAuth } from '../../contexts/AuthContext';

interface NovelPracticeQuizProps {
  novel: Novel;
  initialChapterIndex?: number;
  onClose: () => void;
  onSaveScore?: (score: { correct: number; total: number; percentage: number }) => void;
}

type QuizScreen = 'config' | 'quiz' | 'result' | 'history';
type QuestionOrder = 'random' | 'sequential';
type QuizMode = 'practice' | 'exam';

export default function NovelPracticeQuiz({
  novel,
  initialChapterIndex,
  onClose,
  onSaveScore
}: NovelPracticeQuizProps) {
  const { user } = useAuth();

  // All available aggregated questions (from both chapter data, offline cache, and novel object)
  const [allQuestions, setAllQuestions] = useState<NovelPracticeQuestion[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState<boolean>(true);

  // Configuration states
  const [screen, setScreen] = useState<QuizScreen>('config');
  const [selectedChapterIndex, setSelectedChapterIndex] = useState<number | 'all'>(
    initialChapterIndex !== undefined ? initialChapterIndex : 'all'
  );
  const [questionCountChoice, setQuestionCountChoice] = useState<number | 'all' | 'custom'>(10);
  const [customQuestionCount, setCustomQuestionCount] = useState<number>(15);
  const [questionOrder, setQuestionOrder] = useState<QuestionOrder>('random');
  const [isTimed, setIsTimed] = useState<boolean>(true);
  const [timeMinutes, setTimeMinutes] = useState<number>(15);
  const [quizMode, setQuizMode] = useState<QuizMode>('practice');

  // Active quiz session states
  const [activeQuestions, setActiveQuestions] = useState<NovelPracticeQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showExplanationMap, setShowExplanationMap] = useState<Record<number, boolean>>({});
  const [secondsRemaining, setSecondsRemaining] = useState<number>(0);
  const [timeSpentSeconds, setTimeSpentSeconds] = useState<number>(0);
  const [savedAttemptId, setSavedAttemptId] = useState<string | null>(null);

  // History state
  const [pastAttempts, setPastAttempts] = useState<NovelPracticeAttempt[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load aggregated questions on mount
  useEffect(() => {
    let isCancelled = false;
    setIsLoadingQuestions(true);

    getNovelPracticeQuestions(novel)
      .then((qs) => {
        if (!isCancelled) {
          setAllQuestions(qs);
          setIsLoadingQuestions(false);
        }
      })
      .catch((err) => {
        console.warn('Error retrieving novel practice questions:', err);
        if (!isCancelled) {
          setAllQuestions(novel.practiceQuestions || []);
          setIsLoadingQuestions(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [novel]);

  // Load previous attempts
  const refreshHistory = async () => {
    if (!user) return;
    setIsLoadingHistory(true);
    try {
      const history = await getUserPracticeHistory(user.uid, novel.id);
      setPastAttempts(history);
    } catch (err) {
      console.warn('Failed to load practice history:', err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    refreshHistory();
  }, [user, novel.id]);

  // Filter pool based on chapter choice
  const availablePool = useMemo(() => {
    if (selectedChapterIndex === 'all') {
      return allQuestions;
    }
    return allQuestions.filter((q) => q.chapterIndex === selectedChapterIndex);
  }, [allQuestions, selectedChapterIndex]);

  // Start the quiz
  const handleStartQuiz = () => {
    let pool = [...availablePool];
    if (pool.length === 0) return;

    if (questionOrder === 'random') {
      pool.sort(() => Math.random() - 0.5);
    }

    let targetCount = pool.length;
    if (questionCountChoice === 'all') {
      targetCount = pool.length;
    } else if (questionCountChoice === 'custom') {
      targetCount = Math.max(1, Math.min(pool.length, customQuestionCount));
    } else {
      targetCount = Math.min(pool.length, questionCountChoice);
    }

    const selectedList = pool.slice(0, targetCount);
    setActiveQuestions(selectedList);
    setCurrentIndex(0);
    setSelectedAnswers({});
    setShowExplanationMap({});
    setTimeSpentSeconds(0);

    const totalSeconds = isTimed ? (timeMinutes || 15) * 60 : 0;
    setSecondsRemaining(totalSeconds);
    setSavedAttemptId(null);
    setScreen('quiz');
  };

  // Timer loop
  useEffect(() => {
    if (screen !== 'quiz') {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeSpentSeconds((prev) => prev + 1);

      if (isTimed) {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            // Auto submit when time expires
            handleFinishQuiz();
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [screen, isTimed]);

  const handleSelectOption = (optIndex: number) => {
    if (screen === 'result') return;
    setSelectedAnswers((prev) => ({ ...prev, [currentIndex]: optIndex }));

    // In practice mode, show explanation immediately
    if (quizMode === 'practice') {
      setShowExplanationMap((prev) => ({ ...prev, [currentIndex]: true }));
    }
  };

  // Submit and save score
  const handleFinishQuiz = async () => {
    if (timerRef.current) clearInterval(timerRef.current);

    const total = activeQuestions.length;
    const correct = activeQuestions.reduce((acc, q, idx) => {
      return acc + (selectedAnswers[idx] === q.correctAnswer ? 1 : 0);
    }, 0);
    const scorePct = total > 0 ? Math.round((correct / total) * 100) : 0;

    // Show result
    setScreen('result');

    if (onSaveScore) {
      onSaveScore({ correct, total, percentage: scorePct });
    }

    // Persist attempt locally & cloud
    if (user) {
      const chapterLabel =
        selectedChapterIndex === 'all'
          ? 'All Chapters'
          : `Chapter ${(selectedChapterIndex as number) + 1}`;

      const attemptRecord: NovelPracticeAttempt = {
        id: `att_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        uid: user.uid,
        novelId: novel.id,
        novelTitle: novel.title,
        chapterIndex: typeof selectedChapterIndex === 'number' ? selectedChapterIndex : undefined,
        chapterTitle: chapterLabel,
        totalQuestions: total,
        correctAnswers: correct,
        scorePercentage: scorePct,
        timeSpentSeconds: timeSpentSeconds,
        timestamp: Date.now()
      };

      try {
        await savePracticeAttempt(attemptRecord);
        setSavedAttemptId(attemptRecord.id);
        refreshHistory();
      } catch (e) {
        console.warn('Failed saving practice attempt:', e);
      }
    }
  };

  // Formatting helpers
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Calculate current score
  const correctCount = activeQuestions.reduce((acc, q, idx) => {
    return acc + (selectedAnswers[idx] === q.correctAnswer ? 1 : 0);
  }, 0);
  const totalAnswered = Object.keys(selectedAnswers).length;
  const scorePercent =
    activeQuestions.length > 0
      ? Math.round((correctCount / activeQuestions.length) * 100)
      : 0;

  // Render loading state
  if (isLoadingQuestions) {
    return (
      <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-sm w-full text-center space-y-4 border border-slate-200 dark:border-slate-800">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
            Loading {novel.title} questions...
          </p>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW: 1. CONFIGURATION SCREEN
  // =========================================================================
  if (screen === 'config') {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fade-in overflow-y-auto">
        <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden my-auto max-h-[94vh]">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                <HelpCircle size={22} />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    UTME Practice Engine
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                    <WifiOff size={10} /> Offline Ready
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white line-clamp-1">
                  {novel.title}
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Configuration Form Body */}
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
            {/* Total Available Pool Info */}
            <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-850 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-blue-900 dark:text-blue-200">
                  Total Questions in Library: <span className="font-extrabold text-blue-600 dark:text-blue-400">{allQuestions.length}</span>
                </p>
                <p className="text-[11px] text-blue-700 dark:text-blue-300">
                  {availablePool.length} questions available for your current chapter selection
                </p>
              </div>

              {pastAttempts.length > 0 && (
                <button
                  onClick={() => setScreen('history')}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1 shadow-sm hover:border-blue-400 transition-all"
                >
                  <History size={13} className="text-blue-500" />
                  <span>History ({pastAttempts.length})</span>
                </button>
              )}
            </div>

            {/* 1. Chapter Selection */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Layers size={14} className="text-blue-500" />
                <span>Select Study Scope</span>
              </label>

              <select
                value={selectedChapterIndex === 'all' ? 'all' : selectedChapterIndex}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedChapterIndex(val === 'all' ? 'all' : parseInt(val, 10));
                }}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              >
                <option value="all">
                  All Chapters / Comprehensive Examination ({allQuestions.length} Questions)
                </option>
                {novel.chapters.map((ch, idx) => {
                  const chCount = allQuestions.filter((q) => q.chapterIndex === idx).length;
                  return (
                    <option key={ch.id} value={idx}>
                      Chapter {ch.chapterNumber}: {ch.title} ({chCount} questions)
                    </option>
                  );
                })}
              </select>
            </div>

            {/* 2. Number of Questions (5, 10, 20, 30, 40, 50, or custom) */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Award size={14} className="text-amber-500" />
                  <span>Number of Questions</span>
                </label>
                <span className="text-[11px] font-bold text-slate-400">
                  Pool: {availablePool.length}
                </span>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {[5, 10, 20, 30, 40, 50].map((num) => {
                  const isSelected = questionCountChoice === num;
                  const isTooLarge = num > availablePool.length && availablePool.length > 0;
                  return (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setQuestionCountChoice(num)}
                      className={`py-2 rounded-xl text-xs font-extrabold border transition-all ${
                        isSelected
                          ? 'border-blue-600 bg-blue-600 text-white shadow-md'
                          : 'border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                      }`}
                    >
                      {num} {isTooLarge ? `(${availablePool.length})` : ''}
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={() => setQuestionCountChoice('all')}
                  className={`py-2 rounded-xl text-xs font-extrabold border transition-all ${
                    questionCountChoice === 'all'
                      ? 'border-blue-600 bg-blue-600 text-white shadow-md'
                      : 'border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                  }`}
                >
                  All ({availablePool.length})
                </button>
              </div>

              {/* Custom Count Option */}
              <div className="pt-1 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setQuestionCountChoice('custom')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                    questionCountChoice === 'custom'
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-300'
                      : 'border-slate-200 dark:border-slate-750 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Custom Count
                </button>

                {questionCountChoice === 'custom' && (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      max={availablePool.length}
                      value={customQuestionCount}
                      onChange={(e) => setCustomQuestionCount(Math.max(1, parseInt(e.target.value, 10) || 1))}
                      className="w-20 p-1.5 text-xs font-bold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-center"
                    />
                    <span className="text-[11px] text-slate-500">
                      (Max: {availablePool.length})
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* 3. Question Ordering: Random vs Sequential */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Shuffle size={14} className="text-emerald-500" />
                <span>Question Order</span>
              </label>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setQuestionOrder('random')}
                  className={`p-3 rounded-2xl border-2 flex items-center gap-3 text-left transition-all ${
                    questionOrder === 'random'
                      ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200'
                      : 'border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Shuffle size={18} className={questionOrder === 'random' ? 'text-blue-600' : 'text-slate-400'} />
                  <div>
                    <p className="text-xs font-bold">Random Order</p>
                    <p className="text-[10px] opacity-75">Shuffles questions like actual CBT</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setQuestionOrder('sequential')}
                  className={`p-3 rounded-2xl border-2 flex items-center gap-3 text-left transition-all ${
                    questionOrder === 'sequential'
                      ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200'
                      : 'border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <ListOrdered size={18} className={questionOrder === 'sequential' ? 'text-blue-600' : 'text-slate-400'} />
                  <div>
                    <p className="text-xs font-bold">Sequential Order</p>
                    <p className="text-[10px] opacity-75">Follows the novel chapter-by-chapter</p>
                  </div>
                </button>
              </div>
            </div>

            {/* 4. Timing Mode: Timed vs Untimed */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Timer size={14} className="text-rose-500" />
                <span>Timer & Pace</span>
              </label>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setIsTimed(true)}
                  className={`p-3 rounded-2xl border-2 flex items-center gap-3 text-left transition-all ${
                    isTimed
                      ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200'
                      : 'border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Clock size={18} className={isTimed ? 'text-blue-600' : 'text-slate-400'} />
                  <div>
                    <p className="text-xs font-bold">Timed Examination</p>
                    <p className="text-[10px] opacity-75">Simulates actual UTME countdown</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setIsTimed(false)}
                  className={`p-3 rounded-2xl border-2 flex items-center gap-3 text-left transition-all ${
                    !isTimed
                      ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200'
                      : 'border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <BookOpen size={18} className={!isTimed ? 'text-blue-600' : 'text-slate-400'} />
                  <div>
                    <p className="text-xs font-bold">Untimed Study Mode</p>
                    <p className="text-[10px] opacity-75">Read, reflect, and learn without clock</p>
                  </div>
                </button>
              </div>

              {isTimed && (
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                    Duration:
                  </span>
                  {[5, 10, 15, 20, 30].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setTimeMinutes(mins)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${
                        timeMinutes === mins
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {mins}m
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 5. Feedback Style: Instant Explanation vs Exam Simulation */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Sparkles size={14} className="text-indigo-500" />
                <span>Explanations & Feedback</span>
              </label>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setQuizMode('practice')}
                  className={`p-3 rounded-2xl border-2 flex items-center gap-2 text-left transition-all ${
                    quizMode === 'practice'
                      ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200'
                      : 'border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <div>
                    <p className="text-xs font-bold">Instant Explanations</p>
                    <p className="text-[10px] opacity-75">Reveal correct answer & notes on click</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setQuizMode('exam')}
                  className={`p-3 rounded-2xl border-2 flex items-center gap-2 text-left transition-all ${
                    quizMode === 'exam'
                      ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200'
                      : 'border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <div>
                    <p className="text-xs font-bold">Exam Simulation</p>
                    <p className="text-[10px] opacity-75">Reveal all explanations after submission</p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Footer Action */}
          <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-center justify-between gap-3 shrink-0">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs"
            >
              Cancel
            </button>

            <button
              onClick={handleStartQuiz}
              disabled={availablePool.length === 0}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-extrabold text-xs flex items-center gap-2 shadow-md transition-all"
            >
              <Play size={14} className="fill-white" />
              <span>Start Practice Session</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW: 2. HISTORY SCREEN
  // =========================================================================
  if (screen === 'history') {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fade-in overflow-y-auto">
        <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden my-auto max-h-[90vh]">
          <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <History size={20} className="text-blue-500" />
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                Practice History & Scores
              </h3>
            </div>
            <button
              onClick={() => setScreen('config')}
              className="p-2 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-3">
            {isLoadingHistory ? (
              <div className="py-12 text-center text-slate-400 text-xs">Loading past attempts...</div>
            ) : pastAttempts.length === 0 ? (
              <div className="py-12 text-center space-y-2">
                <Trophy size={36} className="mx-auto text-slate-300 dark:text-slate-600" />
                <p className="text-xs font-bold text-slate-500">No previous practice attempts recorded yet.</p>
              </div>
            ) : (
              pastAttempts.map((attempt) => (
                <div
                  key={attempt.id}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-750 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-900 dark:text-white">
                        {attempt.chapterTitle || 'All Chapters'}
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Calendar size={10} />
                        {new Date(attempt.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Scored {attempt.correctAnswers} / {attempt.totalQuestions} ({attempt.scorePercentage}%) • Took{' '}
                      {formatTime(attempt.timeSpentSeconds)}
                    </p>
                  </div>

                  <div
                    className={`px-3 py-1.5 rounded-xl font-black text-xs ${
                      attempt.scorePercentage >= 75
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : attempt.scorePercentage >= 50
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    }`}
                  >
                    {attempt.scorePercentage}%
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex justify-end">
            <button
              onClick={() => setScreen('config')}
              className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs"
            >
              Back to Setup
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Current active question
  const currentQ: NovelPracticeQuestion = activeQuestions[currentIndex];
  const userSelected = selectedAnswers[currentIndex];
  const isAnswered = userSelected !== undefined;
  const showExplanation =
    showExplanationMap[currentIndex] || screen === 'result' || (quizMode === 'practice' && isAnswered);

  // =========================================================================
  // VIEW: 3. ACTIVE QUIZ & 4. RESULT REVIEW SCREEN
  // =========================================================================
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fade-in overflow-y-auto">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden my-auto max-h-[94vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                {novel.title}
              </span>
              {currentQ?.chapterTitle && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                  {currentQ.chapterTitle}
                </span>
              )}
            </div>
            <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white line-clamp-1">
              UTME Practice Question {currentIndex + 1} of {activeQuestions.length}
            </h3>
          </div>

          <div className="flex items-center gap-3">
            {/* Countdown timer if timed */}
            {isTimed && screen === 'quiz' && (
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs font-black border ${
                  secondsRemaining < 120
                    ? 'bg-rose-50 border-rose-300 text-rose-600 animate-pulse dark:bg-rose-950/40'
                    : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Clock size={13} />
                <span>{formatTime(secondsRemaining)}</span>
              </div>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Quiz Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* Progress Tracker */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
              <span>
                Progress: {currentIndex + 1} / {activeQuestions.length}
              </span>
              <span>
                Answered: {totalAnswered} / {activeQuestions.length}
              </span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-full transition-all duration-300 rounded-full"
                style={{ width: `${((currentIndex + 1) / activeQuestions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Results Summary Card if in 'result' screen */}
          {screen === 'result' && (
            <div className="p-6 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border-2 border-blue-200 dark:border-blue-800 text-center space-y-4 animate-fade-in">
              <div className="w-16 h-16 mx-auto rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg">
                <Trophy size={32} />
              </div>
              <div>
                <h4 className="text-xl font-black text-slate-900 dark:text-white">
                  Assessment Completed!
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                  You scored <strong className="text-blue-600 dark:text-blue-400">{correctCount}</strong> out of{' '}
                  <strong>{activeQuestions.length}</strong> questions ({scorePercent}%)
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Time taken: {formatTime(timeSpentSeconds)} • Saved to offline & cloud history
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setScreen('config')}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-slate-400 font-bold text-xs text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-all"
                >
                  <RotateCcw size={14} />
                  <span>Configure New Quiz</span>
                </button>
                <button
                  onClick={() => setScreen('history')}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 font-bold text-xs text-white flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <History size={14} />
                  <span>View All Scores</span>
                </button>
              </div>
            </div>
          )}

          {/* Question Card */}
          {currentQ && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                {currentQ.topic && (
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    Topic: {currentQ.topic}
                  </span>
                )}
                {currentQ.year && (
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    UTME {currentQ.year}
                  </span>
                )}
                {currentQ.difficulty && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 capitalize">
                    {currentQ.difficulty}
                  </span>
                )}
              </div>

              <h4 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white leading-relaxed">
                {currentQ.question}
              </h4>

              {/* Options List */}
              <div className="space-y-2.5 pt-2">
                {currentQ.options.map((opt, optIdx) => {
                  let btnStyle =
                    'border-slate-200 dark:border-slate-750 hover:border-blue-300 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200';

                  const showAnswersNow = Boolean(showExplanation);

                  if (showAnswersNow) {
                    if (optIdx === currentQ.correctAnswer) {
                      btnStyle =
                        'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-bold shadow-sm';
                    } else if (userSelected === optIdx) {
                      btnStyle =
                        'border-red-400 bg-red-50 dark:bg-red-950/40 text-red-900 dark:text-red-200 font-medium';
                    } else {
                      btnStyle = 'opacity-60 border-slate-200 dark:border-slate-800 text-slate-500';
                    }
                  } else if (userSelected === optIdx) {
                    btnStyle =
                      'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 font-bold ring-2 ring-blue-500/20';
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border-2 transition-all flex items-start justify-between gap-3 text-sm leading-snug ${btnStyle}`}
                    >
                      <span className="flex-1">{opt}</span>
                      {showAnswersNow && optIdx === currentQ.correctAnswer && (
                        <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      )}
                      {showAnswersNow && userSelected === optIdx && optIdx !== currentQ.correctAnswer && (
                        <XCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Answer Explanation */}
              {showExplanation && (
                <div className="mt-4 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300 space-y-1.5 animate-fade-in">
                  <div className="flex items-center gap-1.5 text-amber-800 dark:text-amber-300 font-extrabold">
                    <Award size={16} />
                    <span>JAMB Examination Explanation & Citation</span>
                  </div>
                  <p className="leading-relaxed">{currentQ.explanation}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1 disabled:opacity-40 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Previous</span>
          </button>

          {/* Jump Bubbles */}
          <div className="hidden sm:flex items-center gap-1 max-w-[280px] overflow-x-auto no-scrollbar py-1">
            {activeQuestions.map((_, idx) => {
              const answered = selectedAnswers[idx] !== undefined;
              const isCurr = idx === currentIndex;
              return (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold shrink-0 transition-all ${
                    isCurr
                      ? 'bg-blue-600 text-white ring-2 ring-blue-400'
                      : answered
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300'
                      : 'bg-slate-200 dark:bg-slate-750 text-slate-600 dark:text-slate-400 hover:bg-slate-300'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            {currentIndex < activeQuestions.length - 1 ? (
              <button
                onClick={() => setCurrentIndex((prev) => Math.min(activeQuestions.length - 1, prev + 1))}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition-all"
              >
                <span>Next</span>
                <ArrowRight size={14} />
              </button>
            ) : screen === 'quiz' ? (
              <button
                onClick={handleFinishQuiz}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition-all"
              >
                <CheckCircle2 size={14} />
                <span>Submit CBT</span>
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs"
              >
                Done
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
