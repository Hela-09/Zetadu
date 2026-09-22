import React from 'react';
import { ViewType } from '../types';
import {
  MessageSquare,
  BrainCircuit,
  Layers,
  Compass,
  Clock,
  Sparkles,
  ArrowRight,
  BookOpen,
  ChevronRight,
  Target,
  Flame,
  Zap,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LearnHubProps {
  setView: (view: ViewType | string, options?: { replace?: boolean; subState?: Record<string, any> }) => void;
}

export default function LearnHub({ setView }: LearnHubProps) {
  const { userProfile } = useAuth();

  const learningFeatures = [
    {
      id: 'tutor',
      title: 'AI Tutor',
      badge: 'Socratic 1-on-1',
      description: 'Ask any question, get instant step-by-step explanations, math solutions, and concept breakdowns in real-time.',
      icon: MessageSquare,
      gradient: 'from-blue-600 to-indigo-600',
      badgeBg: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
      borderColor: 'hover:border-blue-500/60 dark:hover:border-blue-500/60',
      iconBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
      ctaText: 'Open AI Tutor',
      onClick: () => setView('tutor'),
    },
    {
      id: 'practice',
      title: 'AI Practice',
      badge: 'UTME CBT & Quizzes',
      description: 'Test your knowledge with authentic past questions, realistic timed exam modes, and instant syllabus explanations.',
      icon: BrainCircuit,
      gradient: 'from-amber-500 to-orange-600',
      badgeBg: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
      borderColor: 'hover:border-amber-500/60 dark:hover:border-amber-500/60',
      iconBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
      ctaText: 'Start AI Practice',
      onClick: () => setView('practice'),
    },
    {
      id: 'flashcards',
      title: 'AI Flashcards',
      badge: 'Spaced Repetition',
      description: 'Master key definitions, formulas, and high-yield concepts using active recall flashcard decks customized to your syllabus.',
      icon: Layers,
      gradient: 'from-emerald-500 to-teal-600',
      badgeBg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
      borderColor: 'hover:border-emerald-500/60 dark:hover:border-emerald-500/60',
      iconBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
      ctaText: 'Study Flashcards',
      onClick: () => setView('flashcards'),
    },
    {
      id: 'journey',
      title: 'Study Journey',
      badge: 'Topic Mastery Roadmap',
      description: 'Follow guided, milestone-based learning paths with XP points, streak rewards, and targeted topic completion.',
      icon: Compass,
      gradient: 'from-purple-600 to-fuchsia-600',
      badgeBg: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
      borderColor: 'hover:border-purple-500/60 dark:hover:border-purple-500/60',
      iconBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
      ctaText: 'Continue Journey',
      onClick: () => setView('journey'),
    },
    {
      id: 'history',
      title: 'History',
      badge: 'Scores & Attempt Review',
      description: 'Review your past test scores, inspect question explanations, track weak areas, and verify your learning gains.',
      icon: Clock,
      gradient: 'from-rose-500 to-pink-600',
      badgeBg: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300',
      borderColor: 'hover:border-rose-500/60 dark:hover:border-rose-500/60',
      iconBg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
      ctaText: 'View History',
      onClick: () => {
        try {
          localStorage.setItem('zetadu_profile_section', 'practice_history');
          window.dispatchEvent(
            new CustomEvent('open-profile-section', { detail: { section: 'practice_history' } })
          );
        } catch (e) {
          console.warn('History navigation trigger:', e);
        }
        setView('profile');
      },
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Top Banner / Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-6 sm:p-8 border border-slate-800 shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold tracking-wide">
            <Sparkles size={14} className="text-blue-400" />
            <span>LEARNDEAN AI STUDY SUITE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight">
            What would you like to learn today?
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Select a learning tool below to chat with your Socratic AI Tutor, simulate CBT exams, drill spaced-repetition flashcards, or track your mastery journey.
          </p>

          {/* Quick Metrics Bar */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md text-xs font-semibold">
              <Flame size={14} className="text-amber-400" />
              <span>Streak: {userProfile?.streak || 0} Days</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md text-xs font-semibold">
              <Zap size={14} className="text-blue-400" />
              <span>Level: {userProfile?.level || 1}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md text-xs font-semibold">
              <Target size={14} className="text-emerald-400" />
              <span>Target: UTME 300+</span>
            </div>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 right-20 w-60 h-60 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* The 5 Core Learning Tools in clean, modern card grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Learning Tools</span>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
              5 Core Features
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {learningFeatures.map((tool) => {
            const Icon = tool.icon;
            return (
              <div
                key={tool.id}
                id={`learn-tool-card-${tool.id}`}
                onClick={tool.onClick}
                className={`group p-5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 ${tool.borderColor} shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className={`p-3 rounded-2xl ${tool.iconBg} shrink-0 group-hover:scale-105 transition-transform`}>
                      <Icon size={24} strokeWidth={2.2} />
                    </div>
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${tool.badgeBg} shrink-0`}>
                      {tool.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center gap-1.5">
                    <span>{tool.title}</span>
                    <ChevronRight size={16} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                    {tool.description}
                  </p>
                </div>

                <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">
                    {tool.ctaText}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <ArrowRight size={13} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Complementary Library Banner (Preserves All Existing Library & Novels Features) */}
      <div className="p-5 rounded-2xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-750 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-blue-600 text-white shrink-0">
            <BookOpen size={20} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Subject Curriculum & Prescribed JAMB Novels
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Access the complete syllabus library, official literature texts (*The Life Changer*, *Second Class Citizen*, etc.), and subject outlines.
            </p>
          </div>
        </div>

        <button
          id="learn-hub-library-btn"
          onClick={() => setView('subjects')}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:border-blue-400 text-slate-800 dark:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs shrink-0"
        >
          <span>Open Library</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
