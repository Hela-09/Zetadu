import fs from 'fs';

const content = `import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, BookOpen, PenTool, MessageSquare, Target, Activity, Search, Bell, Clock, ChevronRight, CheckCircle, BrainCircuit } from 'lucide-react';
import { ViewType, TutorConversation, SubjectHistory } from '../types';
import { collection, query, where, getDocs, getDoc, doc, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';

interface HomeProps {
  setView: (view: ViewType) => void;
}

export default function Home({ setView }: HomeProps) {
  const { user } = useAuth();
  const [mastery, setMastery] = useState(0);
  const [streak, setStreak] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [recentSubjects, setRecentSubjects] = useState<any[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  
  // Continue Learning State
  const [lastSubject, setLastSubject] = useState<SubjectHistory | null>(null);
  const [lastTutor, setLastTutor] = useState<TutorConversation | null>(null);
  const [lastPractice, setLastPractice] = useState<any | null>(null);
  
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
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          totalQuestions += data.totalQuestions || 0;
          totalScore += data.score || 0;
          count++;
        });

        if (totalQuestions > 0) {
          const calculatedAccuracy = (totalScore / totalQuestions) * 100;
          setAccuracy(parseFloat(calculatedAccuracy.toFixed(1)));
          setMastery(Math.round(calculatedAccuracy));
        } else {
          setAccuracy(0);
          setMastery(0);
        }
        
        setQuestionsAnswered(totalQuestions);
        setStreak(count > 0 ? 1 : 0);
        
        // Fetch Continue Learning Data
        // 1. Last Subject
        const subQ = query(collection(db, 'subject_history'), where('uid', '==', user.uid));
        const subSnap = await getDocs(subQ);
        const subjects: SubjectHistory[] = [];
        subSnap.forEach(d => subjects.push({ id: d.id, ...d.data() } as SubjectHistory));
        if (subjects.length > 0) {
           subjects.sort((a, b) => b.lastOpened - a.lastOpened);
           setLastSubject(subjects[0]);
           setRecentSubjects(subjects.slice(0, 3));
        }
        
        // 2. Last AI Tutor
        const tutQ = query(collection(db, 'tutor_conversations'), where('uid', '==', user.uid));
        const tutSnap = await getDocs(tutQ);
        const tutors: TutorConversation[] = [];
        tutSnap.forEach(d => tutors.push({ id: d.id, ...d.data() } as TutorConversation));
        if (tutors.length > 0) {
           tutors.sort((a, b) => b.lastOpened - a.lastOpened);
           setLastTutor(tutors[0]);
        }
        
        // 3. Last Practice
        const pracSnap = await getDoc(doc(db, 'practice_sessions', user.uid));
        if (pracSnap.exists()) {
           setLastPractice({ id: pracSnap.id, ...pracSnap.data() });
        }
        
        // Populate recent activities (combining some)
        const acts: any[] = [];
        if (tutors[0]) acts.push({ type: 'AI Tutor', subject: tutors[0].title, desc: 'Continued conversation', timestamp: tutors[0].lastOpened });
        if (pracSnap.exists()) acts.push({ type: 'Practice Session', subject: pracSnap.data().subject, desc: 'Unfinished session', timestamp: pracSnap.data().updatedAt?.toMillis ? pracSnap.data().updatedAt.toMillis() : Date.now() });
        
        acts.sort((a,b) => b.timestamp - a.timestamp);
        setRecentActivities(acts.slice(0, 4));
        
      } catch (err) {
        console.warn("Failed to fetch user stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setView('subjects');
    }
  };

  const handleContinueTutor = (conv: TutorConversation) => {
    localStorage.setItem('tutor_active_conv', conv.id);
    setView('tutor');
  };
  
  const handleContinueSubject = (sub: SubjectHistory) => {
    // Just go to subjects for now, real app might auto-open it
    setView('subjects');
  };

  return (
    <div className="w-full h-full max-w-7xl mx-auto flex flex-col gap-6 pb-12">
      {/* Quick Search & Announcements */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between shrink-0">
        <form onSubmit={handleSearch} className="relative w-full md:max-w-md">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Quick search subjects or topics..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 focus:border-blue-500 focus:ring-0 outline-none text-slate-700 dark:text-slate-200 transition-colors shadow-sm"
          />
        </form>
        <button onClick={() => setView('subjects')} className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-xl text-sm font-medium w-full md:w-auto shrink-0 shadow-sm border border-blue-100 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
          <Bell size={16} className="text-blue-500" />
          <span>New practice questions available!</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Column */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Welcome Message & Overview */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-blue-600 rounded-3xl p-6 md:p-8 shadow-xl shadow-blue-200/50 flex flex-col md:flex-row items-center gap-8 text-white relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="flex-1 relative z-10">
              <span className="px-3 py-1 bg-blue-500 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 inline-block">
                Welcome back
              </span>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Ready to continue learning?</h2>
              <p className="text-blue-100 text-sm md:text-base opacity-90 leading-relaxed mb-6 max-w-md">
                You're making great progress. Resume your last session or start something new.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <button 
                  onClick={() => setView('practice')}
                  className="bg-white text-blue-600 hover:bg-blue-50 px-5 py-2.5 rounded-xl font-bold shadow-lg transition-colors flex items-center gap-2"
                >
                  <PenTool size={18} />
                  <span>Resume Practice</span>
                </button>
                <button 
                  onClick={() => setView('subjects')}
                  className="bg-blue-700 text-white hover:bg-blue-800 px-5 py-2.5 rounded-xl font-bold transition-colors flex items-center gap-2 border border-blue-500"
                >
                  <BookOpen size={18} />
                  <span>Explore Subjects</span>
                </button>
              </div>
            </div>
          </motion.div>
          
          {/* Continue Learning Cards */}
          {(lastSubject || lastTutor || lastPractice) && (
             <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Continue Learning</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                   {lastSubject && (
                      <button onClick={() => handleContinueSubject(lastSubject)} className="flex flex-col text-left p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                        <div className="flex items-center gap-2 mb-2">
                           <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                              <BookOpen size={16} />
                           </div>
                           <span className="font-semibold text-sm text-slate-800 dark:text-white">Subject</span>
                        </div>
                        <h4 className="font-bold text-slate-900 dark:text-white truncate w-full">{lastSubject.name}</h4>
                        <p className="text-xs text-slate-500 mt-1">Pick up where you left off</p>
                      </button>
                   )}
                   {lastTutor && (
                      <button onClick={() => handleContinueTutor(lastTutor)} className="flex flex-col text-left p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors">
                        <div className="flex items-center gap-2 mb-2">
                           <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-lg">
                              <MessageSquare size={16} />
                           </div>
                           <span className="font-semibold text-sm text-slate-800 dark:text-white">AI Tutor</span>
                        </div>
                        <h4 className="font-bold text-slate-900 dark:text-white truncate w-full">{lastTutor.title}</h4>
                        <p className="text-xs text-slate-500 mt-1">Continue conversation</p>
                      </button>
                   )}
                   {lastPractice && (
                      <button onClick={() => setView('practice')} className="flex flex-col text-left p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-700 transition-colors">
                        <div className="flex items-center gap-2 mb-2">
                           <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-lg">
                              <PenTool size={16} />
                           </div>
                           <span className="font-semibold text-sm text-slate-800 dark:text-white">Practice Session</span>
                        </div>
                        <h4 className="font-bold text-slate-900 dark:text-white truncate w-full">{lastPractice.subject || 'General'}</h4>
                        <p className="text-xs text-slate-500 mt-1">Unfinished quiz</p>
                      </button>
                   )}
                </div>
             </div>
          )}

          {/* Shortcuts Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <button 
              onClick={() => setView('tutor')}
              className="bg-white dark:bg-slate-800 p-4 rounded-2xl border-2 border-slate-100 dark:border-slate-700 hover:border-emerald-500 hover:shadow-lg transition-all flex flex-col items-center justify-center text-center group"
            >
              <div className="w-10 h-10 mb-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageSquare size={20} />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-white text-sm">AI Tutor</h3>
            </button>
            
            <button 
              onClick={() => setView('practice')}
              className="bg-white dark:bg-slate-800 p-4 rounded-2xl border-2 border-slate-100 dark:border-slate-700 hover:border-blue-500 hover:shadow-lg transition-all flex flex-col items-center justify-center text-center group"
            >
              <div className="w-10 h-10 mb-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <PenTool size={20} />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-white text-sm">Practice</h3>
            </button>

            <button 
              onClick={() => setView('subjects')}
              className="bg-white dark:bg-slate-800 p-4 rounded-2xl border-2 border-slate-100 dark:border-slate-700 hover:border-indigo-500 hover:shadow-lg transition-all flex flex-col items-center justify-center text-center group"
            >
              <div className="w-10 h-10 mb-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <BookOpen size={20} />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-white text-sm">Subjects</h3>
            </button>

            <button 
              onClick={() => setView('profile')}
              className="bg-white dark:bg-slate-800 p-4 rounded-2xl border-2 border-slate-100 dark:border-slate-700 hover:border-purple-500 hover:shadow-lg transition-all flex flex-col items-center justify-center text-center group"
            >
              <div className="w-10 h-10 mb-2 bg-purple-50 dark:bg-purple-900/30 text-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Target size={20} />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-white text-sm">Progress</h3>
            </button>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Daily Goal & Streak */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 shadow-sm flex flex-col gap-6">
            <button onClick={() => setView('practice')} className="text-left group block">
              <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-2 group-hover:text-blue-600 transition-colors">
                <Target size={18} className="text-blue-500" />
                Daily Goal
              </h3>
              <p className="text-sm text-slate-500 mb-3">Complete 3 practice questions.</p>
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full transition-all duration-1000" style={{ width: \`\${Math.min(100, (questionsAnswered % 3) * 33.33)}%\` }}></div>
              </div>
              <p className="text-xs text-right mt-2 text-slate-500 font-medium">{questionsAnswered % 3}/3 completed</p>
            </button>

            <div className="pt-6 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-800 dark:text-white text-sm mb-1">Learning Streak</h3>
                <p className="text-xs text-slate-500">Keep it up!</p>
              </div>
              <div className="flex items-center justify-center bg-orange-50 dark:bg-orange-500/10 text-orange-600 px-4 py-2 rounded-xl border border-orange-100 dark:border-orange-500/20">
                <span className="font-black text-xl mr-1">{streak}</span>
                <span className="text-xs font-bold uppercase tracking-wider">Days</span>
              </div>
            </div>
          </div>

          {/* Progress Overview */}
          <button onClick={() => setView('profile')} className="block text-left bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 shadow-sm hover:border-blue-300 dark:hover:border-blue-700 transition-all group">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 group-hover:text-blue-600 transition-colors">
                <Activity size={18} className="text-emerald-500" />
                Progress Overview
              </h3>
              <ChevronRight size={18} className="text-slate-400 group-hover:text-blue-500" />
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                <div className="text-2xl font-black text-blue-600 dark:text-blue-400">{mastery}%</div>
                <div className="text-[10px] uppercase font-bold text-slate-500 mt-1">Mastery</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{accuracy}%</div>
                <div className="text-[10px] uppercase font-bold text-slate-500 mt-1">Accuracy</div>
              </div>
              <div className="col-span-2 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                <div className="text-2xl font-black text-slate-800 dark:text-white">{questionsAnswered}</div>
                <div className="text-[10px] uppercase font-bold text-slate-500 mt-1">Questions Solved</div>
              </div>
            </div>
          </button>

        </div>
      </div>
    </div>
  );
}
`;

fs.writeFileSync('src/components/Home.tsx', content);

