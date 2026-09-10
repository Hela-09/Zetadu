import React, { useState, Suspense } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import Login from './components/Login';
import { ViewType } from './types';
import { LogOut, Search } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useAuth } from './contexts/AuthContext';
import PaymentGate from './components/PaymentGate';
import SearchModal from './components/SearchModal';
import { ThemeToggle } from './components/ThemeToggle';
import { VIEW_TO_PATH } from './utils/navigation';

const Home = React.lazy(() => import('./components/Home'));
const Subjects = React.lazy(() => import('./components/Subjects'));
const Practice = React.lazy(() => import('./components/Practice'));
const Tutor = React.lazy(() => import('./components/Tutor'));
const Profile = React.lazy(() => import('./components/Profile'));
const Admin = React.lazy(() => import('./components/Admin'));
const DailyChallenge = React.lazy(() => import('./components/DailyChallenge'));
const Opportunities = React.lazy(() => import('./components/Opportunities'));
const Flashcards = React.lazy(() => import('./components/Flashcards'));
const StudyJourney = React.lazy(() => import('./components/StudyJourney'));
const WeakTopics = React.lazy(() => import('./components/WeakTopics'));
const UploadNotes = React.lazy(() => import('./components/UploadNotes'));
const SchoolUpdates = React.lazy(() => import('./components/SchoolUpdates'));

