import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  MoreVertical,
  BrainCircuit,
  GraduationCap,
  Sliders,
  Layers,
  BookOpen,
  WifiOff,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { ViewType } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { navigateToRootSection } from '../utils/navigationHistory';

interface HeaderMoreMenuProps {
  setCurrentView: (view: ViewType | string, options?: { replace?: boolean; subState?: Record<string, any> }) => void;
  onOpenHelp: () => void;
}

export default function HeaderMoreMenu({ setCurrentView, onOpenHelp }: HeaderMoreMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();

  // Close on outside click or Escape key
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setShowLogoutConfirm(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        setShowLogoutConfirm(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Section item click handlers
  const handleItemClick = (action: () => void) => {
    setIsOpen(false);
    action();
  };

  const handleLogout = async () => {
    setIsOpen(false);
    setShowLogoutConfirm(false);
    try {
      await signOut();
    } catch (err) {
      console.error('Failed to log out', err);
    }
  };

  // Structured secondary features grouped into clear sections
  const sections = [
    {
      title: 'Study & Practice',
      items: [
        {
          id: 'tutor',
          label: 'AI Tutor',
          subtitle: 'Interactive study assistant & tutor',
          icon: BrainCircuit,
          iconBg: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300',
          badge: 'AI',
          isActive: location.pathname.startsWith('/ai-tutor') || location.pathname.startsWith('/tutor'),
          action: () => navigateToRootSection(navigate, '/ai-tutor'),
        },
        {
          id: 'jamb',
          label: 'JAMB Prep',
          subtitle: 'UTME CBT questions, syllabus & novels',
          icon: GraduationCap,
          iconBg: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300',
          badge: 'UTME',
          isActive: location.pathname.startsWith('/jamb'),
          action: () => navigateToRootSection(navigate, '/jamb'),
        },
        {
          id: 'practice',
          label: 'Practice',
          subtitle: 'Subject quizzes & CBT drills',
          icon: Sliders,
          iconBg: 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300',
          isActive: location.pathname.startsWith('/practice'),
          action: () => navigateToRootSection(navigate, '/practice'),
        },
        {
          id: 'flashcards',
          label: 'Flashcards',
          subtitle: 'Spaced repetition revision decks',
          icon: Layers,
          iconBg: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300',
          isActive: location.pathname.startsWith('/flashcards'),
          action: () => navigateToRootSection(navigate, '/flashcards'),
        },
      ],
    },
    {
      title: 'Library & Resources',
      items: [
        {
          id: 'library',
          label: 'Library',
          subtitle: 'Curriculum textbooks & literature',
          icon: BookOpen,
          iconBg: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300',
          isActive: location.pathname.startsWith('/library') || location.pathname.startsWith('/subjects'),
          action: () => navigateToRootSection(navigate, '/subjects'),
        },
        {
          id: 'offline',
          label: 'Offline Mode',
          subtitle: 'Downloaded packs & offline study',
          icon: WifiOff,
          iconBg: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300',
          isActive: false,
          action: () => {
            try {
              sessionStorage.setItem('open_offline_hub', 'true');
              window.dispatchEvent(new CustomEvent('open-offline-hub'));
            } catch (e) {
              console.warn('Offline hub trigger:', e);
            }
            navigateToRootSection(navigate, '/home');
          },
        },
      ],
    },
    {
      title: 'Preferences & Support',
      items: [
        {
          id: 'settings',
          label: 'Settings',
          subtitle: 'Preferences, appearance & security',
          icon: Settings,
          iconBg: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
          isActive: location.pathname === '/settings',
          action: () => {
            try {
              localStorage.setItem('zetadu_profile_section', 'settings');
              window.dispatchEvent(new CustomEvent('open-profile-section', { detail: { section: 'settings' } }));
            } catch (_) {}
            navigateToRootSection(navigate, '/profile');
          },
        },
        {
          id: 'help',
          label: 'Help & Support',
          subtitle: 'User guides, FAQs & assistance',
          icon: HelpCircle,
          iconBg: 'bg-violet-100 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300',
          isActive: false,
          action: onOpenHelp,
        },
      ],
    },
  ];

  return (
    <div className="relative" ref={menuRef}>
      {/* Three-Dot (⋮) Trigger Button */}
      <button
        id="header-more-menu-btn"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
          isOpen
            ? 'bg-blue-50 dark:bg-blue-900/40 border-blue-400 text-blue-600 dark:text-blue-300 shadow-xs'
            : 'bg-white dark:bg-slate-800 border-slate-200/90 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700/80 shadow-2xs'
        }`}
        aria-label="More features (⋮)"
        aria-haspopup="true"
        aria-expanded={isOpen}
        title="More Features (⋮)"
      >
        <MoreVertical size={18} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          id="header-more-menu-dropdown"
          className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 py-3 z-50 animate-scale-up select-none max-h-[85vh] overflow-y-auto overscroll-contain"
        >
          {/* Header Title */}
          <div className="px-4 pb-2.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Sparkles size={14} className="text-amber-500" />
              <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white">
                LearnDean Menu
              </span>
            </div>
            <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
              Secondary Tools
            </span>
          </div>

          {/* Grouped Sections */}
          <div className="p-2 space-y-3">
            {sections.map((section, sIdx) => (
              <div key={section.title} className="space-y-1">
                {/* Section Header */}
                <div className="px-2 pt-1 pb-0.5">
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    {section.title}
                  </p>
                </div>

                {/* Section Items */}
                <div className="space-y-0.5">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        id={`header-more-${item.id}-btn`}
                        onClick={() => handleItemClick(item.action)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-2xl text-left transition-colors cursor-pointer group ${
                          item.isActive
                            ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300'
                            : 'hover:bg-slate-100/80 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className={`p-2 rounded-xl shrink-0 transition-colors ${item.iconBg}`}>
                            <Icon size={16} />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <p className="text-xs font-bold truncate">
                                {item.label}
                              </p>
                              {item.badge && (
                                <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-amber-400 text-slate-950">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                              {item.subtitle}
                            </p>
                          </div>
                        </div>

                        <ChevronRight
                          size={14}
                          className="text-slate-300 dark:text-slate-600 group-hover:text-slate-500 dark:group-hover:text-slate-400 shrink-0 transition-colors ml-1"
                        />
                      </button>
                    );
                  })}
                </div>

                {sIdx < sections.length - 1 && (
                  <div className="border-b border-slate-100 dark:border-slate-800/80 my-1 mx-2" />
                )}
              </div>
            ))}
          </div>

          {/* Footer with Sign Out */}
          {user && (
            <div className="px-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              {showLogoutConfirm ? (
                <div className="p-2.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 space-y-2">
                  <p className="text-xs font-bold text-rose-800 dark:text-rose-200 text-center">
                    Sign out of LearnDean?
                  </p>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setShowLogoutConfirm(false)}
                      className="flex-1 py-1.5 text-[11px] font-bold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex-1 py-1.5 text-[11px] font-bold rounded-xl bg-rose-600 text-white hover:bg-rose-700 cursor-pointer"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowLogoutConfirm(true)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <LogOut size={14} />
                    <span>Sign Out</span>
                  </div>
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
