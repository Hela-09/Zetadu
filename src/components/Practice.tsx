import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, AlertCircle, Loader2, Settings, ArrowLeft, ArrowRight, Flag, Menu, X, Clock, Search, BookOpen } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase/config';
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

export default function Practice() {
  const { user, getToken, settings, userProfile } = useAuth();
  const getNormalizedCorrectIndex = (question: any): number => {
    let correctValue = question.correctAnswerIndex !== undefined ? question.correctAnswerIndex : question.correctAnswer;
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

  const isOptionCorrect = (question: any, index: number | null) => {
    if (index === null) return false;
    return getNormalizedCorrectIndex(question) === index;
  };

  const [setupMode, setSetupMode] = useState(cachedInternalSession ? cachedInternalSession.setupMode : true);
  const [setupStep, setSetupStep] = useState(() => {
    if (localStorage.getItem('educore_target_subject_id')) return 2;
    return 1;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<Question[]>(cachedInternalSession ? cachedInternalSession.questions : []);
  const [currentQIndex, setCurrentQIndex] = useState(cachedInternalSession ? cachedInternalSession.currentQIndex : 0);
  
  // CBT State
  const [answers, setAnswers] = useState<Record<number, number>>(cachedInternalSession ? cachedInternalSession.answers : {});
  const [markedForReview, setMarkedForReview] = useState<Record<number, boolean>>(cachedInternalSession ? cachedInternalSession.markedForReview : {});
  const [timerDuration, setTimerDuration] = useState<number>(cachedInternalSession ? cachedInternalSession.timerDuration : 30); // in minutes
  const [timerRemaining, setTimerRemaining] = useState<number>(cachedInternalSession ? cachedInternalSession.timerRemaining : 1800); // in seconds
  const [isSubmitted, setIsSubmitted] = useState(cachedInternalSession ? cachedInternalSession.isSubmitted : false);
  const [score, setScore] = useState(cachedInternalSession ? cachedInternalSession.score : 0);

  // Form state
  const [level, setLevel] = useState<string>(() => {
    if (cachedInternalSession) return cachedInternalSession.level;
    return userProfile?.educationLevel || 'Secondary';
  });
  const [selectedClass, setSelectedClass] = useState<string>(() => {
    if (cachedInternalSession) return cachedInternalSession.selectedClass;
    if (level === 'Primary') return 'Primary 6';
    if (level === 'Secondary') return 'SSS 3';
    return '100 Level';
  });
  const [subjectId, setSubjectId] = useState<string>(() => {
    if (cachedInternalSession && cachedInternalSession.subjectId) return cachedInternalSession.subjectId;
    const targetId = localStorage.getItem('educore_target_subject_id');
    if (targetId) return targetId;
    return 'mathematics';
  });
  
  const [subject, setSubject] = useState(() => {
    if (cachedInternalSession) return cachedInternalSession.subject;
    const targetId = localStorage.getItem('educore_target_subject_id');
    if (targetId) {
      const found = ALL_SUBJECTS.find(s => s.id === targetId);
      if (found) return found.name;
    }
    const target = localStorage.getItem('educore_target_subject');
    return target || 'Mathematics';
  });
  const [topic, setTopic] = useState(cachedInternalSession ? cachedInternalSession.topic : '');
  const [difficulty, setDifficulty] = useState(cachedInternalSession ? cachedInternalSession.difficulty : (settings?.defaultPracticeDifficulty || 'Medium'));
  const [amount, setAmount] = useState(cachedInternalSession ? cachedInternalSession.amount : 60);

  const [hasRestored, setHasRestored] = useState(!!cachedInternalSession);
  const [showResumePrompt, setShowResumePrompt] = useState(false);
  const [savedSession, setSavedSession] = useState<any>(null);

  const [showLeavePrompt, setShowLeavePrompt] = useState(false);
  const [showSubmitPrompt, setShowSubmitPrompt] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load session on mount
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
            if (!parsed.uid || (user && parsed.uid === user.uid)) {
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
             if (data && !data.setupMode && data.questions && data.questions.length > 0) {
               restoreSessionData(data);
             }
          }
        } catch (err) {
           console.warn("Failed to load session from firestore", err);
        }
      }
      setHasRestored(true);
    };
    
    if (!hasRestored) {
       loadSession();
    }
  }, [user, hasRestored]);

  // Save session on state change
  useEffect(() => {
    if (!hasRestored || setupMode || showResumePrompt || questions.length === 0) return;

    const sessionData = {
      uid: user?.uid,
      setupMode,
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
      isSubmitted,
      score,
      updatedAt: Date.now()
    };
    
    cachedInternalSession = sessionData;
    localStorage.setItem('practice_session', JSON.stringify(sessionData));

    if (user && !isSubmitted) {
      setDoc(doc(db, 'practice_sessions', user.uid), {
         ...sessionData,
         updatedAt: serverTimestamp() 
      }).catch(err => console.warn("Failed to save session to firestore", err));
    }
  }, [setupMode, subjectId, subject, topic, difficulty, level, selectedClass, amount, timerDuration, timerRemaining, questions, currentQIndex, answers, markedForReview, isSubmitted, score, hasRestored, showResumePrompt, user]);

  const restoreSessionData = (data: any) => {
      setLevel(data.level || 'Secondary');
      setSelectedClass(data.selectedClass || 'SSS 3');
      setSubjectId(data.subjectId || 'mathematics');
      setSubject(data.subject || 'Mathematics');
      setTopic(data.topic || '');
      setDifficulty(data.difficulty || 'Medium');
      setAmount(data.amount || 5);
      setTimerDuration(data.timerDuration || 30);
      setTimerRemaining(data.timerRemaining !== undefined ? data.timerRemaining : (data.timerDuration * 60));
      setQuestions(data.questions || []);
      setCurrentQIndex(data.currentQIndex || 0);
      setAnswers(data.answers || {});
      setMarkedForReview(data.markedForReview || {});
      setIsSubmitted(data.isSubmitted || false);
      setScore(data.score || 0);
      setSetupMode(false);
  };

  // Timer effect
  useEffect(() => {
    if (setupMode || isSubmitted || showResumePrompt) {
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
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [setupMode, isSubmitted, showResumePrompt]);

  const clearSession = async () => {
     cachedInternalSession = null;
     localStorage.removeItem('practice_session');
     if (user) {
        try {
           await deleteDoc(doc(db, 'practice_sessions', user.uid));
        } catch(e) {}
     }
  };

  const handleResume = () => {
    if (savedSession) {
      restoreSessionData(savedSession);
    }
    setShowResumePrompt(false);
  };

  const handleLeavePractice = () => {
    setShowLeavePrompt(false);
    setSetupMode(true);
  };

  const handleExitAfterSubmit = async () => {
    await clearSession();
    setSetupMode(true);
  };

  const handleStartNew = async () => {
    await clearSession();
    setShowResumePrompt(false);
    setSetupMode(true);
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
          country: userProfile?.country || 'Nigeria'
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

      if (user) {
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
          console.warn("Failed to log history", dbErr);
        }
      }
    } catch (err: any) {
      console.warn(err);
      alert(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleOptionClick = (index: number) => {
    if (isSubmitted) return;
    setAnswers(prev => ({
      ...prev,
      [currentQIndex]: index
    }));
  };

  const toggleMarkReview = () => {
    setMarkedForReview(prev => ({
      ...prev,
      [currentQIndex]: !prev[currentQIndex]
    }));
  };

  const handleNext = () => {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQIndex > 0) {
      setCurrentQIndex(prev => prev - 1);
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
    setScore(finalScore);
    setIsSubmitted(true);
    
    if (user) {
      try {
        await addDoc(collection(db, 'learning_data'), {
          uid: user.uid,
          subject,
          topic,
          difficulty,
          score: finalScore,
          totalQuestions: questions.length,
          answeredQuestions: questions.map((q, i) => ({
             ...q,
             userAnswerIndex: answers[i]
          })),
          updatedAt: serverTimestamp()
        });
      } catch (err) {
        console.warn("Failed to save score:", err);
      }
    }
    await clearSession();
  };

  const handleTimeUp = () => {
    const finalScore = calculateScore();
    setScore(finalScore);
    setIsSubmitted(true);
    alert("Time's up! Your practice session has been submitted automatically.");
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

  if (showResumePrompt) {
    return (
      <div className="w-full max-w-2xl mx-auto pb-8 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="bento-card dark:bg-slate-800 p-8 text-center max-w-md w-full">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Unfinished Session</h2>
          <p className="text-slate-600 dark:text-slate-300 mb-8">
            You have an unfinished session. Starting a new one will discard the current session.
          </p>
          <div className="space-y-4">
            <button 
              onClick={handleResume}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors"
            >
              Continue Current Session
            </button>
            <button 
              onClick={handleStartNew}
              className="w-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-900 dark:text-white font-bold py-3 rounded-xl transition-colors"
            >
              Start New Session
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (setupMode || questions.length === 0 || !questions[currentQIndex]) {
    if (setupStep === 1) {
      const filtered = ALL_SUBJECTS.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.category.toLowerCase().includes(searchQuery.toLowerCase()));
      return (
        <div className="w-full max-w-7xl mx-auto pb-12 flex flex-col h-full">
          <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6 shrink-0">
            <div>
              <p className="text-sm font-bold tracking-widest text-blue-600 dark:text-blue-400 uppercase mb-2">
                Practice Session
              </p>
              <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Select a Subject</h2>
            </div>
            
            <div className="relative w-full md:w-96">
              <input 
                type="text" 
                placeholder="Search subjects..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm no-spinners"
              />
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 flex-1 overflow-y-auto pb-8 pr-2">
            {filtered.map((sub) => (
              <button
                key={sub.id}
                onClick={() => {
                  setSubjectId(sub.id);
                  setSubject(sub.name);
                  setSetupStep(2);
                }}
                className="bg-white dark:bg-slate-800 rounded-3xl p-6 border-2 border-slate-100 dark:border-slate-700/50 hover:border-blue-200 dark:hover:border-slate-500 shadow-sm hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between text-left relative"
              >
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div className={`p-4 rounded-2xl text-white shadow-md ${sub.color} group-hover:scale-110 transition-transform duration-300`}>
                      <BookOpen size={28} />
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1 pr-6">
                    {sub.name}
                  </h3>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">{sub.category}</p>
                </div>
              </button>
            ))}
            
            {filtered.length === 0 && (
              <div className="col-span-full py-20 text-center flex flex-col items-center">
                 <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-400">
                   <Search size={32} />
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No subjects found</h3>
                 <p className="text-slate-500 dark:text-slate-400">Try adjusting your search.</p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="w-full max-w-2xl mx-auto pb-8">
        <div className="mb-8 flex items-center justify-between">
          <button onClick={() => setSetupStep(1)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div className="text-center flex-1 mr-10">
            <p className="text-sm font-semibold tracking-wide text-blue-600 dark:text-blue-400 uppercase mb-1">
              Setup Quiz
            </p>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Zetadu Practice Session</h2>
          </div>
        </div>
        
        <form onSubmit={handleGenerate} className="bento-card dark:bg-slate-800 p-6 space-y-6">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 rounded-xl mb-2 flex items-center gap-3">
            <BookOpen size={24} className="text-blue-500" />
            <div>
               <p className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider mb-0.5">Selected Subject</p>
               <p className="text-lg font-bold text-slate-900 dark:text-white">{subject}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Education Level</label>
              <select value={level} onChange={(e) => {
                setLevel(e.target.value);
                if (e.target.value === 'Primary') setSelectedClass('Primary 6');
                else if (e.target.value === 'Secondary') setSelectedClass('SSS 3');
                else setSelectedClass('100 Level');
              }} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white">
                <option>Primary</option>
                <option>Secondary</option>
                <option>University</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Class / Exam</label>
              {level === 'Primary' && (
                <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white">
                  {SUBJECT_DATA.Primary.classes.map(c => <option key={c}>{c}</option>)}
                </select>
              )}
              {level === 'Secondary' && (
                <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white">
                  {SUBJECT_DATA.Secondary.classes.map(c => <option key={c}>{c}</option>)}
                </select>
              )}
              {level === 'University' && (
                <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white">
                  {SUBJECT_DATA.University.classes.map(c => <option key={c}>{c}</option>)}
                </select>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Topic (Optional)</label>
              <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., Algebra, Cellular Respiration" className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Difficulty</label>
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white">
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
                <option>Mixed</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Number of Questions</label>
              <select value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white">
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={30}>30</option>
                <option value={40}>40</option>
                <option value={50}>50</option>
                <option value={60}>60</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Timer</label>
              <select value={timerDuration} onChange={(e) => setTimerDuration(Number(e.target.value))} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white">
                <option value={10}>10 minutes</option>
                <option value={20}>20 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>60 minutes</option>
                <option value={90}>90 minutes</option>
              </select>
            </div>
          </div>
          
          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2">
            {loading ? <Loader2 className="animate-spin" /> : <Settings size={20} />}
            {loading ? 'Generating...' : 'Start Practice'}
          </button>
        </form>
      </div>
    );
  }

  const question = questions[currentQIndex];
  const answeredCount = Object.keys(answers).length;
  const unansweredCount = questions.length - answeredCount;

  // Timer warnings
  let timerClass = "text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800";
  if (!isSubmitted) {
    if (timerRemaining <= 60) {
      timerClass = "text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-900/30 animate-pulse font-bold";
    } else if (timerRemaining <= 300) {
      timerClass = "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-900/30 font-medium";
    }
  }

  const renderQuestionNavigator = () => (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-slate-900 dark:text-white">Questions</h3>
        {showMobileNav && (
          <button onClick={() => setShowMobileNav(false)} className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
            <X size={20} />
          </button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-4 xl:grid-cols-5 gap-2">
          {questions.map((_, i) => {
            const isAnswered = answers[i] !== undefined;
            const isMarked = markedForReview[i];
            const isCurrent = currentQIndex === i;
            
            let btnClass = "w-full aspect-square rounded-lg font-medium text-sm flex items-center justify-center border transition-colors relative ";
            
            if (isCurrent) {
              btnClass += "border-blue-600 ring-2 ring-blue-600/30 ";
            } else {
              btnClass += "border-slate-200 dark:border-slate-700 ";
            }

            if (isSubmitted) {
              const correct = isOptionCorrect(questions[i], answers[i]);
              if (correct) btnClass += "bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-400 ";
              else if (!isAnswered) btnClass += "bg-slate-100 text-slate-400 dark:bg-slate-800 ";
              else btnClass += "bg-rose-100 text-rose-700 border-rose-300 dark:bg-rose-900/30 dark:border-rose-800 dark:text-rose-400 ";
            } else {
              if (isAnswered) btnClass += "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 ";
              else btnClass += "bg-white text-slate-600 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 ";
            }

            return (
              <button
                key={i}
                onClick={() => {
                  setCurrentQIndex(i);
                  setShowMobileNav(false);
                }}
                className={btnClass}
              >
                {i + 1}
                {isMarked && !isSubmitted && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border-2 border-white dark:border-slate-800"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>
      
      {!isSubmitted && (
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
          <div className="flex flex-col gap-2 mb-4 text-sm text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800"></div> Answered: {answeredCount}</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"></div> Unanswered: {unansweredCount}</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-400"></div> Marked: {Object.values(markedForReview).filter(Boolean).length}</div>
          </div>
          <button 
            onClick={() => setShowSubmitPrompt(true)}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors"
          >
            Submit Quiz
          </button>
        </div>
      )}
      {isSubmitted && (
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
          <div className="text-center mb-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">Final Score</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{score} / {questions.length}</p>
          </div>
          <button 
            onClick={handleExitAfterSubmit}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors"
          >
            Exit Session
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full max-w-6xl mx-auto pb-8 min-h-[100dvh] flex flex-col relative">
      {/* Leave Prompt */}
      {showLeavePrompt && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Leave practice?</h2>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              Your progress has been saved. You can resume this session later.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowLeavePrompt(false)} className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-900 dark:text-white font-medium rounded-lg transition-colors">Stay</button>
              <button onClick={handleLeavePractice} className="flex-1 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-medium rounded-lg transition-colors">Leave</button>
            </div>
          </div>
        </div>
      )}

      {/* Submit Prompt */}
      {showSubmitPrompt && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full shadow-xl">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Submit Quiz?</h2>
            <div className="space-y-4 mb-8">
              <p className="text-slate-600 dark:text-slate-300">
                You have answered <span className="font-bold text-slate-900 dark:text-white">{answeredCount}</span> of <span className="font-bold text-slate-900 dark:text-white">{questions.length}</span> questions.
              </p>
              {unansweredCount > 0 && (
                <p className="text-amber-600 dark:text-amber-400 font-medium">
                  {unansweredCount} {unansweredCount === 1 ? 'question is' : 'questions are'} unanswered.
                </p>
              )}
              <p className="text-slate-600 dark:text-slate-300">
                Are you sure you want to submit?
              </p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowSubmitPrompt(false)} className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-900 dark:text-white font-medium rounded-xl transition-colors">Continue Practice</button>
              <button onClick={confirmSubmit} className="flex-1 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-colors">Submit Quiz</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2 sm:gap-6 bg-white dark:bg-slate-800 px-4 sm:px-8 rounded-2xl border border-slate-200 dark:border-slate-700 mb-6 shrink-0 shadow-sm h-[76px] sm:h-[96px] w-full box-border">
        
        {/* LEFT */}
        <div className="flex items-center justify-start h-full">
          <button onClick={() => setShowLeavePrompt(true)} className="p-2 -ml-2 shrink-0 flex items-center justify-center min-w-[44px] min-h-[44px] hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-500 dark:text-slate-400 transition-colors">
            <ArrowLeft size={24} />
          </button>
        </div>
        
        {/* CENTER */}
        <div className="flex flex-col justify-center min-w-0 h-full overflow-hidden">
          <h2 className="font-bold text-slate-900 dark:text-white truncate text-base sm:text-lg md:text-xl leading-tight mb-1 w-full block">
            {subject} {topic && `- ${topic}`}
          </h2>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate w-full block">
            Question {currentQIndex + 1} of {questions.length}
          </p>
        </div>

        {/* RIGHT */}
        <div className="flex items-center justify-end gap-2 sm:gap-4 h-full">
          <div className={`h-[44px] flex items-center justify-center px-3 sm:px-4 rounded-xl gap-2 ${timerClass} transition-colors w-[100px] sm:w-[128px]`}>
            <Clock size={18} className="shrink-0" />
            <span className="font-mono text-base sm:text-lg tabular-nums font-bold tracking-tight">{formatTime(timerRemaining)}</span>
          </div>
          
          <button onClick={() => setShowMobileNav(true)} className="lg:hidden min-w-[44px] min-h-[44px] flex items-center justify-center bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-lg text-slate-700 dark:text-slate-300 shrink-0 transition-colors">
            <Menu size={24} />
          </button>
        </div>
      </div>

      <div className="flex gap-6 flex-1 relative">
        {/* Main Question Area */}
        <div className="flex-1 flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex-1 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 md:p-10 shadow-sm"
            >
              <div className="flex justify-between items-start mb-6">
                <span className="bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-lg text-sm font-medium">
                  {question.topic || 'General'}
                </span>
                {!isSubmitted && (
                  <button 
                    onClick={toggleMarkReview}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      markedForReview[currentQIndex] ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    <Flag size={16} className={markedForReview[currentQIndex] ? 'fill-current' : ''} />
                    <span className="hidden sm:inline">{markedForReview[currentQIndex] ? 'Marked for review' : 'Mark for review'}</span>
                  </button>
                )}
              </div>

              <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white mb-8 leading-relaxed whitespace-pre-wrap">
                {question.question}
              </h3>

              <div className="space-y-4 mb-8">
                {question.options.map((option, index) => {
                  const isSelected = answers[currentQIndex] === index;
                  const isCorrect = isSubmitted && isOptionCorrect(question, index);
                  const isWrongSelection = isSubmitted && isSelected && !isOptionCorrect(question, index);
                  
                  let styleClass = "border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 bg-white dark:bg-slate-900/50";
                  
                  if (isSelected && !isSubmitted) {
                    styleClass = "border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100 ring-2 ring-blue-600/20";
                  } else if (isCorrect) {
                    styleClass = "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-900 dark:text-emerald-100 ring-2 ring-emerald-500/20";
                  } else if (isWrongSelection) {
                    styleClass = "border-rose-500 bg-rose-50 dark:bg-rose-900/20 text-rose-900 dark:text-rose-100 ring-2 ring-rose-500/20";
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => handleOptionClick(index)}
                      disabled={isSubmitted}
                      className={`w-full text-left p-4 sm:p-5 rounded-2xl border-2 transition-all duration-200 flex items-center gap-4 ${styleClass}`}
                    >
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 font-medium ${
                        isSelected && !isSubmitted ? 'border-blue-600 bg-blue-600 text-white' :
                        isCorrect ? 'border-emerald-500 bg-emerald-500 text-white' :
                        isWrongSelection ? 'border-rose-500 bg-rose-500 text-white' :
                        'border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400'
                      }`}>
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className={`font-medium flex-1 text-lg ${isSubmitted ? '' : 'text-slate-700 dark:text-slate-200'}`}>
                        {option}
                      </span>
                      {isCorrect && <CheckCircle2 className="text-emerald-500 shrink-0" size={24} />}
                      {isWrongSelection && <XCircle className="text-rose-500 shrink-0" size={24} />}
                    </button>
                  );
                })}
              </div>

              {isSubmitted && (
                <div className={`p-6 rounded-2xl border-2 mb-8 ${
                  answers[currentQIndex] === undefined
                    ? 'bg-slate-50 border-slate-200 dark:bg-slate-900/50 dark:border-slate-800'
                    : isOptionCorrect(question, answers[currentQIndex]) 
                      ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/10 dark:border-emerald-800/30' 
                      : 'bg-amber-50 border-amber-200 dark:bg-amber-900/10 dark:border-amber-800/30'
                }`}>
                  <div className="flex gap-4">
                    <AlertCircle className={`shrink-0 mt-1 ${
                      answers[currentQIndex] === undefined
                        ? 'text-slate-500 dark:text-slate-400'
                        : isOptionCorrect(question, answers[currentQIndex]) ? 'text-emerald-500' : 'text-amber-500'
                    }`} size={24} />
                    <div>
                      <h4 className={`text-lg font-bold mb-2 ${
                        answers[currentQIndex] === undefined
                          ? 'text-slate-700 dark:text-slate-300'
                          : isOptionCorrect(question, answers[currentQIndex]) ? 'text-emerald-800 dark:text-emerald-300' : 'text-amber-800 dark:text-amber-300'
                      }`}>
                        {answers[currentQIndex] === undefined 
                          ? 'Unanswered'
                          : isOptionCorrect(question, answers[currentQIndex]) ? 'Correct!' : 'Incorrect'
                        }
                      </h4>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg whitespace-pre-wrap">
                        {(() => {
                          if (answers[currentQIndex] === undefined) {
                            const correctIdx = getNormalizedCorrectIndex(question);
                            const label = correctIdx >= 0 ? String.fromCharCode(65 + correctIdx) : '?';
                            return `The correct answer is Option ${label}.\n\n${question.explanation}`;
                          }
                          return question.explanation;
                        })()}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-6 flex flex-wrap gap-4 justify-between items-center bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm shrink-0">
            <div className="flex gap-2 sm:gap-4">
              <button
                onClick={handlePrev}
                disabled={currentQIndex === 0}
                className="flex items-center justify-center gap-1 sm:gap-2 px-4 sm:px-6 py-3 min-h-[44px] rounded-xl font-medium transition-colors bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft size={20} /> <span className="hidden sm:inline">Previous</span>
              </button>
              <button
                onClick={handleNext}
                disabled={currentQIndex === questions.length - 1}
                className="flex items-center justify-center gap-1 sm:gap-2 px-4 sm:px-6 py-3 min-h-[44px] rounded-xl font-medium transition-colors bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="hidden sm:inline">Next</span> <ArrowRight size={20} />
              </button>
            </div>
            
            <div className="flex gap-2 sm:gap-4">
              <button 
                onClick={() => setShowMobileNav(true)} 
                className="lg:hidden flex items-center justify-center gap-2 px-4 py-3 min-h-[44px] rounded-xl font-medium transition-colors bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200"
              >
                 <Menu size={20} /> <span className="hidden sm:inline">Questions</span>
              </button>
              
              {!isSubmitted && (
                <button
                  onClick={() => setShowSubmitPrompt(true)}
                  className="flex items-center justify-center gap-2 px-6 py-3 min-h-[44px] rounded-xl font-bold transition-colors bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  Submit Quiz
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Desktop Sidebar Navigator */}
        <div className="hidden lg:block w-80 shrink-0">
          <div className="sticky top-28 h-[calc(100dvh-140px)]">
             {renderQuestionNavigator()}
          </div>
        </div>

        {/* Mobile Drawer Navigator */}
        <AnimatePresence>
          {showMobileNav && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 lg:hidden flex justify-end bg-black/50"
            >
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="w-4/5 max-w-sm bg-white dark:bg-slate-900 h-[100dvh] pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] pr-[env(safe-area-inset-right)] pl-0 sm:pl-[env(safe-area-inset-left)]"
              >
                {renderQuestionNavigator()}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
