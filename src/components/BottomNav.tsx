import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ViewType } from '../types';
import {
  Home,
  BookOpen,
  GraduationCap,
  Upload,
  User,
} from 'lucide-react';
import { navigateToRootSection, getSectionForPath } from '../utils/navigationHistory';
import { useAuth } from '../contexts/AuthContext';

interface BottomNavProps {
  currentView: ViewType;
  setCurrentView: (view: ViewType | string, options?: { replace?: boolean; subState?: Record<string, any> }) => void;
}

export default function BottomNav({ currentView, setCurrentView }: BottomNavProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, userProfile } = useAuth();
  const [avatarError, setAvatarError] = useState(false);

  const currentSection = getSectionForPath(location.pathname);
  const avatarUrl = userProfile?.photoURL || user?.photoURL;

  // STRICT REQUIREMENT:
  // EXACTLY 5 MAIN NAVIGATION ITEMS:
  // 1. 🏠 Home    — house icon + "Home"
  // 2. 📚 Learn   — open book icon + "Learn"
  // 3. 🎓 Study   — graduation cap/study icon + "Study"
  // 4. 📤 Upload  — upload arrow icon + "Upload"
  // 5. 👤 Profile — person icon (or profile picture) + "Profile"
  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      rootPath: '/home',
      isActive: currentSection === 'home',
      isUpload: false,
      isProfile: false,
    },
    {
      id: 'learn',
      label: 'Learn',
      icon: BookOpen,
      rootPath: '/learn',
      isActive: currentSection === 'learn',
      isUpload: false,
      isProfile: false,
    },
    {
      id: 'study',
      label: 'Study',
      icon: GraduationCap,
      rootPath: '/study',
      isActive: currentSection === 'study',
      isUpload: false,
      isProfile: false,
    },
    {
      id: 'upload',
      label: 'Upload',
      icon: Upload,
      rootPath: '/upload-notes',
      isActive: currentSection === 'upload',
      isUpload: true,
      isProfile: false,
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      rootPath: '/profile',
      isActive: currentSection === 'profile',
      isUpload: false,
      isProfile: true,
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
      <div className="grid grid-cols-5 w-full max-w-lg mx-auto px-1 sm:px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.isActive;

          return (
            <button
              key={item.id}
              id={`mobile-nav-${item.id}-btn`}
              onClick={() => handleNavClick(item)}
              className="flex flex-col items-center justify-center h-13 py-0.5 min-w-0 transition-colors group cursor-pointer relative"
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Active Pill Indicator & Icon */}
              <div
                className={`w-10 sm:w-11 h-7 rounded-full flex items-center justify-center transition-all duration-200 relative ${
                  isActive
                    ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 scale-100 font-bold'
                    : item.isUpload
                    ? 'text-blue-600 dark:text-blue-400 group-hover:text-blue-700 bg-blue-50/80 dark:bg-blue-950/40'
                    : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                }`}
              >
                {/* Profile Avatar when available */}
                {item.isProfile && avatarUrl && !avatarError ? (
                  <img
                    src={avatarUrl}
                    alt={item.label}
                    className={`w-5 h-5 rounded-full object-cover transition-all ${
                      isActive
                        ? 'ring-2 ring-blue-600 dark:ring-blue-400'
                        : 'ring-1 ring-slate-300 dark:ring-slate-600'
                    }`}
                    onError={() => setAvatarError(true)}
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <Icon size={19} strokeWidth={isActive ? 2.5 : item.isUpload ? 2.2 : 1.9} />
                )}

                {/* Subtle upload badge indicator */}
                {item.isUpload && !isActive && (
                  <span
                    className="absolute -top-0.5 -right-0.5 flex h-2 w-2"
                    title="Upload study notes"
                  >
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                  </span>
                )}
              </div>

              {/* Text Label - Always visible! */}
              <span
                className={`text-[10px] sm:text-[10.5px] tracking-tight leading-tight mt-0.5 truncate max-w-full px-0.5 text-center ${
                  isActive
                    ? 'font-black text-blue-700 dark:text-blue-300'
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
