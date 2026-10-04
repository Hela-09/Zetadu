import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import {
  Menu,
  X,
  Home,
  BookOpen,
  GraduationCap,
  Award,
  Sliders,
  Layers,
  Zap,
  FileUp,
  Library,
  BookMarked,
  WifiOff,
  TrendingUp,
  Target,
  Bookmark,
  User,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  Search,
  Shield,
  Sparkles,
} from 'lucide-react';
import { ViewType } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { navigateToRootSection } from '../utils/navigationHistory';
import Logo, { LearnDeanEmblem } from './Logo';
import UserAvatar from './UserAvatar';

interface HeaderMoreMenuProps {
  setCurrentView: (view: ViewType | string, options?: { replace?: boolean; subState?: Record<string, any> }) => void;
  onOpenHelp: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  subtitle: string;
  icon: any;
  iconBg: string;
  iconColor?: string;
  badge?: string;
  badgeColor?: string;
  keywords?: string[];
  isActive: boolean;
  action: () => void;
}

interface MenuSection {
  title: string;
  description?: string;
  items: MenuItem[];
}

export default function HeaderMoreMenu({ setCurrentView, onOpenHelp }: HeaderMoreMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, userProfile, isSuperAdmin, signOut } = useAuth();

  // Close drawer on Escape key or outside click
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        setShowLogoutConfirm(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent background scrolling while drawer is open
      document.body.style.overflow = 'hidden';
      // Auto-focus search input after drawer opens
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 150);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
        clearTimeout(timer);
      };
    }
  }, [isOpen]);

  const handleItemClick = (action: () => void) => {
    setIsOpen(false);
    setShowLogoutConfirm(false);
    setSearchQuery('');
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

  // COMPLETE MASTER LIST OF LEARNDEAN FEATURES & DESTINATIONS
  const sections: MenuSection[] = useMemo(() => {
    const path = location.pathname;

    return [
      {
        title: 'MAIN',
        description: 'Core learning spaces',
        items: [
          {
            id: 'home',
            label: 'Home',
            subtitle: 'Study dashboard, streaks & daily tasks',
            icon: Home,
            iconBg: 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300',
            keywords: ['dashboard', 'start', 'overview', 'main'],
            isActive: path === '/home' || path === '/',
            action: () => navigateToRootSection(navigate, '/home'),
          },
          {
            id: 'learn',
            label: 'Learn',
            subtitle: 'Curriculum syllabus, subject modules & lesson notes',
            icon: BookOpen,
            iconBg: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300',
            keywords: ['curriculum', 'subjects', 'notes', 'topics', 'lessons'],
            isActive: path === '/learn',
            action: () => navigateToRootSection(navigate, '/learn'),
          },
          {
            id: 'study',
            label: 'Study',
            subtitle: 'UTME exam prep, practice tests & novel studies',
            icon: GraduationCap,
            iconBg: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300',
            badge: 'PORTAL',
            badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300',
            keywords: ['jamb', 'utme', 'practice', 'cbt', 'study'],
            isActive: path.startsWith('/study') && !path.includes('study-journey'),
            action: () => navigateToRootSection(navigate, '/study'),
          },
        ],
      },
      {
        title: 'EXAM PREP',
        description: 'Targeted tests and drill engines',
        items: [
          {
            id: 'jamb',
            label: 'JAMB Prep',
            subtitle: 'UTME past questions, exam syllabus & literature guides',
            icon: Award,
            iconBg: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300',
            badge: 'UTME',
            badgeColor: 'bg-amber-400 text-slate-950',
            keywords: ['cbt', 'exam', 'questions', 'answers', 'jamb', 'test'],
            isActive: path.startsWith('/jamb'),
            action: () => navigateToRootSection(navigate, '/jamb'),
          },
          {
            id: 'practice',
            label: 'Practice',
            subtitle: 'Subject quizzes, timed tests & CBT drills',
            icon: Sliders,
            iconBg: 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300',
            keywords: ['quiz', 'timed', 'test', 'drills', 'questions'],
            isActive: path.startsWith('/practice'),
            action: () => navigateToRootSection(navigate, '/practice'),
          },
          {
            id: 'flashcards',
            label: 'Flashcards',
            subtitle: 'Spaced repetition decks for rapid memory recall',
            icon: Layers,
            iconBg: 'bg-teal-100 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300',
            keywords: ['revision', 'spaced repetition', 'cards', 'recall'],
            isActive: path.startsWith('/flashcards'),
            action: () => navigateToRootSection(navigate, '/flashcards'),
          },
          {
            id: 'daily-challenge',
            label: 'Daily Challenge',
            subtitle: 'Daily quick UTME question challenge to keep streaks',
            icon: Zap,
            iconBg: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300',
            badge: 'STREAK',
            badgeColor: 'bg-orange-500 text-white',
            keywords: ['challenge', 'streak', 'daily', 'drill'],
            isActive: path.startsWith('/daily-challenge'),
            action: () => navigateToRootSection(navigate, '/daily-challenge'),
          },
        ],
      },
      {
        title: 'AI & STUDY TOOLS',
        description: 'Smart assistant and digital resources',
        items: [
          {
            id: 'tutor',
            label: 'AI Tutor',
            subtitle: 'Interactive AI tutor, concept breakdown & instant answers',
            icon: () => <LearnDeanEmblem className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
            iconBg: 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/40',
            badge: 'AI',
            badgeColor: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white',
            keywords: ['tutor', 'ai', 'chat', 'assistant', 'smart', 'answers', 'explain'],
            isActive: path.startsWith('/ai-tutor') || path.startsWith('/tutor'),
            action: () => navigateToRootSection(navigate, '/ai-tutor'),
          },
          {
            id: 'upload-notes',
            label: 'Upload Notes',
            subtitle: 'Convert class notes, PDFs & docs into summaries & quizzes',
            icon: FileUp,
            iconBg: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300',
            keywords: ['upload', 'notes', 'pdf', 'document', 'summary', 'convert'],
            isActive: path.startsWith('/upload-notes') || path.startsWith('/upload'),
            action: () => navigateToRootSection(navigate, '/upload-notes'),
          },
          {
            id: 'library',
            label: 'Library',
            subtitle: 'Textbooks, curated subject guides & reference books',
            icon: Library,
            iconBg: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300',
            keywords: ['books', 'curriculum', 'read', 'literature', 'library'],
            isActive: path.startsWith('/library') || (path.startsWith('/subjects') && !path.includes('/novels')),
            action: () => navigateToRootSection(navigate, '/subjects'),
          },
          {
            id: 'novels',
            label: 'JAMB Novels & Literature',
            subtitle: 'Prescribed novels, chapter breakdowns & stored questions',
            icon: BookMarked,
            iconBg: 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300',
            keywords: ['novels', 'lekki headmaster', 'life changer', 'literature', 'reading'],
            isActive: path.startsWith('/novels'),
            action: () => navigateToRootSection(navigate, '/novels'),
          },
          {
            id: 'offline',
            label: 'Offline Mode',
            subtitle: 'Download packs, questions & novels to study without data',
            icon: WifiOff,
            iconBg: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300',
            badge: 'OFFLINE',
            badgeColor: 'bg-amber-500 text-white',
            keywords: ['offline', 'download', 'no internet', 'pack', 'cache'],
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
        title: 'PERSONAL & PROGRESS',
        description: 'Your growth, bookmarks and account',
        items: [
          {
            id: 'progress',
            label: 'Progress & Mastery',
            subtitle: 'Study journey, topic accuracy & syllabus completion',
            icon: TrendingUp,
            iconBg: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300',
            keywords: ['progress', 'journey', 'analytics', 'stats', 'streak', 'mastery'],
            isActive: path.startsWith('/study-journey') || path.startsWith('/journey'),
            action: () => navigateToRootSection(navigate, '/study-journey'),
          },
          {
            id: 'weak-topics',
            label: 'Weak Topics Diagnostic',
            subtitle: 'Pinpoint and resolve topics where you lose marks',
            icon: Target,
            iconBg: 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300',
            keywords: ['weak', 'mistakes', 'errors', 'improve', 'score'],
            isActive: path.startsWith('/weak-topics'),
            action: () => navigateToRootSection(navigate, '/weak-topics'),
          },
          {
            id: 'bookmarks',
            label: 'Bookmarks',
            subtitle: 'Saved challenging questions, notes & novel passages',
            icon: Bookmark,
            iconBg: 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300',
            keywords: ['saved', 'bookmarks', 'favorites', 'review'],
            isActive: path.includes('bookmarks'),
            action: () => {
              navigateToRootSection(navigate, '/study');
            },
          },
          {
            id: 'profile',
            label: 'Profile / Account',
            subtitle: 'Account details, target score & exam date',
            icon: User,
            iconBg: 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300',
            keywords: ['account', 'user', 'name', 'email', 'avatar', 'profile'],
            isActive: path === '/profile',
            action: () => {
              localStorage.removeItem('zetadu_profile_section');
              window.dispatchEvent(new CustomEvent('open-profile-section', { detail: { section: null } }));
              navigateToRootSection(navigate, '/profile');
            },
          },
          {
            id: 'settings',
            label: 'Settings',
            subtitle: 'Appearance, dark/light theme, font size & preferences',
            icon: Settings,
            iconBg: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
            keywords: ['settings', 'preferences', 'dark mode', 'theme', 'font'],
            isActive: path === '/settings',
            action: () => {
              try {
                localStorage.setItem('zetadu_profile_section', 'settings');
                window.dispatchEvent(new CustomEvent('open-profile-section', { detail: { section: 'settings' } }));
              } catch (_) {}
              navigateToRootSection(navigate, '/profile');
            },
          },
        ],
      },
      {
        title: 'SUPPORT & SYSTEM',
        description: 'Assistance and account control',
        items: [
          {
            id: 'help',
            label: 'Help & Support',
            subtitle: 'User guide, UTME FAQs & customer assistance',
            icon: HelpCircle,
            iconBg: 'bg-violet-100 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300',
            keywords: ['help', 'support', 'faq', 'contact', 'guide'],
            isActive: false,
            action: onOpenHelp,
          },
          ...(isSuperAdmin || userProfile?.role === 'super_admin' || userProfile?.isSuperAdmin
            ? [
                {
                  id: 'admin',
                  label: 'Admin Console',
                  subtitle: 'System management, user analytics & database controls',
                  icon: Shield,
                  iconBg: 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300',
                  badge: 'ADMIN',
                  badgeColor: 'bg-rose-600 text-white',
                  keywords: ['admin', 'console', 'database', 'users'],
                  isActive: path.startsWith('/admin'),
                  action: () => navigateToRootSection(navigate, '/admin'),
                },
              ]
            : []),
        ],
      },
    ];
  }, [location.pathname, navigate, onOpenHelp, isSuperAdmin, userProfile]);

  // Real-time Search Filter across all items & categories
  const filteredSections = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return sections;

    return sections
      .map((sec) => {
        const matchesCategory = sec.title.toLowerCase().includes(q);
        const matchingItems = sec.items.filter((item) => {
          if (matchesCategory) return true;
          if (item.label.toLowerCase().includes(q)) return true;
          if (item.subtitle.toLowerCase().includes(q)) return true;
          if (item.keywords?.some((k) => k.toLowerCase().includes(q))) return true;
          return false;
        });

        return {
          ...sec,
          items: matchingItems,
        };
      })
      .filter((sec) => sec.items.length > 0);
  }, [sections, searchQuery]);

  const totalItemCount = useMemo(() => {
    return sections.reduce((acc, s) => acc + s.items.length, 0);
  }, [sections]);

  const filteredCount = useMemo(() => {
    return filteredSections.reduce((acc, s) => acc + s.items.length, 0);
  }, [filteredSections]);

  return (
    <>
      {/* Three-Horizontal-Line Hamburger Icon (☰) Trigger Button */}
      <button
        id="header-hamburger-menu-btn"
        onClick={() => setIsOpen(true)}
        className="p-2 sm:p-2.5 rounded-xl border border-slate-200/90 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex items-center justify-center group"
        aria-label="Navigation Menu (☰)"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        title="Navigation Menu (☰)"
      >
        <Menu size={20} strokeWidth={2.2} className="transition-transform group-hover:scale-105" />
      </button>

      {/* Slide-in Navigation Drawer & Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
            {/* Backdrop overlay (tap outside to close) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => {
                setIsOpen(false);
                setShowLogoutConfirm(false);
              }}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs cursor-pointer"
              aria-hidden="true"
            />

            {/* Slide-in Drawer Container */}
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="fixed inset-y-0 right-0 w-full max-w-[340px] sm:max-w-[400px] bg-white dark:bg-slate-900 shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 z-50 select-none overflow-hidden"
              role="region"
              aria-label="LearnDean complete navigation menu"
            >
              {/* Drawer Header */}
              <div className="p-4 sm:p-5 pb-3 border-b border-slate-200/90 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/80 dark:bg-slate-900/90 backdrop-blur-md">
                <div className="flex items-center space-x-3 min-w-0">
                  <Logo variant="icon" className="w-8 h-8 shrink-0" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h2 className="text-base font-extrabold text-slate-900 dark:text-white leading-tight truncate">
                        LearnDean
                      </h2>
                      <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-blue-600 text-white uppercase tracking-wider leading-none">
                        MENU
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">
                      Complete app features & sections
                    </p>
                  </div>
                </div>

                {/* Close (✕) Button */}
                <button
                  type="button"
                  id="close-hamburger-drawer-btn"
                  onClick={() => {
                    setIsOpen(false);
                    setShowLogoutConfirm(false);
                  }}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/70 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  aria-label="Close navigation menu"
                  title="Close (Esc)"
                >
                  <X size={20} strokeWidth={2.2} />
                </button>
              </div>

              {/* Fast Real-Time Search Bar */}
              <div className="p-3 sm:px-4 border-b border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900 shrink-0">
                <div className="relative flex items-center">
                  <Search
                    size={16}
                    className="absolute left-3.5 text-slate-400 dark:text-slate-500 pointer-events-none"
                  />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search features, tools, exam prep..."
                    className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                    aria-label="Search navigation menu"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                      title="Clear search"
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>

                {searchQuery && (
                  <div className="flex items-center justify-between mt-2 px-1 text-[10px] text-slate-400 dark:text-slate-500">
                    <span>
                      Found {filteredCount} of {totalItemCount} features
                    </span>
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer"
                    >
                      Reset filter
                    </button>
                  </div>
                )}
              </div>

              {/* Scrollable Categories List */}
              <div className="flex-1 overflow-y-auto overscroll-contain p-3 sm:p-4 space-y-4 [scrollbar-gutter:stable]">
                {filteredSections.length > 0 ? (
                  filteredSections.map((section, sIdx) => (
                    <div key={section.title} className="space-y-1.5">
                      {/* Section Category Header */}
                      <div className="px-2 pt-1 flex items-baseline justify-between">
                        <p className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                          {section.title}
                        </p>
                        {section.description && !searchQuery && (
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                            {section.description}
                          </span>
                        )}
                      </div>

                      {/* Items in Section */}
                      <div className="space-y-1">
                        {section.items.map((item) => {
                          const Icon = item.icon;
                          const isActive = item.isActive;

                          return (
                            <button
                              key={item.id}
                              id={`menu-drawer-item-${item.id}`}
                              onClick={() => handleItemClick(item.action)}
                              className={`w-full flex items-center justify-between p-2.5 rounded-2xl text-left transition-all cursor-pointer group relative ${
                                isActive
                                  ? 'bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 font-bold'
                                  : 'hover:bg-slate-100/90 dark:hover:bg-slate-800/90 text-slate-800 dark:text-slate-200 border border-transparent'
                              }`}
                              aria-current={isActive ? 'page' : undefined}
                            >
                              <div className="flex items-center space-x-3 min-w-0 flex-1">
                                {/* Themed Icon Container */}
                                <div
                                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${item.iconBg}`}
                                >
                                  {typeof Icon === 'function' ? (
                                    <Icon size={18} />
                                  ) : (
                                    Icon && <Icon size={18} />
                                  )}
                                </div>

                                {/* Label & Subtitle */}
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-1.5">
                                    <p
                                      className={`text-xs truncate ${
                                        isActive
                                          ? 'font-extrabold text-blue-700 dark:text-blue-300'
                                          : 'font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                                      }`}
                                    >
                                      {item.label}
                                    </p>
                                    {item.badge && (
                                      <span
                                        className={`text-[9px] font-black px-1.5 py-0.2 rounded-md uppercase tracking-wider shrink-0 ${
                                          item.badgeColor || 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300'
                                        }`}
                                      >
                                        {item.badge}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate leading-tight mt-0.5">
                                    {item.subtitle}
                                  </p>
                                </div>
                              </div>

                              {/* Trailing Chevron / Active Dot */}
                              <div className="ml-2 shrink-0 flex items-center">
                                {isActive ? (
                                  <div className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 mr-1" />
                                ) : (
                                  <ChevronRight
                                    size={14}
                                    className="text-slate-300 dark:text-slate-600 group-hover:text-slate-500 dark:group-hover:text-slate-400 group-hover:translate-x-0.5 transition-all"
                                  />
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {sIdx < filteredSections.length - 1 && (
                        <div className="border-b border-slate-100 dark:border-slate-800/80 pt-2 my-1" />
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center flex flex-col items-center justify-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                      <Search size={22} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                        No features found
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                        No tools match "{searchQuery}".
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="px-3.5 py-1.5 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 transition-colors cursor-pointer"
                    >
                      Show all features
                    </button>
                  </div>
                )}
              </div>

              {/* Drawer Footer with User Account and Sign Out */}
              <div className="p-3 sm:p-4 border-t border-slate-200/90 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90 shrink-0 space-y-2">
                {user ? (
                  <>
                    {/* User Profile Bar */}
                    <div
                      onClick={() =>
                        handleItemClick(() => {
                          localStorage.removeItem('zetadu_profile_section');
                          window.dispatchEvent(
                            new CustomEvent('open-profile-section', { detail: { section: null } })
                          );
                          navigateToRootSection(navigate, '/profile');
                        })
                      }
                      className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 hover:border-blue-400 dark:hover:border-blue-500 transition-all cursor-pointer group"
                      title="View Student Profile"
                    >
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <UserAvatar
                          photoURL={userProfile?.photoURL || user?.photoURL}
                          displayName={userProfile?.name || user?.displayName}
                          email={user?.email}
                          size="sm"
                          className="w-8 h-8 text-xs shrink-0 ring-1.5 ring-blue-500/20"
                        />
                        <div className="min-w-0 text-left">
                          <p className="text-xs font-bold text-slate-900 dark:text-white truncate leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {userProfile?.name || user?.displayName || 'Student Profile'}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate leading-tight">
                            {user?.email || 'Tap to manage account'}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 shrink-0 mr-1">
                        View
                      </span>
                    </div>

                    {/* Sign Out Action with Confirmation */}
                    {showLogoutConfirm ? (
                      <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 space-y-2">
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
                        className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold transition-colors cursor-pointer"
                      >
                        <LogOut size={14} />
                        <span>Sign Out</span>
                      </button>
                    )}
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleItemClick(() => navigateToRootSection(navigate, '/home'))}
                    className="w-full py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
