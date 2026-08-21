import React, { useState, Suspense } from 'react';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import Login from './components/Login';
import { ViewType } from './types';
import { Moon, Sun, LogOut } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';
import CompleteProfile from './components/CompleteProfile';


const Home = React.lazy(() => import('./components/Home'));
const Subjects = React.lazy(() => import('./components/Subjects'));
const Practice = React.lazy(() => import('./components/Practice'));
const Tutor = React.lazy(() => import('./components/Tutor'));
const Profile = React.lazy(() => import('./components/Profile'));
const Admin = React.lazy(() => import('./components/Admin'));

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>(() => {
    return (localStorage.getItem('educore_current_view') as ViewType) || 'home';
  });
  const { user, userProfile, settings, updateSettings, isSuperAdmin, loading, signOut } = useAuth();
  const [adminChecked, setAdminChecked] = useState(false);

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


  const theme = settings?.theme || 'system';
  const [systemDarkMode, setSystemDarkMode] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => setSystemDarkMode(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const darkMode = theme === 'dark' || (theme === 'system' && systemDarkMode);

  React.useEffect(() => {
    document.documentElement.classList.add('theme-transition');
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    const timeout = setTimeout(() => {
      document.documentElement.classList.remove('theme-transition');
    }, 300);
    return () => clearTimeout(timeout);
  }, [darkMode]);

  React.useEffect(() => {
    if (user && isSuperAdmin && !adminChecked) {
      setCurrentView('admin');
      setAdminChecked(true);
    } else if (user && !isSuperAdmin && !adminChecked) {
      setAdminChecked(true);
      if (currentView === 'admin') {
        setCurrentView('home');
      }
    }
  }, [user, isSuperAdmin, adminChecked, currentView]);


  React.useEffect(() => {
    localStorage.setItem('educore_current_view', currentView);
  }, [currentView]);

  React.useEffect(() => {
    let size = '16px';
    if (settings?.fontSize === 'small') size = '14px';
    if (settings?.fontSize === 'large') size = '18px';
    document.documentElement.style.fontSize = size;
  }, [settings?.fontSize]);

  const toggleDarkMode = () => updateSettings({ theme: darkMode ? 'light' : 'dark' });

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

  if (user && userProfile && !userProfile.username) {
    return <CompleteProfile />;
  }

  return (
    <div className={`min-h-[100dvh] font-sans ${darkMode ? 'dark bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
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

        <main className={`flex-1 flex flex-col min-h-0 relative ${currentView === 'tutor' ? 'p-0 overflow-hidden' : 'p-4 md:p-8 pb-24 md:pb-8 pb-[calc(6rem+env(safe-area-inset-bottom))] overflow-y-auto overflow-x-hidden'}`}>
          <header className={`flex justify-between items-center shrink-0 gap-4 flex-wrap ${currentView === 'tutor' ? 'hidden' : 'mb-6 md:mb-8'}`}>
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
            <div className="flex items-center gap-2 md:gap-4 ml-auto">
              <button 
                onClick={toggleDarkMode}
                className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <div className="hidden sm:block text-right">
                <p className="text-xs text-slate-500 font-medium">Welcome back,</p>
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
              {currentView === 'home' && <Home setView={setCurrentView} />}
              {currentView === 'subjects' && <Subjects setView={setCurrentView} />}
              {currentView === 'practice' && <Practice />}
              {currentView === 'tutor' && <Tutor setCurrentView={setCurrentView} />}
              {currentView === 'profile' && <Profile setView={setCurrentView} />}
              {currentView === 'admin' && <Admin />}
            </Suspense>
          </div>
        </main>
        
        {currentView !== 'tutor' && <BottomNav currentView={currentView} setCurrentView={setCurrentView} />}
        
      </div>
    </div>
  );
}
