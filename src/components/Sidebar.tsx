import React from 'react';
import { ViewType } from '../types';
import { usePWAInstall } from '../hooks/usePWAInstall';
import Logo from './Logo';
import {
  Home,
  Sparkles,
  FileUp,
  MessageSquare,
  BrainCircuit,
  GraduationCap,
  Compass,
  BookOpen,
  Layers,
  Clock,
  WifiOff,
  Search,
  Download,
} from 'lucide-react';

interface SidebarProps {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
}

export default function Sidebar({ currentView, setCurrentView }: SidebarProps) {
  const { isInstallable, triggerInstall } = usePWAInstall();

  // Desktop sidebar navigation items:
  // - Home
  // - Learn
  // - Upload Notes
  // - AI Tutor
  // - Practice
  // - JAMB
  // - Study Journey
  // - Library
  // - Flashcards
  // - History
  // - Offline Learning
  const navItems = [
    { id: 'home', label: 'Home', icon: Home, isUpload: false },
    { id: 'learn', label: 'Learn', icon: Sparkles, isUpload: false },
    { id: 'upload_notes', label: 'Upload Notes', icon: FileUp, isUpload: true },
    { id: 'tutor', label: 'AI Tutor', icon: MessageSquare, isUpload: false },
    { id: 'practice', label: 'Practice', icon: BrainCircuit, isUpload: false },
    { id: 'jamb', label: 'JAMB', icon: GraduationCap, isUpload: false },
    { id: 'journey', label: 'Study Journey', icon: Compass, isUpload: false },
    { id: 'subjects', label: 'Library', icon: BookOpen, isUpload: false },
    { id: 'flashcards', label: 'Flashcards', icon: Layers, isUpload: false },
    { id: 'history', label: 'History', icon: Clock, isUpload: false },
    { id: 'offline_learning', label: 'Offline Learning', icon: WifiOff, isUpload: false },
  ];

  const handleNavClick = (id: string) => {
    if (id === 'history') {
      try {
        localStorage.setItem('zetadu_profile_section', 'practice_history');
        window.dispatchEvent(new CustomEvent('open-profile-section', { detail: { section: 'practice_history' } }));
      } catch (e) {
        console.warn('History navigation trigger:', e);
      }
      setCurrentView('profile');
      return;
    }

    if (id === 'offline_learning') {
      try {
        sessionStorage.setItem('open_offline_hub', 'true');
        window.dispatchEvent(new CustomEvent('open-offline-hub'));
      } catch (e) {
        console.warn('Offline hub trigger:', e);
      }
      setCurrentView('home');
      return;
    }

    setCurrentView(id as ViewType);
  };

  return (
    <aside className="w-64 h-full bg-slate-900 text-white flex flex-col shrink-0 border-r border-slate-800 select-none">
      {/* Brand Header */}
      <div 
        onClick={() => setCurrentView('home')}
        className="p-5 pb-4 flex items-center space-x-3 shrink-0 cursor-pointer group"
      >
        <Logo variant="icon" className="w-9 h-9 shrink-0 group-hover:scale-105 transition-transform" />
        <div>
          <div className="flex items-center gap-1.5">
            <h2 className="text-lg font-bold text-white leading-tight">LearnDean</h2>
            <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-blue-600 text-white leading-tight">
              PRO
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-tight">Smart Prep System</p>
        </div>
      </div>

      {/* Global Search Bar Trigger */}
      <div className="px-4 pb-2 shrink-0">
        <button
          id="sidebar-search-btn"
          onClick={() => {
            const event = new CustomEvent('open-zetadu-search');
            window.dispatchEvent(event);
          }}
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

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-1 space-y-1 overflow-y-auto overscroll-contain">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            currentView === item.id ||
            (item.id === 'subjects' && (currentView === 'subjects' || currentView === 'novels'));

          return (
            <button
              key={item.id}
              id={`sidebar-nav-${item.id}-btn`}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all duration-150 text-left relative group cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white font-semibold shadow-sm shadow-blue-900/50'
                  : item.isUpload
                  ? 'text-blue-400 hover:bg-slate-800/90 font-medium'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white font-medium'
              }`}
            >
              <div className="flex items-center space-x-3 truncate">
                <Icon
                  size={19}
                  className={`shrink-0 transition-transform ${
                    isActive
                      ? 'text-white'
                      : item.isUpload
                      ? 'text-blue-400 group-hover:scale-110'
                      : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                <span className="text-sm truncate">{item.label}</span>
              </div>

              {/* Upload Notes prominent badge */}
              {item.isUpload && !isActive && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30 shrink-0">
                  Upload
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer & Study Goal */}
      <div className="p-3 shrink-0 border-t border-slate-800/80">
        {isInstallable && (
          <button
            onClick={triggerInstall}
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-semibold py-2 px-3 rounded-xl transition-all shadow-md mb-3 text-xs cursor-pointer"
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
          <p className="text-[11px] text-slate-400 mb-2.5 leading-snug">
            Upload study notes or drill 5 CBT questions to keep your streak.
          </p>
          <div className="h-1.5 w-full bg-slate-950 rounded-full mb-2.5 overflow-hidden">
            <div className="h-full w-2/3 bg-blue-500 rounded-full"></div>
          </div>
          <button
            onClick={() => setCurrentView('practice')}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-1.5 px-3 rounded-lg transition-colors cursor-pointer text-center"
          >
            Continue Practice
          </button>
        </div>
      </div>
    </aside>
  );
}
