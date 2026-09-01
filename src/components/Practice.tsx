import React, { useState } from 'react';
import Quiz from './Quiz';
import Flashcards from './Flashcards';
import { motion } from 'motion/react';
import { BrainCircuit, Sparkles, BookOpen } from 'lucide-react';

export default function Practice() {
  const [mode, setMode] = useState<'launchpad' | 'quiz' | 'flashcards'>('launchpad');

  if (mode === 'quiz') {
    return <Quiz onBack={() => setMode('launchpad')} />;
  }

  if (mode === 'flashcards') {
    return <Flashcards onBack={() => setMode('launchpad')} />;
  }

  return (
    <div className="w-full max-w-7xl mx-auto pb-12 flex flex-col min-h-[80vh]">
      <div className="mb-12">
        <p className="text-sm font-bold tracking-widest text-blue-600 dark:text-blue-400 uppercase mb-2">
          Practice Hub
        </p>
        <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Choose Your Study Mode</h2>
        <p className="text-slate-600 dark:text-slate-400 mt-4 text-lg max-w-2xl">
          Select a practice mode below to start studying. Test your knowledge with an interactive quiz or generate custom flashcards from your notes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.button
          whileHover={{ y: -5 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setMode('quiz')}
          className="text-left bg-white dark:bg-slate-800 rounded-3xl p-8 border-2 border-slate-100 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform">
            <BrainCircuit size={120} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-2xl flex items-center justify-center mb-6 relative z-10">
            <BrainCircuit size={32} />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 relative z-10">
            Interactive Quiz
          </h3>
          <p className="text-slate-600 dark:text-slate-400 text-lg relative z-10">
            Test your knowledge with multiple-choice questions across various subjects and difficulty levels. Receive AI-powered explanations for every answer.
          </p>
        </motion.button>

        <motion.button
          whileHover={{ y: -5 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setMode('flashcards')}
          className="text-left bg-white dark:bg-slate-800 rounded-3xl p-8 border-2 border-slate-100 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-600 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform">
            <Sparkles size={120} className="text-purple-600 dark:text-purple-400" />
          </div>
          <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-2xl flex items-center justify-center mb-6 relative z-10">
            <Sparkles size={32} />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 relative z-10">
            AI Flashcards
          </h3>
          <p className="text-slate-600 dark:text-slate-400 text-lg relative z-10">
            Paste your study notes or lecture transcripts and let Gemini automatically generate interactive flashcards for active recall practice.
          </p>
        </motion.button>
      </div>
    </div>
  );
}
