import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  ArrowLeft, 
  Clock, 
  Calculator as CalcIcon, 
  Bookmark, 
  Flag, 
  CheckCircle2, 
  XCircle, 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  Check, 
  X, 
  AlertTriangle, 
  BookOpen, 
  Sparkles, 
  Award, 
  HelpCircle,
  Menu,
  GraduationCap
} from 'lucide-react';
import { JAMB_SUBJECTS, JambQuestion, getUnifiedQuestionsForPractice } from '../../data/jambQuestions';
import { jambService } from '../../services/jambService';
import { jambQuestionEngine } from '../../services/jambQuestionEngine';
import JambCalculator from './JambCalculator';

export interface JambPracticeConfig {
  subject: string;
  subjectId?: string;
  topic?: string;
  year?: number | 'all';
  amount?: number;
  ordering?: 'random' | 'sequential';
  isUntimed?: boolean;
  timerDuration?: number; // in minutes
  practiceMode?: 'practice' | 'cbt' | 'study';
  subjects?: string[]; // for multi-subject CBT
  questions?: JambQuestion[];
  reviewSession?: {
    id?: string;
    questions: any[];
    answers: Record<string | number, number>;
    score: number;
    totalQuestions: number;
    percentage: number;
    timeUsedSeconds: number;
    subject: string;
    subjectName?: string;
    year?: number | 'all';
    topic?: string;
  };
}

export interface JambPracticeScreenProps {
  config: JambPracticeConfig;
  onExit: () => void;
  onRetake?: (config: JambPracticeConfig) => void;
}

