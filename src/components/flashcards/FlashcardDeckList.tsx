import React, { useState, useMemo } from 'react';
import { 
  Layers, Plus, Sparkles, BookOpen, Clock, Bookmark, Search, 
  ChevronRight, CheckCircle2, Play, X, Eye, EyeOff, ArrowLeft
} from 'lucide-react';
import { Flashcard, FlashcardDeck } from '../../types';

interface FlashcardDeckListProps {
  decks: FlashcardDeck[];
  allCards?: Flashcard[];
  totalCardsCount: number;
  totalDueCount: number;
  totalBookmarkedCount: number;
  activeView?: 'decks' | 'all-cards' | 'due-cards' | 'bookmarked-cards';
  onViewChange?: (view: 'decks' | 'all-cards' | 'due-cards' | 'bookmarked-cards') => void;
  activeFilter?: 'all' | 'due' | 'bookmarked';
  onFilterChange?: (filter: 'all' | 'due' | 'bookmarked') => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onSelectDeck: (deck: FlashcardDeck, filterMode?: 'all' | 'due' | 'bookmarked') => void;
  onToggleBookmark?: (cardId: string) => void;
  onStudyCards?: (cards: Flashcard[], title: string) => void;
  onCreateCard: () => void;
  onGenerateAI: () => void;
}

