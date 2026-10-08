import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ViewType } from '../types';
import {
  Home,
  BookOpen,
  GraduationCap,
  FileUp,
} from 'lucide-react';
import { LearnDeanEmblem } from './Logo';
import { navigateToRootSection, getSectionForPath } from '../utils/navigationHistory';

interface BottomNavProps {
  currentView: ViewType;
  setCurrentView: (view: ViewType | string, options?: { replace?: boolean; subState?: Record<string, any> }) => void;
}

export default function BottomNav({ currentView, setCurrentView }: BottomNavProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const currentSection = getSectionForPath(location.pathname);

  // EXACT SPECIFICATION:
  // 5 MAIN ITEMS: Home | Learn | [LEARNDEAN AI LOGO] | Upload | Study
  // Center AI logo is the distinctive LearnDean app logo, visually emphasized slightly more
  // Part of the navigation bar itself (not floating/draggable)
  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      rootPath: '/home',
      isActive: currentSection === 'home',
      isCenter: false,
    },
    {
      id: 'learn',
      label: 'Learn',
      icon: BookOpen,
      rootPath: '/learn',
      isActive: currentSection === 'learn',
      isCenter: false,
    },
    {
      id: 'tutor',
      label: 'AI Tutor',
      icon: null, // Uses distinctive LearnDean AI Logo
      rootPath: '/ai-tutor',
      isActive: currentSection === 'tutor',
      isCenter: true,
    },
    {
      id: 'upload',
      label: 'Upload',
      icon: FileUp,
      rootPath: '/upload-notes',
      isActive: currentSection === 'upload',
      isCenter: false,
    },
    {
      id: 'study',
      label: 'Study',
      icon: GraduationCap,
      rootPath: '/study',
      isActive: currentSection === 'study',
      isCenter: false,
    },
  ];

  const handleNavClick = (item: (typeof navItems)[number]) => {
    navigateToRootSection(navigate, item.rootPath);
  };

  return (
    <nav
      id="mobile-bottom-nav"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/90 dark:border-slate-800 pb-[max(0.4rem,env(safe-area-inset-bottom))] pt-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.3)] select-none overflow-x-hidden"
      role="navigation"
      aria-label="Main mobile navigation"
    >
      <div className="grid grid-cols-5 w-full max-w-lg mx-auto px-1 sm:px-2 items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.isActive;
          const isCenter = item.isCenter;

          return (
            <button
              key={item.id}
              id={`mobile-nav-${item.id}-btn`}
              onClick={() => handleNavClick(item)}
              className="flex flex-col items-center justify-center py-0.5 min-w-0 transition-colors group cursor-pointer relative"
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              {isCenter ? (
                /* Center AI Tutor item with distinctive LearnDean LD monogram app icon */
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-200 overflow-hidden shrink-0 ${
                    isActive
                      ? 'shadow-md shadow-blue-500/30 ring-2 ring-blue-500 scale-[1.05]'
                      : 'shadow-xs border border-blue-200/50 dark:border-blue-800/40 group-hover:scale-105'
                  }`}
                >
                  <LearnDeanEmblem
                    className={`w-full h-full block transition-transform ${
                      isActive ? 'scale-105' : 'group-hover:scale-105'
                    }`}
                    background="app-icon"
                    active={isActive}
                  />
                </div>
              ) : (
                /* Standard Navigation Icon */
                <div className="relative flex items-center justify-center w-7 h-7">
                  {Icon && (
                    <Icon
                      size={24}
                      strokeWidth={isActive ? 2.3 : 1.85}
                      className={`transition-all duration-200 ${
                        isActive
                          ? 'text-blue-600 dark:text-blue-400 scale-[1.03]'
                          : 'text-slate-400 dark:text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200'
                      }`}
                    />
                  )}
                </div>
              )}

              {/* Text Label - Always visible */}
              <span
                className={`text-[10px] sm:text-[11px] leading-tight tracking-tight truncate max-w-full px-0.5 text-center transition-colors duration-200 ${
                  isCenter ? 'mt-0.5' : 'mt-1'
                } ${
                  isActive
                    ? 'font-bold text-blue-600 dark:text-blue-400'
                    : isCenter
                    ? 'font-semibold text-blue-600/80 dark:text-blue-400/80 group-hover:text-blue-600 dark:group-hover:text-blue-300'
                    : 'font-medium text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                }`}
              >
                {item.label}
              </span>

              {/* Active Dot Indicator - Smoothly moves across tabs via Framer Motion layoutId */}
              <div className="h-2 flex items-center justify-center mt-0.5">
                {isActive ? (
                  <motion.div
                    layoutId="bottomNavActiveDot"
                    className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                ) : (
                  <div className="w-1.5 h-1.5 opacity-0" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