export default function JambPracticeScreen({ config, onExit, onRetake }: JambPracticeScreenProps) {
  // 1. Resolve subject metadata
  const currentSubjectMeta = useMemo(() => {
    const raw = config.subjectId || config.subject;
    return JAMB_SUBJECTS.find(
      s => s.id.toLowerCase() === raw.toLowerCase() || s.name.toLowerCase() === raw.toLowerCase()
    ) || JAMB_SUBJECTS[0];
  }, [config.subject, config.subjectId]);

  const hasCalculator = useMemo(() => {
    return Boolean(
      currentSubjectMeta.hasCalculator ||
      ['mathematics', 'physics', 'chemistry', 'accounts', 'principles_of_accounts', 'commerce'].some(s =>
        (config.subjectId || config.subject).toLowerCase().includes(s)
      )
    );
  }, [currentSubjectMeta, config.subject, config.subjectId]);

  // 2. Synchronous initial question bank retrieval (Never shows blank/loading on launch)
  const [questions, setQuestions] = useState<any[]>(() => {
    if (config.reviewSession?.questions && config.reviewSession.questions.length > 0) {
      return config.reviewSession.questions;
    }
    if (config.questions && config.questions.length > 0) {
      return config.questions;
    }
    return getUnifiedQuestionsForPractice({
      subjects: config.subjects,
      subject: config.subjectId || config.subject,
      topic: config.topic,
      year: config.year,
      count: config.amount || 20,
      order: config.ordering || 'random'
    });
  });

  // Track review mode
  const isInitialReview = Boolean(config.reviewSession);

  // Practice state
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, number>>(() => {
    if (config.reviewSession?.answers) {
      const norm: Record<number, number> = {};
      Object.entries(config.reviewSession.answers).forEach(([k, v]) => {
        norm[Number(k)] = Number(v);
      });
      return norm;
    }
    return {};
  });

  const [markedForReview, setMarkedForReview] = useState<Record<number, boolean>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(isInitialReview);
  const [finalScore, setFinalScore] = useState<number>(config.reviewSession?.score || 0);
  const [finalPercentage, setFinalPercentage] = useState<number>(config.reviewSession?.percentage || 0);

  // Timing
  const initialDurationSeconds = useMemo(() => {
    if (config.isUntimed || config.practiceMode === 'study') return 0;
    const mins = config.timerDuration ?? (config.practiceMode === 'cbt' ? 45 : 20);
    return mins > 0 ? mins * 60 : 0;
  }, [config.isUntimed, config.timerDuration, config.practiceMode]);

  const [timerRemaining, setTimerRemaining] = useState<number>(initialDurationSeconds);
  const [timeUsedSeconds, setTimeUsedSeconds] = useState<number>(config.reviewSession?.timeUsedSeconds || 0);
  const isUntimed = config.isUntimed || config.practiceMode === 'study' || initialDurationSeconds === 0;

  // Modals & UI States
  const [isCalculatorOpen, setIsCalculatorOpen] = useState<boolean>(false);
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [showExitModal, setShowExitModal] = useState<boolean>(false);
  const [showPaletteDrawer, setShowPaletteDrawer] = useState<boolean>(false);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Timer Interval
  useEffect(() => {
    if (isSubmitted || isUntimed) return;

    const interval = setInterval(() => {
      setTimerRemaining(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitPractice(true);
          return 0;
        }
        return prev - 1;
      });
      setTimeUsedSeconds(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isSubmitted, isUntimed]);

  // Track untimed practice time
  useEffect(() => {
    if (isSubmitted || !isUntimed) return;
    const interval = setInterval(() => {
      setTimeUsedSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isSubmitted, isUntimed]);

  // Load existing bookmarks
  useEffect(() => {
    jambService.getBookmarks().then(bList => {
      const set = new Set<string>();
      bList.forEach(b => set.add(b.questionId));
      setBookmarkedIds(set);
    }).catch(() => {});
  }, []);

  // Record questions seen for user history tracking
  useEffect(() => {
    if (!isInitialReview && questions.length > 0) {
      const docs = questions.map(q => ({
        questionId: q.id,
        subjectId: q.subject,
        subjectName: q.subjectName || q.subject,
        topicId: q.topic || 'General',
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        difficulty: 'medium' as const,
        sourceType: 'past_question' as const,
        isAIgenerated: false,
        status: 'active' as const,
        fingerprint: q.id,
        timesUsed: 1,
        year: q.year,
        createdAt: Date.now(),
        updatedAt: Date.now()
      }));
      jambQuestionEngine.recordQuestionsSeen('guest', `jamb_sess_${Date.now()}`, docs).catch(() => {});
    }
  }, []);

  const currentQ = questions[currentQIndex] || questions[0];

  const handleSelectOption = (optIndex: number) => {
    if (isSubmitted) return;
    setAnswers(prev => ({
      ...prev,
      [currentQIndex]: optIndex
    }));
  };

  const handleToggleMarkReview = () => {
    setMarkedForReview(prev => ({
      ...prev,
      [currentQIndex]: !prev[currentQIndex]
    }));
  };

  const handleToggleBookmark = async () => {
    if (!currentQ) return;
    try {
      const isNowBookmarked = await jambService.toggleBookmark(currentQ);
      setBookmarkedIds(prev => {
        const next = new Set(prev);
        if (isNowBookmarked) next.add(currentQ.id);
        else next.delete(currentQ.id);
        return next;
      });
      setToastMessage(isNowBookmarked ? 'Question bookmarked for revision!' : 'Bookmark removed.');
      setTimeout(() => setToastMessage(null), 2500);
    } catch {
      setToastMessage('Could not update bookmark.');
      setTimeout(() => setToastMessage(null), 2000);
    }
  };

  // Submit and Calculate Score
  const handleSubmitPractice = (autoTimedOut = false) => {
    setShowSubmitModal(false);

    let correctCount = 0;
    questions.forEach((q, idx) => {
      const userAns = answers[idx];
      if (userAns !== undefined && userAns === q.correctAnswer) {
        correctCount++;
      }
    });

    const total = questions.length;
    const pct = total > 0 ? Math.round((correctCount / total) * 100) : 0;

    setFinalScore(correctCount);
    setFinalPercentage(pct);
    setIsSubmitted(true);
    setCurrentQIndex(0);

    const answersMap: Record<string, number> = {};
    Object.entries(answers).forEach(([k, v]) => {
      answersMap[String(k)] = v;
    });

    // Save attempt to history
    jambService.saveAttempt({
      subject: config.subjectId || config.subject,
      subjectName: currentSubjectMeta.name,
      year: config.year || 'all',
      score: correctCount,
      totalQuestions: total,
      percentage: pct,
      timeSpentSeconds: timeUsedSeconds,
      answers: answersMap,
      questions: questions as any
    }).catch(err => console.warn('Could not save practice attempt:', err));

    if (autoTimedOut) {
      setToastMessage("Time is up! Your JAMB practice has been submitted.");
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const handleRetakeSession = () => {
    if (onRetake) {
      onRetake(config);
      return;
    }
    // In-place retake
    setAnswers({});
    setMarkedForReview({});
    setCurrentQIndex(0);
    setFinalScore(0);
    setFinalPercentage(0);
    setTimerRemaining(initialDurationSeconds);
    setTimeUsedSeconds(0);
    setIsSubmitted(false);
  };

  // Stats calculation
  const totalAnswered = Object.keys(answers).length;
  const totalMarked = Object.values(markedForReview).filter(Boolean).length;
  const totalUnanswered = questions.length - totalAnswered;

  // Format timer MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center space-y-4">
        <AlertTriangle size={48} className="text-amber-500 mx-auto" />
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">No Matching JAMB Questions Found</h3>
        <p className="text-sm text-slate-500">
          We could not locate questions matching your exact filter ({currentSubjectMeta.name}, {config.year || 'all'}, {config.topic || 'all topics'}).
        </p>
        <button
          type="button"
          onClick={onExit}
          className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm cursor-pointer hover:bg-blue-700"
        >
          Return to JAMB Prep
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6 min-w-0">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-2xl shadow-xl border border-slate-700 animate-in fade-in slide-in-from-top-4 duration-200">
          {toastMessage}
        </div>
      )}

      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 sm:p-4 shadow-xs">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            type="button"
            onClick={() => {
              if (isSubmitted) {
                onExit();
              } else {
                setShowExitModal(true);
              }
            }}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            title="Exit JAMB Practice"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase border ${currentSubjectMeta.badgeBg}`}>
                {currentSubjectMeta.code}
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                {currentSubjectMeta.name}
              </span>
              {currentQ?.year && (
                <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-[10px] font-bold border border-blue-200 dark:border-blue-800/60">
                  JAMB {currentQ.year}
                </span>
              )}
            </div>
            {config.topic && config.topic !== 'All Topics' && (
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                Topic: {config.topic}
              </p>
            )}
          </div>
        </div>

        {/* Timer & CBT Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {!isSubmitted && (
            <>
              {isUntimed ? (
                <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                  <Clock size={14} />
                  <span>Untimed</span>
                </div>
              ) : (
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs sm:text-sm font-mono font-bold ${
                  timerRemaining <= 300
                    ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 animate-pulse'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                }`}>
                  <Clock size={14} className={timerRemaining <= 300 ? 'text-rose-600' : 'text-slate-500'} />
                  <span>{formatTime(timerRemaining)}</span>
                </div>
              )}
            </>
          )}

          {hasCalculator && (
            <button
              type="button"
              onClick={() => setIsCalculatorOpen(true)}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              title="Open JAMB Calculator"
            >
              <CalcIcon size={16} className="text-blue-600 dark:text-blue-400" />
              <span className="hidden sm:inline">Calculator</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowPaletteDrawer(!showPaletteDrawer)}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            title="Question Grid Palette"
          >
            <Menu size={16} />
            <span className="hidden sm:inline">Grid ({currentQIndex + 1}/{questions.length})</span>
          </button>
        </div>
      </div>

      {/* Main Practice Container */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 items-start">
        {/* Left/Main: Question Card */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-xs space-y-5 sm:space-y-6">
            {/* Question Header Status */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-bold">
                  Question {currentQIndex + 1} of {questions.length}
                </span>
                {currentQ?.topic && (
                  <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
                    • {currentQ.topic}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleToggleBookmark}
                  className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                    bookmarkedIds.has(currentQ?.id)
                      ? 'border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                  }`}
                  title="Bookmark this question"
                >
                  <Bookmark size={15} className={bookmarkedIds.has(currentQ?.id) ? 'fill-current text-amber-500' : ''} />
                  <span className="hidden sm:inline">
                    {bookmarkedIds.has(currentQ?.id) ? 'Bookmarked' : 'Bookmark'}
                  </span>
                </button>

                {!isSubmitted && (
                  <button
                    type="button"
                    onClick={handleToggleMarkReview}
                    className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                      markedForReview[currentQIndex]
                        ? 'border-purple-300 bg-purple-50 text-purple-800 dark:border-purple-700 dark:bg-purple-950/40 dark:text-purple-300'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                    }`}
                    title="Mark question for review later"
                  >
                    <Flag size={15} className={markedForReview[currentQIndex] ? 'fill-current text-purple-600' : ''} />
                    <span className="hidden sm:inline">
                      {markedForReview[currentQIndex] ? 'Flagged' : 'Review Later'}
                    </span>
                  </button>
                )}
              </div>
            </div>

            {/* Comprehension Passage (if present) */}
            {currentQ?.passage && (
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-serif max-h-64 overflow-y-auto">
                <p className="font-bold font-sans text-xs uppercase tracking-wider text-slate-400 mb-2">Reading Passage</p>
                {currentQ.passage}
              </div>
            )}

            {/* Question Text */}
            <div className="text-sm sm:text-base md:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
              {currentQ?.question}
            </div>

            {/* Options List */}
            <div className="space-y-2.5 sm:space-y-3 pt-2">
              {currentQ?.options?.map((optText, optIdx) => {
                const optLetter = String.fromCharCode(65 + optIdx);
                const isSelected = answers[currentQIndex] === optIdx;
                const isCorrect = currentQ.correctAnswer === optIdx;
                
                let optionStyle = 'border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/80 hover:border-slate-300 dark:hover:border-slate-600';
                let badgeStyle = 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';

                if (isSubmitted) {
                  if (isCorrect) {
                    optionStyle = 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100 ring-2 ring-emerald-500/20';
                    badgeStyle = 'bg-emerald-600 text-white';
                  } else if (isSelected && !isCorrect) {
                    optionStyle = 'border-rose-500 bg-rose-50/80 dark:bg-rose-950/40 text-rose-900 dark:text-rose-100 ring-2 ring-rose-500/20';
                    badgeStyle = 'bg-rose-600 text-white';
                  }
                } else if (isSelected) {
                  optionStyle = 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/40 text-blue-900 dark:text-blue-100 ring-2 ring-blue-600/30';
                  badgeStyle = 'bg-blue-600 text-white';
                }

                return (
                  <button
                    key={optIdx}
                    type="button"
                    disabled={isSubmitted}
                    onClick={() => handleSelectOption(optIdx)}
                    className={`w-full p-3.5 sm:p-4 rounded-2xl border text-left flex items-center justify-between gap-3 transition-all cursor-pointer ${optionStyle}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl font-bold flex items-center justify-center text-xs sm:text-sm shrink-0 transition-colors ${badgeStyle}`}>
                        {optLetter}
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100">
                        {optText}
                      </span>
                    </div>

                    {isSubmitted && (
                      <div className="shrink-0">
                        {isCorrect && (
                          <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                            <CheckCircle2 size={16} />
                            <span className="hidden sm:inline">Correct Answer</span>
                          </div>
                        )}
                        {isSelected && !isCorrect && (
                          <div className="flex items-center gap-1 text-rose-600 dark:text-rose-400 text-xs font-bold">
                            <XCircle size={16} />
                            <span className="hidden sm:inline">Your Choice</span>
                          </div>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Post-Submission Answer Explanation */}
            {isSubmitted && currentQ?.explanation && (
              <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">
                  <BookOpen size={16} />
                  <span>JAMB Syllabus Explanation & Derivation</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-mono whitespace-pre-line">
                  {currentQ.explanation}
                </p>
              </div>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              type="button"
              disabled={currentQIndex === 0}
              onClick={() => setCurrentQIndex(prev => Math.max(0, prev - 1))}
              className="px-4 sm:px-6 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            >
              <ChevronLeft size={16} />
              <span>Previous</span>
            </button>

            {!isSubmitted ? (
              <button
                type="button"
                onClick={() => setShowSubmitModal(true)}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/20 transition cursor-pointer"
              >
                Submit Practice
              </button>
            ) : (
              <button
                type="button"
                onClick={handleRetakeSession}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-600/20 flex items-center gap-1.5 transition cursor-pointer"
              >
                <RotateCcw size={16} />
                <span>Retake Session</span>
              </button>
            )}

            <button
              type="button"
              disabled={currentQIndex === questions.length - 1}
              onClick={() => setCurrentQIndex(prev => Math.min(questions.length - 1, prev + 1))}
              className="px-4 sm:px-6 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Right Sidebar: CBT Question Palette & Session Stats */}
        <div className="lg:col-span-1 space-y-4">
          {/* Summary / Results Banner */}
          {isSubmitted && (
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl p-5 shadow-lg space-y-3">
              <div className="flex items-center gap-2">
                <Award size={20} className="text-amber-300" />
                <h4 className="font-bold text-sm">Session Results</h4>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black">{finalScore} / {questions.length}</span>
                <span className="text-lg font-bold text-blue-200">({finalPercentage}%)</span>
              </div>
              <p className="text-xs text-blue-100">
                Time spent: {formatTime(timeUsedSeconds)}
              </p>
              <button
                type="button"
                onClick={onExit}
                className="w-full py-2.5 rounded-xl bg-white text-blue-900 font-bold text-xs shadow-sm hover:bg-blue-50 transition cursor-pointer"
              >
                Back to JAMB Prep
              </button>
            </div>
          )}

          {/* Question Status Grid Palette */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Question Palette
              </h4>
              <span className="text-xs font-bold text-slate-500">
                {totalAnswered}/{questions.length}
              </span>
            </div>

            <div className="grid grid-cols-5 gap-2 max-h-72 overflow-y-auto pr-1">
              {questions.map((q, idx) => {
                const isCurrent = currentQIndex === idx;
                const isAnswered = answers[idx] !== undefined;
                const isFlagged = markedForReview[idx];
                const isAnsCorrect = isSubmitted && answers[idx] === q.correctAnswer;
                const isAnsIncorrect = isSubmitted && answers[idx] !== undefined && answers[idx] !== q.correctAnswer;

                let btnBg = 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700';

                if (isSubmitted) {
                  if (isAnsCorrect) {
                    btnBg = 'bg-emerald-600 text-white border-emerald-700';
                  } else if (isAnsIncorrect) {
                    btnBg = 'bg-rose-600 text-white border-rose-700';
                  } else {
                    btnBg = 'bg-slate-200 dark:bg-slate-700 text-slate-500 border-slate-300';
                  }
                } else if (isAnswered) {
                  btnBg = 'bg-blue-600 text-white border-blue-700';
                } else if (isFlagged) {
                  btnBg = 'bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 border-purple-300';
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentQIndex(idx)}
                    className={`h-9 rounded-xl border text-xs font-bold transition flex items-center justify-center relative cursor-pointer ${btnBg} ${
                      isCurrent ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900 scale-105 z-10' : ''
                    }`}
                  >
                    {idx + 1}
                    {isFlagged && !isSubmitted && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-purple-500 rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-[11px] text-slate-500">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-blue-600" />
                <span>Answered ({totalAnswered})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-purple-500" />
                <span>Flagged ({totalMarked})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-slate-200 dark:bg-slate-700" />
                <span>Unanswered ({totalUnanswered})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md ring-2 ring-blue-500" />
                <span>Current</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Calculator Modal */}
      {hasCalculator && (
        <JambCalculator
          isOpen={isCalculatorOpen}
          onClose={() => setIsCalculatorOpen(false)}
        />
      )}

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Submit JAMB Practice?</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Are you sure you want to finish your practice session? You will immediately see your score, question breakdowns, and complete syllabus derivations.
            </p>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Answered Questions:</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">{totalAnswered} of {questions.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Unanswered Questions:</span>
                <span className="font-bold text-rose-600 dark:text-rose-400">{totalUnanswered}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Marked for Review:</span>
                <span className="font-bold text-purple-600 dark:text-purple-400">{totalMarked}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                Continue Practice
              </button>
              <button
                type="button"
                onClick={() => handleSubmitPractice(false)}
                className="flex-1 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition cursor-pointer"
              >
                Yes, Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exit Practice Confirmation Modal */}
      {showExitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Exit JAMB Practice?</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Do you want to leave this practice session? Your progress will be saved so you can return to it later.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowExitModal(false)}
                className="flex-1 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                Keep Practicing
              </button>
              <button
                type="button"
                onClick={onExit}
                className="flex-1 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-lg shadow-rose-600/30 transition cursor-pointer"
              >
                Exit Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
