import React, { useEffect, useState, lazy, Suspense } from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, BookOpen, PenTool, MessageSquare, Target, Activity, Search, Bell, Clock, ChevronRight, CheckCircle, BrainCircuit, Zap, Flame, Trophy, Calendar, Play, Settings, Compass, AlertTriangle, Layers, FileUp, GraduationCap, Calculator, Download, WifiOff, Wifi } from 'lucide-react';
import { ViewType, TutorConversation, SubjectHistory, StudyJourneyState } from '../types';
import { collection, query, where, getDocs, getDoc, doc, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { getLevelInfo } from '../lib/achievements';
import { loadStudyJourney, clearStudyJourney } from '../lib/studyJourneyService';
import { fetchStudentTopicAnalysis, StudentTopicAnalysis, TopicResultSummary } from '../utils/weakTopics';
import DailyStudyPlanCard from './DailyStudyPlanCard';
import { getDailyStudyPlan, markMistakesReviewed } from '../utils/dailyStudyPlan';
import { DailyStudyPlan } from '../types';
import OfflineLearningHub from './offline/OfflineLearningHub';
import PrepareForOfflineModal from './offline/PrepareForOfflineModal';

const WeakTopicActionModal = lazy(() => import('./WeakTopicActionModal'));
const ReviewMistakesModal = lazy(() => import('./ReviewMistakesModal'));

interface HomeProps {
  setView: (view: ViewType) => void;
}

export default function Home({ setView }: HomeProps) {
  const { user, userProfile } = useAuth();
  
  // Fast hydration from local cache to eliminate blank/spinner startup delays
  const [cachedHome] = useState(() => {
    if (!user) return null;
    try {
      const saved = localStorage.getItem(`zetadu_home_cache_${user.uid}`);
      return saved ? JSON.parse(saved) : null;
    } catch (_) {
      return null;
    }
  });

  const [examReadiness, setExamReadiness] = useState(() => cachedHome?.examReadiness || 0);
  const [streak, setStreak] = useState(() => userProfile?.streak || cachedHome?.streak || 0);
  const [topicAnalysis, setTopicAnalysis] = useState<StudentTopicAnalysis | null>(() => cachedHome?.topicAnalysis || null);
  const [selectedWeakTopic, setSelectedWeakTopic] = useState<TopicResultSummary | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'weak' | 'average' | 'strong'>(() => {
    if (cachedHome?.topicAnalysis?.weakTopics?.length > 0) return 'weak';
    if (cachedHome?.topicAnalysis?.averageTopics?.length > 0) return 'average';
    return 'all';
  });
  const [recentPractice, setRecentPractice] = useState<any | null>(() => cachedHome?.recentPractice || null);
  const [activeJourney, setActiveJourney] = useState<StudyJourneyState | null>(() => cachedHome?.activeJourney || null);
  
  // Daily Study Plan State initialized from cache
  const [dailyPlan, setDailyPlan] = useState<DailyStudyPlan | null>(() => cachedHome?.dailyPlan || null);
  const [dailyPlanLoading, setDailyPlanLoading] = useState(false);
  const [reviewMistakesTopic, setReviewMistakesTopic] = useState<TopicResultSummary | null>(null);

  // Offline Learning Hub states
  const [isOffline, setIsOffline] = useState<boolean>(() => typeof navigator !== 'undefined' ? !navigator.onLine : false);
  const [showOfflineHubPreview, setShowOfflineHubPreview] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('open_offline_hub') === 'true') {
      sessionStorage.removeItem('open_offline_hub');
      return true;
    }
    return false;
  });
  const [isPrepareModalOpen, setIsPrepareModalOpen] = useState<boolean>(false);
  const [onlineNotification, setOnlineNotification] = useState<string | null>(null);

  useEffect(() => {
    const handleOpenOfflineHub = () => {
      setShowOfflineHubPreview(true);
      window.scrollTo(0, 0);
    };
    window.addEventListener('open-offline-hub', handleOpenOfflineHub);
    return () => window.removeEventListener('open-offline-hub', handleOpenOfflineHub);
  }, []);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setShowOfflineHubPreview(false);
      setOnlineNotification("Connection restored. Automatically returned to live Home dashboard.");
      setTimeout(() => {
        setOnlineNotification(null);
      }, 4000);
    };

    const handleOffline = () => {
      setIsOffline(true);
      setOnlineNotification("Offline mode detected. LearnDean Offline Learning Hub is active.");
      setTimeout(() => {
        setOnlineNotification(null);
      }, 4000);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  // Start with loading: false if cached data exists or profile is ready so UI displays immediately
  const [loading, setLoading] = useState(() => !cachedHome);

  const refreshDailyPlan = async () => {
    if (!user) return;
    setDailyPlanLoading(true);
    try {
      const plan = await getDailyStudyPlan(user.uid, topicAnalysis || undefined);
      setDailyPlan(plan);
    } catch (e) {
      console.warn("Failed to refresh daily study plan:", e);
    } finally {
      setDailyPlanLoading(false);
    }
  };

  const handleOpenMistakeReview = () => {
    const target = topicAnalysis?.weakTopics[0] ||
      topicAnalysis?.averageTopics[0] ||
      (topicAnalysis?.allTopics && topicAnalysis.allTopics.length > 0 ? topicAnalysis.allTopics[0] : null);
    
    if (target) {
      setReviewMistakesTopic(target);
    } else {
      setReviewMistakesTopic({
        topic: dailyPlan?.primaryTopic || 'General Review',
        subject: dailyPlan?.primarySubject || 'Core Subjects',
        subjectId: 'mathematics',
        totalQuestions: 0,
        correctCount: 0,
        incorrectCount: 0,
        accuracy: 0,
        category: 'weak',
        mistakes: []
      });
    }
  };

  const handleCompleteMistakesReview = async () => {
    if (user) {
      await markMistakesReviewed(user.uid);
      const updated = await getDailyStudyPlan(user.uid, topicAnalysis || undefined);
      setDailyPlan(updated);
    }
  };

  useEffect(() => {
    let isCancelled = false;
    const fetchStats = async () => {
      if (!user) return;
      try {
        // Fetch all primary dashboard stats in parallel without blocking sequential waterfalls
        const [journeyRes, analysisRes, practiceRes] = await Promise.allSettled([
          loadStudyJourney(user.uid),
          fetchStudentTopicAnalysis(user.uid),
          getDoc(doc(db, 'practice_sessions', user.uid))
        ]);

        if (isCancelled) return;

        let journeyData: StudyJourneyState | null = null;
        if (journeyRes.status === 'fulfilled' && journeyRes.value && journeyRes.value.status === 'in_progress') {
          journeyData = journeyRes.value;
          setActiveJourney(journeyData);
        }

        let analysisData: StudentTopicAnalysis | null = null;
        if (analysisRes.status === 'fulfilled' && analysisRes.value) {
          analysisData = analysisRes.value;
          setTopicAnalysis(analysisData);
          setExamReadiness(analysisData.overallAccuracy || 0);

          if (analysisData.weakTopics.length > 0) {
            setActiveTab('weak');
          } else if (analysisData.averageTopics.length > 0) {
            setActiveTab('average');
          } else {
            setActiveTab('all');
          }
        }

        let practiceData: any = null;
        if (practiceRes.status === 'fulfilled' && practiceRes.value.exists()) {
          practiceData = { id: practiceRes.value.id, ...practiceRes.value.data() };
          setRecentPractice(practiceData);
        }

        // Fetch Daily Study Plan passing the already retrieved analysisData (avoids duplicate query!)
        let planData: DailyStudyPlan | null = null;
        try {
          planData = await getDailyStudyPlan(user.uid, analysisData || undefined);
          if (!isCancelled && planData) {
            setDailyPlan(planData);
          }
        } catch (planErr) {
          console.warn('Failed to load daily study plan in fetchStats:', planErr);
        }

        // Cache combined results for instant subsequent loads
        try {
          localStorage.setItem(
            `zetadu_home_cache_${user.uid}`,
            JSON.stringify({
              topicAnalysis: analysisData,
              examReadiness: analysisData?.overallAccuracy || 0,
              recentPractice: practiceData,
              activeJourney: journeyData,
              dailyPlan: planData,
              updatedAt: Date.now()
            })
          );
        } catch (_) {}
        
      } catch (err: any) {
        console.warn("Stats fetch warning:", err);
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };
    
    fetchStats();
    return () => {
      isCancelled = true;
    };
  }, [user]);

  const userName = user?.displayName ? user.displayName.split(' ')[0] : 'Student';

  // If user is offline or previewing the offline hub, show OfflineLearningHub immediately
  if (isOffline || showOfflineHubPreview) {
    return (
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-6 pb-28 sm:pb-32">
        {onlineNotification && (
          <div className="p-3.5 rounded-xl bg-amber-500 text-white text-xs sm:text-sm font-semibold flex items-center justify-between shadow-xs">
            <span>{onlineNotification}</span>
            <button
              onClick={() => setOnlineNotification(null)}
              className="text-white/80 hover:text-white ml-2 text-xs uppercase font-bold cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {showOfflineHubPreview && !isOffline && (
          <div className="p-3 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 rounded-xl flex items-center justify-between text-xs text-blue-800 dark:text-blue-200">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>
                <strong>Preview Mode:</strong> You are testing the Offline Learning Hub while online.
              </span>
            </div>
            <button
              onClick={() => setShowOfflineHubPreview(false)}
              className="font-bold underline text-blue-600 dark:text-blue-400 hover:text-blue-800 cursor-pointer"
            >
              Return to Live Home
            </button>
          </div>
        )}

        <OfflineLearningHub
          setView={setView}
          onRetryConnection={() => {
            if (typeof navigator !== 'undefined' && navigator.onLine) {
              setIsOffline(false);
              setShowOfflineHubPreview(false);
            }
          }}
          isOnlineActual={!isOffline}
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const startRecommendedPractice = () => {
    const target = topicAnalysis?.weakTopics[0] || topicAnalysis?.averageTopics[0] || topicAnalysis?.strongTopics[0];
    if (target) {
      localStorage.removeItem('practice_session');
      localStorage.setItem('zetadu_target_topic', target.topic);
      localStorage.setItem('zetadu_target_subject', target.subject);
      localStorage.setItem('zetadu_target_subject_id', target.subjectId);
    }
    setView('practice');
  };

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-5 sm:gap-8 pb-28 sm:pb-32 min-w-0">
      {/* Online Notification Banner */}
      {onlineNotification && (
        <div className="p-3.5 rounded-xl bg-emerald-600 text-white text-xs sm:text-sm font-semibold flex items-center justify-between shadow-xs">
          <span>{onlineNotification}</span>
          <button
            onClick={() => setOnlineNotification(null)}
            className="text-white/80 hover:text-white ml-2 text-xs uppercase font-bold cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Hello, {userName}! 👋
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1 text-sm sm:text-base">
            Welcome back to your personalized study dashboard.
          </p>
        </div>
        
        <div className="flex items-center gap-3 flex-wrap">
          {/* Prepare for Offline Button */}
          <button
            id="home-prepare-offline-btn"
            onClick={() => setIsPrepareModalOpen(true)}
            className="px-3.5 py-2.5 rounded-2xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/80 text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shadow-2xs"
            title="Download JAMB content and novels for offline study"
          >
            <Download className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Prepare for Offline</span>
          </button>

          {/* Offline Hub Preview Button */}
          <button
            id="home-offline-hub-preview-btn"
            onClick={() => setShowOfflineHubPreview(true)}
            className="px-3 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            title="Preview Offline Learning Hub"
          >
            <WifiOff className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span>Offline Hub</span>
          </button>

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
             <div className="flex items-center gap-3 sm:gap-4 bg-white dark:bg-slate-800 p-2.5 sm:p-3 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs max-w-full">
                <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white font-bold text-xs sm:text-base shadow-md shrink-0">
                   Lvl {levelInfo.level}
                </div>
                <div className="pr-1 sm:pr-2 min-w-0 flex-1">
                   <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 truncate">{levelInfo.title}</span>
                      <span className="text-[10px] sm:text-xs font-medium text-blue-600 dark:text-blue-400 shrink-0">{xp} / {levelInfo.nextXp} XP</span>
                   </div>
                   <div className="h-2 w-24 sm:w-32 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }}></div>
                   </div>
                </div>
             </div>
           );
        })()}
        </div>
      </div>

      {/* Five Main Feature Layouts */}
      <div id="home-top-feature-layouts" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 w-full min-w-0">
        <button id="quick-action-ai-tutor" onClick={() => setView('tutor')} className="bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-3xl border-2 border-slate-100 dark:border-slate-700 hover:border-emerald-500 hover:shadow-lg transition-all flex flex-col items-center justify-center text-center group cursor-pointer">
          <div className="w-11 h-11 mb-2.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <MessageSquare size={24} />
          </div>
          <h3 className="font-bold text-slate-800 dark:text-white text-xs sm:text-sm">AI Tutor</h3>
        </button>
        <button id="quick-action-upload-notes" onClick={() => setView('upload_notes')} className="bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-3xl border-2 border-slate-100 dark:border-slate-700 hover:border-blue-500 hover:shadow-lg transition-all flex flex-col items-center justify-center text-center group cursor-pointer">
          <div className="w-11 h-11 mb-2.5 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <FileUp size={24} />
          </div>
          <h3 className="font-bold text-slate-800 dark:text-white text-xs sm:text-sm">Upload Notes</h3>
        </button>
        <button id="quick-action-study-journey" onClick={() => setView('journey')} className="bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-3xl border-2 border-slate-100 dark:border-slate-700 hover:border-indigo-500 hover:shadow-lg transition-all flex flex-col items-center justify-center text-center group cursor-pointer">
          <div className="w-11 h-11 mb-2.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Compass size={24} />
          </div>
          <h3 className="font-bold text-slate-800 dark:text-white text-xs sm:text-sm">Study Journey</h3>
        </button>
        <button id="quick-action-library" onClick={() => setView('subjects')} className="bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-3xl border-2 border-slate-100 dark:border-slate-700 hover:border-amber-500 hover:shadow-lg transition-all flex flex-col items-center justify-center text-center group cursor-pointer">
          <div className="w-11 h-11 mb-2.5 bg-amber-50 dark:bg-amber-900/30 text-amber-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <BookOpen size={24} />
          </div>
          <h3 className="font-bold text-slate-800 dark:text-white text-xs sm:text-sm">Library</h3>
        </button>
        <button id="quick-action-practice" onClick={() => setView('practice')} className="col-span-2 sm:col-span-1 lg:col-span-1 bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-3xl border-2 border-slate-100 dark:border-slate-700 hover:border-rose-500 hover:shadow-lg transition-all flex flex-col items-center justify-center text-center group cursor-pointer">
          <div className="w-11 h-11 mb-2.5 bg-rose-50 dark:bg-rose-900/30 text-rose-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <PenTool size={24} />
          </div>
          <h3 className="font-bold text-slate-800 dark:text-white text-xs sm:text-sm">Practice</h3>
        </button>
      </div>

      {/* Quick Search Bar Banner on Home */}
      <div 
        id="home-search-banner"
        onClick={() => {
          const event = new CustomEvent('open-zetadu-search');
          window.dispatchEvent(event);
        }}
        className="w-full bg-white dark:bg-slate-800/90 p-3.5 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-xs hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-4 group"
      >
        <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform border border-blue-100 dark:border-blue-900/40">
            <Search size={18} />
          </div>
          <div className="truncate">
            <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              Find Subjects, Topics, Flashcards & Practice Questions
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              Type to search any subject syllabus, flashcards, or practice questions instantly...
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <kbd className="hidden md:inline-block px-2 py-1 text-xs font-mono bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg border border-slate-200 dark:border-slate-600">
            ⌘K
          </kbd>
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
            Search <ArrowRight size={14} />
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 w-full min-w-0">
        
        {/* Main Content Area */}
        <div className="lg:col-span-8 flex flex-col gap-6 sm:gap-8 min-w-0">
          
          {/* Daily Study Plan */}
          <DailyStudyPlanCard
            plan={dailyPlan}
            loading={dailyPlanLoading}
            topicSummary={topicAnalysis?.weakTopics[0] || topicAnalysis?.averageTopics[0] || null}
            onRefresh={refreshDailyPlan}
            onOpenMistakeReview={handleOpenMistakeReview}
            setView={setView}
            onPlanUpdated={(updated) => setDailyPlan(updated)}
          />
          
          {/* JAMB CBT Prep Banner Card */}
          <div 
            id="jamb-prep-home-card"
            onClick={() => setView('jamb')}
            className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 text-white cursor-pointer hover:shadow-xl hover:shadow-blue-600/25 transition-all group relative overflow-hidden border border-blue-500/30 w-full min-w-0"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform">
              <GraduationCap size={130} />
            </div>
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-blue-500/40 text-blue-200 border border-blue-400/40 uppercase tracking-wider">
                    UTME 2025 / 2026
                  </span>
                  <span className="text-xs text-blue-200 flex items-center gap-1 font-semibold">
                    <Calculator size={13} className="text-amber-300" /> Maths Calculator Included
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  JAMB CBT Exam Prep
                </h2>
                <p className="text-blue-100/90 text-sm max-w-lg leading-relaxed">
                  Practice past questions organized by year for English, Mathematics, Physics, Chemistry & Biology with real exam timer and in-question scientific calculator.
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {['English', 'Mathematics', 'Physics', 'Chemistry', 'Biology'].map((subj) => (
                    <span key={subj} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/10 backdrop-blur-xs text-white">
                      {subj}
                    </span>
                  ))}
                </div>
              </div>
              <div className="shrink-0 flex sm:flex-col items-start sm:items-end justify-between gap-3">
                <button 
                  type="button"
                  className="bg-white text-blue-800 px-6 py-3 rounded-2xl font-bold text-sm shadow-md group-hover:bg-blue-50 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Practice CBT</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Daily Challenge */}
          <div 
            onClick={() => setView('daily_challenge')}
            className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 text-white cursor-pointer hover:shadow-lg hover:shadow-orange-500/30 transition-all group relative overflow-hidden w-full min-w-0"
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

          {/* Weak Topics & Performance Diagnostics */}
          <div id="weak-topics-home-card" className="bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 w-full min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-rose-50 dark:bg-rose-950/40 text-rose-600 rounded-2xl flex items-center justify-center border border-rose-100 dark:border-rose-900/50">
                  <Target size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Weak Topics & Mastery</h2>
                  <p className="text-slate-500 text-sm">Real-time analysis from your practice results.</p>
                </div>
              </div>
              <button
                id="view-all-weak-topics-btn"
                onClick={() => setView('weak_topics')}
                className="self-start sm:self-auto px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>View Full Analysis</span>
                <ChevronRight size={14} />
              </button>
            </div>

            {/* Metric Tabs */}
            <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300 flex items-center gap-1.5 shrink-0">
                <AlertTriangle size={13} />
                <span>Weak: {topicAnalysis?.weakTopics.length || 0}</span>
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 flex items-center gap-1.5 shrink-0">
                <Activity size={13} />
                <span>Average: {topicAnalysis?.averageTopics.length || 0}</span>
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5 shrink-0">
                <CheckCircle size={13} />
                <span>Strong: {topicAnalysis?.strongTopics.length || 0}</span>
              </span>
            </div>

            <div className="flex flex-col gap-8">
              
              {/* Weak Topics */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <Target size={18} className="text-rose-500" />
                    <span>Weak Topics</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900">
                      &lt; 50%
                    </span>
                  </h3>
                  <span className="text-xs text-slate-400 hidden sm:inline">Click any weak topic to practice, review cards, or ask tutor</span>
                </div>

                {topicAnalysis && topicAnalysis.weakTopics.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {topicAnalysis.weakTopics.map((topic, i) => (
                      <div
                        key={`weak-${i}`}
                        id={`weak-topic-item-${i}`}
                        onClick={() => setSelectedWeakTopic(topic)}
                        className="group flex flex-col justify-between bg-rose-50/40 dark:bg-rose-950/20 hover:bg-rose-50 dark:hover:bg-rose-950/40 p-4 rounded-2xl border-2 border-rose-200/80 dark:border-rose-900/60 hover:border-rose-500 dark:hover:border-rose-500 transition-all cursor-pointer shadow-xs"
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block truncate">
                              {topic.subject}
                            </span>
                            <span className="font-bold text-slate-900 dark:text-white truncate block text-sm group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors" title={topic.topic}>
                              {topic.topic}
                            </span>
                          </div>
                          <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800 shrink-0">
                            {topic.accuracy}%
                          </span>
                        </div>

                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 mb-2 overflow-hidden">
                          <div className="h-full bg-rose-500 rounded-full" style={{ width: `${Math.max(6, topic.accuracy)}%` }} />
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                          <span>{topic.correctCount}/{topic.totalQuestions} correct ({topic.incorrectCount} missed)</span>
                          <span className="font-bold text-rose-600 dark:text-rose-400 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                            <span>Take Action</span>
                            <ChevronRight size={13} />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 text-slate-500 text-xs italic">
                    {topicAnalysis?.hasResults
                      ? 'No weak topics identified! You are performing at or above 50% in all tested topics.'
                      : 'No practice results yet. Complete a quiz to analyze weak topics.'}
                  </div>
                )}
              </div>

              {/* Average Topics */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <Activity size={18} className="text-amber-500" />
                    <span>Average Topics</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900">
                      50% - 74%
                    </span>
                  </h3>
                </div>

                {topicAnalysis && topicAnalysis.averageTopics.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {topicAnalysis.averageTopics.map((topic, i) => (
                      <div
                        key={`avg-${i}`}
                        id={`avg-topic-item-${i}`}
                        onClick={() => setSelectedWeakTopic(topic)}
                        className="group flex flex-col justify-between bg-slate-50/70 dark:bg-slate-900/50 hover:bg-slate-100/70 dark:hover:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-amber-400 transition-all cursor-pointer"
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block truncate">
                              {topic.subject}
                            </span>
                            <span className="font-bold text-slate-800 dark:text-white truncate block text-sm" title={topic.topic}>
                              {topic.topic}
                            </span>
                          </div>
                          <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800 shrink-0">
                            {topic.accuracy}%
                          </span>
                        </div>

                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 mb-2 overflow-hidden">
                          <div className="h-full bg-amber-500 rounded-full" style={{ width: `${topic.accuracy}%` }} />
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                          <span>{topic.correctCount}/{topic.totalQuestions} questions correct</span>
                          <span className="font-semibold text-amber-600 dark:text-amber-400">Review</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 text-slate-500 text-xs italic">
                    No average topics identified yet.
                  </div>
                )}
              </div>

              {/* Strong Topics */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <CheckCircle size={18} className="text-emerald-500" />
                    <span>Strong Topics</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900">
                      &ge; 75%
                    </span>
                  </h3>
                </div>

                {topicAnalysis && topicAnalysis.strongTopics.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {topicAnalysis.strongTopics.map((topic, i) => (
                      <div
                        key={`strong-${i}`}
                        id={`strong-topic-item-${i}`}
                        onClick={() => setSelectedWeakTopic(topic)}
                        className="group flex flex-col justify-between bg-slate-50/70 dark:bg-slate-900/50 hover:bg-slate-100/70 dark:hover:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-emerald-400 transition-all cursor-pointer"
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block truncate">
                              {topic.subject}
                            </span>
                            <span className="font-bold text-slate-800 dark:text-white truncate block text-sm" title={topic.topic}>
                              {topic.topic}
                            </span>
                          </div>
                          <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 shrink-0">
                            {topic.accuracy}%
                          </span>
                        </div>

                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 mb-2 overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${topic.accuracy}%` }} />
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                          <span>{topic.correctCount}/{topic.totalQuestions} questions correct</span>
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">Mastered</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 text-slate-500 text-xs italic">
                    No strong topics identified yet.
                  </div>
                )}
              </div>

            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button 
                id="start-recommended-practice-btn"
                onClick={startRecommendedPractice}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play size={18} className="fill-current" /> Start Recommended Practice
              </button>
              <button
                id="explore-weak-topics-btn"
                onClick={() => setView('weak_topics')}
                className="w-full sm:w-auto bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Target size={18} className="text-rose-500" /> Explore All Weak Topics
              </button>
            </div>
            
          </div>

          {/* Action Modal for Weak Topics */}
          {selectedWeakTopic && (
            <Suspense fallback={null}>
              <WeakTopicActionModal
                topic={selectedWeakTopic}
                onClose={() => setSelectedWeakTopic(null)}
                setView={setView}
              />
            </Suspense>
          )}

          {/* Review Mistakes Modal for Daily Study Plan */}
          {reviewMistakesTopic && (
            <Suspense fallback={null}>
              <ReviewMistakesModal
                topicSummary={reviewMistakesTopic}
                onClose={() => setReviewMistakesTopic(null)}
                onCompleteReview={handleCompleteMistakesReview}
                setView={setView}
              />
            </Suspense>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-6 min-w-0">
          {/* Continue Study */}
          <div className="bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl sm:rounded-3xl p-4 sm:p-6 w-full min-w-0">
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
                    className="py-2 px-3 rounded-xl bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-600 transition-colors cursor-pointer"
                  >
                    Start Over
                  </button>
                </div>
              </div>
            ) : recentPractice ? (
              <div onClick={() => setView('practice')} className="group p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-500 cursor-pointer transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                    <PenTool size={16} />
                  </div>
                  <span className="font-bold text-sm text-slate-800 dark:text-white">Unfinished Practice</span>
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white truncate">{recentPractice.subject || 'General'}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Pick up where you left off</p>
              </div>
            ) : (
              <div onClick={() => setView('tutor')} className="group p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-500 cursor-pointer transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-lg">
                    <MessageSquare size={16} />
                  </div>
                  <span className="font-bold text-sm text-slate-800 dark:text-white">AI Tutor</span>
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white truncate">Start a new session</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Ask questions or review a topic</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Clearance Spacer */}
      <div className="md:hidden h-20 sm:h-24 w-full shrink-0 pointer-events-none" aria-hidden="true" />

      {/* Prepare for Offline Modal */}
      <PrepareForOfflineModal
        isOpen={isPrepareModalOpen}
        onClose={() => setIsPrepareModalOpen(false)}
      />
    </div>
  );
}
