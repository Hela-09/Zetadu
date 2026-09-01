const fs = require('fs');

const code = `import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, BookOpen, PenTool, MessageSquare, Target, Activity, Search, Bell, Clock, ChevronRight, CheckCircle, BrainCircuit, Zap, Flame, Trophy, Calendar, Play } from 'lucide-react';
import { ViewType, TutorConversation, SubjectHistory } from '../types';
import { collection, query, where, getDocs, getDoc, doc, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';

interface HomeProps {
  setView: (view: ViewType) => void;
}

export default function Home({ setView }: HomeProps) {
  const { user, userProfile } = useAuth();
  
  // New State metrics
  const [examReadiness, setExamReadiness] = useState(0);
  const [streak, setStreak] = useState(userProfile?.streak || 0);
  const [weakAreas, setWeakAreas] = useState<any[]>([]);
  const [recentPractice, setRecentPractice] = useState<any | null>(null);
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;
      try {
        const learningDataRef = collection(db, 'learning_data');
        const q = query(learningDataRef, where('uid', '==', user.uid));
        const querySnapshot = await getDocs(q);
        
        let totalQuestions = 0;
        let totalScore = 0;
        let count = 0;
        const subjectStats: Record<string, { score: number, total: number }> = {};
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const qCount = data.totalQuestions || 0;
          const sCount = data.score || 0;
          const subj = data.subject || 'General';
          
          totalQuestions += qCount;
          totalScore += sCount;
          count++;
          
          if (!subjectStats[subj]) subjectStats[subj] = { score: 0, total: 0 };
          subjectStats[subj].score += sCount;
          subjectStats[subj].total += qCount;
        });
        
        if (totalQuestions > 0) {
          const readiness = (totalScore / totalQuestions) * 100;
          setExamReadiness(Math.round(readiness));
        } else {
          setExamReadiness(0);
        }
        
        // Calculate weak areas
        const areas = Object.keys(subjectStats).map(subj => {
          const stats = subjectStats[subj];
          const pct = Math.round((stats.score / stats.total) * 100);
          return { name: subj, pct };
        });
        
        // Sort lowest to highest
        areas.sort((a, b) => a.pct - b.pct);
        setWeakAreas(areas.slice(0, 3));
        
        // Fetch Last Practice
        const pracSnap = await getDoc(doc(db, 'practice_sessions', user.uid));
        if (pracSnap.exists()) {
           setRecentPractice({ id: pracSnap.id, ...pracSnap.data() });
        }
        
      } catch (err) {
        console.warn("Failed to fetch user stats:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, [user]);

  const userName = user?.displayName ? user.displayName.split(' ')[0] : 'Student';

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-8 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Welcome back, {userName}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Ready for today\\'s learning journey?</p>
        </div>
        <div className="flex items-center gap-4">
           {/* Streak Indicator */}
           <div className="flex items-center gap-2 bg-orange-50 dark:bg-orange-500/10 text-orange-600 px-4 py-2 rounded-2xl border-2 border-orange-100 dark:border-orange-500/20 shadow-sm">
             <Flame size={20} className="fill-current" />
             <span className="font-bold">{streak || 7} Day Streak</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        
        {/* Main Left Column */}
        <div className="lg:col-span-8 flex flex-col gap-6 lg:gap-8">
          
          {/* Main Hero Card (Next Study Session) */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <BrainCircuit size={20} className="text-blue-200" />
                  <span className="text-sm font-bold text-blue-200 tracking-wider uppercase">Your Next Study Session</span>
                </div>
                <h2 className="text-3xl font-bold mb-2">
                  {weakAreas.length > 0 ? weakAreas[0].name : "General Practice"}
                </h2>
                <p className="text-blue-100 mb-6 max-w-md text-sm sm:text-base">
                  Based on your recent performance, we recommend focusing on this subject to improve your overall exam readiness.
                </p>
                <button 
                  onClick={() => setView('practice')}
                  className="bg-white text-blue-700 px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:bg-blue-50 transition-all flex items-center gap-2 w-fit"
                >
                  <Play size={18} className="fill-current" /> Start Practice
                </button>
              </div>
              <div className="hidden md:block shrink-0">
                {/* Visual Representation of Readiness */}
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="64" cy="64" r="56" fill="transparent" stroke="rgba(255,255,255,0.2)" strokeWidth="12" />
                    <circle cx="64" cy="64" r="56" fill="transparent" stroke="white" strokeWidth="12" 
                      strokeDasharray="351.8" 
                      strokeDashoffset={351.8 - (351.8 * (examReadiness || 78)) / 100}
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black">{examReadiness || 78}%</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-200">Readiness</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Grid for Daily Challenge & Weak Areas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            
            {/* Daily Challenge */}
            <div className="bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-3xl p-6 relative overflow-hidden group hover:border-amber-400 dark:hover:border-amber-500 transition-colors cursor-pointer" onClick={() => setView('practice')}>
               <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                 <Zap size={100} className="text-amber-500" />
               </div>
               <div className="relative z-10 flex flex-col h-full">
                 <div className="flex items-center justify-between mb-4">
                   <div className="flex items-center gap-2">
                     <div className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-lg">
                       <Zap size={20} className="fill-current" />
                     </div>
                     <span className="font-bold text-slate-800 dark:text-white">Daily Challenge</span>
                   </div>
                   <span className="text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-400 px-2 py-1 rounded-md">NEW</span>
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">10 Questions • 5 Minutes</h3>
                 <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 flex-1">Complete your daily challenge to earn bonus XP and maintain your streak.</p>
                 <button className="w-full py-3 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors">
                   Start Challenge
                 </button>
               </div>
            </div>

            {/* Your Weak Areas */}
            <div className="bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-3xl p-6 flex flex-col">
              <div className="flex items-center gap-2 mb-6">
                <Target size={20} className="text-slate-400" />
                <h3 className="font-bold text-slate-800 dark:text-white">Your Weak Areas</h3>
              </div>
              <div className="flex-1 flex flex-col justify-center gap-4">
                {weakAreas.length > 0 ? (
                  weakAreas.map((area, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="font-medium text-slate-700 dark:text-slate-300">{area.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">{area.pct}%</span>
                        <div className={"w-3 h-3 rounded-full " + (area.pct < 55 ? 'bg-rose-500' : area.pct < 75 ? 'bg-amber-500' : 'bg-emerald-500')}></div>
                      </div>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-700 dark:text-slate-300">Trigonometry</span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">42%</span>
                        <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-700 dark:text-slate-300">Chemistry</span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">52%</span>
                        <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-700 dark:text-slate-300">Algebra</span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">61%</span>
                        <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

          </div>

          {/* Quick Actions (Replacing previous shortcuts) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <button onClick={() => setView('tutor')} className="bg-white dark:bg-slate-800 p-4 rounded-2xl border-2 border-slate-100 dark:border-slate-700 hover:border-emerald-500 hover:shadow-lg transition-all flex flex-col items-center justify-center text-center group">
              <div className="w-12 h-12 mb-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageSquare size={24} />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-white text-sm">AI Tutor</h3>
            </button>
            <button onClick={() => setView('subjects')} className="bg-white dark:bg-slate-800 p-4 rounded-2xl border-2 border-slate-100 dark:border-slate-700 hover:border-indigo-500 hover:shadow-lg transition-all flex flex-col items-center justify-center text-center group">
              <div className="w-12 h-12 mb-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <BookOpen size={24} />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-white text-sm">Library</h3>
            </button>
            <button onClick={() => setView('practice')} className="bg-white dark:bg-slate-800 p-4 rounded-2xl border-2 border-slate-100 dark:border-slate-700 hover:border-blue-500 hover:shadow-lg transition-all flex flex-col items-center justify-center text-center group relative">
              <div className="absolute top-2 right-2 bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">NEW</div>
              <div className="w-12 h-12 mb-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <PenTool size={24} />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-white text-sm">Flashcards</h3>
            </button>
            <button onClick={() => setView('profile')} className="bg-white dark:bg-slate-800 p-4 rounded-2xl border-2 border-slate-100 dark:border-slate-700 hover:border-purple-500 hover:shadow-lg transition-all flex flex-col items-center justify-center text-center group">
              <div className="w-12 h-12 mb-3 bg-purple-50 dark:bg-purple-900/30 text-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Trophy size={24} />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-white text-sm">Achievements</h3>
            </button>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Continue Study (Recent Practice) */}
          <div className="bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-3xl p-6">
            <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <Clock size={18} className="text-blue-500" /> Continue Study
            </h3>
            {recentPractice ? (
              <div onClick={() => setView('practice')} className="group p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 hover:border-blue-300 cursor-pointer transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                    <PenTool size={16} />
                  </div>
                  <span className="font-bold text-sm text-slate-800 dark:text-white">Unfinished Practice</span>
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white truncate">{recentPractice.subject || 'General'}</h4>
                <p className="text-xs text-slate-500 mt-1">Pick up where you left off</p>
              </div>
            ) : (
              <div onClick={() => setView('tutor')} className="group p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 hover:border-emerald-300 cursor-pointer transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-lg">
                    <MessageSquare size={16} />
                  </div>
                  <span className="font-bold text-sm text-slate-800 dark:text-white">AI Tutor</span>
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white truncate">Start a new session</h4>
                <p className="text-xs text-slate-500 mt-1">Ask questions or review a topic</p>
              </div>
            )}
          </div>

          {/* Exam Countdown */}
          <div className="bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Calendar size={18} className="text-purple-500" /> Upcoming Exam
              </h3>
              <button className="text-slate-400 hover:text-slate-600">
                <Settings size={16} />
              </button>
            </div>
            <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800/30 text-center">
              <h4 className="font-black text-2xl text-purple-700 dark:text-purple-300 mb-1">45 DAYS LEFT</h4>
              <p className="text-sm font-bold text-purple-600/80 dark:text-purple-400/80 uppercase tracking-widest">JAMB 2026</p>
            </div>
          </div>

          {/* Achievements Preview */}
          <div className="bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Trophy size={18} className="text-amber-500" /> Recent Achievements
              </h3>
              <button onClick={() => setView('profile')} className="text-sm text-blue-600 font-bold hover:underline">View All</button>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 text-lg">🏆</div>
                <div>
                  <h4 className="font-bold text-sm text-slate-800 dark:text-white">First Practice</h4>
                  <p className="text-xs text-slate-500">Completed your first quiz</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 text-lg">🔥</div>
                <div>
                  <h4 className="font-bold text-sm text-slate-800 dark:text-white">7-Day Streak</h4>
                  <p className="text-xs text-slate-500">Studied for 7 days in a row</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
`;

fs.writeFileSync('src/components/Home.tsx', code);
