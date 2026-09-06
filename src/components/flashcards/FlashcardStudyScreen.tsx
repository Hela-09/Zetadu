import React, { useState, useEffect } from 'react';
import { 
  X, Bookmark, Shuffle, ArrowLeft, ArrowRight, RotateCw, CheckCircle2, 
  HelpCircle, Sparkles, ChevronRight, AlertCircle, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Flashcard } from '../../types';

interface FlashcardStudyScreenProps {
  deckName: string;
  subject: string;
  topic: string;
  cards: Flashcard[];
  onExit: () => void;
  onRateCard: (cardId: string, rating: 'Again' | 'Hard' | 'Good' | 'Easy') => Promise<void>;
  onToggleBookmark: (cardId: string) => Promise<void>;
  onContinueToPractice?: () => void;
}

export default function FlashcardStudyScreen({
  deckName,
  subject,
  topic,
  cards: initialCards,
  onExit,
  onRateCard,
  onToggleBookmark,
  onContinueToPractice
}: FlashcardStudyScreenProps) {
  const [cards, setCards] = useState<Flashcard[]>(initialCards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [shuffleToast, setShuffleToast] = useState(false);
  const [savingRating, setSavingRating] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [ratingsHistory, setRatingsHistory] = useState<Record<string, 'Again' | 'Hard' | 'Good' | 'Easy'>>({});

  useEffect(() => {
    setCards(initialCards);
    setCurrentIndex(0);
    setIsFlipped(false);
    setSessionCompleted(false);
  }, [initialCards]);

  const currentCard = cards[currentIndex];
  const progressPercent = cards.length > 0 ? ((currentIndex + 1) / cards.length) * 100 : 0;

  // Handle 3D flip
  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showExitModal || sessionCompleted) return;
      
      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped(prev => !prev);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (isFlipped) {
        if (e.key === '1') handleRatingSelect('Again');
        if (e.key === '2') handleRatingSelect('Hard');
        if (e.key === '3') handleRatingSelect('Good');
        if (e.key === '4') handleRatingSelect('Easy');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFlipped, currentIndex, cards.length, showExitModal, sessionCompleted]);

  // Shuffle study order
  const handleShuffle = () => {
    const shuffled = [...cards];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    setShuffleToast(true);
    setTimeout(() => setShuffleToast(false), 2200);
  };

  // Bookmark toggle
  const handleBookmarkToggle = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!currentCard) return;

    const newBookmarked = !currentCard.bookmarked;
    // Optimistic UI update
    setCards(prev => prev.map((c, i) => i === currentIndex ? { ...c, bookmarked: newBookmarked } : c));
    await onToggleBookmark(currentCard.id);
  };

  // Select rating: Save, update progress, advance to next card
  const handleRatingSelect = async (rating: 'Again' | 'Hard' | 'Good' | 'Easy') => {
    if (!currentCard || savingRating) return;
    setSavingRating(true);

    try {
      setRatingsHistory(prev => ({ ...prev, [currentCard.id]: rating }));
      
      // Update local card progress
      setCards(prev => prev.map((c, i) => {
        if (i === currentIndex) {
          return {
            ...c,
            rating,
            reviews: (c.reviews || 0) + 1,
            lastReviewed: Date.now()
          };
        }
        return c;
      }));

      // Call parent Firestore updater
      await onRateCard(currentCard.id, rating);

      // Advance to next card or complete session
      if (currentIndex < cards.length - 1) {
        setIsFlipped(false);
        setCurrentIndex(prev => prev + 1);
      } else {
        setSessionCompleted(true);
      }
    } finally {
      setSavingRating(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setIsFlipped(false);
      setCurrentIndex(prev => prev + 1);
    } else {
      setSessionCompleted(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setCurrentIndex(prev => prev - 1);
    }
  };

  const restartStudy = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setSessionCompleted(false);
    setRatingsHistory({});
  };

  const restartDifficultOnly = () => {
    const hardCards = cards.filter(c => {
      const r = ratingsHistory[c.id] || c.rating;
      return r === 'Again' || r === 'Hard';
    });
    if (hardCards.length > 0) {
      setCards(hardCards);
      setCurrentIndex(0);
      setIsFlipped(false);
      setSessionCompleted(false);
      setRatingsHistory({});
    } else {
      restartStudy();
    }
  };

  // Completion screen
  if (sessionCompleted) {
    const counts = {
      Again: Object.values(ratingsHistory).filter(r => r === 'Again').length,
      Hard: Object.values(ratingsHistory).filter(r => r === 'Hard').length,
      Good: Object.values(ratingsHistory).filter(r => r === 'Good').length,
      Easy: Object.values(ratingsHistory).filter(r => r === 'Easy').length,
    };
    const totalRated = Object.keys(ratingsHistory).length;
    const hasDifficult = counts.Again > 0 || counts.Hard > 0;

    return (
      <div className="fixed inset-0 z-[60] bg-slate-50 dark:bg-slate-900 overflow-y-auto flex flex-col justify-between p-4 sm:p-6 md:p-8">
        {/* Top bar */}
        <div className="w-full max-w-2xl mx-auto flex items-center justify-between pb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              {subject || 'Study'}
            </span>
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">
              {topic || deckName}
            </h2>
          </div>
          <button
            onClick={onExit}
            className="p-2.5 rounded-full text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            title="Exit"
          >
            <X size={24} />
          </button>
        </div>

        {/* Completion Card */}
        <div className="w-full max-w-lg mx-auto bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl p-6 sm:p-10 text-center my-auto">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={36} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white mb-2">
            Deck Completed!
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mb-6">
            You reviewed all {cards.length} cards in <span className="font-semibold text-slate-800 dark:text-slate-200">{topic || deckName}</span>.
          </p>

          {totalRated > 0 && (
            <div className="grid grid-cols-4 gap-2 mb-8 p-3 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="text-center">
                <div className="text-xs font-semibold text-red-600 dark:text-red-400">Again</div>
                <div className="text-lg font-bold text-slate-800 dark:text-white">{counts.Again}</div>
              </div>
              <div className="text-center">
                <div className="text-xs font-semibold text-amber-600 dark:text-amber-400">Hard</div>
                <div className="text-lg font-bold text-slate-800 dark:text-white">{counts.Hard}</div>
              </div>
              <div className="text-center">
                <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Good</div>
                <div className="text-lg font-bold text-slate-800 dark:text-white">{counts.Good}</div>
              </div>
              <div className="text-center">
                <div className="text-xs font-semibold text-blue-600 dark:text-blue-400">Easy</div>
                <div className="text-lg font-bold text-slate-800 dark:text-white">{counts.Easy}</div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {onContinueToPractice && (
              <button
                id="flashcard-continue-to-practice-btn"
                onClick={onContinueToPractice}
                className="w-full py-4 px-4 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-md flex items-center justify-center gap-2 text-base cursor-pointer"
              >
                <span>Continue to Practice</span>
                <ArrowRight size={20} />
              </button>
            )}
            {hasDifficult && (
              <button
                onClick={restartDifficultOnly}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/50 hover:bg-amber-200 dark:hover:bg-amber-900/60 transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw size={18} />
                Review Difficult Cards ({counts.Again + counts.Hard})
              </button>
            )}
            <button
              onClick={restartStudy}
              className="w-full py-3.5 px-4 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <RotateCw size={18} />
              Study Deck Again
            </button>
            <button
              onClick={onExit}
              className="w-full py-3 px-4 rounded-xl font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors"
            >
              Back to Decks
            </button>
          </div>
        </div>

        <div className="w-full max-w-2xl mx-auto text-center py-4 text-xs text-slate-400">
          EduCore Zetadu Spaced Repetition Engine
        </div>
      </div>
    );
  }

  if (!currentCard) {
    return (
      <div className="fixed inset-0 z-[60] bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-slate-600 dark:text-slate-400 mb-4">No cards found in this study deck.</p>
          <button
            onClick={onExit}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold"
          >
            Return to Decks
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] bg-slate-50 dark:bg-slate-900 overflow-y-auto flex flex-col justify-between select-none">
      {/* Toast for Shuffle */}
      <AnimatePresence>
        {shuffleToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 z-[70] bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 px-4 py-2 rounded-full text-xs font-semibold shadow-lg flex items-center gap-2"
          >
            <Shuffle size={14} /> Deck order randomized
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOP BAR */}
      <header className="w-full max-w-3xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6">
        <div className="flex items-center justify-between gap-3 mb-3">
          {/* Subject & Topic */}
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 truncate">
              {subject || currentCard.subject || 'Biology'}
            </span>
            <h1 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white truncate">
              {topic || currentCard.topic || deckName || 'Cell Structure'}
            </h1>
          </div>

          {/* Action Buttons: Bookmark, Shuffle, Exit */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={handleBookmarkToggle}
              className={`p-2.5 rounded-full transition-colors ${
                currentCard.bookmarked
                  ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
              title={currentCard.bookmarked ? 'Remove Bookmark' : 'Bookmark Card'}
              aria-label="Bookmark card"
            >
              <Bookmark size={20} fill={currentCard.bookmarked ? 'currentColor' : 'none'} />
            </button>

            <button
              onClick={handleShuffle}
              className="p-2.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              title="Shuffle Cards"
              aria-label="Shuffle cards"
            >
              <Shuffle size={20} />
            </button>

            <button
              onClick={() => setShowExitModal(true)}
              className="p-2.5 rounded-full text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              title="Exit Study Session"
              aria-label="Exit study session"
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Card Counter & Visible Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>Card {currentIndex + 1} of {cards.length}</span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </header>

      {/* CENTER: ONE LARGE FLASHCARD WITH 3D FLIP */}
      <main className="w-full max-w-3xl mx-auto px-4 sm:px-6 my-auto py-4 flex flex-col items-center justify-center">
        <div className="w-full max-w-xl perspective-1000">
          <div 
            onClick={handleCardClick}
            className={`card-flip-container relative w-full h-[360px] sm:h-[420px] cursor-pointer ${
              isFlipped ? 'flipped' : ''
            }`}
            role="button"
            tabIndex={0}
            aria-label={isFlipped ? "Flashcard back showing answer. Tap to flip back." : "Flashcard front showing question. Tap to reveal answer."}
          >
            {/* FRONT FACE */}
            <div className="card-face card-face-front absolute inset-0 w-full h-full rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-md hover:shadow-lg transition-shadow p-6 sm:p-10 flex flex-col justify-between text-center overflow-hidden">
              <div className="flex items-center justify-between w-full">
                <span className="px-3 py-1 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-full text-xs font-bold uppercase tracking-wider">
                  Question
                </span>
                {currentCard.difficulty && (
                  <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                    {currentCard.difficulty}
                  </span>
                )}
              </div>

              {/* Main Question / Concept */}
              <div className="flex-1 flex flex-col items-center justify-center px-2 py-4">
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 dark:text-white leading-relaxed tracking-tight break-words max-h-[220px] sm:max-h-[260px] overflow-y-auto pr-1">
                  {currentCard.front}
                </p>
              </div>

              {/* Subtle flip prompt */}
              <div className="flex items-center justify-center gap-1.5 text-xs font-medium text-slate-400 dark:text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-700/60">
                <RotateCw size={14} className="animate-pulse text-blue-500" />
                <span>Tap card to reveal answer</span>
              </div>
            </div>

            {/* BACK FACE */}
            <div className="card-face card-face-back absolute inset-0 w-full h-full rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-md hover:shadow-lg transition-shadow p-6 sm:p-10 flex flex-col justify-between text-left overflow-hidden">
              <div className="flex items-center justify-between w-full shrink-0 mb-2">
                <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-bold uppercase tracking-wider">
                  Correct Answer
                </span>
                <span className="text-xs text-slate-400">
                  Tap to flip back
                </span>
              </div>

              {/* Scrollable Answer, Explanation, Example */}
              <div 
                className="flex-1 overflow-y-auto pr-2 space-y-4 my-auto py-2"
                onClick={(e) => {
                  // Allow scrolling and text selection without triggering unwanted flip
                  e.stopPropagation();
                }}
              >
                {/* Correct Answer */}
                <div className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white leading-snug break-words">
                  {currentCard.back}
                </div>

                {/* Explanation */}
                {currentCard.explanation && (
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Explanation
                    </span>
                    <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-1 leading-relaxed break-words">
                      {currentCard.explanation}
                    </p>
                  </div>
                )}

                {/* Example */}
                {currentCard.example && (
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 bg-blue-50/50 dark:bg-blue-950/20 p-3 rounded-xl">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      Example
                    </span>
                    <p className="text-sm text-slate-700 dark:text-slate-300 mt-1 italic break-words">
                      {currentCard.example}
                    </p>
                  </div>
                )}
              </div>

              {/* Subtle flip prompt */}
              <div className="flex items-center justify-center gap-1.5 text-xs font-medium text-slate-400 dark:text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-700/60 shrink-0">
                <RotateCw size={14} className="text-slate-400" />
                <span>Tap card to flip back</span>
              </div>
            </div>
          </div>
        </div>

        {/* LEARNING RATING BUTTONS (Shown ONLY after card is flipped) */}
        <div className="w-full max-w-xl mt-5 min-h-[58px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            {isFlipped ? (
              <motion.div 
                key="rating-buttons"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-4 gap-2 sm:gap-3 w-full"
              >
                {/* Again Button */}
                <button
                  onClick={(e) => { e.stopPropagation(); handleRatingSelect('Again'); }}
                  disabled={savingRating}
                  className="py-3 px-2 rounded-2xl font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 dark:bg-red-950/30 dark:border-red-900/50 dark:text-red-300 transition-all flex flex-col items-center justify-center touch-manipulation active:scale-95 disabled:opacity-50"
                  aria-label="Rate Again - repeat within 1 minute"
                >
                  <span className="text-sm sm:text-base">Again</span>
                  <span className="text-[10px] text-red-500/80 font-medium">&lt; 1m</span>
                </button>

                {/* Hard Button */}
                <button
                  onClick={(e) => { e.stopPropagation(); handleRatingSelect('Hard'); }}
                  disabled={savingRating}
                  className="py-3 px-2 rounded-2xl font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 dark:bg-amber-950/30 dark:border-amber-900/50 dark:text-amber-300 transition-all flex flex-col items-center justify-center touch-manipulation active:scale-95 disabled:opacity-50"
                  aria-label="Rate Hard - review in 10 minutes"
                >
                  <span className="text-sm sm:text-base">Hard</span>
                  <span className="text-[10px] text-amber-500/80 font-medium">10m</span>
                </button>

                {/* Good Button */}
                <button
                  onClick={(e) => { e.stopPropagation(); handleRatingSelect('Good'); }}
                  disabled={savingRating}
                  className="py-3 px-2 rounded-2xl font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-900/50 dark:text-emerald-300 transition-all flex flex-col items-center justify-center touch-manipulation active:scale-95 disabled:opacity-50"
                  aria-label="Rate Good - review in 1 day"
                >
                  <span className="text-sm sm:text-base">Good</span>
                  <span className="text-[10px] text-emerald-500/80 font-medium">1d</span>
                </button>

                {/* Easy Button */}
                <button
                  onClick={(e) => { e.stopPropagation(); handleRatingSelect('Easy'); }}
                  disabled={savingRating}
                  className="py-3 px-2 rounded-2xl font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 dark:bg-blue-950/30 dark:border-blue-900/50 dark:text-blue-300 transition-all flex flex-col items-center justify-center touch-manipulation active:scale-95 disabled:opacity-50"
                  aria-label="Rate Easy - review in 4 days"
                >
                  <span className="text-sm sm:text-base">Easy</span>
                  <span className="text-[10px] text-blue-500/80 font-medium">4d</span>
                </button>
              </motion.div>
            ) : (
              <motion.div 
                key="flip-hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xs text-slate-400 dark:text-slate-500 font-medium"
              >
                Tap card to reveal answer & rate your memory
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* BOTTOM NAVIGATION: PREVIOUS & NEXT CARD */}
      <footer className="w-full max-w-3xl mx-auto px-4 sm:px-6 pb-6 pt-2">
        <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-4">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors ${
              currentIndex === 0
                ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
                : 'text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <ArrowLeft size={18} />
            <span>Previous Card</span>
          </button>

          <div className="text-xs font-semibold text-slate-400">
            {currentIndex + 1} / {cards.length}
          </div>

          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <span>{currentIndex === cards.length - 1 ? 'Finish' : 'Next Card'}</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </footer>

      {/* EXIT CONFIRMATION MODAL */}
      <AnimatePresence>
        {showExitModal && (
          <div className="fixed inset-0 z-[80] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mx-auto text-slate-600 dark:text-slate-300">
                <AlertCircle size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                End Study Session?
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Your progress on completed cards has already been saved. Would you like to exit to the decks page?
              </p>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowExitModal(false)}
                  className="flex-1 py-3 px-4 rounded-xl font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                  Keep Studying
                </button>
                <button
                  onClick={() => {
                    setShowExitModal(false);
                    onExit();
                  }}
                  className="flex-1 py-3 px-4 rounded-xl font-semibold text-white bg-rose-600 hover:bg-rose-700 transition-colors"
                >
                  Exit Session
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
