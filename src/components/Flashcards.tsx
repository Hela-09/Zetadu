import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Sparkles, BookOpen, ChevronLeft, ChevronRight, Loader2, RotateCcw } from 'lucide-react';

interface Flashcard {
  front: string;
  back: string;
}

export default function Flashcards({ onBack }: { onBack: () => void }) {
  const { getToken } = useAuth();
  const [inputText, setInputText] = useState('');
  const [count, setCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    
    setLoading(true);
    try {
      const token = await getToken();
      const response = await fetch('/api/generate-flashcards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          text: inputText,
          count: count
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate flashcards');
      }

      const data = await response.json();
      if (data.flashcards && data.flashcards.length > 0) {
        setFlashcards(data.flashcards);
        setCurrentIndex(0);
        setIsFlipped(false);
      }
    } catch (error) {
      console.error("Error generating flashcards:", error);
      alert("There was an error generating flashcards. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const nextCard = () => {
    if (currentIndex < flashcards.length - 1) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(prev => prev + 1), 150);
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(prev => prev - 1), 150);
    }
  };

  const resetGenerator = () => {
    setFlashcards([]);
    setInputText('');
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  if (flashcards.length > 0) {
    return (
      <div className="w-full max-w-4xl mx-auto pb-12 flex flex-col items-center">
        <div className="w-full flex items-center justify-between mb-8">
          <button onClick={() => onBack()} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div className="flex items-center gap-2">
            <span className="px-4 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full font-bold text-sm">
              {currentIndex + 1} / {flashcards.length}
            </span>
          </div>
          <button onClick={resetGenerator} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors" title="Create New">
            <RotateCcw size={20} />
          </button>
        </div>

        <div className="w-full max-w-2xl relative h-[400px] perspective-1000">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex + (isFlipped ? '-back' : '-front')}
              initial={{ rotateX: isFlipped ? -90 : 90, opacity: 0 }}
              animate={{ rotateX: 0, opacity: 1 }}
              exit={{ rotateX: isFlipped ? 90 : -90, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 cursor-pointer"
              onClick={() => setIsFlipped(!isFlipped)}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className={`w-full h-full rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-xl border-2 ${
                isFlipped 
                  ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800' 
                  : 'bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-700'
              }`}>
                <span className="text-sm font-bold tracking-widest uppercase mb-6 text-slate-400">
                  {isFlipped ? 'Answer' : 'Question'}
                </span>
                <p className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white leading-tight">
                  {isFlipped ? flashcards[currentIndex].back : flashcards[currentIndex].front}
                </p>
                <div className="absolute bottom-6 text-sm text-slate-400 font-medium flex items-center gap-2">
                  <RotateCcw size={14} /> Click to flip
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-6 mt-10">
          <button 
            onClick={prevCard} 
            disabled={currentIndex === 0}
            className="w-14 h-14 rounded-full flex items-center justify-center bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={24} className="text-slate-700 dark:text-slate-300" />
          </button>
          
          <button 
            onClick={nextCard} 
            disabled={currentIndex === flashcards.length - 1}
            className="w-14 h-14 rounded-full flex items-center justify-center bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={24} className="text-slate-700 dark:text-slate-300" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto pb-12 flex flex-col">
      <div className="mb-8 flex items-center gap-4">
        <button onClick={() => onBack()} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div>
          <p className="text-sm font-bold tracking-widest text-purple-600 dark:text-purple-400 uppercase mb-1">
            Flashcard Generator
          </p>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Convert Notes to Flashcards</h2>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-8 border-2 border-slate-100 dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-3 mb-6 p-4 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-2xl">
          <Sparkles size={24} />
          <p className="font-medium text-sm md:text-base">Paste your study notes, lecture transcripts, or any learning material below, and Gemini AI will instantly turn them into interactive flashcards.</p>
        </div>

        <form onSubmit={handleGenerate} className="flex flex-col gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Study Material / Notes</label>
            <textarea 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste your text here (e.g., 'Mitochondria is the powerhouse of the cell...')"
              className="w-full h-48 p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-purple-500 focus:border-purple-500 outline-none transition-all resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Number of Flashcards</label>
            <select 
              value={count} 
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-full p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
            >
              <option value={5}>5 Flashcards</option>
              <option value={10}>10 Flashcards</option>
              <option value={15}>15 Flashcards</option>
              <option value={20}>20 Flashcards</option>
            </select>
          </div>

          <button 
            type="submit" 
            disabled={loading || !inputText.trim()}
            className="w-full py-4 mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl transition-all shadow-md hover:shadow-lg disabled:opacity-70 flex items-center justify-center gap-3 text-lg"
          >
            {loading ? (
              <>
                <Loader2 size={24} className="animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles size={24} />
                Generate Flashcards
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
