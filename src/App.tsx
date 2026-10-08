import React, { useState, Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import Logo from './components/Logo';
import UserAvatar from './components/UserAvatar';
import HeaderMoreMenu from './components/HeaderMoreMenu';
import HelpModal from './components/HelpModal';
import GoogleBackupPromptModal from './components/GoogleBackupPromptModal';
import { ViewType } from './types';
import { Search } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useAuth } from './contexts/AuthContext';
import { ThemeToggle } from './components/ThemeToggle';
import { VIEW_TO_PATH } from './utils/navigation';
import { recordRoute } from './utils/navigationHistory';

const Login = lazy(() => import('./components/Login'));
const PaymentGate = lazy(() => import('./components/PaymentGate'));
const SearchModal = lazy(() => import('./components/SearchModal'));

const Home = React.lazy(() => import('./components/Home'));
const Subjects = React.lazy(() => import('./components/Subjects'));
const Practice = React.lazy(() => import('./components/Practice'));
const Tutor = React.lazy(() => import('./components/Tutor'));
const Profile = React.lazy(() => import('./components/Profile'));
const Admin = React.lazy(() => import('./components/Admin'));
const DailyChallenge = React.lazy(() => import('./components/DailyChallenge'));
const Flashcards = React.lazy(() => import('./components/Flashcards'));
const StudyJourney = React.lazy(() => import('./components/StudyJourney'));
const WeakTopics = React.lazy(() => import('./components/WeakTopics'));
const UploadNotes = React.lazy(() => import('./components/UploadNotes'));
const JambPrep = React.lazy(() => import('./components/jamb/JambPrep'));
const StudyHub = React.lazy(() => import('./components/study/StudyHub'));
const NovelsLibrary = React.lazy(() => import('./components/novels/NovelsLibrary'));
const LearnHub = React.lazy(() => import('./components/LearnHub'));

