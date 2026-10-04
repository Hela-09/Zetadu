import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ViewType } from '../types';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { navigateToRootSection, getSectionForPath } from '../utils/navigationHistory';
import { useAuth } from '../contexts/AuthContext';
import Logo from './Logo';
import {
  Home,
  BookOpen,
  GraduationCap,
  Upload,
  User,
  Search,
  Download,
} from 'lucide-react';

interface SidebarProps {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
}

export default function Sidebar({ currentView, setCurrentView }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, userProfile } = useAuth();
  const { isInstallable, triggerInstall } = usePWAInstall();
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
  // TEXT LABELS MUST ALWAYS BE VISIBLE.
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

  const handleNavClick = (rootPath: string) => {
    navigateToRootSection(navigate, rootPath);
  };

  return (
    <aside
      className="w-64 h-full bg-slate-900 text-white flex flex-col shrink-0 border-r border-slate-800 select-none"
      role="navigation"
      aria-label="Desktop main navigation"
    >
      {/* Brand Header */}
      <div className="p-4 pb-3 flex items-center justify-between shrink-0 border-b border-slate-800/80">
        <div
          onClick={() => handleNavClick('/home')}
          className="flex items-center space-x-3 cursor-pointer group min-w-0"
          title="LearnDean Home"
        >
          <Logo variant="icon" className="w-9 h-9 shrink-0 group-hover:scale-105 transition-transform" />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h2 className="text-base font-bold text-white leading-tight truncate">LearnDean</h2>
              <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-blue-600 text-white leading-tight">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-tight truncate">Smart Prep System</p>
          </div>
        </div>
      </div>

      {/* Global Search Bar */}
      <div className="px-3.5 py-2.5 shrink-0">
        <button
          type="button"
          id="sidebar-search-btn"
          onClick={() => window.dispatchEvent(new CustomEvent('open-zetadu-search'))}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-slate-400 hover:text-slate-200 text-xs transition-all cursor-pointer group"
          title="Search LearnDean (⌘K)"
        >
          <div className="flex items-center gap-2">
            <Search size={15} className="group-hover:text-blue-400 transition-colors" />
            <span className="font-medium">Search...</span>
          </div>
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-900 text-slate-400 rounded border border-slate-700">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Main Navigation Items (Icon + Clear Text Label Always Visible) */}
      <nav className="flex-1 px-3 py-1 space-y-1.5 overflow-y-auto overscroll-contain">
        <p className="px-2 pt-1 pb-1 text-[10px] font-black uppercase tracking-wider text-slate-500">
          Navigation
        </p>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.isActive;

          return (
            <button
              key={item.id}
              id={`sidebar-nav-${item.id}-btn`}
              onClick={() => handleNavClick(item.rootPath)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-150 relative group cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white font-bold shadow-sm shadow-blue-900/50'
                  : item.isUpload
                  ? 'text-blue-400 hover:bg-slate-800/90 font-medium'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white font-medium'
              }`}
              title={item.label}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="flex items-center space-x-3 truncate">
                {/* Profile Picture when available or Icon */}
                {item.isProfile && avatarUrl && !avatarError ? (
                  <img
                    src={avatarUrl}
                    alt={item.label}
                    className={`w-5 h-5 rounded-full object-cover shrink-0 transition-transform ${
                      isActive
                        ? 'ring-2 ring-white scale-105'
                        : 'ring-1 ring-slate-400 group-hover:scale-105'
                    }`}
                    onError={() => setAvatarError(true)}
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <Icon
                    size={20}
                    className={`shrink-0 transition-transform ${
                      isActive
                        ? 'text-white'
                        : item.isUpload
                        ? 'text-blue-400 group-hover:scale-110'
                        : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                )}

                {/* Text Label is ALWAYS visible! */}
                <span className="text-sm font-semibold truncate">{item.label}</span>
              </div>

              {/* Upload Badge */}
              {item.isUpload && !isActive && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30 shrink-0">
                  Upload
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer: PWA Install & Target */}
      <div className="p-3 shrink-0 border-t border-slate-800/80 space-y-2.5">
        {isInstallable && (
          <button
            type="button"
            onClick={triggerInstall}
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-semibold py-2 px-3 rounded-xl transition-all shadow-md text-xs cursor-pointer"
            title="Install LearnDean App"
            aria-label="Install App"
          >
            <Download size={16} />
            <span>Install App</span>
          </button>
        )}

        <div className="bg-slate-800/90 p-3 rounded-xl border border-slate-700/50">
          <div className="flex items-center justify-between mb-1.5">
            <h3 className="text-xs font-semibold text-white">Daily Target</h3>
            <span className="text-[10px] text-blue-400 font-bold">2/3 Done</span>
          </div>
          <p className="text-[11px] text-slate-400 mb-2 leading-snug">
            Upload study notes or drill questions to keep your streak.
          </p>
          <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
            <div className="h-full w-2/3 bg-blue-500 rounded-full"></div>
          </div>
        </div>
      </div>
    </aside>
  );
}
