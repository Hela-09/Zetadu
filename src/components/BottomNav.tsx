import React from 'react';
import { ViewType } from '../types';
import { Home, BookOpen, MessageSquare, User, Layers, GraduationCap } from "lucide-react";
import { motion } from 'motion/react';

interface BottomNavProps {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
}

export default function BottomNav({ currentView, setCurrentView }: BottomNavProps) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'jamb', label: 'JAMB', icon: GraduationCap },
    { id: 'subjects', label: 'Learn', icon: BookOpen },
    { id: 'flashcards', label: 'Cards', icon: Layers },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 pb-[env(safe-area-inset-bottom)] shadow-lg">
      <div className="flex items-center justify-around px-1 sm:px-2 py-1.5 sm:py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id || (item.id === 'subjects' && (currentView === 'practice' || currentView === 'novels'));
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id as ViewType)}
              className={`flex flex-col items-center justify-center flex-1 min-w-0 max-w-[72px] h-12 sm:h-14 rounded-xl sm:rounded-2xl transition-all duration-200 ${
                isActive 
                  ? 'text-blue-600 dark:text-blue-500' 
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <div className={`flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full mb-0.5 sm:mb-1 shrink-0 ${isActive ? 'bg-blue-50 dark:bg-blue-900/30' : ''}`}>
                <Icon size={18} className="sm:w-5 sm:h-5" strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`text-[9px] sm:text-[10px] truncate max-w-full px-0.5 ${isActive ? 'font-semibold' : 'font-medium'}`}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
