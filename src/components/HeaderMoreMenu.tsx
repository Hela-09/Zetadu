import React, { useState, useRef, useEffect } from 'react';
import {
  MoreVertical,
  BookOpen,
  WifiOff,
  User,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { ViewType } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface HeaderMoreMenuProps {
  setCurrentView: (view: ViewType | string, options?: { replace?: boolean; subState?: Record<string, any> }) => void;
  onOpenHelp: () => void;
}

export default function HeaderMoreMenu({ setCurrentView, onOpenHelp }: HeaderMoreMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { signOut } = useAuth();

  // Close on outside click or Escape key
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
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

  const handleLibraryClick = () => {
    setIsOpen(false);
    setCurrentView('subjects');
  };

  const handleOfflineClick = () => {
    setIsOpen(false);
    try {
      sessionStorage.setItem('open_offline_hub', 'true');
      window.dispatchEvent(new CustomEvent('open-offline-hub'));
    } catch (e) {
      console.warn('Offline hub trigger:', e);
    }
    setCurrentView('home');
  };

  const handleProfileClick = () => {
    setIsOpen(false);
    try {
      localStorage.removeItem('zetadu_profile_section');
      window.dispatchEvent(new CustomEvent('open-profile-section', { detail: { section: null } }));
    } catch (e) {
      console.warn('Profile navigation trigger:', e);
    }
    setCurrentView('profile');
  };

  const handleSettingsClick = () => {
    setIsOpen(false);
    try {
      localStorage.setItem('zetadu_profile_section', 'settings');
      window.dispatchEvent(new CustomEvent('open-profile-section', { detail: { section: 'settings' } }));
    } catch (e) {
      console.warn('Settings navigation trigger:', e);
    }
    setCurrentView('profile');
  };

  const handleHelpClick = () => {
    setIsOpen(false);
    onOpenHelp();
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

  const menuItems = [
    {
      id: 'library',
      label: 'Library',
      description: 'Curriculum & prescribed novels',
      icon: BookOpen,
      onClick: handleLibraryClick,
    },
    {
      id: 'offline',
      label: 'Offline Learning',
      description: 'Study without internet or data',
      icon: WifiOff,
      onClick: handleOfflineClick,
    },
    {
      id: 'profile',
      label: 'Profile',
      description: 'Exam targets, rank & account',
      icon: User,
      onClick: handleProfileClick,
    },
    {
      id: 'settings',
      label: 'Settings',
      description: 'Preferences & display mode',
      icon: Settings,
      onClick: handleSettingsClick,
    },
    {
      id: 'help',
      label: 'Help',
      description: 'Guides, FAQs & assistance',
      icon: HelpCircle,
      onClick: handleHelpClick,
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
        aria-label="More options (⋮)"
        aria-haspopup="true"
        aria-expanded={isOpen}
        title="More Options (⋮)"
      >
        <MoreVertical size={18} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          id="header-more-menu-dropdown"
          className="absolute right-0 top-full mt-2 w-64 sm:w-72 bg-white dark:bg-slate-850 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-750 py-2 z-50 animate-scale-up select-none overflow-hidden"
        >
          {/* Header Title */}
          <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
              More Options
            </span>
          </div>

          {/* Menu Items */}
          <div className="p-1.5 space-y-0.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  id={`header-more-${item.id}-btn`}
                  onClick={item.onClick}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-100/80 dark:hover:bg-slate-800 text-left transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Icon size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {item.label}
                      </p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 line-clamp-1">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-slate-300 dark:text-slate-600 group-hover:text-slate-500 transition-colors" />
                </button>
              );
            })}

            {/* Divider */}
            <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

            {/* Logout Item */}
            <button
              id="header-more-logout-btn"
              onClick={() => setShowLogoutConfirm(true)}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/40 text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-lg bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 group-hover:bg-red-600 group-hover:text-white transition-colors">
                  <LogOut size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-red-600 dark:text-red-400">
                    Logout
                  </p>
                  <p className="text-[10px] text-red-400/80 dark:text-red-400/60">
                    Sign out of your account
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Logout Confirmation Prompt */}
      {showLogoutConfirm && (
        <div
          className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setShowLogoutConfirm(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-scale-up text-center"
          >
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto">
              <LogOut size={22} />
            </div>
            <div>
              <h4 className="text-base font-black text-slate-900 dark:text-white">
                Sign Out of LearnDean?
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Your progress is securely synced to the cloud. You can sign back in anytime.
              </p>
            </div>
            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Yes, Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