function getEffectiveView(pathname: string): ViewType {
  if (pathname === '/ai-tutor' || pathname === '/tutor') return 'tutor';
  if (pathname === '/learn' || pathname === '/subjects') return 'subjects';
  if (pathname.startsWith('/practice')) return 'practice';
  if (pathname.startsWith('/flashcards')) return 'flashcards';
  if (pathname.startsWith('/profile') || pathname.startsWith('/settings')) return 'profile';
  if (pathname.startsWith('/opportunities') || pathname.startsWith('/explore')) return 'opportunities';
  if (pathname.startsWith('/daily-challenge')) return 'daily_challenge';
  if (pathname.startsWith('/study-journey') || pathname.startsWith('/journey')) return 'journey';
  if (pathname.startsWith('/weak-topics')) return 'weak_topics';
  if (pathname.startsWith('/upload-notes')) return 'upload_notes';
  if (pathname.startsWith('/school-updates')) return 'school_updates';
  if (pathname.startsWith('/admin')) return 'admin';
  return 'home';
}

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const currentView = getEffectiveView(location.pathname);
  const { user, userProfile, settings, isSuperAdmin, loading, signOut } = useAuth();
  const [adminChecked, setAdminChecked] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

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
    if (user && isSuperAdmin && !adminChecked) {
      setCurrentView('admin', { replace: true });
      setAdminChecked(true);
    } else if (user && !isSuperAdmin && !adminChecked) {
      setAdminChecked(true);
      if (currentView === 'admin') {
        setCurrentView('home', { replace: true });
      }
    }
  }, [user, isSuperAdmin, adminChecked, currentView, setCurrentView]);

  React.useEffect(() => {
    let size = '16px';
    if (settings?.fontSize === 'small') size = '14px';
    if (settings?.fontSize === 'large') size = '18px';
    document.documentElement.style.fontSize = size;
  }, [settings?.fontSize]);

  if (loading) {
    return (
      <div className="min-h-[100dvh] bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" aria-label="Loading..."></div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  // Check subscription status
  const isSubscriptionActive = userProfile?.subscriptionStatus === 'active';
  if (user && userProfile && !isSuperAdmin && !userProfile.isSuperAdmin && userProfile.role !== 'super_admin' && !isSubscriptionActive) {
    return <PaymentGate />;
  }

  return (
    <div className="min-h-[100dvh] font-sans bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      <div className="flex h-[100dvh] overflow-hidden w-full relative">
        {/* Sidebar container */}
        <div className={`hidden md:flex relative z-50 ${currentView === 'tutor' ? '!hidden' : ''}`}>
          <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
        </div>
        
        {!isOnline && (
          <div className="offline-banner absolute top-0 left-0 right-0 bg-amber-500 text-white text-center py-1 text-xs font-medium z-[100] flex justify-center items-center gap-2">
            You're offline. Reconnect to continue.
          </div>
        )}

        <main className={`flex-1 flex flex-col min-h-0 relative ${currentView === 'tutor' ? 'p-0 overflow-hidden' : 'p-3 sm:p-4 md:p-8 pb-[calc(7.5rem+env(safe-area-inset-bottom))] md:pb-8 overflow-y-auto'}`}>
          <header className={`flex justify-between items-center shrink-0 gap-3 md:gap-4 flex-wrap ${currentView === 'tutor' ? 'hidden' : 'mb-6 md:mb-8'}`}>
            <div className="flex items-center gap-3">
              <div className="space-y-1">
                <p className="text-blue-600 font-semibold text-[10px] md:text-xs uppercase tracking-wider">
                  Adaptive Learning Engine
                </p>
                <h1 className="text-xl md:text-3xl font-bold tracking-tight text-slate-800 dark:text-white">
                  Exam Readiness: <span className="text-blue-600">High</span>
                </h1>
              </div>
            </div>

            {/* Global Search Bar Trigger (Desktop & Tablet) */}
            <div className="flex-1 max-w-sm lg:max-w-md mx-2 hidden sm:block">
              <button
                id="header-global-search-btn"
                onClick={() => setIsSearchOpen(true)}
                className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 text-slate-400 dark:text-slate-400 shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
                title="Search subjects, topics, flashcards, questions (⌘K)"
              >
                <div className="flex items-center gap-2 text-xs truncate">
                  <Search size={15} className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors shrink-0" />
                  <span className="truncate">Search subjects, topics, flashcards...</span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 rounded border border-slate-200 dark:border-slate-600">
                    ⌘K
                  </kbd>
                </div>
              </button>
            </div>

            <div className="flex items-center gap-2 md:gap-3 ml-auto">
              {/* Mobile Search Button */}
              <button
                id="mobile-header-search-btn"
                onClick={() => setIsSearchOpen(true)}
                className="sm:hidden p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                aria-label="Search"
                title="Search Zetadu"
              >
                <Search size={18} />
              </button>

              {/* Theme Toggle Button */}
              <ThemeToggle />

              <div className="hidden sm:block text-right">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Welcome back,</p>
                <p className="text-sm font-bold text-slate-800 dark:text-white">{user.displayName || 'Student'}</p>
              </div>
              <div 
                className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden border-2 border-blue-100 dark:border-blue-800 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300"
                aria-hidden="true"
              >
                {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'S'}
              </div>
              <button 
                onClick={signOut}
                className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Sign out"
              >
                <LogOut size={20} />
              </button>
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
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="flex-1 flex flex-col min-h-0 relative"
                >
                  <Routes>
                    <Route path="/" element={<Navigate to="/home" replace />} />
                    <Route path="/home" element={<Home setView={setCurrentView} />} />
                    <Route path="/ai-tutor" element={<Tutor setCurrentView={setCurrentView} />} />
                    <Route path="/tutor" element={<Navigate to="/ai-tutor" replace />} />
                    <Route path="/learn" element={<Subjects setView={setCurrentView} />} />
                    <Route path="/subjects" element={<Navigate to="/learn" replace />} />
                    <Route path="/practice" element={<Practice setView={setCurrentView} />} />
                    <Route path="/flashcards" element={<Flashcards setView={setCurrentView} />} />
                    <Route path="/profile" element={<Profile setView={setCurrentView} />} />
                    <Route path="/settings" element={<Profile setView={setCurrentView} />} />
                    <Route path="/opportunities" element={<Opportunities />} />
                    <Route path="/explore" element={<Navigate to="/opportunities" replace />} />
                    <Route path="/daily-challenge" element={<DailyChallenge setView={setCurrentView} />} />
                    <Route path="/study-journey" element={<StudyJourney setView={setCurrentView} />} />
                    <Route path="/journey" element={<Navigate to="/study-journey" replace />} />
                    <Route path="/weak-topics" element={<WeakTopics setView={setCurrentView} />} />
                    <Route path="/upload-notes" element={<UploadNotes setView={setCurrentView} />} />
                    <Route path="/school-updates" element={<SchoolUpdates setView={setCurrentView} />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="*" element={<Navigate to="/home" replace />} />
                  </Routes>

                  {/* Guaranteed Mobile Bottom Spacer for clearance above BottomNav */}
                  {currentView !== 'tutor' && (
                    <div 
                      id="mobile-bottom-nav-spacer" 
                      className="md:hidden w-full h-24 sm:h-28 shrink-0 pointer-events-none" 
                      aria-hidden="true" 
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </Suspense>
          </div>
        </main>
        
        {currentView !== 'tutor' && <BottomNav currentView={currentView} setCurrentView={setCurrentView} />}
        
        {/* Global Search Modal */}
        <SearchModal 
          isOpen={isSearchOpen} 
          onClose={() => setIsSearchOpen(false)} 
          setView={setCurrentView} 
        />
      </div>
    </div>
  );
}
