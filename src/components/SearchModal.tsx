import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  X, 
  BookOpen, 
  Target, 
  Layers, 
  PenTool, 
  ArrowRight, 
  CornerDownLeft,
  Sparkles,
  FileUp,
  GraduationCap
} from 'lucide-react';
import { ViewType } from '../types';
import { 
  searchZetaduSync, 
  SearchResultItem, 
  SearchCategory, 
  preloadUserSearchData 
} from '../utils/searchIndex';
import { useAuth } from '../contexts/AuthContext';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  setView: (view: ViewType) => void;
}

const POPULAR_SUGGESTIONS = [
  'Quadratic Equations',
  'Photosynthesis',
  'Newton\'s Laws',
  'Subject-Verb Agreement',
  'Demand and Supply',
  'Periodic Table',
  'Binary Numbers'
];

export default function SearchModal({ isOpen, onClose, setView }: SearchModalProps) {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<SearchCategory>('all');
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Preload user data on open
  useEffect(() => {
    if (isOpen) {
      if (user) {
        preloadUserSearchData(user.uid);
      }
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setSearchTerm('');
      setSelectedIndex(0);
      setActiveCategory('all');
    }
  }, [isOpen, user]);

  // Global key listener for Escape, Up, Down, Enter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (results.length > 0 && results[selectedIndex]) {
          handleSelectResult(results[selectedIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  // Keep selected index in view
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchTerm, activeCategory]);

  if (!isOpen) return null;

  // Instant synchronous search
  const { results, counts } = searchZetaduSync(searchTerm, activeCategory);

  const handleSelectResult = (item: SearchResultItem) => {
    onClose();

    if (item.type === 'subject') {
      if (item.subjectId) localStorage.setItem('zetadu_target_subject_id', item.subjectId);
      if (item.subject) localStorage.setItem('zetadu_target_subject', item.subject);
      setView('subjects');
    } else if (item.type === 'topic') {
      localStorage.removeItem('practice_session');
      if (item.topic) localStorage.setItem('zetadu_target_topic', item.topic);
      if (item.subject) localStorage.setItem('zetadu_target_subject', item.subject);
      if (item.subjectId) localStorage.setItem('zetadu_target_subject_id', item.subjectId);
      setView('practice');
    } else if (item.type === 'flashcard') {
      if (item.topic) {
        localStorage.setItem('zetadu_flashcard_topic', item.topic);
        localStorage.setItem('zetadu_target_topic', item.topic);
      }
      if (item.subject) localStorage.setItem('zetadu_target_subject', item.subject);
      if (item.details?.id) localStorage.setItem('zetadu_flashcard_card_id', item.details.id);
      setView('flashcards');
    } else if (item.type === 'question') {
      localStorage.removeItem('practice_session');
      if (item.topic) localStorage.setItem('zetadu_target_topic', item.topic);
      if (item.subject) localStorage.setItem('zetadu_target_subject', item.subject);
      if (item.subjectId) localStorage.setItem('zetadu_target_subject_id', item.subjectId);
      if (item.details) {
        localStorage.setItem('zetadu_target_question', JSON.stringify(item.details));
      }
      setView('practice');
    } else if (item.type === 'action') {
      if (item.id === 'action-upload-notes') {
        setView('upload_notes');
      } else if (item.id === 'action-school-updates') {
        setView('school_updates');
      }
    }
  };

  const getItemIcon = (type: string, id?: string) => {
    switch (type) {
      case 'subject':
        return <BookOpen size={18} className="text-blue-600 dark:text-blue-400" />;
      case 'topic':
        return <Target size={18} className="text-indigo-600 dark:text-indigo-400" />;
      case 'flashcard':
        return <Layers size={18} className="text-emerald-600 dark:text-emerald-400" />;
      case 'question':
        return <PenTool size={18} className="text-amber-600 dark:text-amber-400" />;
      case 'action':
        if (id === 'action-school-updates') {
          return <GraduationCap size={18} className="text-blue-600 dark:text-blue-400" />;
        }
        return <FileUp size={18} className="text-blue-600 dark:text-blue-400" />;
      default:
        return <Search size={18} className="text-slate-400" />;
    }
  };

  const getItemBadgeStyle = (type: string) => {
    switch (type) {
      case 'subject':
        return 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-900';
      case 'topic':
        return 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-900';
      case 'flashcard':
        return 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900';
      case 'question':
        return 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-900';
      case 'action':
        return 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-900 font-bold';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  const getActionLabel = (type: string) => {
    switch (type) {
      case 'subject':
        return 'Open Subject';
      case 'topic':
        return 'Practice Topic';
      case 'flashcard':
        return 'Study Card';
      case 'question':
        return 'Solve Question';
      default:
        return 'Open';
    }
  };

  return (
    <div
      id="search-modal-backdrop"
      className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 md:pt-16 bg-slate-950/60 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div
        id="search-modal-container"
        className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-3xl border-2 border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Bar Input Row */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-900/50">
            <Search size={20} />
          </div>

          <input
            id="zetadu-global-search-input"
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search subjects, topics, flashcards, or questions..."
            className="flex-1 bg-transparent text-base sm:text-lg font-bold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
            autoComplete="off"
            spellCheck="false"
          />

          {searchTerm && (
            <button
              id="clear-search-btn"
              onClick={() => setSearchTerm('')}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Clear search"
            >
              <X size={18} />
            </button>
          )}

          <button
            id="close-search-modal-btn"
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Esc
          </button>
        </div>

        {/* Category Filters Row */}
        {searchTerm.trim().length > 0 && (
          <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <button
              id="filter-all-btn"
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === 'all'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              All ({counts.all})
            </button>
            <button
              id="filter-subjects-btn"
              onClick={() => setActiveCategory('subject')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === 'subject'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              Subjects ({counts.subject})
            </button>
            <button
              id="filter-topics-btn"
              onClick={() => setActiveCategory('topic')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === 'topic'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              Topics ({counts.topic})
            </button>
            <button
              id="filter-flashcards-btn"
              onClick={() => setActiveCategory('flashcard')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === 'flashcard'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              Flashcards ({counts.flashcard})
            </button>
            <button
              id="filter-questions-btn"
              onClick={() => setActiveCategory('question')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === 'question'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              Questions ({counts.question})
            </button>
          </div>
        )}

        {/* Results List */}
        <div ref={listRef} className="p-3 sm:p-4 overflow-y-auto flex-1 space-y-2">
          {searchTerm.trim().length === 0 ? (
            <div className="py-8 px-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-3">
                <Sparkles size={24} />
              </div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-1">
                Instant Search across Zetadu
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-5">
                Type any keyword to instantly find subjects, curriculum topics, flashcards, or practice questions.
              </p>

              <div className="max-w-md mx-auto">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                  Popular Searches
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {POPULAR_SUGGESTIONS.map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => setSearchTerm(suggestion)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:text-blue-600 dark:hover:text-blue-400 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer border border-slate-200/50 dark:border-slate-700/50"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-2" id="search-results-list">
              {results.map((item, idx) => {
                const isSelected = selectedIndex === idx;
                return (
                  <div
                    key={item.id}
                    id={`search-result-item-${idx}`}
                    onClick={() => handleSelectResult(item)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`p-3 sm:p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-850'
                    }`}
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0 mt-0.5">
                        {getItemIcon(item.type, item.id)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span
                            className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md border ${getItemBadgeStyle(
                              item.type
                            )}`}
                          >
                            {item.badge}
                          </span>
                          {item.subject && item.type !== 'subject' && (
                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate">
                              {item.subject}
                            </span>
                          )}
                        </div>

                        <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {item.title}
                        </h4>

                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="hidden sm:inline-block text-xs font-bold text-blue-600 dark:text-blue-400">
                        {getActionLabel(item.type)}
                      </span>
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                        }`}
                      >
                        <ArrowRight size={14} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-10 text-center">
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                No results found for "{searchTerm}"
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Try searching for general terms like Mathematics, Physics, Photosynthesis, or Concord.
              </p>
            </div>
          )}
        </div>

        {/* Footer with Keyboard Shortcuts */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 shadow-2xs text-[10px]">
                ↑
              </kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 shadow-2xs text-[10px]">
                ↓
              </kbd>{' '}
              to navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 shadow-2xs text-[10px] flex items-center gap-0.5">
                <CornerDownLeft size={10} /> Enter
              </kbd>{' '}
              to open
            </span>
          </div>

          <div>
            <span>Instant Search across Zetadu</span>
          </div>
        </div>
      </div>
    </div>
  );
}
