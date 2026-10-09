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
  AlertCircle,
  BookOpen, 
  Sparkles, 
  Award, 
  HelpCircle,
  Menu,
  GraduationCap,
  Layers,
  FileText,
  Square
} from 'lucide-react';
import { JAMB_SUBJECTS, JambQuestion, getUnifiedQuestionsForPractice } from '../../data/jambQuestions';
import { 
  canonicalSubjectKey, 
  getCanonicalSubjectDisplayName 
} from '../../utils/jambSubjectMatcher';
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
  // Synchronous initial question bank retrieval (Never shows blank/loading on launch)
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

  // Results review filter state
  const [reviewSubjectFilter, setReviewSubjectFilter] = useState<string>('all');
  const [reviewMistakesOnly, setReviewMistakesOnly] = useState<boolean>(false);

  // Timing
  const initialDurationSeconds = useMemo(() => {
    if (config.isUntimed || config.practiceMode === 'study') return 0;
    const mins = config.timerDuration ?? (config.practiceMode === 'cbt' ? 120 : 20);
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
  const [paletteSubjectTab, setPaletteSubjectTab] = useState<string>('all');
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // For multi-subject course combo, show pre-practice confirmation before starting
  const [hasStartedPractice, setHasStartedPractice] = useState<boolean>(() => {
    return Boolean(config.reviewSession || (config.subjects && config.subjects.length <= 1) || (!config.subjects && !config.practiceMode));
  });

  // Group questions by canonical subject for isolated subject navigation & reporting
  const subjectTabs = useMemo(() => {
    if (!questions || questions.length === 0) return [];
    
    const map = new Map<string, {
      id: string;
      name: string;
      code: string;
      badgeBg: string;
      hasCalculator: boolean;
      startIndex: number;
      endIndex: number;
      count: number;
      questions: any[];
    }>();

    questions.forEach((q, idx) => {
      const rawSub = q.subjectName || q.subject || config.subject || 'General';
      const canonicalKey = canonicalSubjectKey(rawSub);
      const displayName = getCanonicalSubjectDisplayName(canonicalKey);
      const subMeta = JAMB_SUBJECTS.find(
        s => s.id === canonicalKey || s.name.toLowerCase() === displayName.toLowerCase()
      );

      if (!map.has(displayName)) {
        map.set(displayName, {
          id: canonicalKey,
          name: displayName,
          code: subMeta?.code || displayName.substring(0, 3).toUpperCase(),
          badgeBg: subMeta?.badgeBg || 'bg-blue-50 text-blue-800 border-blue-200',
          hasCalculator: Boolean(subMeta?.hasCalculator || ['mathematics', 'physics', 'chemistry', 'accounts', 'principles_of_accounts'].includes(canonicalKey)),
          startIndex: idx,
          endIndex: idx,
          count: 1,
          questions: [q]
        });
      } else {
        const item = map.get(displayName)!;
        item.endIndex = idx;
        item.count += 1;
        item.questions.push(q);
      }
    });

    return Array.from(map.values()).map(tab => {
      let tabAnsweredCount = 0;
      let tabCorrectCount = 0;
      let tabFlaggedCount = 0;

      for (let i = tab.startIndex; i <= tab.endIndex; i++) {
        if (answers[i] !== undefined) {
          tabAnsweredCount++;
          if (answers[i] === questions[i]?.correctAnswer) {
            tabCorrectCount++;
          }
        }
        if (markedForReview[i]) {
          tabFlaggedCount++;
        }
      }

      const tabPct = tab.count > 0 ? Math.round((tabCorrectCount / tab.count) * 100) : 0;
      const scaledScore = tab.count > 0 ? Math.round((tabCorrectCount / tab.count) * 100) : 0; // Scaled to 100 marks per subject

      return {
        ...tab,
        answeredCount: tabAnsweredCount,
        correctCount: tabCorrectCount,
        flaggedCount: tabFlaggedCount,
        unansweredCount: tab.count - tabAnsweredCount,
        incorrectCount: tabAnsweredCount - tabCorrectCount,
        percentage: tabPct,
        scaledScore
      };
    });
  }, [questions, answers, markedForReview, config.subject]);

  // Current Subject and Question metadata
  const currentSubjectTab = useMemo(() => {
    if (subjectTabs.length === 0) return null;
    const found = subjectTabs.find(t => currentQIndex >= t.startIndex && currentQIndex <= t.endIndex);
    return found || subjectTabs[0];
  }, [subjectTabs, currentQIndex]);

  const questionNumberInSubject = currentSubjectTab 
    ? (currentQIndex - currentSubjectTab.startIndex + 1)
    : (currentQIndex + 1);

  const totalQuestionsInSubject = currentSubjectTab 
    ? currentSubjectTab.count 
    : questions.length;

  const currentSubjectMeta = useMemo(() => {
    if (currentSubjectTab) {
      const match = JAMB_SUBJECTS.find(s => s.id === currentSubjectTab.id || s.name.toLowerCase() === currentSubjectTab.name.toLowerCase());
      if (match) return match;
    }
    const raw = config.subjectId || config.subject;
    return JAMB_SUBJECTS.find(
      s => s.id.toLowerCase() === raw.toLowerCase() || s.name.toLowerCase() === raw.toLowerCase()
    ) || JAMB_SUBJECTS[0];
  }, [currentSubjectTab, config.subject, config.subjectId]);

  const hasCalculator = useMemo(() => {
    if (currentSubjectTab) {
      return currentSubjectTab.hasCalculator;
    }
    return Boolean(
      currentSubjectMeta.hasCalculator ||
      ['mathematics', 'physics', 'chemistry', 'accounts', 'principles_of_accounts', 'commerce'].some(s =>
        (config.subjectId || config.subject).toLowerCase().includes(s)
      )
    );
  }, [currentSubjectTab, currentSubjectMeta, config.subject, config.subjectId]);

  // Detect if requested questions exceeded available questions in bank
  const shortfallNotice = useMemo(() => {
    if (!config.amount || questions.length >= config.amount) return null;
    const requested = config.amount;
    const available = questions.length;
    return `You selected ${requested} questions, but ${available} authentic questions are currently available in the question bank for this selection. ${requested} questions are not currently available.`;
  }, [config.amount, questions.length]);

  // Timer Interval
  useEffect(() => {
    if (!hasStartedPractice || isSubmitted || isUntimed) return;

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
  }, [hasStartedPractice, isSubmitted, isUntimed]);

  // Track untimed practice time
  useEffect(() => {
    if (!hasStartedPractice || isSubmitted || !isUntimed) return;
    const interval = setInterval(() => {
      setTimeUsedSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [hasStartedPractice, isSubmitted, isUntimed]);

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
        subjectId: q.subjectId || q.subject,
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

    // Save attempt to history with subject breakdowns
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

  // Jump to specific subject in navigator
  const handleSwitchSubject = (tab: typeof subjectTabs[0]) => {
    setCurrentQIndex(tab.startIndex);
  };

  // Stats calculation
  const totalAnswered = Object.keys(answers).length;
  const totalMarked = Object.values(markedForReview).filter(Boolean).length;
  const totalUnanswered = questions.length - totalAnswered;
  const aggregateJambMarks = Math.round((finalScore / (questions.length || 1)) * 400);

  // Format timer MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Filtered questions for review
  const filteredReviewQuestions = useMemo(() => {
    if (!isSubmitted) return [];
    return questions.map((q, idx) => ({ q, idx })).filter(({ q, idx }) => {
      const qSubName = q.subjectName || q.subject;
      const canonical = canonicalSubjectKey(qSubName);
      if (reviewSubjectFilter !== 'all' && canonical !== reviewSubjectFilter) {
        return false;
      }
      if (reviewMistakesOnly) {
        const userAns = answers[idx];
        return userAns !== q.correctAnswer;
      }
      return true;
    });
  }, [isSubmitted, questions, reviewSubjectFilter, reviewMistakesOnly, answers]);

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
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer shrink-0"
            title="Exit JAMB Practice"
          >
            <ArrowLeft size={20} />
          </button>
          
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase border ${currentSubjectTab ? currentSubjectTab.badgeBg : currentSubjectMeta.badgeBg}`}>
                {currentSubjectTab ? currentSubjectTab.code : currentSubjectMeta.code}
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                {currentSubjectTab ? currentSubjectTab.name : currentSubjectMeta.name}
              </span>
              {subjectTabs.length > 1 && (
                <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-[10px] sm:text-xs font-mono font-bold border border-blue-200 dark:border-blue-800">
                  {currentSubjectTab?.name || currentSubjectMeta.name} {questionNumberInSubject}/{totalQuestionsInSubject}
                </span>
              )}
              {currentQ?.year && (
                <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold border border-slate-200 dark:border-slate-700">
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
            <span className="hidden sm:inline">Palette ({totalAnswered}/{questions.length})</span>
          </button>
        </div>
      </div>

      {/* Shortfall Notice: When requested count exceeds available in bank */}
      {shortfallNotice && (
        <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-3 shadow-xs">
          <AlertCircle size={18} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold block text-amber-800 dark:text-amber-300">
              Question Bank Availability Notice
            </span>
            <p className="leading-relaxed">
              {shortfallNotice} LearnDean strictly isolates questions and never substitutes questions from other subjects. Practicing with all {questions.length} authentic questions.
            </p>
          </div>
        </div>
      )}

      {/* COURSE COMBO PRE-PRACTICE / STRUCTURE SUMMARY BANNER */}
      {subjectTabs.length > 1 && !isSubmitted && (
        <div className="bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 sm:p-4 text-xs space-y-2.5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-xs">
              <Layers size={14} className="text-blue-600" />
              Selected JAMB Course Combination Structure:
            </span>
            <span className="font-mono font-extrabold text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
              Total — {questions.length} questions
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {subjectTabs.map(tab => (
              <div 
                key={tab.id}
                onClick={() => handleSwitchSubject(tab)}
                className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                  currentSubjectTab?.id === tab.id
                    ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-300 dark:border-blue-700 ring-1 ring-blue-500/20'
                    : 'bg-white dark:bg-slate-800 border-slate-200/80 dark:border-slate-700/80 hover:border-slate-300'
                }`}
              >
                <div className="min-w-0 pr-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">{tab.code}</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 truncate block text-[11px] sm:text-xs">{tab.name}</span>
                </div>
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400 shrink-0 text-xs">
                  {tab.count} Qs
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBJECT NAVIGATOR (For Multi-Subject Course Combo & CBT) */}
      {subjectTabs.length > 1 && !isSubmitted && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-2 sm:p-2.5 shadow-xs">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold shrink-0">
              <Layers size={13} className="text-blue-600" />
              <span>Subjects:</span>
            </div>
            {subjectTabs.map((tab) => {
              const isCurrent = currentSubjectTab?.id === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleSwitchSubject(tab)}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                    isCurrent
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-2 ring-blue-600/40'
                      : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700/80'
                  }`}
                >
                  <span>{tab.name}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                    isCurrent 
                      ? 'bg-blue-700 text-white' 
                      : 'bg-slate-200/80 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}>
                    {tab.answeredCount}/{tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* DEDICATED RESULTS VIEW (When Exam/Practice is Submitted) */}
      {isSubmitted ? (
        <div className="space-y-6 animate-fadeIn">
          {/* 1. Overall Score Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/20">
                  <Award size={16} className="text-amber-400" />
                  <span>JAMB Practice Examination Completed</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black">
                  {subjectTabs.length > 1 ? 'Official JAMB CBT Results' : `${currentSubjectMeta.name} Results`}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                  {subjectTabs.length > 1
                    ? `Completed across all ${subjectTabs.length} isolated subjects without cross-subject substitution.`
                    : `Completed ${questions.length} questions for ${currentSubjectMeta.name}.`}
                </p>
              </div>

              {/* Big Score Badges */}
              <div className="flex items-center gap-4 sm:gap-6 shrink-0">
                <div className="text-center p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
                  <div className="text-3xl sm:text-4xl font-black text-white">
                    {finalScore} <span className="text-lg font-bold text-blue-200">/ {questions.length}</span>
                  </div>
                  <span className="text-[11px] font-bold text-blue-200 uppercase tracking-wider block mt-0.5">
                    Total Correct ({finalPercentage}%)
                  </span>
                </div>

                {subjectTabs.length > 1 && (
                  <div className="text-center p-4 rounded-2xl bg-blue-600/30 backdrop-blur-md border border-blue-400/30">
                    <div className="text-3xl sm:text-4xl font-black text-amber-300">
                      {aggregateJambMarks} <span className="text-lg font-bold text-amber-200">/ 400</span>
                    </div>
                    <span className="text-[11px] font-bold text-amber-200 uppercase tracking-wider block mt-0.5">
                      Scaled UTME Score
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
              <div className="flex items-center gap-4">
                <span>Time Spent: <strong>{formatTime(timeUsedSeconds)}</strong></span>
                <span>Answered: <strong>{totalAnswered}/{questions.length}</strong></span>
                <span>Unanswered: <strong>{totalUnanswered}</strong></span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleRetakeSession}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <RotateCcw size={14} />
                  <span>Retake Practice</span>
                </button>
                <button
                  type="button"
                  onClick={onExit}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition cursor-pointer shadow-md"
                >
                  Exit to JAMB Prep
                </button>
              </div>
            </div>
          </div>

          {/* 2. SUBJECT-BY-SUBJECT BREAKDOWN (Shown Separately) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <BookOpen size={16} className="text-blue-600" />
                <span>Subject Performance Breakdown (Isolated by Subject)</span>
              </h4>
              <span className="text-xs text-slate-500">
                {subjectTabs.length} {subjectTabs.length === 1 ? 'Subject' : 'Subjects'} evaluated
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {subjectTabs.map((tab) => (
                <div 
                  key={tab.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase border ${tab.badgeBg}`}>
                        {tab.code}
                      </span>
                      <h5 className="font-bold text-slate-900 dark:text-white text-sm mt-1 truncate">
                        {tab.name}
                      </h5>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-black text-blue-600 dark:text-blue-400">
                        {tab.percentage}%
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 block">
                        {tab.scaledScore}/100 Marks
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-blue-600 h-full rounded-full transition-all"
                      style={{ width: `${tab.percentage}%` }}
                    />
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-1 pt-1 border-t border-slate-100 dark:border-slate-800 text-[11px]">
                    <div className="text-center">
                      <span className="text-slate-400 block text-[10px]">Correct</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">{tab.correctCount}</span>
                    </div>
                    <div className="text-center">
                      <span className="text-slate-400 block text-[10px]">Wrong</span>
                      <span className="font-bold text-rose-600 dark:text-rose-400">{tab.incorrectCount}</span>
                    </div>
                    <div className="text-center">
                      <span className="text-slate-400 block text-[10px]">Skipped</span>
                      <span className="font-bold text-slate-500">{tab.unansweredCount}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setReviewSubjectFilter(tab.id);
                      setReviewMistakesOnly(false);
                      setCurrentQIndex(tab.startIndex);
                    }}
                    className="w-full py-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>Review {tab.code} Questions</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 3. QUESTION-BY-QUESTION REVIEW SECTION */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-6 md:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText size={18} className="text-blue-600" />
                  <span>Step-by-Step Questions Review & Syllabus Derivations</span>
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Inspect every question, your selected choice, and the official JAMB derivation.
                </p>
              </div>

              {/* Filter controls */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setReviewMistakesOnly(!reviewMistakesOnly)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                    reviewMistakesOnly
                      ? 'bg-rose-50 border-rose-300 text-rose-700 dark:bg-rose-950/40 dark:border-rose-700 dark:text-rose-300'
                      : 'bg-slate-50 border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'
                  }`}
                >
                  {reviewMistakesOnly ? 'Showing Mistakes Only' : 'Show Mistakes Only'}
                </button>
              </div>
            </div>

            {/* Subject Filter Chips for Review */}
            {subjectTabs.length > 1 && (
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                <button
                  type="button"
                  onClick={() => setReviewSubjectFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
                    reviewSubjectFilter === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  All Subjects ({questions.length})
                </button>
                {subjectTabs.map(tab => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setReviewSubjectFilter(tab.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
                      reviewSubjectFilter === tab.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {tab.name} ({tab.count})
                  </button>
                ))}
              </div>
            )}

            {/* Questions Review List */}
            <div className="space-y-6">
              {filteredReviewQuestions.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  No questions match your current review filter.
                </div>
              ) : (
                filteredReviewQuestions.map(({ q, idx }) => {
                  const userAns = answers[idx];
                  const isCorrect = userAns === q.correctAnswer;
                  const isUnanswered = userAns === undefined;
                  const qSubjectKey = canonicalSubjectKey(q.subjectName || q.subject);
                  const qSubjectDisplayName = getCanonicalSubjectDisplayName(qSubjectKey);
                  const tabForQ = subjectTabs.find(t => t.id === qSubjectKey);
                  const numInSub = tabForQ ? (idx - tabForQ.startIndex + 1) : (idx + 1);

                  return (
                    <div 
                      key={idx}
                      className="p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-4"
                    >
                      {/* Review Question Header */}
                      <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-200/60 dark:border-slate-800 pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 text-xs font-bold">
                            {qSubjectDisplayName} • Q{numInSub}
                          </span>
                          <span className="text-xs text-slate-500">
                            (Overall Question {idx + 1})
                          </span>
                          {q.year && (
                            <span className="text-xs text-slate-400">
                              • JAMB {q.year}
                            </span>
                          )}
                        </div>

                        <div>
                          {isCorrect ? (
                            <span className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-1">
                              <CheckCircle2 size={14} /> Correct (+1)
                            </span>
                          ) : isUnanswered ? (
                            <span className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold">
                              Unanswered
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-lg bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center gap-1">
                              <XCircle size={14} /> Incorrect
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Passage if any */}
                      {q.passage && (
                        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-serif leading-relaxed text-slate-700 dark:text-slate-300 max-h-48 overflow-y-auto">
                          {q.passage}
                        </div>
                      )}

                      {/* Question Text */}
                      <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-relaxed">
                        {q.question}
                      </div>

                      {/* Options */}
                      <div className="space-y-2 pt-1">
                        {q.options?.map((opt: string, optIdx: number) => {
                          const optLetter = String.fromCharCode(65 + optIdx);
                          const isOptionCorrect = q.correctAnswer === optIdx;
                          const isUserChoice = userAns === optIdx;

                          let style = 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300';
                          if (isOptionCorrect) {
                            style = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 text-emerald-900 dark:text-emerald-100 ring-1 ring-emerald-400';
                          } else if (isUserChoice && !isOptionCorrect) {
                            style = 'bg-rose-50 dark:bg-rose-950/40 border-rose-400 text-rose-900 dark:text-rose-100 ring-1 ring-rose-400';
                          }

                          return (
                            <div 
                              key={optIdx}
                              className={`p-3 rounded-xl border flex items-center justify-between text-xs sm:text-sm font-medium ${style}`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <span className="w-6 h-6 rounded-lg font-bold flex items-center justify-center text-xs shrink-0 bg-slate-100 dark:bg-slate-700">
                                  {optLetter}
                                </span>
                                <span className="break-words">{opt}</span>
                              </div>

                              <div className="shrink-0 ml-2">
                                {isOptionCorrect && (
                                  <span className="text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-1">
                                    <Check size={14} /> Correct Answer
                                  </span>
                                )}
                                {isUserChoice && !isOptionCorrect && (
                                  <span className="text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-1">
                                    <X size={14} /> Your Choice
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Official Explanation */}
                      {q.explanation && (
                        <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60 space-y-1.5 text-xs">
                          <span className="font-bold text-blue-700 dark:text-blue-300 flex items-center gap-1 uppercase tracking-wider text-[10px]">
                            <BookOpen size={13} /> Official JAMB Syllabus Derivation:
                          </span>
                          <p className="text-slate-700 dark:text-slate-200 leading-relaxed font-mono whitespace-pre-line">
                            {q.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      ) : (!hasStartedPractice && subjectTabs.length > 1) ? (
        /* COURSE COMBO PRE-PRACTICE STRUCTURE SCREEN */
        <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 md:p-10 shadow-lg space-y-6 animate-fadeIn">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-xs font-bold border border-blue-200 dark:border-blue-800">
              <Layers size={14} className="text-blue-600" />
              <span>JAMB UTME Course Combination Practice</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Selected Course Combination
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Selected subjects and exact question counts before practice starts. Each subject is strictly isolated.
            </p>
          </div>

          {/* Clearly display every selected subject and its question count */}
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="space-y-2">
              {subjectTabs.map(tab => (
                <div 
                  key={tab.id}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs sm:text-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase border ${tab.badgeBg}`}>
                      {tab.code}
                    </span>
                    <span className="font-extrabold text-slate-900 dark:text-white">
                      {tab.name}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                    — {tab.count} questions
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-sm sm:text-base font-black text-slate-900 dark:text-white">
              <span>Total</span>
              <span className="font-mono text-blue-600 dark:text-blue-400 font-extrabold">
                — {questions.length} questions
              </span>
            </div>
          </div>

          {shortfallNotice && (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-3">
              <AlertCircle size={18} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold block text-amber-800 dark:text-amber-300">Question Bank Availability Notice</span>
                <p>{shortfallNotice}</p>
              </div>
            </div>
          )}

          <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60 space-y-2 text-xs text-slate-700 dark:text-slate-300">
            <span className="font-bold text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
              <Sparkles size={14} className="text-blue-600" />
              Practice Rules &amp; Subject Isolation:
            </span>
            <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400">
              <li>Each subject's questions are kept completely separate without cross-subject substitution.</li>
              <li>You can switch between subjects anytime using the Subject Navigator without losing your answers.</li>
              <li>Final results show each subject's performance separately and your overall scaled UTME score.</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onExit}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 cursor-pointer"
            >
              Exit to JAMB Prep
            </button>
            <button
              type="button"
              onClick={() => setHasStartedPractice(true)}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-black shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition cursor-pointer hover:scale-[1.01]"
            >
              <span>Begin Practice ({questions.length} Questions)</span>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      ) : (
        /* MAIN ACTIVE PRACTICE SCREEN */
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 items-start">
          {/* Main Question Card */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-xs space-y-5 sm:space-y-6">
              {/* Question Header Status */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-3.5 py-1.5 rounded-xl bg-blue-600 text-white text-xs sm:text-sm font-black shadow-xs flex items-center gap-1.5">
                    <span>{currentSubjectTab?.name || currentSubjectMeta.name}</span>
                    <span className="font-mono">{questionNumberInSubject}/{totalQuestionsInSubject}</span>
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold hidden sm:inline">
                    (Overall Q{currentQIndex + 1} of {questions.length})
                  </span>
                  {currentQ?.topic && (
                    <span className="text-xs text-slate-500 dark:text-slate-400 hidden md:inline">
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
                {currentQ?.options?.map((optText: string, optIdx: number) => {
                  const optLetter = String.fromCharCode(65 + optIdx);
                  const isSelected = answers[currentQIndex] === optIdx;

                  let optionStyle = 'border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/80 hover:border-slate-300 dark:hover:border-slate-600';
                  let badgeStyle = 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';

                  if (isSelected) {
                    optionStyle = 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/40 text-blue-900 dark:text-blue-100 ring-2 ring-blue-600/30';
                    badgeStyle = 'bg-blue-600 text-white';
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full p-3 sm:p-4 rounded-2xl border text-left flex items-start sm:items-center justify-between gap-3 transition-all cursor-pointer min-w-0 ${optionStyle}`}
                    >
                      <div className="flex items-start sm:items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                        <span className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl font-bold flex items-center justify-center text-xs sm:text-sm shrink-0 transition-colors mt-0.5 sm:mt-0 ${badgeStyle}`}>
                          {optLetter}
                        </span>
                        <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 break-words flex-1 min-w-0 leading-snug sm:leading-normal">
                          {optText}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
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

              <button
                type="button"
                onClick={() => setShowSubmitModal(true)}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/20 transition cursor-pointer"
              >
                Submit Practice
              </button>

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

              {/* Subject Tabs Filter within Question Palette if multi-subject */}
              {subjectTabs.length > 1 && (
                <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar">
                  <button
                    type="button"
                    onClick={() => setPaletteSubjectTab('all')}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition cursor-pointer ${
                      paletteSubjectTab === 'all'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    All ({questions.length})
                  </button>
                  {subjectTabs.map(tab => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setPaletteSubjectTab(tab.id)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition cursor-pointer ${
                        paletteSubjectTab === tab.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {tab.code} ({tab.count})
                    </button>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-5 gap-2 max-h-72 overflow-y-auto pr-1">
                {questions.map((q, idx) => {
                  const qSubKey = canonicalSubjectKey(q.subjectName || q.subject);
                  if (paletteSubjectTab !== 'all' && qSubKey !== paletteSubjectTab) {
                    return null;
                  }

                  const isCurrent = currentQIndex === idx;
                  const isAnswered = answers[idx] !== undefined;
                  const isFlagged = markedForReview[idx];

                  let btnBg = 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700';

                  if (isAnswered) {
                    btnBg = 'bg-blue-600 text-white border-blue-700';
                  } else if (isFlagged) {
                    btnBg = 'bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 border-purple-300';
                  }

                  // Number inside button: if filtered to single subject, show subject question number
                  const tabForQ = subjectTabs.find(t => t.id === qSubKey);
                  const displayNum = paletteSubjectTab !== 'all' && tabForQ
                    ? (idx - tabForQ.startIndex + 1)
                    : (idx + 1);

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCurrentQIndex(idx)}
                      className={`h-9 rounded-xl border text-xs font-bold transition flex items-center justify-center relative cursor-pointer ${btnBg} ${
                        isCurrent ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900 scale-105 z-10' : ''
                      }`}
                    >
                      {displayNum}
                      {isFlagged && (
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
      )}

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
              Are you sure you want to finish your practice session? You will immediately see your score, subject-by-subject breakdown, and complete syllabus derivations.
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
