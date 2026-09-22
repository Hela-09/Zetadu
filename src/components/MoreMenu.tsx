import React, { useEffect, useRef } from 'react';
import { ViewType } from '../types';
import {
  MessageSquare,
  Compass,
  BookOpen,
  Layers,
  Clock,
  WifiOff,
  User,
  Settings,
  X,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface MoreMenuProps {
  isOpen: boolean;
  onClose: () => void;
  anchor?: 'top-right' | 'bottom-right';
  currentView: ViewType;
  setCurrentView: (view: ViewType | string, options?: { replace?: boolean; subState?: Record<string, any> }) => void;
}

export default function MoreMenu({
  isOpen,
  onClose,
  anchor = 'bottom-right',
  currentView,
  setCurrentView,
}: MoreMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  // Close when pressing Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Secondary items requested explicitly for the More (⋮) menu:
  // - AI Tutor
  // - Study Journey
  // - Library
  // - Flashcards
  // - History
  // - Offline Learning
  // - Profile
  // - Settings
  const moreMenuItems = [
    {
      id: 'tutor',
      label: 'AI Tutor',
      subtitle: 'Interactive study assistant',
      icon: MessageSquare,
      color: 'bg-violet-100 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400',
      action: () => {
        onClose();
        setCurrentView('tutor');
      },
      isActive: currentView === 'tutor',
    },
    {
      id: 'journey',
      label: 'Study Journey',
      subtitle: 'Step-by-step syllabus plan',
      icon: Compass,
      color: 'bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400',
      action: () => {
        onClose();
        setCurrentView('journey');
      },
      isActive: currentView === 'journey',
    },
    {
      id: 'subjects',
      label: 'Library',
      subtitle: 'Curriculum subjects & novels',
      icon: BookOpen,
      color: 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400',
      action: () => {
        onClose();
        setCurrentView('subjects');
      },
      isActive: currentView === 'subjects' || currentView === 'novels',
    },
    {
      id: 'flashcards',
      label: 'Flashcards',
      subtitle: 'Spaced repetition decks',
      icon: Layers,
      color: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400',
      action: () => {
        onClose();
        setCurrentView('flashcards');
      },
      isActive: currentView === 'flashcards',
    },
    {
      id: 'history',
      label: 'History',
      subtitle: 'Past CBT & practice records',
      icon: Clock,
      color: 'bg-teal-100 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400',
      action: () => {
        onClose();
        try {
          localStorage.setItem('zetadu_profile_section', 'practice_history');
          window.dispatchEvent(new CustomEvent('open-profile-section', { detail: { section: 'practice_history' } }));
        } catch (e) {
          console.warn('History navigation trigger:', e);
        }
        setCurrentView('profile');
      },
      isActive: false,
    },
    {
      id: 'offline_learning',
      label: 'Offline Learning',
      subtitle: 'Saved questions & offline hub',
      icon: WifiOff,
      color: 'bg-cyan-100 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400',
      action: () => {
        onClose();
        try {
          sessionStorage.setItem('open_offline_hub', 'true');
          window.dispatchEvent(new CustomEvent('open-offline-hub'));
        } catch (e) {
          console.warn('Offline hub trigger:', e);
        }
        setCurrentView('home');
      },
      isActive: false,
    },
    {
      id: 'profile',
      label: 'Profile',
      subtitle: 'XP, level & achievements',
      icon: User,
      color: 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400',
      action: () => {
        onClose();
        try {
          localStorage.removeItem('zetadu_profile_section');
          window.dispatchEvent(new CustomEvent('open-profile-section', { detail: { section: null } }));
        } catch (e) {
          console.warn('Profile navigation trigger:', e);
        }
        setCurrentView('profile');
      },
      isActive: currentView === 'profile',
    },
    {
      id: 'settings',
      label: 'Settings',
      subtitle: 'Font size, preferences & mode',
      icon: Settings,
      color: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300',
      action: () => {
        onClose();
        try {
          localStorage.setItem('zetadu_profile_section', 'settings');
          window.dispatchEvent(new CustomEvent('open-profile-section', { detail: { section: 'settings' } }));
        } catch (e) {
          console.warn('Settings navigation trigger:', e);
        }
        setCurrentView('/settings');
      },
      isActive: false,
    },
  ];

  const isTop = anchor === 'top-right';

  return (
    <>
      {/* Dimmed backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-slate-900/35 dark:bg-black/60 backdrop-blur-[2px]"
            aria-label="Close menu"
          />
        )}
      </AnimatePresence>

      {/* Floating Menu Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={menuRef}
            initial={{
              opacity: 0,
              scale: 0.92,
              y: isTop ? -10 : 16,
            }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{
              opacity: 0,
              scale: 0.94,
              y: isTop ? -8 : 10,
            }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className={`fixed z-50 w-[275px] max-w-[calc(100vw-1rem)] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200/90 dark:border-slate-800/90 p-1.5 overflow-hidden ${
              isTop
                ? 'top-16 right-2 sm:right-4 md:right-6 origin-top-right'
                : 'bottom-[calc(4.25rem+env(safe-area-inset-bottom))] right-2 sm:right-3 origin-bottom-right'
            }`}
          >
            {/* Header */}
            <div className="px-3 py-2 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 mb-1">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400"></span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  LearnDean Menu
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X size={14} />
              </button>
            </div>

            {/* Menu List */}
            <div className="flex flex-col space-y-0.5 max-h-[72dvh] overflow-y-auto overscroll-contain">
              {moreMenuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    id={`more-menu-${anchor}-${item.id}-btn`}
                    onClick={item.action}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left transition-all duration-150 cursor-pointer ${
                      item.isActive
                        ? 'bg-blue-50/90 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/70 active:bg-slate-100 dark:active:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${item.color}`}>
                        <Icon size={16} strokeWidth={2.2} />
                      </div>
                      <div className="truncate min-w-0">
                        <div className="text-xs font-semibold leading-tight text-slate-800 dark:text-slate-100 truncate">
                          {item.label}
                        </div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-500 truncate leading-none mt-0.5">
                          {item.subtitle}
                        </div>
                      </div>
                    </div>
                    {item.isActive ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 shrink-0 ml-2" />
                    ) : (
                      <ChevronRight size={14} className="text-slate-300 dark:text-slate-600 shrink-0 ml-1" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
