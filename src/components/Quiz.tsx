import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp, doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { SUBJECT_DATA, ALL_SUBJECTS } from '../data/subjects';

interface Question {
  question: string;
  options: string[];
  correctAnswerIndex?: number;
  correctAnswer?: any;
  explanation: string;
  difficulty: string;
  topic: string;
}

let cachedInternalSession: any = null;

export default function Quiz({ onBack, setView }: { onBack?: () => void, setView?: (v: any) => void }) {
  const { user, getToken, settings, userProfile } = useAuth();

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
  const [timerDuration, setTimerDuration] = useState<number>(cachedInternalSession ? cachedInternalSession.timerDuration : 30); // in minutes
  const [timerRemaining, setTimerRemaining] = useState<number>(cachedInternalSession ? cachedInternalSession.timerRemaining : 1800); // in seconds
  const [isSubmitted, setIsSubmitted] = useState(cachedInternalSession ? cachedInternalSession.isSubmitted : false);
  const [score, setScore] = useState(cachedInternalSession ? cachedInternalSession.score : 0);
  const [timeUsedSeconds, setTimeUsedSeconds] = useState<number>(() => {
    if (cachedInternalSession?.timeUsedSeconds) return cachedInternalSession.timeUsedSeconds;
    return 0;
  });

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
    if (cachedInternalSession?.subjectId) return cachedInternalSession.subjectId;
    const targetId = localStorage.getItem('zetadu_target_subject_id');
    if (targetId) return targetId;
    return 'mathematics';
  });
  
  const [subject, setSubject] = useState(() => {
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
    if (cachedInternalSession?.topic) return cachedInternalSession.topic;
    return localStorage.getItem('zetadu_target_topic') || '';
  });
  const [difficulty, setDifficulty] = useState(cachedInternalSession ? cachedInternalSession.difficulty : (settings?.defaultPracticeDifficulty || 'Medium'));
  const [amount, setAmount] = useState(cachedInternalSession ? cachedInternalSession.amount : 60);
  const [practiceMode, setPracticeMode] = useState(cachedInternalSession ? cachedInternalSession.practiceMode || 'Custom Practice' : 'Custom Practice');

  const [hasRestored, setHasRestored] = useState(!!cachedInternalSession);
  const [showLeavePrompt, setShowLeavePrompt] = useState(false);
  const [showSubmitPrompt, setShowSubmitPrompt] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedTimerRef = useRef<number>(timerRemaining);
  const questionCardRef = useRef<HTMLDivElement | null>(null);

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

  // Load session on mount (memory -> localStorage -> Firestore)
  useEffect(() => {
    const loadSession = async () => {
      if (cachedInternalSession && !cachedInternalSession.setupMode && cachedInternalSession.questions?.length > 0) {
        setHasRestored(true);
        return;
      }

      let foundSession = false;
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
      
      if (!foundSession && user) {
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

  // Persist session state helper (saves to memory, localStorage, and Firestore)
  const persistSessionToFirebase = useCallback(async (overrides?: Partial<any>) => {
    if (setupMode || questions.length === 0 || isSubmitted) return;

    const sessionData = {
      uid: user?.uid,
      setupMode: false,
      level,
      selectedClass,
      subjectId,
      subject,
      topic,
      difficulty,
      amount,
      timerDuration,
      timerRemaining,
      questions,
      currentQIndex,
      answers,
      markedForReview,
      isSubmitted: false,
      score,
      updatedAt: Date.now(),
      ...overrides
    };

    cachedInternalSession = sessionData;
    try {
      localStorage.setItem('practice_session', JSON.stringify(sessionData));
    } catch (e) {
      console.warn("Local storage write error", e);
    }

    if (user && !isSubmitted) {
      try {
        await setDoc(doc(db, 'practice_sessions', user.uid), {
          ...sessionData,
          updatedAt: serverTimestamp()
        }, { merge: true });
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

    timerRef.current = setInterval(() => {
      setTimerRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleTimeUp();
          return 0;
        }
        const updated = prev - 1;
        
        // Save to localStorage every second
        try {
          const cached = localStorage.getItem('practice_session');
          if (cached) {
            const parsed = JSON.parse(cached);
            parsed.timerRemaining = updated;
            localStorage.setItem('practice_session', JSON.stringify(parsed));
          }
        } catch (e) {}

        // Periodically sync timer to Firestore every 30 seconds
        if (Math.abs(lastSavedTimerRef.current - updated) >= 30) {
          lastSavedTimerRef.current = updated;
          if (user) {
            setDoc(doc(db, 'practice_sessions', user.uid), {
              timerRemaining: updated,
              updatedAt: serverTimestamp()
            }, { merge: true }).catch(() => {});
          }
        }

        return updated;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [setupMode, isSubmitted, questions.length, viewMode, user]);

  const clearSession = async () => {
    cachedInternalSession = null;
    localStorage.removeItem('practice_session');
    localStorage.removeItem('zetadu_target_subject_id');
    localStorage.removeItem('zetadu_target_subject');
    localStorage.removeItem('zetadu_target_topic');
    if (user) {
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

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    try {
      const token = await getToken();
      
      const response = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          subject: subject,
          topic: topic || 'General',
          difficulty: difficulty,
          amount: amount,
          educationLevel: level,
          country: userProfile?.country || 'Nigeria',
          practiceMode: practiceMode
        })
      });

      if (!response.ok) {
        if (response.status === 401) throw new Error("Authentication required");
        throw new Error("Failed to generate questions.");
      }
      
      const contentType = response.headers.get("content-type");
      if (!contentType || contentType.indexOf("application/json") === -1) {
        throw new Error('Generation returned non-JSON response');
      }

      const data = await response.json();

      if (!data.questions || data.questions.length === 0) {
        throw new Error("No questions are currently available for this subject.");
      }

      setQuestions(data.questions);
      setScore(0);
      setCurrentQIndex(0);
      setAnswers({});
      setMarkedForReview({});
      setTimerRemaining(timerDuration * 60);
      setSetupMode(false);
      setIsSubmitted(false);
      setViewMode('practice');

      // Initialize persistent session immediately
      const initialSession = {
        uid: user?.uid,
        setupMode: false,
        level,
        selectedClass,
        subjectId,
        subject,
        topic,
        difficulty,
        amount,
        practiceMode,
        timerDuration,
        timerRemaining: timerDuration * 60,
        questions: data.questions,
        currentQIndex: 0,
        answers: {},
        markedForReview: {},
        isSubmitted: false,
        score: 0,
        updatedAt: Date.now()
      };
      cachedInternalSession = initialSession;
      try {
        localStorage.setItem('practice_session', JSON.stringify(initialSession));
      } catch (e) {}

      if (user) {
        try {
          await setDoc(doc(db, 'practice_sessions', user.uid), {
            ...initialSession,
            updatedAt: serverTimestamp()
          });
        } catch (dbErr) {
          console.warn("Silent initialize session in firestore warning", dbErr);
        }

        try {
          await addDoc(collection(db, 'ai_history'), {
            uid: user.uid,
            type: 'question_generation',
            content: `Generated ${data.questions.length} questions for ${subject}${topic ? ' - ' + topic : ''}`,
            metadata: {
              subject,
              topic,
              difficulty,
              amount: data.questions.length,
              questions: data.questions
            },
            createdAt: serverTimestamp()
          });
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

  const handleOptionClick = (index: number) => {
    if (isSubmitted || viewMode !== 'practice') return;
    const newAnswers = {
      ...answers,
      [currentQIndex]: index
    };
    setAnswers(newAnswers);
    // Instant background save
    persistSessionToFirebase({ answers: newAnswers });
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

  const calculateScore = () => {
    let s = 0;
    questions.forEach((q, i) => {
      if (answers[i] !== undefined && isOptionCorrect(q, answers[i])) {
        s++;
      }
    });
    return s;
  };

  const confirmSubmit = async () => {
    setShowSubmitPrompt(false);
    const finalScore = calculateScore();
    const usedSeconds = Math.max(0, (timerDuration * 60) - timerRemaining);
    setScore(finalScore);
    setTimeUsedSeconds(usedSeconds);
    setIsSubmitted(true);
    setViewMode('results');
    
    if (user) {
      try {
        await addDoc(collection(db, 'learning_data'), {
          uid: user.uid,
          subject,
          topic: topic || 'General',
          difficulty,
          score: finalScore,
          totalQuestions: questions.length,
          percentage: Math.round((finalScore / questions.length) * 100),
          timeUsedSeconds: usedSeconds,
          answeredQuestions: questions.map((q, i) => ({
            ...q,
            userAnswerIndex: answers[i] !== undefined ? answers[i] : null
          })),
          updatedAt: serverTimestamp()
        });
      } catch (err) {
        console.warn("Silent save learning data warning:", err);
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
        <div className="w-full max-w-7xl mx-auto pb-12 flex flex-col">
          <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shrink-0">
            <div className="flex items-center gap-4">
              {onBack && (
                <button 
                  id="quiz-back-button"
                  onClick={onBack} 
                  className="p-2.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors self-start"
                >
                  <ArrowLeft size={24} />
                </button>
              )}
              <div>
                <p className="text-xs font-bold tracking-widest text-blue-600 dark:text-blue-400 uppercase mb-1">
                  Practice Session
                </p>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Select a Subject
                </h2>
              </div>
            </div>
            
            <div className="relative w-full md:w-96">
              <input 
                id="quiz-search-subjects-input"
                type="text" 
                placeholder="Search subjects..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-xs"
              />
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 flex-1 pb-8">
            {filtered.map((sub) => (
              <button
                key={sub.id}
                id={`quiz-subject-${sub.id}`}
                onClick={() => {
                  setSubjectId(sub.id);
                  setSubject(sub.name);
                  setSetupStep(2);
                }}
                className="bg-white dark:bg-slate-800 rounded-3xl p-6 border-2 border-slate-100 dark:border-slate-700/60 hover:border-blue-500 dark:hover:border-blue-500 shadow-xs hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between text-left relative"
              >
                <div>
                  <div className="flex justify-between items-start mb-5">
                    <div className={`p-4 rounded-2xl text-white shadow-sm ${sub.color} group-hover:scale-105 transition-transform duration-200`}>
                      <BookOpen size={26} />
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                    {sub.name}
                  </h3>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{sub.category}</p>
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
        </div>
      );
    }

    return (
      <div className="w-full max-w-2xl mx-auto pb-12">
        <div className="mb-8 flex items-center justify-between">
          <button 
            id="quiz-back-to-step1"
            onClick={() => setSetupStep(1)} 
            className="p-2.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="text-center flex-1 mr-10">
            <p className="text-xs font-bold tracking-wider text-blue-600 dark:text-blue-400 uppercase mb-1">
              Setup Practice
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Zetadu Practice Session</h2>
          </div>
        </div>
        
        <form onSubmit={handleGenerate} className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
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
                <option value={5}>5 Questions</option>
                <option value={10}>10 Questions</option>
                <option value={20}>20 Questions</option>
                <option value={30}>30 Questions</option>
                <option value={40}>40 Questions</option>
                <option value={60}>60 Questions</option>
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

  // Current Question
  const question = questions[currentQIndex] || questions[0];
  const answeredCount = Object.keys(answers).length;
  const unansweredCount = Math.max(0, questions.length - answeredCount);
  const correctCount = calculateScore();
  const incorrectCount = questions.length - correctCount;
  const percentage = Math.round((correctCount / questions.length) * 100) || 0;

  // Render 2: Dedicated Results Page (Requirement 11)
  if (viewMode === 'results') {
    return (
      <div className="w-full max-w-4xl mx-auto pb-16 px-4">
        {/* Results Card */}
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-700 shadow-md text-center relative overflow-hidden"
        >
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-bold mb-6">
            <Trophy size={18} className="text-blue-600 dark:text-blue-400" />
            Practice Session Completed
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
            {subject}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base font-medium mb-8">
            {topic ? `${topic} • ` : ''}{difficulty} Difficulty • {questions.length} Questions
          </p>

          {/* Main Percentage & Score Display */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 py-6 mb-8 border-y border-slate-100 dark:border-slate-700/60">
            <div className="flex flex-col items-center">
              <div className={`w-32 h-32 rounded-full border-8 flex flex-col items-center justify-center ${
                percentage >= 70 
                  ? 'border-emerald-500 text-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/20' 
                  : percentage >= 50 
                    ? 'border-blue-500 text-blue-600 bg-blue-50/50 dark:bg-blue-950/20' 
                    : 'border-amber-500 text-amber-600 bg-amber-50/50 dark:bg-amber-950/20'
              }`}>
                <span className="text-3xl font-black">{percentage}%</span>
                <span className="text-xs uppercase font-bold tracking-wider opacity-80">Score</span>
              </div>
            </div>

            <div className="text-left space-y-2">
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {percentage >= 75 ? 'Outstanding Performance!' : percentage >= 50 ? 'Good Effort!' : 'Keep Practicing!'}
              </p>
              <p className="text-slate-600 dark:text-slate-400 max-w-sm text-sm sm:text-base">
                You correctly answered <span className="font-bold text-slate-900 dark:text-white">{correctCount}</span> out of <span className="font-bold text-slate-900 dark:text-white">{questions.length}</span> questions.
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10 text-left">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">
                <Award size={16} className="text-blue-500" /> Total Score
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {correctCount} <span className="text-sm font-medium text-slate-400">/ {questions.length}</span>
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
                <CheckCircle2 size={16} /> Correct
              </div>
              <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
                {correctCount}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider mb-1">
                <XCircle size={16} /> Incorrect
              </div>
              <p className="text-2xl font-bold text-rose-700 dark:text-rose-400">
                {incorrectCount}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">
                <Clock size={16} className="text-purple-500" /> Time Used
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {formatTimeSpentString(timeUsedSeconds)}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              id="quiz-results-review-button"
              onClick={() => {
                setCurrentQIndex(0);
                setViewMode('review');
              }}
              className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-colors shadow-sm flex items-center justify-center gap-2.5 text-base cursor-pointer"
            >
              <Eye size={20} /> Review Answers
            </button>

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
          </div>
        </motion.div>
      </div>
    );
  }

  // Reusable Questions Panel (Used for both Desktop sidebar and Mobile drawer)
  const renderQuestionsPanel = () => (
    <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-5 flex flex-col h-full shadow-xs">
      <div className="flex justify-between items-center mb-4 shrink-0">
        <div>
          <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Questions</h3>
          <p className="text-xs text-slate-500 font-medium">
            {viewMode === 'review' ? 'Review questions' : `${answeredCount} of ${questions.length} Answered`}
          </p>
        </div>
        {showMobileNav && (
          <button 
            id="quiz-close-mobile-drawer"
            onClick={() => setShowMobileNav(false)} 
            className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Grid of question numbers */}
      <div className="flex-1 overflow-y-auto pr-1 min-h-0 py-1">
        <div className="grid grid-cols-5 gap-2 w-full">
          {questions.map((q, i) => {
            const isAnswered = answers[i] !== undefined;
            const isMarked = markedForReview[i];
            const isCurrent = currentQIndex === i;
            
            let btnClass = "w-full aspect-square min-w-0 rounded-xl font-bold text-sm flex items-center justify-center transition-all relative shrink-0 cursor-pointer ";
            
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
      <div className="flex items-center justify-between mb-6 shrink-0 gap-4">
        <div className="flex items-center gap-3">
          <button 
            id="quiz-header-back-button"
            onClick={() => {
              if (viewMode === 'review') {
                setViewMode('results');
              } else {
                setShowLeavePrompt(true);
              }
            }}
            className="p-2.5 rounded-2xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft size={22} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">{subject}</h2>
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

        {viewMode === 'practice' ? (
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-2xl text-slate-700 dark:text-slate-300 font-mono font-bold text-sm shadow-2xs">
            <Clock size={16} className={timerRemaining <= 180 ? 'text-rose-500 animate-pulse' : 'text-blue-600'} />
            <span className={timerRemaining <= 180 ? 'text-rose-600 dark:text-rose-400' : ''}>
              {formatTime(timerRemaining)}
            </span>
          </div>
        ) : (
          <button
            id="quiz-back-to-results-btn"
            onClick={() => setViewMode('results')}
            className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl text-sm font-bold hover:bg-blue-100 transition-colors cursor-pointer"
          >
            Back to Results
          </button>
        )}
      </div>

      {/* Main Content Layout: Question Area + Desktop Sidebar */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* Main Question Area (No internal scrollbar clamp) */}
        <div className="flex-1 w-full min-w-0" ref={questionCardRef}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-xs"
            >
              {/* Question Card Header */}
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100 dark:border-slate-700/60 gap-4">
                <span className="inline-block px-3.5 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs sm:text-sm font-bold">
                  Question {currentQIndex + 1} of {questions.length}
                </span>

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
                    <span>{markedForReview[currentQIndex] ? 'Marked for Review' : 'Mark for Review'}</span>
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

                  let cardStyle = "border-2 transition-all duration-150 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer text-left w-full ";

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
          <div className="mt-6 flex flex-wrap gap-3 items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
            {/* Previous and Next Buttons (Requirement 7) */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                id="quiz-nav-prev-btn"
                onClick={handlePrev}
                disabled={currentQIndex === 0}
                className="flex items-center justify-center gap-1.5 px-4 sm:px-6 py-3 min-h-[44px] rounded-xl font-bold text-sm sm:text-base transition-colors bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ArrowLeft size={18} /> <span>Previous</span>
              </button>

              <button
                id="quiz-nav-next-btn"
                onClick={handleNext}
                disabled={currentQIndex === questions.length - 1}
                className="flex items-center justify-center gap-1.5 px-4 sm:px-6 py-3 min-h-[44px] rounded-xl font-bold text-sm sm:text-base transition-colors bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <span>Next</span> <ArrowRight size={18} />
              </button>
            </div>

            {/* Middle/Right: Mobile Questions Panel Toggle & ONLY ONE Submit Button (Requirements 5 & 14) */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Mobile Drawer Trigger (Hidden on Desktop) */}
              <button 
                id="quiz-open-mobile-drawer-btn"
                onClick={() => setShowMobileNav(true)}
                className="lg:hidden flex items-center justify-center gap-2 px-4 py-3 min-h-[44px] rounded-xl font-bold text-sm transition-colors bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200 cursor-pointer"
              >
                <Menu size={18} />
                <span>Questions ({answeredCount}/{questions.length})</span>
              </button>

              {/* The ONLY Submit Quiz button in the entire view (Requirement 5) */}
              {viewMode === 'practice' && (
                <button
                  id="quiz-submit-single-button"
                  onClick={() => setShowSubmitPrompt(true)}
                  className="flex items-center justify-center gap-2 px-6 py-3 min-h-[44px] rounded-xl font-bold text-sm sm:text-base transition-colors bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer"
                >
                  <CheckCircle2 size={18} />
                  <span>Submit Quiz</span>
                </button>
              )}

              {viewMode === 'review' && (
                <button
                  id="quiz-review-back-to-summary"
                  onClick={() => setViewMode('results')}
                  className="flex items-center justify-center gap-2 px-5 py-3 min-h-[44px] rounded-xl font-bold text-sm transition-colors bg-blue-600 hover:bg-blue-700 text-white shadow-xs cursor-pointer"
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
                className="w-4/5 max-w-sm bg-white dark:bg-slate-900 h-full p-4 shadow-2xl overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {renderQuestionsPanel()}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
