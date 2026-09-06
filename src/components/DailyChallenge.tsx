import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Zap, Clock, CheckCircle2, XCircle, ArrowRight, ArrowLeft, Trophy, Loader2, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { checkAndAwardAchievements, calculateStreakBonus } from '../lib/achievements';
import { db } from '../lib/firebase';
import { collection, doc, setDoc, getDoc, getDocs, query, where, serverTimestamp, increment } from 'firebase/firestore';
import { ALL_SUBJECTS } from '../data/subjects';

interface Question {
  question: string;
  options: string[];
  correctAnswerIndex?: number;
  correctAnswer?: any;
  explanation: string;
  difficulty: string;
  topic: string;
}

export default function DailyChallenge({ setView }: { setView: (view: any) => void }) {
  const { user, userProfile, getToken, refreshProfile } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [completedToday, setCompletedToday] = useState(false);
  const [pastScore, setPastScore] = useState<{ score: number, xp: number } | null>(null);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timerRemaining, setTimerRemaining] = useState(600); // 10 mins
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const [score, setScore] = useState(0);
  const [xpAwarded, setXpAwarded] = useState(0);

  const todayStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const challengeId = `${user?.uid}_${todayStr}`;

  useEffect(() => {
    const checkCompletion = async () => {
      if (!user) return;
      try {
        const q = query(
          collection(db, 'daily_challenges'),
          where('uid', '==', user.uid),
          where('date', '==', todayStr)
        );
        const querySnap = await getDocs(q);
        if (!querySnap.empty) {
          const data = querySnap.docs[0].data();
          setCompletedToday(true);
          setPastScore({ score: data.score, xp: data.xpAwarded });
        }
      } catch (err) {
        console.error("Failed to check daily challenge:", err);
      } finally {
        setLoading(false);
      }
    };
    checkCompletion();
  }, [user, challengeId]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (questions.length > 0 && !isSubmitted && timerRemaining > 0) {
      interval = setInterval(() => {
        setTimerRemaining(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [questions, isSubmitted, timerRemaining]);

  const startChallenge = async () => {
    setIsGenerating(true);
    try {
      const token = await getToken();
      
      // Try to pick a subject from favorites, or fallback to random
      let selectedSubject = 'Mathematics';
      const savedFavs = localStorage.getItem('zetadu_favorite_subjects');
      if (savedFavs) {
        try {
          const favIds = JSON.parse(savedFavs);
          if (favIds && favIds.length > 0) {
             const randomId = favIds[Math.floor(Math.random() * favIds.length)];
             const found = ALL_SUBJECTS.find(s => s.id === randomId);
             if (found) selectedSubject = found.name;
          }
        } catch(e) {}
      }

      const response = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          subject: selectedSubject,
          topic: 'General Mix',
          difficulty: 'Medium',
          amount: 10,
          educationLevel: userProfile?.educationLevel || 'Secondary',
          country: userProfile?.country || 'Nigeria'
        })
      });

      if (!response.ok) throw new Error("Failed to generate questions");
      const data = await response.json();
      
      if (data && data.questions && data.questions.length > 0) {
        setQuestions(data.questions.slice(0, 10)); // Ensure exactly 10
        setTimerRemaining(600);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to start daily challenge. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const getNormalizedCorrectIndex = (question: any): number => {
    let correctValue = question.correctAnswerIndex !== undefined ? question.correctAnswerIndex : question.correctAnswer;
    if (correctValue === undefined) return -1;
    if (typeof correctValue === 'number') return correctValue;
    if (typeof correctValue === 'string') {
      const normalizedStr = correctValue.trim().toLowerCase();
      if (['a', 'b', 'c', 'd'].includes(normalizedStr)) return normalizedStr.charCodeAt(0) - 97;
      if (question.options) {
        const foundIndex = question.options.findIndex((opt: string) => opt.trim().toLowerCase() === normalizedStr);
        if (foundIndex !== -1) return foundIndex;
      }
      if (!isNaN(Number(normalizedStr))) return Number(normalizedStr);
    }
    return -1;
  };

  const isOptionCorrect = (question: any, index: number | null) => {
    if (index === null) return false;
    return getNormalizedCorrectIndex(question) === index;
  };

  const handleSubmit = async () => {
    if (isSubmitted || !user) return;
    setIsSubmitted(true);
    
    // Calculate Score
    let finalScore = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] !== undefined && isOptionCorrect(q, answers[idx])) {
        finalScore++;
      }
    });
    
    setScore(finalScore);
    
    // Award XP: base 50 + 15 per correct answer
    const earnedXp = 50 + (finalScore * 15);
    setXpAwarded(earnedXp);

    try {
      // 1. Record daily challenge
      await setDoc(doc(db, 'daily_challenges', challengeId), {
        uid: user.uid,
        date: todayStr,
        score: finalScore,
        totalQuestions: questions.length,
        xpAwarded: earnedXp,
        completedAt: serverTimestamp()
      });

      // 2. Update user profile (XP and Streak)
      const userRef = doc(db, 'users', user.uid);
      
      // Determine if we should increment streak
      // (If lastChallengeDate != todayStr, increment)
      const currentStreak = userProfile?.streak || 0;
      const lastChallenge = userProfile?.lastChallengeDate;
      let newStreak = currentStreak;
      
      if (lastChallenge !== todayStr) {
        // Simple logic: if yesterday, increment. If older, reset to 1.
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        
        if (lastChallenge === yesterdayStr) {
          newStreak += 1;
        } else {
          newStreak = 1;
        }
      }

      await setDoc(userRef, {
        xp: increment(earnedXp),
        streak: newStreak,
        lastChallengeDate: todayStr
      }, { merge: true });

      // Refresh profile to update UI globally
      if (refreshProfile) await refreshProfile();
      
    } catch (err) {
      console.error("Failed to save results", err);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    );
  }

  if (completedToday) {
    return (
      <div className="w-full max-w-4xl mx-auto py-12 px-4 flex flex-col items-center text-center">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-green-500/20">
          <CheckCircle2 size={64} />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Challenge Completed!</h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg max-w-md mx-auto mb-8">
          You've already conquered today's Daily Challenge. Come back tomorrow for a new set of questions!
        </p>
        
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border-2 border-slate-100 dark:border-slate-700 w-full max-w-sm">
          <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-100 dark:border-slate-700">
            <span className="text-slate-500 font-bold">Your Score</span>
            <span className="text-2xl font-black text-slate-900 dark:text-white">{pastScore?.score} / 10</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500 font-bold">XP Earned</span>
            <span className="text-xl font-bold text-orange-500">+{pastScore?.xp} XP</span>
          </div>
        </div>
        
        <button 
          onClick={() => setView('home')}
          className="mt-8 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white px-8 py-3 rounded-xl font-bold transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto py-12 px-4 flex flex-col items-center text-center">
        <div className="w-24 h-24 bg-orange-100 text-orange-600 rounded-3xl flex items-center justify-center mb-6 rotate-12 shadow-xl shadow-orange-500/20">
          <Zap size={64} className="fill-current text-orange-400" />
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4">Daily Challenge</h1>
        <p className="text-slate-600 dark:text-slate-400 text-xl max-w-xl mx-auto mb-10">
          Test your knowledge with 10 random questions based on your preferred subjects. Earn XP and build your study streak!
        </p>
        
        <div className="grid grid-cols-2 gap-4 mb-12 w-full max-w-md">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border-2 border-slate-100 dark:border-slate-700">
            <h3 className="text-sm font-bold text-slate-500 mb-1">Questions</h3>
            <p className="text-2xl font-black text-slate-900 dark:text-white">10</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border-2 border-slate-100 dark:border-slate-700">
            <h3 className="text-sm font-bold text-slate-500 mb-1">Time Limit</h3>
            <p className="text-2xl font-black text-slate-900 dark:text-white">10:00</p>
          </div>
        </div>

        <button 
          onClick={startChallenge}
          disabled={isGenerating}
          className="bg-orange-500 hover:bg-orange-600 text-white px-12 py-4 rounded-2xl font-black text-lg transition-all shadow-lg hover:shadow-orange-500/30 flex items-center gap-3 disabled:opacity-70"
        >
          {isGenerating ? (
            <><Loader2 className="animate-spin" /> Generating Challenge...</>
          ) : (
            <><Zap className="fill-current" /> Start Challenge</>
          )}
        </button>
      </div>
    );
  }

  const currentQ = questions[currentQIndex];

  if (isSubmitted) {
    return (
      <div className="w-full max-w-4xl mx-auto pb-12 flex flex-col items-center">
        <div className="bg-white dark:bg-slate-800 w-full rounded-3xl p-8 border-2 border-slate-100 dark:border-slate-700 text-center mb-8 shadow-xl">
          <Trophy size={64} className="mx-auto text-yellow-500 mb-4" />
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Challenge Complete!</h2>
          
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            <div className="flex flex-col items-center">
              <span className="text-slate-500 font-bold uppercase tracking-wider text-xs mb-1">Final Score</span>
              <span className="text-4xl font-black text-slate-900 dark:text-white">{score}<span className="text-xl text-slate-400">/10</span></span>
            </div>
            <div className="w-px bg-slate-200 dark:bg-slate-700"></div>
            <div className="flex flex-col items-center">
              <span className="text-slate-500 font-bold uppercase tracking-wider text-xs mb-1">XP Earned</span>
              <span className="text-4xl font-black text-orange-500">+{xpAwarded}</span>
            </div>
          </div>
          
          <button 
            onClick={() => setView('home')}
            className="mt-10 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white px-8 py-3 rounded-xl font-bold transition-colors"
          >
            Back to Dashboard
          </button>
        </div>

        <div className="w-full">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Review Answers</h3>
          <div className="flex flex-col gap-6">
            {questions.map((q, idx) => {
              const uAns = answers[idx];
              const isCorrect = isOptionCorrect(q, uAns);
              const correctIdx = getNormalizedCorrectIndex(q);
              
              return (
                <div key={idx} className={`bg-white dark:bg-slate-800 p-6 rounded-3xl border-2 ${isCorrect ? 'border-green-200 dark:border-green-900/50' : 'border-rose-200 dark:border-rose-900/50'}`}>
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 mt-1">
                      {isCorrect ? <CheckCircle2 className="text-green-500" /> : <XCircle className="text-rose-500" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-slate-900 dark:text-white text-lg mb-4">{idx + 1}. {q.question}</p>
                      
                      <div className="flex flex-col gap-2">
                        {q.options.map((opt, oIdx) => {
                          const isThisCorrect = oIdx === correctIdx;
                          const isThisSelected = oIdx === uAns;
                          
                          let bgClass = "bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400";
                          if (isThisCorrect) bgClass = "bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700 text-green-800 dark:text-green-300 font-bold";
                          else if (isThisSelected && !isThisCorrect) bgClass = "bg-rose-100 dark:bg-rose-900/30 border-rose-300 dark:border-rose-700 text-rose-800 dark:text-rose-300";
                          
                          return (
                            <div key={oIdx} className={`px-4 py-3 rounded-xl border ${bgClass}`}>
                              {opt}
                            </div>
                          );
                        })}
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">Explanation</span>
                        <p className="text-sm text-slate-700 dark:text-slate-300">{q.explanation}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto h-[100dvh] md:h-auto flex flex-col md:pb-12 bg-white md:bg-transparent">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 p-4 md:rounded-3xl md:border-2 border-b-2 md:border-b-2 border-slate-100 dark:border-slate-700 flex justify-between items-center shrink-0 mb-0 md:mb-6 z-10 sticky top-0 md:relative shadow-sm md:shadow-none">
        <div className="flex items-center gap-3">
          <button onClick={() => setView('home')} className="p-2 -ml-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500">
            <X size={20} />
          </button>
          <div>
            <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Zap size={16} className="text-orange-500" /> Daily Challenge
            </h2>
            <p className="text-xs font-bold text-slate-500">Question {currentQIndex + 1} of 10</p>
          </div>
        </div>
        <div className={`flex items-center gap-2 font-bold px-3 py-1.5 rounded-lg ${timerRemaining < 60 ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
          <Clock size={16} />
          <span>{formatTime(timerRemaining)}</span>
        </div>
      </div>

      {/* Progress */}
      <div className="px-4 py-3 md:p-0 shrink-0">
        <div className="flex gap-1 md:gap-2 mb-4">
          {questions.map((_, i) => (
            <div 
              key={i} 
              onClick={() => setCurrentQIndex(i)}
              className={`h-2 flex-1 rounded-full cursor-pointer transition-colors ${
                i === currentQIndex ? 'bg-orange-500' : 
                answers[i] !== undefined ? 'bg-orange-200 dark:bg-orange-900' : 'bg-slate-200 dark:bg-slate-700'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Question Card */}
      <div className="flex-1 overflow-y-auto px-4 md:px-0">
        <div className="bg-white dark:bg-slate-800 md:rounded-3xl md:border-2 border-slate-100 dark:border-slate-700 p-6 md:p-8 min-h-full md:min-h-0 flex flex-col">
          <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-8 leading-snug">
            {currentQ.question}
          </h3>
          
          <div className="flex flex-col gap-3 mt-auto md:mt-0">
            {currentQ.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => setAnswers(prev => ({ ...prev, [currentQIndex]: idx }))}
                className={`w-full text-left p-4 md:p-5 rounded-2xl border-2 transition-all font-medium text-[15px] md:text-base ${
                  answers[currentQIndex] === idx 
                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 shadow-sm' 
                    : 'border-slate-200 dark:border-slate-700 hover:border-orange-300 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 font-bold transition-colors ${
                    answers[currentQIndex] === idx ? 'border-orange-500 bg-orange-500 text-white' : 'border-slate-300 text-slate-500'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span>{opt}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="p-4 md:px-0 md:mt-6 shrink-0 flex items-center justify-between gap-4 bg-white md:bg-transparent border-t md:border-none border-slate-100 dark:border-slate-800">
        <button
          onClick={() => setCurrentQIndex(Math.max(0, currentQIndex - 1))}
          disabled={currentQIndex === 0}
          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold disabled:opacity-50 transition-colors"
        >
          <ArrowLeft size={20} /> <span className="hidden sm:inline">Previous</span>
        </button>
        
        {currentQIndex === questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            className="flex-[2] md:flex-none flex items-center justify-center gap-2 px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold shadow-lg shadow-green-600/20 transition-all"
          >
            <CheckCircle2 size={20} /> Submit Challenge
          </button>
        ) : (
          <button
            onClick={() => setCurrentQIndex(Math.min(questions.length - 1, currentQIndex + 1))}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-xl font-bold transition-colors"
          >
            <span className="hidden sm:inline">Next</span> <ArrowRight size={20} />
          </button>
        )}
      </div>
    </div>
  );
}
