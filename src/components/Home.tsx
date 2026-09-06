import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, BookOpen, PenTool, MessageSquare, Target, Activity, Search, Bell, Clock, ChevronRight, CheckCircle, BrainCircuit, Zap, Flame, Trophy, Calendar, Play, Settings, Compass } from 'lucide-react';
import { ViewType,  TutorConversation, SubjectHistory, StudyJourneyState } from '../types';
import { collection, query, where, getDocs, getDoc, doc, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { getLevelInfo } from '../lib/achievements';
import { loadStudyJourney, clearStudyJourney } from '../lib/studyJourneyService';

interface HomeProps {
  setView: (view: ViewType) => void;
}

export default function Home({ setView }: HomeProps) {
  const { user, userProfile } = useAuth();
  
  // New State metrics
  const [examReadiness, setExamReadiness] = useState(0);
  const [streak, setStreak] = useState(userProfile?.streak || 0);
  const [topicCategories, setTopicCategories] = useState<{weak: any[], developing: any[], strong: any[]}>({ weak: [], developing: [], strong: [] });
  const [recentPractice, setRecentPractice] = useState<any | null>(null);
  const [activeJourney, setActiveJourney] = useState<StudyJourneyState | null>(null);
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;
      try {
        // Fetch active study journey
        try {
          const journeyData = await loadStudyJourney(user.uid);
          if (journeyData && journeyData.status === 'in_progress') {
            setActiveJourney(journeyData);
          }
        } catch (e) {
          console.warn('Failed to load study journey in Home:', e);
        }

        const learningDataRef = collection(db, 'learning_data');
        const q = query(learningDataRef, where('uid', '==', user.uid));
        const querySnapshot = await getDocs(q);
        
        let totalQuestions = 0;
        let totalScore = 0;
        let count = 0;
        const topicStats: Record<string, { score: number, total: number, subject: string }> = {};
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const qCount = data.totalQuestions || 0;
          const sCount = data.score || 0;
          const fallbackSubject = data.subject || 'General';
          
          totalQuestions += qCount;
          totalScore += sCount;
          
          if (data.answeredQuestions && Array.isArray(data.answeredQuestions)) {
            data.answeredQuestions.forEach((q: any) => {
               const t = q.topic || data.topic || fallbackSubject;
               if (!topicStats[t]) topicStats[t] = { score: 0, total: 0, subject: fallbackSubject };
               topicStats[t].total += 1;
               
               let correctValue = q.correctAnswerIndex !== undefined ? q.correctAnswerIndex : q.correctAnswer;
               let isCorrect = false;
               const userAns = q.userAnswerIndex;
               
               if (userAns !== undefined && userAns !== null && userAns !== -1) {
                 if (typeof correctValue === 'number' && correctValue === userAns) {
                   isCorrect = true;
                 } else if (typeof correctValue === 'string') {
                   const normalizedStr = correctValue.trim().toLowerCase();
                   let expectedIdx = -1;
                   if (['a', 'b', 'c', 'd'].includes(normalizedStr)) {
                     expectedIdx = normalizedStr.charCodeAt(0) - 97;
                   } else if (q.options) {
                     expectedIdx = q.options.findIndex((opt) => typeof opt === 'string' && opt.trim().toLowerCase() === normalizedStr);
                   }
                   if (expectedIdx === -1 && !isNaN(Number(normalizedStr))) {
                     expectedIdx = Number(normalizedStr);
                   }
                   if (expectedIdx === userAns) isCorrect = true;
                 }
               }
               
               if (isCorrect) topicStats[t].score += 1;
            });
          } else {
             const t = data.topic || fallbackSubject;
             if (!topicStats[t]) topicStats[t] = { score: 0, total: 0, subject: fallbackSubject };
             topicStats[t].total += qCount;
             topicStats[t].score += sCount;
          }
        });
        
        if (totalQuestions > 0) {
          const readiness = (totalScore / totalQuestions) * 100;
          setExamReadiness(Math.round(readiness));
        } else {
          setExamReadiness(0);
        }
        
        const areas = Object.keys(topicStats)
          .map(topic => {
            const stats = topicStats[topic];
            const pct = Math.round((stats.score / stats.total) * 100);
            return { name: topic, pct, total: stats.total, subject: stats.subject };
          })
          .filter(a => a.total >= 2); // Do not judge based on 1 question
          
        const weak = areas.filter(a => a.pct < 50).sort((a, b) => a.pct - b.pct);
        const developing = areas.filter(a => a.pct >= 50 && a.pct < 75).sort((a, b) => a.pct - b.pct);
        const strong = areas.filter(a => a.pct >= 75).sort((a, b) => b.pct - a.pct);
        
        setTopicCategories({ weak, developing, strong });
        
        // Fetch Last Practice
        const pracSnap = await getDoc(doc(db, 'practice_sessions', user.uid));
        if (pracSnap.exists()) {
           setRecentPractice({ id: pracSnap.id, ...pracSnap.data() });
        }
        
      } catch (err: any) {
        if (err?.message?.includes("not found") || err?.code === 'unavailable') {
            console.warn("Firestore is currently unavailable or database missing.");
        } else {
            console.warn("Stats fetch warning:", err);
        }
        // Silently handle error to prevent AI Studio metadata triggers
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

  const startRecommendedPractice = () => {
    let target = topicCategories.weak[0] || topicCategories.developing[0] || topicCategories.strong[0];
    if (target) {
      localStorage.setItem('zetadu_target_topic', target.name);
      localStorage.setItem('zetadu_target_subject', target.subject);
      
      // Try to find the matching subject id
      const formattedSubject = target.subject.toLowerCase();
      let subjectId = formattedSubject.replace(/[^a-z0-9]/g, '-');
      if (formattedSubject.includes('english')) subjectId = 'english';
      else if (formattedSubject.includes('math')) subjectId = 'mathematics';
      
      localStorage.setItem('zetadu_target_subject_id', subjectId);
    }
    setView('practice');
  };

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-8 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Hello, {userName}! 👋
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Welcome back to your personalized study dashboard.
          </p>
        </div>
        
        {/* Phase 4: Level & XP Stats */}
        {(() => {
           const xp = userProfile?.xp || 0;
           const levelInfo = getLevelInfo(xp);
           const prevLevelXp = levelInfo.level === 1 ? 0 : getLevelInfo(xp - (xp % 100 === 0 ? 1 : xp % 100) - 100).nextXp || 0; // Simplified
           const currentLevelBaseXp = levelInfo.level === 1 ? 0 : 
               (levelInfo.level === 2 ? 100 : 
               (levelInfo.level === 3 ? 250 : 
               (levelInfo.level === 4 ? 500 : 
               (levelInfo.level === 5 ? 1000 : 
               (levelInfo.level === 6 ? 2500 : 5000)))));
           
           const progressPct = levelInfo.level >= 7 ? 100 : Math.min(100, Math.max(0, ((xp - currentLevelBaseXp) / (levelInfo.nextXp - currentLevelBaseXp)) * 100));
           
           return (
             <div className="flex items-center gap-4 bg-white dark:bg-slate-800 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white font-bold shadow-md">
                   Lvl {levelInfo.level}
                </div>
                <div className="pr-2">
                   <div className="flex items-center justify-between gap-4 mb-1">
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{levelInfo.title}</span>
                      <span className="text-xs font-medium text-blue-600 dark:text-blue-400">{xp} / {levelInfo.nextXp} XP</span>
                   </div>
                   <div className="h-2 w-32 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }}></div>
                   </div>
                </div>
             </div>
           );
        })()}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Content Area */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          
          {/* Daily Challenge */}
          <div 
            onClick={() => setView('daily_challenge')}
            className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl p-6 md:p-8 text-white cursor-pointer hover:shadow-lg hover:shadow-orange-500/30 transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform">
              <Zap size={120} />
            </div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Zap size={24} className="fill-current text-yellow-300" />
                  <h2 className="text-2xl font-bold">Daily Challenge</h2>
                </div>
                <p className="text-orange-100 mb-4 max-w-md">Complete 10 questions today to earn XP and increase your streak!</p>
                <button className="bg-white text-orange-600 px-6 py-2 rounded-xl font-bold shadow-sm group-hover:bg-orange-50 transition-colors">
                  Play Now
                </button>
              </div>
            </div>
          </div>

          {/* Personal Study Coach */}
          <div className="bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-3xl p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-2xl flex items-center justify-center">
                <BrainCircuit size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Personal Study Coach</h2>
                <p className="text-slate-500">Analysis based on your practice sessions.</p>
              </div>
            </div>

            <div className="flex flex-col gap-8">
              
              {/* Weak Topics */}
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-4">
                  <Target size={20} className="text-rose-500" /> Focus Areas (Weak)
                </h3>
                {topicCategories.weak.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {topicCategories.weak.map((topic, i) => (
                      <div key={i} className="flex items-center justify-between bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
                        <span className="font-medium text-slate-700 dark:text-slate-300 truncate mr-2" title={topic.name}>{topic.name}</span>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-sm font-bold text-slate-900 dark:text-white">{topic.pct}%</span>
                          <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 italic text-sm">No weak areas identified yet. Keep practicing!</p>
                )}
              </div>

              {/* Developing Topics */}
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-4">
                  <Activity size={20} className="text-amber-500" /> Developing
                </h3>
                {topicCategories.developing.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {topicCategories.developing.map((topic, i) => (
                      <div key={i} className="flex items-center justify-between bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
                        <span className="font-medium text-slate-700 dark:text-slate-300 truncate mr-2" title={topic.name}>{topic.name}</span>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-sm font-bold text-slate-900 dark:text-white">{topic.pct}%</span>
                          <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 italic text-sm">No developing areas identified yet.</p>
                )}
              </div>

              {/* Strong Topics */}
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-4">
                  <CheckCircle size={20} className="text-emerald-500" /> Strong
                </h3>
                {topicCategories.strong.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {topicCategories.strong.map((topic, i) => (
                      <div key={i} className="flex items-center justify-between bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
                        <span className="font-medium text-slate-700 dark:text-slate-300 truncate mr-2" title={topic.name}>{topic.name}</span>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-sm font-bold text-slate-900 dark:text-white">{topic.pct}%</span>
                          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 italic text-sm">No strong areas identified yet.</p>
                )}
              </div>

            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700">
              <button 
                onClick={startRecommendedPractice}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Play size={18} className="fill-current" /> Start Recommended Practice
              </button>
            </div>
            
          </div>
          
          {/* Quick Actions */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <button onClick={() => setView('journey')} className="bg-white dark:bg-slate-800 p-5 rounded-3xl border-2 border-slate-100 dark:border-slate-700 hover:border-blue-500 hover:shadow-lg transition-all flex flex-col items-center justify-center text-center group">
              <div className="w-12 h-12 mb-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Compass size={26} />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-white text-sm">Study Journey</h3>
            </button>
            <button onClick={() => setView('tutor')} className="bg-white dark:bg-slate-800 p-5 rounded-3xl border-2 border-slate-100 dark:border-slate-700 hover:border-emerald-500 hover:shadow-lg transition-all flex flex-col items-center justify-center text-center group">
              <div className="w-12 h-12 mb-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageSquare size={26} />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-white text-sm">AI Tutor</h3>
            </button>
            <button onClick={() => setView('subjects')} className="bg-white dark:bg-slate-800 p-5 rounded-3xl border-2 border-slate-100 dark:border-slate-700 hover:border-indigo-500 hover:shadow-lg transition-all flex flex-col items-center justify-center text-center group">
              <div className="w-12 h-12 mb-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <BookOpen size={26} />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-white text-sm">Library</h3>
            </button>
            <button onClick={() => setView('practice')} className="bg-white dark:bg-slate-800 p-5 rounded-3xl border-2 border-slate-100 dark:border-slate-700 hover:border-blue-500 hover:shadow-lg transition-all flex flex-col items-center justify-center text-center group">
              <div className="w-12 h-12 mb-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <PenTool size={26} />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-white text-sm">Practice</h3>
            </button>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Continue Study */}
          <div className="bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-3xl p-6">
            <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <Clock size={18} className="text-blue-500" /> Continue Study
            </h3>
            {activeJourney && activeJourney.status === 'in_progress' ? (
              <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border-2 border-blue-200 dark:border-blue-800 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-blue-600 text-white rounded-lg">
                      <Compass size={14} />
                    </div>
                    <span className="font-bold text-xs uppercase text-blue-700 dark:text-blue-300">Study Journey</span>
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200">
                    Step {activeJourney.step} of 6
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white truncate text-base mb-0.5">{activeJourney.topic}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{activeJourney.subject} • {activeJourney.examType}</p>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-3">Continue your Study Journey?</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setView('journey')}
                    className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>Continue</span>
                    <ChevronRight size={14} />
                  </button>
                  <button
                    onClick={async () => {
                      if (user) await clearStudyJourney(user.uid);
                      setActiveJourney(null);
                      setView('journey');
                    }}
                    className="py-2 px-3 rounded-xl bg-white dark:bg-slate-700 hover:bg-slate-100 text-slate-600 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-600 transition-colors cursor-pointer"
                  >
                    Start Over
                  </button>
                </div>
              </div>
            ) : recentPractice ? (
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
        </div>
      </div>
    </div>
  );
}
