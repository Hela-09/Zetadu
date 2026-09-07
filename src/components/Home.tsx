import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, BookOpen, PenTool, MessageSquare, Target, Activity, Search, Bell, Clock, ChevronRight, CheckCircle, BrainCircuit, Zap, Flame, Trophy, Calendar, Play, Settings, Compass, AlertTriangle, Layers, FileUp } from 'lucide-react';
import { ViewType,  TutorConversation, SubjectHistory, StudyJourneyState } from '../types';
import { collection, query, where, getDocs, getDoc, doc, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { getLevelInfo } from '../lib/achievements';
import { loadStudyJourney, clearStudyJourney } from '../lib/studyJourneyService';
import { fetchStudentTopicAnalysis, StudentTopicAnalysis, TopicResultSummary } from '../utils/weakTopics';
import WeakTopicActionModal from './WeakTopicActionModal';
import DailyStudyPlanCard from './DailyStudyPlanCard';
import ReviewMistakesModal from './ReviewMistakesModal';
import { getDailyStudyPlan, markMistakesReviewed } from '../utils/dailyStudyPlan';
import { DailyStudyPlan } from '../types';

interface HomeProps {
  setView: (view: ViewType) => void;
}

export default function Home({ setView }: HomeProps) {
  const { user, userProfile } = useAuth();
  
  // New State metrics
  const [examReadiness, setExamReadiness] = useState(0);
  const [streak, setStreak] = useState(userProfile?.streak || 0);
  const [topicAnalysis, setTopicAnalysis] = useState<StudentTopicAnalysis | null>(null);
  const [selectedWeakTopic, setSelectedWeakTopic] = useState<TopicResultSummary | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'weak' | 'average' | 'strong'>('weak');
  const [recentPractice, setRecentPractice] = useState<any | null>(null);
  const [activeJourney, setActiveJourney] = useState<StudyJourneyState | null>(null);
  
  // Daily Study Plan State
  const [dailyPlan, setDailyPlan] = useState<DailyStudyPlan | null>(null);
  const [dailyPlanLoading, setDailyPlanLoading] = useState(false);
  const [reviewMistakesTopic, setReviewMistakesTopic] = useState<TopicResultSummary | null>(null);
  
  const [loading, setLoading] = useState(true);

  const refreshDailyPlan = async () => {
    if (!user) return;
    setDailyPlanLoading(true);
    try {
      const plan = await getDailyStudyPlan(user.uid);
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
      const updated = await getDailyStudyPlan(user.uid);
      setDailyPlan(updated);
    }
  };

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

        // Fetch comprehensive real student practice results
        const analysisData = await fetchStudentTopicAnalysis(user.uid);
        setTopicAnalysis(analysisData);
        setExamReadiness(analysisData.overallAccuracy || 0);

        if (analysisData.weakTopics.length > 0) {
          setActiveTab('weak');
        } else if (analysisData.averageTopics.length > 0) {
          setActiveTab('average');
        } else {
          setActiveTab('all');
        }
        
        // Fetch Daily Study Plan
        try {
          const plan = await getDailyStudyPlan(user.uid);
          setDailyPlan(plan);
        } catch (planErr) {
          console.warn('Failed to load daily study plan in fetchStats:', planErr);
        }

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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Content Area */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
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

          {/* Weak Topics & Performance Diagnostics */}
          <div id="weak-topics-home-card" className="bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-3xl p-6 md:p-8">
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
                        className="group flex flex-col justify-between bg-slate-50/70 dark:bg-slate-900/50 hover:bg-slate-100/70 dark:hover:bg-slate-850 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-amber-400 transition-all cursor-pointer"
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
                        className="group flex flex-col justify-between bg-slate-50/70 dark:bg-slate-900/50 hover:bg-slate-100/70 dark:hover:bg-slate-850 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-emerald-400 transition-all cursor-pointer"
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
          <WeakTopicActionModal
            topic={selectedWeakTopic}
            onClose={() => setSelectedWeakTopic(null)}
            setView={setView}
          />

          {/* Review Mistakes Modal for Daily Study Plan */}
          <ReviewMistakesModal
            topicSummary={reviewMistakesTopic}
            onClose={() => setReviewMistakesTopic(null)}
            onCompleteReview={handleCompleteMistakesReview}
            setView={setView}
          />
          
          {/* Quick Actions */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
            <button id="quick-action-upload-notes" onClick={() => setView('upload_notes')} className="bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-3xl border-2 border-slate-100 dark:border-slate-700 hover:border-blue-500 hover:shadow-lg transition-all flex flex-col items-center justify-center text-center group cursor-pointer">
              <div className="w-11 h-11 mb-2.5 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileUp size={24} />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-white text-xs sm:text-sm">Upload Notes</h3>
            </button>
            <button onClick={() => setView('journey')} className="bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-3xl border-2 border-slate-100 dark:border-slate-700 hover:border-indigo-500 hover:shadow-lg transition-all flex flex-col items-center justify-center text-center group cursor-pointer">
              <div className="w-11 h-11 mb-2.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Compass size={24} />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-white text-xs sm:text-sm">Study Journey</h3>
            </button>
            <button onClick={() => setView('tutor')} className="bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-3xl border-2 border-slate-100 dark:border-slate-700 hover:border-emerald-500 hover:shadow-lg transition-all flex flex-col items-center justify-center text-center group cursor-pointer">
              <div className="w-11 h-11 mb-2.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageSquare size={24} />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-white text-xs sm:text-sm">AI Tutor</h3>
            </button>
            <button onClick={() => setView('subjects')} className="bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-3xl border-2 border-slate-100 dark:border-slate-700 hover:border-amber-500 hover:shadow-lg transition-all flex flex-col items-center justify-center text-center group cursor-pointer">
              <div className="w-11 h-11 mb-2.5 bg-amber-50 dark:bg-amber-900/30 text-amber-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <BookOpen size={24} />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-white text-xs sm:text-sm">Library</h3>
            </button>
            <button onClick={() => setView('practice')} className="bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-3xl border-2 border-slate-100 dark:border-slate-700 hover:border-rose-500 hover:shadow-lg transition-all flex flex-col items-center justify-center text-center group cursor-pointer">
              <div className="w-11 h-11 mb-2.5 bg-rose-50 dark:bg-rose-900/30 text-rose-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <PenTool size={24} />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-white text-xs sm:text-sm">Practice</h3>
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
