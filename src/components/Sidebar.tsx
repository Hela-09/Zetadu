import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ViewType } from '../types';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { navigateToRootSection, getSectionForPath } from '../utils/navigationHistory';
import Logo from './Logo';
import {
  Home,
  BookOpen,
  FileUp,
  User,
  GraduationCap,
  Sliders,
  BrainCircuit,
  Layers,
  WifiOff,
  Search,
  Download,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';

interface SidebarProps {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
}

const COLLAPSED_STORAGE_KEY = 'learndean_sidebar_collapsed';

export default function Sidebar({ currentView, setCurrentView }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isInstallable, triggerInstall } = usePWAInstall();

  // Collapsed state: user preference stored in localStorage, defaulting to compact on tablet
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const saved = localStorage.getItem(COLLAPSED_STORAGE_KEY);
    if (saved !== null) {
      return saved === 'true';
    }
    // Auto-compact on tablet screens (768px - 1024px) to preserve workspace
    return window.innerWidth >= 768 && window.innerWidth < 1024;
  });

  const toggleCollapse = () => {
    setIsCollapsed(prev => {
      const next = !prev;
      try {
        localStorage.setItem(COLLAPSED_STORAGE_KEY, String(next));
      } catch (_) {}
      return next;
    });
  };

  const currentSection = getSectionForPath(location.pathname);

  // 1. Primary Navigation Destinations (Home, Learn, Upload, Profile)
  const primaryNavItems = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      rootPath: '/home',
      isActive: currentSection === 'home',
      isUpload: false,
    },
    {
      id: 'learn',
      label: 'Learn',
      icon: BookOpen,
      rootPath: '/learn',
      isActive: currentSection === 'learn' && (location.pathname === '/learn' || location.pathname.startsWith('/study-journey')),
      isUpload: false,
    },
    {
      id: 'upload',
      label: 'Upload Notes',
      icon: FileUp,
      rootPath: '/upload-notes',
      isActive: currentSection === 'upload',
      isUpload: true,
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      rootPath: '/profile',
      isActive: currentSection === 'profile',
      isUpload: false,
    },
  ];

  // 2. Secondary / Quick Study Destinations
  const secondaryNavItems = [
    {
      id: 'jamb',
      label: 'JAMB Prep',
      icon: GraduationCap,
      rootPath: '/jamb',
      badge: 'UTME',
      isActive: location.pathname.startsWith('/jamb'),
    },
    {
      id: 'practice',
      label: 'Practice',
      icon: Sliders,
      rootPath: '/practice',
      isActive: location.pathname.startsWith('/practice'),
    },
    {
      id: 'tutor',
      label: 'AI Tutor',
      icon: BrainCircuit,
      rootPath: '/ai-tutor',
      badge: 'AI',
      isActive: location.pathname.startsWith('/ai-tutor') || location.pathname.startsWith('/tutor'),
    },
    {
      id: 'library',
      label: 'Library',
      icon: BookOpen,
      rootPath: '/subjects',
      isActive: location.pathname.startsWith('/subjects') || location.pathname.startsWith('/library'),
    },
    {
      id: 'flashcards',
      label: 'Flashcards',
      icon: Layers,
      rootPath: '/flashcards',
      isActive: location.pathname.startsWith('/flashcards'),
    },
    {
      id: 'offline',
      label: 'Offline Mode',
      icon: WifiOff,
      rootPath: null,
      isActive: false,
    },
  ];

  const handleNavClick = (rootPath: string | null) => {
    if (!rootPath) {
      // Offline mode trigger
      try {
        sessionStorage.setItem('open_offline_hub', 'true');
        window.dispatchEvent(new CustomEvent('open-offline-hub'));
      } catch (e) {
        console.warn('Offline hub trigger:', e);
      }
      navigateToRootSection(navigate, '/home');
      return;
    }

    navigateToRootSection(navigate, rootPath);
  };

  return (
    <aside
      className={`h-full bg-slate-900 text-white flex flex-col shrink-0 border-r border-slate-800 select-none transition-all duration-200 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
      role="navigation"
      aria-label="Desktop and tablet navigation"
    >
      {/* Brand Header & Collapse Toggle */}
      <div className="p-3.5 pb-2.5 flex items-center justify-between shrink-0 border-b border-slate-800/80">
        <div
          onClick={() => handleNavClick('/home')}
          className={`flex items-center space-x-2.5 cursor-pointer group min-w-0 ${
            isCollapsed ? 'justify-center w-full' : ''
          }`}
          title="LearnDean Home"
        >
          <Logo variant="icon" className="w-9 h-9 shrink-0 group-hover:scale-105 transition-transform" />
          {!isCollapsed && (
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h2 className="text-base font-bold text-white leading-tight truncate">LearnDean</h2>
                <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-blue-600 text-white leading-tight">
                  PRO
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-tight truncate">Smart Prep System</p>
            </div>
          )}
        </div>

        {/* Collapse / Expand Toggle Button */}
        {!isCollapsed && (
          <button
            type="button"
            onClick={toggleCollapse}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Collapse sidebar"
            title="Collapse sidebar to maximize workspace"
          >
            <PanelLeftClose size={17} />
          </button>
        )}
      </div>

      {/* Global Search Bar (Expanded Only) or Search Icon Button (Collapsed) */}
      <div className="px-3 py-2 shrink-0">
        {isCollapsed ? (
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent('open-zetadu-search'))}
            className="w-full h-10 flex items-center justify-center rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-slate-400 hover:text-white transition cursor-pointer"
            aria-label="Search LearnDean"
            title="Search LearnDean (⌘K)"
          >
            <Search size={17} />
          </button>
        ) : (
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
        )}
      </div>

      {/* Navigation Links Scroll Container */}
      <nav className="flex-1 px-2.5 py-1 space-y-4 overflow-y-auto overscroll-contain">
        {/* 1. Main Navigation Group */}
        <div className="space-y-1">
          {!isCollapsed && (
            <p className="px-2 text-[10px] font-black uppercase tracking-wider text-slate-500">
              Main
            </p>
          )}
          {primaryNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.isActive;

            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}-btn`}
                onClick={() => handleNavClick(item.rootPath)}
                className={`w-full flex items-center rounded-xl transition-all duration-150 relative group cursor-pointer ${
                  isCollapsed
                    ? 'justify-center h-11 px-0'
                    : 'justify-between px-3 py-2.5'
                } ${
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
                <div className={`flex items-center space-x-3 truncate ${isCollapsed ? 'justify-center' : ''}`}>
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
                  {!isCollapsed && <span className="text-sm truncate">{item.label}</span>}
                </div>

                {!isCollapsed && item.isUpload && !isActive && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30 shrink-0">
                    Upload
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* 2. Quick Study Tools Group */}
        <div className="space-y-1 pt-2 border-t border-slate-800/70">
          {!isCollapsed && (
            <p className="px-2 text-[10px] font-black uppercase tracking-wider text-slate-500">
              Study Tools
            </p>
          )}
          {secondaryNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.isActive;

            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}-btn`}
                onClick={() => handleNavClick(item.rootPath)}
                className={`w-full flex items-center rounded-xl transition-all duration-150 relative group cursor-pointer ${
                  isCollapsed
                    ? 'justify-center h-10 px-0'
                    : 'justify-between px-3 py-2'
                } ${
                  isActive
                    ? 'bg-blue-600/90 text-white font-bold'
                    : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200 font-medium'
                }`}
                title={item.label}
                aria-label={item.label}
              >
                <div className={`flex items-center space-x-3 truncate ${isCollapsed ? 'justify-center' : ''}`}>
                  <Icon
                    size={17}
                    className={`shrink-0 ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  {!isCollapsed && <span className="text-xs truncate">{item.label}</span>}
                </div>

                {!isCollapsed && item.badge && !isActive && (
                  <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 shrink-0">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer & Expand Toggle for Collapsed View */}
      <div className="p-2.5 shrink-0 border-t border-slate-800/80 space-y-2">
        {isInstallable && (
          <button
            type="button"
            onClick={triggerInstall}
            className={`w-full flex items-center justify-center bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-semibold rounded-xl transition-all shadow-md text-xs cursor-pointer ${
              isCollapsed ? 'p-2.5' : 'py-2 px-3 space-x-2'
            }`}
            title="Install LearnDean App"
            aria-label="Install App"
          >
            <Download size={16} />
            {!isCollapsed && <span>Install App</span>}
          </button>
        )}

        {/* Collapsed Mode Expand Button */}
        {isCollapsed && (
          <button
            type="button"
            onClick={toggleCollapse}
            className="w-full h-10 flex items-center justify-center rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
            aria-label="Expand sidebar"
            title="Expand sidebar"
          >
            <PanelLeftOpen size={18} />
          </button>
        )}
      </div>
    </aside>
  );
}
