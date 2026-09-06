import React from 'react';
import { ViewType } from '../types';
import { Home, BookOpen, MessageSquare, User, Briefcase, Layers } from "lucide-react";
import { motion } from 'motion/react';

interface BottomNavProps {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
}

export default function BottomNav({ currentView, setCurrentView }: BottomNavProps) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'subjects', label: 'Learn', icon: BookOpen },
    { id: 'flashcards', label: 'Cards', icon: Layers },
    { id: 'opportunities', label: 'Opp\s', icon: Briefcase },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id || (item.id === 'subjects' && currentView === 'practice');
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id as ViewType)}
              className={`flex flex-col items-center justify-center w-16 h-14 rounded-2xl transition-all duration-200 ${
                isActive 
                  ? 'text-blue-600 dark:text-blue-500' 
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <div className={`flex items-center justify-center w-8 h-8 rounded-full mb-1 ${isActive ? 'bg-blue-50 dark:bg-blue-900/30' : ''}`}>
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`text-[10px] ${isActive ? 'font-semibold' : 'font-medium'}`}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
