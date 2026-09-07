import React from 'react';
import { ViewType } from '../types';
import { usePWAInstall } from '../hooks/usePWAInstall';
import Logo from './Logo';
import { Home, BookOpen, MessageSquare, User, Download, Briefcase, Layers, Compass, Search, FileUp } from 'lucide-react';
import { motion } from 'motion/react';

interface SidebarProps {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
}

export default function Sidebar({ currentView, setCurrentView }: SidebarProps) {
  const { isInstallable, triggerInstall } = usePWAInstall();
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'upload_notes', label: 'Upload Notes', icon: FileUp },
    { id: 'journey', label: 'Study Journey', icon: Compass },
    { id: 'subjects', label: 'Learn', icon: BookOpen },
    { id: 'flashcards', label: 'Flashcards', icon: Layers },
    { id: 'opportunities', label: 'Opportunities', icon: Briefcase },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <aside className="w-64 h-full bg-slate-900 text-white flex flex-col shrink-0">
      <div className="p-6 flex items-center space-x-3 shrink-0">
        <Logo variant="icon" className="w-10 h-10 shrink-0" />
        <div>
          <h2 className="text-lg font-bold text-white leading-tight">Zetadu AI</h2>
          <p className="text-sm text-slate-400 leading-tight">Smart Prep System</p>
        </div>
      </div>

      <div className="px-4 pb-2">
        <button
          id="sidebar-search-btn"
          onClick={() => {
            const event = new CustomEvent('open-zetadu-search');
            window.dispatchEvent(event);
          }}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-slate-400 hover:text-slate-200 text-xs transition-all cursor-pointer group"
          title="Search Zetadu (⌘K)"
        >
          <div className="flex items-center gap-2">
            <Search size={16} className="group-hover:text-blue-400 transition-colors" />
            <span className="font-medium">Search...</span>
          </div>
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-900 text-slate-400 rounded border border-slate-700">
            ⌘K
          </kbd>
        </button>
      </div>

      <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id || (item.id === 'subjects' && currentView === 'practice');
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id as ViewType)}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-left relative ${
                isActive 
                  ? 'bg-blue-900/50 border-l-4 border-blue-500 text-white font-medium' 
                  : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              <Icon size={20} className="relative z-10" />
              <span className="relative z-10">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4">
        
        {isInstallable && (
          <button
            onClick={triggerInstall}
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-semibold py-2.5 px-4 rounded-xl transition-all shadow-md mb-4"
          >
            <Download size={18} />
            <span>Install App</span>
          </button>
        )}
        <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700/50">
          <h3 className="text-sm font-semibold text-white mb-2">Daily Goal</h3>
          <p className="text-xs text-slate-400 mb-4 leading-relaxed">
            Complete 3 practice questions and review 1 topic.
          </p>
          <div className="h-1.5 w-full bg-slate-950 rounded-full mb-3">
            <div className="h-full w-2/3 bg-blue-500 rounded-full"></div>
          </div>
          <button 
            onClick={() => setCurrentView('practice')}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2 px-4 rounded-lg transition-colors shadow-sm"
          >
            Continue Study
          </button>
        </div>
      </div>
    </aside>
  );
}