function getEffectiveView(pathname: string): ViewType {
  if (pathname === '/ai-tutor' || pathname === '/tutor') return 'tutor';
  if (pathname === '/learn') return 'learn';
  if (pathname === '/library' || pathname === '/subjects' || pathname.startsWith('/subjects/') || pathname.startsWith('/library/')) return 'subjects';
  if (pathname.startsWith('/novels') || pathname === '/learn/novels') return 'novels';
  if (pathname.startsWith('/study')) return 'jamb';
  if (pathname.startsWith('/jamb')) return 'jamb';
  if (pathname.startsWith('/practice')) return 'practice';
  if (pathname.startsWith('/flashcards')) return 'flashcards';
  if (pathname.startsWith('/profile') || pathname.startsWith('/settings')) return 'profile';
  if (pathname.startsWith('/daily-challenge')) return 'daily_challenge';
  if (pathname.startsWith('/study-journey') || pathname.startsWith('/journey')) return 'journey';
  if (pathname.startsWith('/weak-topics')) return 'weak_topics';
  if (pathname.startsWith('/upload-notes') || pathname.startsWith('/upload')) return 'upload_notes';
  if (pathname.startsWith('/admin')) return 'admin';
  return 'home';
}

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const currentView = getEffectiveView(location.pathname);

  // Synchronize route changes with LearnDean navigation stack
  React.useEffect(() => {
    recordRoute(location.pathname + location.search);
  }, [location.pathname, location.search]);

  const {
    user,
    userProfile,
    settings,
    isSuperAdmin,
    loading,
    signOut,
    showGoogleBackupPrompt,
    setShowGoogleBackupPrompt,
    needsPasswordCreation,
  } = useAuth();
  const [adminChecked, setAdminChecked] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Centralized React Router navigation
  const setCurrentView = React.useCallback(
    (newView: ViewType | string, options?: { replace?: boolean; subState?: Record<string, any> }) => {
      let targetPath = '';
      if (typeof newView === 'string' && newView.startsWith('/')) {
        targetPath = newView;
      } else {
        targetPath = VIEW_TO_PATH[newView as ViewType] || '/home';
      }

      if (options?.replace) {
        navigate(targetPath, { replace: true, state: options?.subState });
      } else {
        navigate(targetPath, { state: options?.subState });
      }
    },
    [navigate]
  );

  // Global search shortcut (Cmd+K / Ctrl+K or custom open event)
  React.useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      } else if (e.key === '/' && !isInput && !isSearchOpen) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    const handleCustomOpenSearch = () => {
      setIsSearchOpen(true);
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    window.addEventListener('open-zetadu-search', handleCustomOpenSearch);
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
      window.removeEventListener('open-zetadu-search', handleCustomOpenSearch);
    };
  }, [isSearchOpen]);

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  React.useEffect(() => {
    if (user && !adminChecked) {
      setAdminChecked(true);
      // Navigate to Home page upon initial authentication only if landing at root or login
      if (location.pathname === '/' || location.pathname === '/login') {
        setCurrentView('home', { replace: true });
      }
    }
  }, [user, adminChecked, setCurrentView, location.pathname]);

  React.useEffect(() => {
    let size = '16px';
    if (settings?.fontSize === 'small') size = '14px';
    if (settings?.fontSize === 'large') size = '18px';
    document.documentElement.style.fontSize = size;
  }, [settings?.fontSize]);

  if (loading) {
    return (
      <div className="min-h-[100dvh] bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-4 select-none">
        <div className="mb-4">
          <Logo variant="icon" className="w-16 h-16 shrink-0 shadow-lg shadow-blue-500/10" />
        </div>
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-medium">
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" aria-label="Loading..."></div>
          <span>Loading LearnDean...</span>
        </div>
      </div>
    );
  }

  if (!user || needsPasswordCreation) {
    return (
      <Suspense fallback={
        <div className="min-h-[100dvh] bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-4 select-none">
          <div className="mb-4">
            <Logo variant="icon" className="w-16 h-16 shrink-0 shadow-lg shadow-blue-500/10" />
          </div>
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-medium">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" aria-label="Loading..."></div>
            <span>Loading LearnDean...</span>
          </div>
        </div>
      }>
        <Login forceCreatePassword={needsPasswordCreation} />
      </Suspense>
    );
  }

  // Check subscription status
  const isSubscriptionActive = userProfile?.subscriptionStatus === 'active';
  if (user && userProfile && !isSuperAdmin && !userProfile.isSuperAdmin && userProfile.role !== 'super_admin' && !isSubscriptionActive) {
    return (
      <Suspense fallback={
        <div className="min-h-[100dvh] bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-4 select-none">
          <div className="mb-4">
            <Logo variant="icon" className="w-16 h-16 shrink-0 shadow-lg shadow-blue-500/10" />
          </div>
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-medium">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" aria-label="Loading..."></div>
            <span>Loading...</span>
          </div>
        </div>
      }>
        <PaymentGate />
      </Suspense>
    );
  }

  return (
    <div className="min-h-[100dvh] font-sans bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      <div className="flex h-[100dvh] overflow-hidden w-full relative">
        {/* Sidebar container */}
        <div className="hidden md:flex relative z-50">
          <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
        </div>
        
        {!isOnline && (
          <div className="offline-banner absolute top-0 left-0 right-0 bg-amber-500 text-white text-center py-1 text-xs font-medium z-[100] flex justify-center items-center gap-2">
            You're offline. Reconnect to continue.
          </div>
        )}

        <main className={`flex-1 flex flex-col min-h-0 relative overflow-x-hidden ${currentView === 'tutor' ? 'p-0 overflow-hidden' : 'p-3 sm:p-5 md:p-8 pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-8 overflow-y-auto'}`}>
          <header className={`flex justify-between items-center shrink-0 gap-2 sm:gap-3 md:gap-4 flex-nowrap relative z-30 ${currentView === 'tutor' ? 'hidden' : 'mb-3 sm:mb-4 md:mb-6'}`}>
            {/* LearnDean Logo & Name on the Left */}
            <div 
              id="header-brand-logo"
              onClick={() => setCurrentView('home')}
              className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group shrink-0"
              role="button"
              tabIndex={0}
              aria-label="LearnDean Home"
            >
              <Logo variant="icon" className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 group-hover:scale-105 transition-transform" />
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-base sm:text-lg md:text-xl font-black tracking-tight text-slate-900 dark:text-white leading-none">
                    LearnDean
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 leading-none">
                    PRO
                  </span>
                </div>
                <p className="hidden md:block text-[11px] text-slate-500 dark:text-slate-400 font-medium -mt-0.5">
                  Smart Prep System
                </p>
              </div>
            </div>

            {/* Global Search Bar Trigger (Desktop & Tablet) */}
            <div className="flex-1 max-w-xs md:max-w-sm lg:max-w-md mx-2 hidden sm:block">
              <button
                id="header-global-search-btn"
                onClick={() => setIsSearchOpen(true)}
                className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 text-slate-400 dark:text-slate-400 shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
                title="Search subjects, topics, flashcards, questions (⌘K)"
              >
                <div className="flex items-center gap-2 text-xs truncate">
                  <Search size={15} className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors shrink-0" />
                  <span className="truncate">Search subjects, questions...</span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 rounded border border-slate-200 dark:border-slate-600">
                    ⌘K
                  </kbd>
                </div>
              </button>
            </div>

            {/* Right Header: Search (Mobile), ThemeToggle, Profile Avatar */}
            <div className="flex items-center gap-1.5 sm:gap-2 ml-auto shrink-0">
              {/* Mobile Search Button */}
              <button
                id="mobile-header-search-btn"
                onClick={() => setIsSearchOpen(true)}
                className="sm:hidden p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                aria-label="Search"
                title="Search LearnDean"
              >
                <Search size={18} />
              </button>

              {/* Theme Toggle Button */}
              <ThemeToggle />

              {/* Profile Avatar on the Right */}
              <button
                id="header-profile-btn"
                onClick={() => {
                  localStorage.removeItem('zetadu_profile_section');
                  window.dispatchEvent(new CustomEvent('open-profile-section', { detail: { section: null } }));
                  setCurrentView('profile');
                }}
                className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 border border-slate-200/90 dark:border-slate-700 text-left transition-all cursor-pointer group shadow-2xs"
                aria-label="Student Profile"
                title="View Student Profile"
              >
                <UserAvatar
                  photoURL={userProfile?.photoURL || user?.photoURL}
                  displayName={userProfile?.name || user?.displayName}
                  email={user?.email}
                  size="sm"
                  className="ring-2 ring-blue-500/20"
                />
                <div className="hidden sm:block leading-tight text-left pr-0.5">
                  <p className="text-[10px] text-slate-400 dark:text-slate-400 font-medium">Profile</p>
                  <p className="text-xs font-bold text-slate-800 dark:text-white truncate max-w-[90px]">
                    {userProfile?.name || user?.displayName || 'Student'}
                  </p>
                </div>
              </button>

              {/* Hamburger (☰) Navigation Drawer Menu */}
              <HeaderMoreMenu
                setCurrentView={setCurrentView}
                onOpenHelp={() => setIsHelpOpen(true)}
              />
            </div>
          </header>

          <div className="flex-1 relative flex flex-col min-h-0">
            <Suspense fallback={
              <div className="flex-1 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" aria-label="Loading section..."></div>
              </div>
            }>
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.1, ease: "easeOut" }}
                  className="flex-1 flex flex-col min-h-0 relative"
                >
                  <Routes>
                    <Route path="/" element={<Navigate to="/home" replace />} />
                    <Route path="/home" element={<Home setView={setCurrentView} />} />
                    <Route path="/ai-tutor" element={<Tutor setCurrentView={setCurrentView} />} />
                    <Route path="/tutor" element={<Navigate to="/ai-tutor" replace />} />
                    <Route path="/learn" element={<LearnHub setView={setCurrentView} />} />
                    <Route path="/library" element={<Subjects setView={setCurrentView} />} />
                    <Route path="/library/:subjectId" element={<Subjects setView={setCurrentView} />} />
                    <Route path="/subjects" element={<Subjects setView={setCurrentView} />} />
                    <Route path="/subjects/:subjectId" element={<Subjects setView={setCurrentView} />} />
                    <Route path="/novels" element={<NovelsLibrary />} />
                    <Route path="/novels/:novelId" element={<NovelsLibrary />} />
                    <Route path="/learn/novels" element={<Subjects setView={setCurrentView} initialSection="novels" />} />
                    <Route path="/practice" element={<Practice setView={setCurrentView} />} />
                    <Route path="/practice/:subjectId" element={<Practice setView={setCurrentView} />} />
                    <Route path="/study" element={<StudyHub setView={setCurrentView} />} />
                    <Route path="/study/:examId" element={<StudyHub setView={setCurrentView} />} />
                    <Route path="/study/:examId/:subjectId" element={<StudyHub setView={setCurrentView} />} />
                    <Route path="/jamb" element={<JambPrep setView={setCurrentView} />} />
                    <Route path="/jamb/:tab" element={<JambPrep setView={setCurrentView} />} />
                    <Route path="/jamb-prep" element={<JambPrep setView={setCurrentView} />} />
                    <Route path="/jamb-cbt" element={<JambPrep setView={setCurrentView} initialTab="cbt" />} />
                    <Route path="/flashcards" element={<Flashcards setView={setCurrentView} />} />
                    <Route path="/flashcards/:subjectId" element={<Flashcards setView={setCurrentView} />} />
                    <Route path="/profile" element={<Profile setView={setCurrentView} />} />
                    <Route path="/profile/:section" element={<Profile setView={setCurrentView} />} />
                    <Route path="/settings" element={<Profile setView={setCurrentView} />} />
                    <Route path="/daily-challenge" element={<DailyChallenge setView={setCurrentView} />} />
                    <Route path="/study-journey" element={<StudyJourney setView={setCurrentView} />} />
                    <Route path="/journey" element={<Navigate to="/study-journey" replace />} />
                    <Route path="/weak-topics" element={<WeakTopics setView={setCurrentView} />} />
                    <Route path="/upload-notes" element={<UploadNotes setView={setCurrentView} />} />
                    <Route path="/upload" element={<Navigate to="/upload-notes" replace />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="*" element={<Navigate to="/home" replace />} />
                  </Routes>
                </motion.div>
              </AnimatePresence>
            </Suspense>
          </div>
        </main>
        
        {/* Bottom Navigation on Mobile */}
        <BottomNav currentView={currentView} setCurrentView={setCurrentView} />
        
        {/* Global Search Modal - only loaded and mounted when search is activated */}
        {isSearchOpen && (
          <Suspense fallback={null}>
            <SearchModal 
              isOpen={isSearchOpen} 
              onClose={() => setIsSearchOpen(false)} 
              setView={setCurrentView} 
            />
          </Suspense>
        )}

        {/* Help & Support Modal */}
        <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />

        {/* Post-Google Signup Backup Password Prompt */}
        {showGoogleBackupPrompt && (
          <GoogleBackupPromptModal
            isOpen={showGoogleBackupPrompt}
            onClose={() => setShowGoogleBackupPrompt(false)}
          />
        )}
      </div>
    </div>
  );
}