export default function FlashcardDeckList({
  decks,
  allCards = [],
  totalCardsCount,
  totalDueCount,
  totalBookmarkedCount,
  activeView: propActiveView,
  onViewChange,
  activeFilter: propActiveFilter,
  onFilterChange,
  searchQuery: propSearchQuery,
  onSearchChange,
  onSelectDeck,
  onToggleBookmark,
  onStudyCards,
  onCreateCard,
  onGenerateAI
}: FlashcardDeckListProps) {
  // Support both controlled and uncontrolled states so interaction is guaranteed
  const [internalActiveView, setInternalActiveView] = useState<'decks' | 'all-cards' | 'due-cards' | 'bookmarked-cards'>('decks');
  const [internalSearchQuery, setInternalSearchQuery] = useState('');
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  const currentActiveView = propActiveView !== undefined ? propActiveView : internalActiveView;
  const currentSearchQuery = propSearchQuery !== undefined ? propSearchQuery : internalSearchQuery;

  // Real-time timestamp for due card calculation
  const now = Date.now();

  const handleStatsCardClick = (view: 'decks' | 'all-cards' | 'due-cards' | 'bookmarked-cards') => {
    setInternalActiveView(view);
    if (onViewChange) {
      onViewChange(view);
    }
    if (onFilterChange) {
      if (view === 'due-cards') onFilterChange('due');
      else if (view === 'bookmarked-cards') onFilterChange('bookmarked');
      else onFilterChange('all');
    }

    if (view === 'decks') {
      setTimeout(() => {
        const el = document.getElementById('flashcard-decks-section');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 50);
    }
  };

  const handleSearchUpdate = (val: string) => {
    setInternalSearchQuery(val);
    if (onSearchChange) {
      onSearchChange(val);
    }
  };

  // Calculate real deck counts
  const allDecksCount = decks.length;
  const dueDecksCount = useMemo(() => {
    return decks.filter(d => (d.dueTodayCount || 0) > 0).length;
  }, [decks]);
  const bookmarkedDecksCount = useMemo(() => {
    return decks.filter(d => (d.bookmarkedCount || 0) > 0).length;
  }, [decks]);

  // Combined filtering for DECKS
  const filteredDecks = useMemo(() => {
    return decks.filter(deck => {
      // Search query criteria (case-insensitive search by deck name, subject, topic)
      const q = currentSearchQuery.trim().toLowerCase();
      if (!q) return true;

      const nameMatch = deck.name ? deck.name.toLowerCase().includes(q) : false;
      const subjectMatch = deck.subject ? deck.subject.toLowerCase().includes(q) : false;
      const topicMatch = deck.topic ? deck.topic.toLowerCase().includes(q) : false;
      const deckNameMatch = (deck as any).deckName ? (deck as any).deckName.toLowerCase().includes(q) : false;

      return nameMatch || subjectMatch || topicMatch || deckNameMatch;
    });
  }, [decks, currentSearchQuery]);

  // Select cards according to active card view
  const cardsForCurrentView = useMemo(() => {
    if (currentActiveView === 'due-cards') {
      // Only flashcards that are due today or overdue
      return allCards.filter(c => !c.nextReview || c.nextReview <= now);
    }
    if (currentActiveView === 'bookmarked-cards') {
      // Only flashcards the user has bookmarked
      return allCards.filter(c => c.bookmarked === true);
    }
    // all-cards view: all user flashcards
    return allCards;
  }, [allCards, currentActiveView, now]);

  // Filter cards by search query
  const filteredCards = useMemo(() => {
    const q = currentSearchQuery.trim().toLowerCase();
    if (!q) return cardsForCurrentView;

    return cardsForCurrentView.filter(card => {
      const frontMatch = card.front ? card.front.toLowerCase().includes(q) : false;
      const backMatch = card.back ? card.back.toLowerCase().includes(q) : false;
      const subjectMatch = card.subject ? card.subject.toLowerCase().includes(q) : false;
      const topicMatch = card.topic ? card.topic.toLowerCase().includes(q) : false;
      const deckMatch = card.deckName ? card.deckName.toLowerCase().includes(q) : false;
      const explanationMatch = card.explanation ? card.explanation.toLowerCase().includes(q) : false;

      return frontMatch || backMatch || subjectMatch || topicMatch || deckMatch || explanationMatch;
    });
  }, [cardsForCurrentView, currentSearchQuery]);

  // Toggle card answer reveal
  const toggleCardAnswer = (cardId: string) => {
    setExpandedCards(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  const areAllExpanded = useMemo(() => {
    if (filteredCards.length === 0) return false;
    return filteredCards.every(c => expandedCards[c.id]);
  }, [filteredCards, expandedCards]);

  const handleToggleExpandAll = () => {
    if (areAllExpanded) {
      setExpandedCards({});
    } else {
      const next: Record<string, boolean> = {};
      filteredCards.forEach(c => { next[c.id] = true; });
      setExpandedCards(next);
    }
  };

  const formatNextReview = (timestamp?: number): string => {
    if (!timestamp) return 'Due for Review';
    if (timestamp <= now) return 'Due for Review';
    const diffDays = Math.ceil((timestamp - now) / (1000 * 60 * 60 * 24));
    if (diffDays <= 1) return 'Tomorrow';
    return `In ${diffDays} days`;
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 sm:space-y-8 animate-fade-in relative z-10">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wider">
            <Layers size={16} />
            <span>Spaced Repetition System</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white tracking-tight mt-1">
            Flashcards Dashboard
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track your revision decks, review due flashcards, and inspect bookmarks.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <button
            type="button"
            onClick={onGenerateAI}
            className="cursor-pointer flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/50 border border-blue-200 dark:border-blue-800 transition-colors"
          >
            <Sparkles size={16} />
            <span>Generate with AI</span>
          </button>

          <button
            type="button"
            onClick={onCreateCard}
            className="cursor-pointer flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus size={16} />
            <span>New Flashcard</span>
          </button>
        </div>
      </div>

      {/* DASHBOARD STATISTICS CARDS (CLICKABLE & FUNCTIONAL) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 relative z-10">
        {/* 1. TOTAL DECKS CARD */}
        <button
          type="button"
          id="stats-card-total-decks"
          role="button"
          aria-pressed={currentActiveView === 'decks'}
          aria-label="View all flashcard decks"
          onClick={() => handleStatsCardClick('decks')}
          className={`group text-left rounded-2xl p-4 sm:p-5 border transition-all duration-200 cursor-pointer select-none touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 active:scale-[0.98] ${
            currentActiveView === 'decks'
              ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-500 dark:border-blue-500 ring-2 ring-blue-500/20 shadow-sm'
              : 'bg-white dark:bg-slate-800 border-slate-200/80 dark:border-slate-700/80 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between gap-1 text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <Layers size={16} className={currentActiveView === 'decks' ? 'text-blue-600 dark:text-blue-400' : 'text-blue-500'} />
              <span>Total Decks</span>
            </div>
            {currentActiveView === 'decks' && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-blue-600 text-white dark:bg-blue-500 dark:text-white">
                Active
              </span>
            )}
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white mt-2">
            {allDecksCount}
          </div>
          <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-1.5 flex items-center justify-between">
            <span>Browse decks</span>
            <ChevronRight size={13} className={`transition-transform duration-200 ${currentActiveView === 'decks' ? 'text-blue-600 dark:text-blue-400 translate-x-0.5' : 'group-hover:translate-x-0.5'}`} />
          </div>
        </button>

        {/* 2. TOTAL CARDS CARD */}
        <button
          type="button"
          id="stats-card-total-cards"
          role="button"
          aria-pressed={currentActiveView === 'all-cards'}
          aria-label="View all flashcards"
          onClick={() => handleStatsCardClick('all-cards')}
          className={`group text-left rounded-2xl p-4 sm:p-5 border transition-all duration-200 cursor-pointer select-none touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 active:scale-[0.98] ${
            currentActiveView === 'all-cards'
              ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-500 dark:border-indigo-500 ring-2 ring-indigo-500/20 shadow-sm'
              : 'bg-white dark:bg-slate-800 border-slate-200/80 dark:border-slate-700/80 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between gap-1 text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <BookOpen size={16} className={currentActiveView === 'all-cards' ? 'text-indigo-600 dark:text-indigo-400' : 'text-indigo-500'} />
              <span>Total Cards</span>
            </div>
            {currentActiveView === 'all-cards' && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-indigo-600 text-white dark:bg-indigo-500 dark:text-white">
                Active
              </span>
            )}
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white mt-2">
            {totalCardsCount}
          </div>
          <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-1.5 flex items-center justify-between">
            <span>Browse all cards</span>
            <ChevronRight size={13} className={`transition-transform duration-200 ${currentActiveView === 'all-cards' ? 'text-indigo-600 dark:text-indigo-400 translate-x-0.5' : 'group-hover:translate-x-0.5'}`} />
          </div>
        </button>

        {/* 3. CARDS DUE TODAY CARD */}
        <button
          type="button"
          id="stats-card-due-today"
          role="button"
          aria-pressed={currentActiveView === 'due-cards'}
          aria-label="View flashcards due today"
          onClick={() => handleStatsCardClick('due-cards')}
          className={`group text-left rounded-2xl p-4 sm:p-5 border transition-all duration-200 cursor-pointer select-none touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 active:scale-[0.98] ${
            currentActiveView === 'due-cards'
              ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-500 dark:border-amber-500 ring-2 ring-amber-500/20 shadow-sm'
              : 'bg-white dark:bg-slate-800 border-slate-200/80 dark:border-slate-700/80 hover:border-amber-300 dark:hover:border-amber-700 hover:shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between gap-1 text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <Clock size={16} className={currentActiveView === 'due-cards' ? 'text-amber-600 dark:text-amber-400' : 'text-amber-500'} />
              <span>Cards Due Today</span>
            </div>
            {currentActiveView === 'due-cards' && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-amber-600 text-white dark:bg-amber-500 dark:text-white">
                Active
              </span>
            )}
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-amber-600 dark:text-amber-400 mt-2">
            {totalDueCount}
          </div>
          <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-1.5 flex items-center justify-between">
            <span>{totalDueCount > 0 ? 'Review now' : 'All caught up'}</span>
            <ChevronRight size={13} className={`transition-transform duration-200 ${currentActiveView === 'due-cards' ? 'text-amber-600 dark:text-amber-400 translate-x-0.5' : 'group-hover:translate-x-0.5'}`} />
          </div>
        </button>

        {/* 4. BOOKMARKED CARDS CARD */}
        <button
          type="button"
          id="stats-card-bookmarked"
          role="button"
          aria-pressed={currentActiveView === 'bookmarked-cards'}
          aria-label="View bookmarked flashcards"
          onClick={() => handleStatsCardClick('bookmarked-cards')}
          className={`group text-left rounded-2xl p-4 sm:p-5 border transition-all duration-200 cursor-pointer select-none touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 active:scale-[0.98] ${
            currentActiveView === 'bookmarked-cards'
              ? 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-500 dark:border-rose-500 ring-2 ring-rose-500/20 shadow-sm'
              : 'bg-white dark:bg-slate-800 border-slate-200/80 dark:border-slate-700/80 hover:border-rose-300 dark:hover:border-rose-700 hover:shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between gap-1 text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <Bookmark size={16} className={currentActiveView === 'bookmarked-cards' ? 'text-rose-600 dark:text-rose-400' : 'text-rose-500'} />
              <span>Bookmarked Cards</span>
            </div>
            {currentActiveView === 'bookmarked-cards' && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-rose-600 text-white dark:bg-rose-500 dark:text-white">
                Active
              </span>
            )}
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-rose-600 dark:text-rose-400 mt-2">
            {totalBookmarkedCount}
          </div>
          <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-1.5 flex items-center justify-between">
            <span>Flagged cards</span>
            <ChevronRight size={13} className={`transition-transform duration-200 ${currentActiveView === 'bookmarked-cards' ? 'text-rose-600 dark:text-rose-400 translate-x-0.5' : 'group-hover:translate-x-0.5'}`} />
          </div>
        </button>
      </div>

      {/* SEARCH AND VIEW TABS CONTROLS */}
      <div className="relative z-20 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pointer-events-auto">
        {/* Search bar */}
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            id="search-flashcards"
            name="search-flashcards"
            type="text"
            value={currentSearchQuery}
            onChange={(e) => handleSearchUpdate(e.target.value)}
            placeholder={
              currentActiveView === 'decks'
                ? "Search decks by name, subject, or topic..."
                : "Search cards by question, answer, subject, or topic..."
            }
            aria-label="Search flashcards"
            className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xs"
          />
          {currentSearchQuery && (
            <button
              type="button"
              onClick={() => handleSearchUpdate('')}
              aria-label="Clear search"
              className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* View Tabs */}
        <div 
          role="tablist"
          aria-label="Flashcards view tabs"
          className="relative z-20 flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/90 rounded-xl border border-slate-200/80 dark:border-slate-700/80 self-start sm:self-auto pointer-events-auto shadow-xs flex-wrap"
        >
          {/* ALL DECKS TAB */}
          <button
            type="button"
            id="tab-all-decks"
            role="tab"
            aria-selected={currentActiveView === 'decks'}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleStatsCardClick('decks');
            }}
            className={`cursor-pointer pointer-events-auto relative z-20 px-3 py-1.5 rounded-lg text-xs transition-all select-none ${
              currentActiveView === 'decks'
                ? 'bg-blue-600 text-white font-bold shadow-sm ring-1 ring-blue-600/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/50 font-medium'
            }`}
          >
            All Decks ({allDecksCount})
          </button>

          {/* ALL CARDS TAB */}
          <button
            type="button"
            id="tab-all-cards"
            role="tab"
            aria-selected={currentActiveView === 'all-cards'}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleStatsCardClick('all-cards');
            }}
            className={`cursor-pointer pointer-events-auto relative z-20 px-3 py-1.5 rounded-lg text-xs transition-all select-none ${
              currentActiveView === 'all-cards'
                ? 'bg-indigo-600 text-white font-bold shadow-sm ring-1 ring-indigo-600/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/50 font-medium'
            }`}
          >
            All Cards ({totalCardsCount})
          </button>

          {/* DUE TODAY TAB */}
          <button
            type="button"
            id="tab-due-today"
            role="tab"
            aria-selected={currentActiveView === 'due-cards'}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleStatsCardClick('due-cards');
            }}
            className={`cursor-pointer pointer-events-auto relative z-20 px-3 py-1.5 rounded-lg text-xs transition-all select-none ${
              currentActiveView === 'due-cards'
                ? 'bg-amber-600 text-white font-bold shadow-sm ring-1 ring-amber-600/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/50 font-medium'
            }`}
          >
            Due Today ({totalDueCount})
          </button>

          {/* BOOKMARKED TAB */}
          <button
            type="button"
            id="tab-bookmarked"
            role="tab"
            aria-selected={currentActiveView === 'bookmarked-cards'}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleStatsCardClick('bookmarked-cards');
            }}
            className={`cursor-pointer pointer-events-auto relative z-20 px-3 py-1.5 rounded-lg text-xs transition-all select-none ${
              currentActiveView === 'bookmarked-cards'
                ? 'bg-rose-600 text-white font-bold shadow-sm ring-1 ring-rose-600/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/50 font-medium'
            }`}
          >
            Bookmarked ({totalBookmarkedCount})
          </button>
        </div>
      </div>

      {/* VIEW CONTENT: DECKS OR CARDS BROWSER */}
      {currentActiveView === 'decks' ? (
        /* ---------------------------------------------------- */
        /* 1. FLASHCARD DECKS SECTION                           */
        /* ---------------------------------------------------- */
        <div id="flashcard-decks-section" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Layers size={18} className="text-blue-500" />
              <span>User Decks ({filteredDecks.length})</span>
            </h2>
          </div>

          {filteredDecks.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 p-8 sm:p-12 text-center max-w-lg mx-auto shadow-xs relative z-10">
              <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-4">
                {currentSearchQuery ? <Search size={32} /> : <Layers size={32} />}
              </div>
              
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
                {currentSearchQuery ? 'No matching decks found.' : 'No flashcard decks yet'}
              </h3>
              
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                {currentSearchQuery ? (
                  <>No decks match your search for <span className="font-semibold text-slate-700 dark:text-slate-300">"{currentSearchQuery}"</span>. Try adjusting your query or clearing search.</>
                ) : (
                  'Create your first flashcard or generate a complete revision deck in seconds with AI.'
                )}
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                {currentSearchQuery ? (
                  <button
                    type="button"
                    onClick={() => handleSearchUpdate('')}
                    className="cursor-pointer w-full sm:w-auto px-5 py-2.5 rounded-xl font-semibold text-sm text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 transition-colors"
                  >
                    Clear Search
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={onGenerateAI}
                      className="cursor-pointer w-full sm:w-auto px-5 py-2.5 rounded-xl font-semibold text-sm text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                    >
                      <Sparkles size={16} />
                      Generate with AI
                    </button>
                    <button
                      type="button"
                      onClick={onCreateCard}
                      className="cursor-pointer w-full sm:w-auto px-5 py-2.5 rounded-xl font-semibold text-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center gap-2"
                    >
                      <Plus size={16} />
                      Create Flashcard
                    </button>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 relative z-10">
              {filteredDecks.map((deck) => {
                const masteredCards = deck.cards.filter(c => c.rating === 'Easy' || c.rating === 'Good').length;
                const masteryPercentage = deck.cardCount > 0 ? Math.round((masteredCards / deck.cardCount) * 100) : 0;

                return (
                  <div
                    key={deck.id}
                    onClick={() => onSelectDeck(deck, 'all')}
                    className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 shadow-xs hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all p-5 sm:p-6 flex flex-col justify-between cursor-pointer relative"
                  >
                    <div>
                      {/* Subject Tag & Status */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300">
                          {deck.subject}
                        </span>

                        {deck.dueTodayCount > 0 ? (
                          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-900/40">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                            {deck.dueTodayCount} Due
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400">
                            <CheckCircle2 size={12} />
                            Caught Up
                          </span>
                        )}
                      </div>

                      {/* Deck Name */}
                      <h3 className="text-lg font-bold text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                        {deck.name}
                      </h3>

                      {/* Topic Subtitle */}
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                        {deck.topic}
                      </p>

                      {/* Card count and Due badge */}
                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
                        <span>
                          {deck.cardCount} {deck.cardCount === 1 ? 'Card' : 'Cards'} • {deck.dueTodayCount > 0 ? `${deck.dueTodayCount} Due Today` : 'All Reviewed'}
                        </span>
                        <span>{masteryPercentage}% Mastered</span>
                      </div>

                      {/* Mini progress bar */}
                      <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700/60 rounded-full mt-2 overflow-hidden">
                        <div 
                          className="h-full bg-blue-600 rounded-full transition-all duration-300"
                          style={{ width: `${masteryPercentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Card Action Row */}
                    <div className="mt-5 pt-3 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1">
                        {(deck.bookmarkedCount || 0) > 0 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectDeck(deck, 'bookmarked');
                            }}
                            className="cursor-pointer p-2 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors text-xs font-semibold flex items-center gap-1"
                            title="Study Bookmarked Cards"
                          >
                            <Bookmark size={14} fill="currentColor" />
                            <span>{deck.bookmarkedCount}</span>
                          </button>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectDeck(deck, 'all');
                        }}
                        className="cursor-pointer flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors ml-auto"
                      >
                        <Play size={12} fill="currentColor" />
                        <span>Study Deck</span>
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* ---------------------------------------------------- */
        /* 2, 3, 4. CARDS BROWSER VIEW (All, Due, Bookmarked)    */
        /* ---------------------------------------------------- */
        <div className="space-y-4">
          {/* Card View Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                currentActiveView === 'due-cards'
                  ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
                  : currentActiveView === 'bookmarked-cards'
                  ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                  : 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
              }`}>
                {currentActiveView === 'due-cards' ? (
                  <Clock size={20} />
                ) : currentActiveView === 'bookmarked-cards' ? (
                  <Bookmark size={20} />
                ) : (
                  <BookOpen size={20} />
                )}
              </div>

              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white">
                  {currentActiveView === 'due-cards'
                    ? 'Cards Due for Review'
                    : currentActiveView === 'bookmarked-cards'
                    ? 'Bookmarked Flashcards'
                    : 'All Flashcards'}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Showing {filteredCards.length} {filteredCards.length === 1 ? 'card' : 'cards'}
                  {currentSearchQuery && ` matching "${currentSearchQuery}"`}
                </p>
              </div>
            </div>

            {/* Actions for current card view */}
            <div className="flex items-center gap-2 flex-wrap self-end sm:self-auto">
              {filteredCards.length > 0 && onStudyCards && (
                <button
                  type="button"
                  onClick={() => {
                    const title = currentActiveView === 'due-cards'
                      ? 'Due Flashcards Review'
                      : currentActiveView === 'bookmarked-cards'
                      ? 'Bookmarked Flashcards'
                      : 'All Flashcards Study';
                    onStudyCards(filteredCards, title);
                  }}
                  className="cursor-pointer flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-xs"
                >
                  <Play size={12} fill="currentColor" />
                  <span>Study {filteredCards.length} {filteredCards.length === 1 ? 'Card' : 'Cards'}</span>
                </button>
              )}

              {filteredCards.length > 0 && (
                <button
                  type="button"
                  onClick={handleToggleExpandAll}
                  className="cursor-pointer flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700/60 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  {areAllExpanded ? <EyeOff size={14} /> : <Eye size={14} />}
                  <span>{areAllExpanded ? 'Hide All Answers' : 'Reveal All Answers'}</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => handleStatsCardClick('decks')}
                className="cursor-pointer flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <ArrowLeft size={14} />
                <span>Back to Decks</span>
              </button>
            </div>
          </div>

          {/* Cards Grid or Proper Empty States */}
          {filteredCards.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 p-8 sm:p-12 text-center max-w-lg mx-auto shadow-xs relative z-10">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                currentSearchQuery
                  ? 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                  : currentActiveView === 'due-cards'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                  : currentActiveView === 'bookmarked-cards'
                  ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400'
                  : 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
              }`}>
                {currentSearchQuery ? (
                  <Search size={32} />
                ) : currentActiveView === 'due-cards' ? (
                  <CheckCircle2 size={32} />
                ) : currentActiveView === 'bookmarked-cards' ? (
                  <Bookmark size={32} />
                ) : (
                  <BookOpen size={32} />
                )}
              </div>

              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
                {currentSearchQuery ? (
                  'No matching flashcards found.'
                ) : currentActiveView === 'due-cards' ? (
                  "You're all caught up! No cards are due for review."
                ) : currentActiveView === 'bookmarked-cards' ? (
                  'No bookmarked cards yet'
                ) : (
                  'No flashcards yet'
                )}
              </h3>

              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                {currentSearchQuery ? (
                  <>No flashcards match your search for <span className="font-semibold text-slate-700 dark:text-slate-300">"{currentSearchQuery}"</span>. Try adjusting your search query.</>
                ) : currentActiveView === 'due-cards' ? (
                  'All your flashcards are reviewed and on schedule! None are currently due for review today. You can practice all decks anytime.'
                ) : currentActiveView === 'bookmarked-cards' ? (
                  'You have not bookmarked any flashcards yet. Click the bookmark icon on any flashcard while studying or browsing to review them here.'
                ) : (
                  'Create your first flashcard manually or generate a complete revision deck in seconds with AI.'
                )}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                {currentSearchQuery ? (
                  <button
                    type="button"
                    onClick={() => handleSearchUpdate('')}
                    className="cursor-pointer w-full sm:w-auto px-5 py-2.5 rounded-xl font-semibold text-sm text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 transition-colors"
                  >
                    Clear Search
                  </button>
                ) : currentActiveView !== 'all-cards' ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleStatsCardClick('all-cards')}
                      className="cursor-pointer w-full sm:w-auto px-5 py-2.5 rounded-xl font-semibold text-sm text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 transition-colors"
                    >
                      Browse All Cards
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatsCardClick('decks')}
                      className="cursor-pointer w-full sm:w-auto px-5 py-2.5 rounded-xl font-semibold text-sm text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 transition-colors"
                    >
                      View All Decks
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={onGenerateAI}
                      className="cursor-pointer w-full sm:w-auto px-5 py-2.5 rounded-xl font-semibold text-sm text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                    >
                      <Sparkles size={16} />
                      Generate with AI
                    </button>
                    <button
                      type="button"
                      onClick={onCreateCard}
                      className="cursor-pointer w-full sm:w-auto px-5 py-2.5 rounded-xl font-semibold text-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center gap-2"
                    >
                      <Plus size={16} />
                      Create Flashcard
                    </button>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 relative z-10">
              {filteredCards.map((card) => {
                const isExpanded = Boolean(expandedCards[card.id]);
                const isDue = !card.nextReview || card.nextReview <= now;

                return (
                  <div
                    key={card.id}
                    id={`flashcard-item-${card.id}`}
                    className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 shadow-xs hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all p-5 flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Badges: Deck, Subject, Topic & Bookmark */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {/* Subject Badge */}
                          <span className="px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/40">
                            {card.subject || 'General'}
                          </span>

                          {/* Topic Badge */}
                          {card.topic && (
                            <span className="px-2 py-0.5 rounded-md text-[11px] font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700/60 line-clamp-1 max-w-[140px]">
                              {card.topic}
                            </span>
                          )}

                          {/* Deck Badge */}
                          {card.deckName && card.deckName !== card.subject && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 line-clamp-1 max-w-[120px]">
                              {card.deckName}
                            </span>
                          )}
                        </div>

                        {/* Bookmark Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onToggleBookmark) onToggleBookmark(card.id);
                          }}
                          aria-label={card.bookmarked ? 'Remove bookmark' : 'Bookmark flashcard'}
                          className={`cursor-pointer p-1.5 rounded-lg transition-colors ${
                            card.bookmarked
                              ? 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40'
                              : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50/50 dark:hover:bg-rose-950/30'
                          }`}
                        >
                          <Bookmark size={15} fill={card.bookmarked ? 'currentColor' : 'none'} />
                        </button>
                      </div>

                      {/* Card Front (Question / Prompt) */}
                      <div className="mb-3">
                        <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                          Question / Front
                        </div>
                        <h4 className="text-sm sm:text-base font-semibold text-slate-800 dark:text-white leading-relaxed">
                          {card.front}
                        </h4>
                      </div>

                      {/* Toggle Answer Button */}
                      <button
                        type="button"
                        onClick={() => toggleCardAnswer(card.id)}
                        className="cursor-pointer inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 py-1 transition-colors select-none"
                      >
                        {isExpanded ? <EyeOff size={13} /> : <Eye size={13} />}
                        <span>{isExpanded ? 'Hide Answer' : 'Show Answer'}</span>
                      </button>

                      {/* Card Back (Answer & Explanation) */}
                      {isExpanded && (
                        <div className="mt-2.5 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 space-y-2 text-xs">
                          <div>
                            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 mb-0.5">
                              Answer / Back
                            </div>
                            <p className="text-sm font-medium text-slate-800 dark:text-slate-100 leading-relaxed">
                              {card.back}
                            </p>
                          </div>

                          {card.explanation && (
                            <div className="pt-2 border-t border-slate-200/50 dark:border-slate-800/80">
                              <span className="font-semibold text-slate-600 dark:text-slate-300">Explanation: </span>
                              <span className="text-slate-500 dark:text-slate-400 leading-relaxed">{card.explanation}</span>
                            </div>
                          )}

                          {card.example && (
                            <div className="pt-1 text-slate-500 dark:text-slate-400">
                              <span className="font-semibold text-slate-600 dark:text-slate-300">Example: </span>
                              <span>{card.example}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Card Status Footer */}
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-1.5">
                        {/* Due Status */}
                        {isDue ? (
                          <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md border border-amber-200/60 dark:border-amber-900/40">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                            Due Today
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400 dark:text-slate-500">
                            {formatNextReview(card.nextReview)}
                          </span>
                        )}

                        {/* Rating tag if available */}
                        {card.rating && (
                          <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700/60">
                            {card.rating}
                          </span>
                        )}
                      </div>

                      {/* Study Individual Card */}
                      {onStudyCards && (
                        <button
                          type="button"
                          onClick={() => onStudyCards([card], card.topic || card.subject || 'Single Card')}
                          className="cursor-pointer flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 px-2.5 py-1 rounded-lg transition-colors"
                        >
                          <span>Study</span>
                          <Play size={10} fill="currentColor" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
