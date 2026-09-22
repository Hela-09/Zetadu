import React from 'react';
import { ViewType } from '../types';
import {
  Home,
  BrainCircuit,
  GraduationCap,
  FileUp,
} from 'lucide-react';

interface BottomNavProps {
  currentView: ViewType;
  setCurrentView: (view: ViewType | string, options?: { replace?: boolean; subState?: Record<string, any> }) => void;
}

export default function BottomNav({ currentView, setCurrentView }: BottomNavProps) {
  // STRICT REQUIREMENT:
  // BOTTOM NAVIGATION — ONLY 4 ITEMS:
  // 1. Home
  // 2. Learn
  // 3. JAMB
  // 4. Upload
  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      isActive: currentView === 'home',
      isUpload: false,
    },
    {
      id: 'learn',
      label: 'Learn',
      icon: BrainCircuit,
      // Stays active when using any of the learning features (AI Tutor, Practice, Flashcards, Study Journey)
      isActive:
        currentView === 'learn' ||
        currentView === 'tutor' ||
        currentView === 'practice' ||
        currentView === 'flashcards' ||
        currentView === 'journey',
      isUpload: false,
    },
    {
      id: 'jamb',
      label: 'JAMB',
      icon: GraduationCap,
      isActive: currentView === 'jamb' || currentView === 'novels',
      isUpload: false,
    },
    {
      id: 'upload_notes',
      label: 'Upload',
      icon: FileUp,
      isActive: currentView === 'upload_notes',
      isUpload: true,
    },
  ];

  return (
    <nav
      id="mobile-bottom-nav"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/90 dark:border-slate-800 pb-[max(0.4rem,env(safe-area-inset-bottom))] pt-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.3)] select-none"
    >
      <div className="grid grid-cols-4 w-full max-w-md mx-auto px-1 sm:px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.isActive;

          return (
            <button
              key={item.id}
              id={`mobile-nav-${item.id}-btn`}
              onClick={() => setCurrentView(item.id as ViewType)}
              className="flex flex-col items-center justify-center h-13 py-0.5 min-w-0 transition-colors group cursor-pointer relative"
              aria-label={item.label}
            >
              {/* Active Pill Indicator */}
              <div
                className={`w-12 sm:w-14 h-7 rounded-full flex items-center justify-center transition-all duration-200 relative ${
                  isActive
                    ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 scale-100'
                    : item.isUpload
                    ? 'text-blue-600 dark:text-blue-400 group-hover:text-blue-700 bg-blue-50/80 dark:bg-blue-950/40'
                    : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                }`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : item.isUpload ? 2.3 : 1.9} />

                {/* Subtle upload badge indicator */}
                {item.isUpload && !isActive && (
                  <span
                    className="absolute -top-1 -right-1 flex h-2 w-2"
                    title="Upload study notes & textbooks"
                  >
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                  </span>
                )}
              </div>

              {/* Text Label */}
              <span
                className={`text-[10px] sm:text-[10.5px] tracking-tight leading-tight mt-0.5 truncate max-w-full px-0.5 ${
                  isActive
                    ? 'font-extrabold text-blue-700 dark:text-blue-400'
                    : item.isUpload
                    ? 'font-bold text-blue-600 dark:text-blue-400'
                    : 'font-medium text-slate-500 dark:text-slate-400'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
