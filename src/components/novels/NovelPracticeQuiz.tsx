import React, { useState } from 'react';
import { Novel, NovelPracticeQuestion } from '../../types';
import {
  X,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Trophy,
  BookOpen,
  Award,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

interface NovelPracticeQuizProps {
  novel: Novel;
  onClose: () => void;
  onSaveScore?: (score: { correct: number; total: number; percentage: number }) => void;
}

export default function NovelPracticeQuiz({ novel, onClose, onSaveScore }: NovelPracticeQuizProps) {
  const questions = novel.practiceQuestions || [];

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showExplanationMap, setShowExplanationMap] = useState<Record<number, boolean>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  if (questions.length === 0) {
    return (
      <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
        <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 text-center">
          <HelpCircle size={48} className="mx-auto text-amber-500 mb-4" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Practice Questions Coming Soon
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            Our JAMB examination editorial team is finalizing authenticated CBT questions for {novel.title}.
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm"
          >
            Back to Study Materials
          </button>
        </div>
      </div>
    );
  }

  const currentQ: NovelPracticeQuestion = questions[currentIndex];
  const userSelected = selectedAnswers[currentIndex];
  const isAnswered = userSelected !== undefined;
  const isCorrect = userSelected === currentQ.correctAnswer;
  const showExplanation = showExplanationMap[currentIndex] || isSubmitted;

  // Calculate stats
  const totalAnswered = Object.keys(selectedAnswers).length;
  const correctCount = questions.reduce((acc, q, idx) => {
    return acc + (selectedAnswers[idx] === q.correctAnswer ? 1 : 0);
  }, 0);
  const scorePercent = Math.round((correctCount / questions.length) * 100);

  const handleSelectOption = (optIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [currentIndex]: optIndex }));
    // Auto show explanation after answering
    setShowExplanationMap((prev) => ({ ...prev, [currentIndex]: true }));
  };

  const handleFinishQuiz = () => {
    setIsSubmitted(true);
    if (onSaveScore) {
      onSaveScore({
        correct: correctCount,
        total: questions.length,
        percentage: scorePercent
      });
    }
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setShowExplanationMap({});
    setIsSubmitted(false);
    setCurrentIndex(0);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fade-in overflow-y-auto">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden my-auto max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                {novel.subject}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300">
                UTME CBT Practice
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white line-clamp-1">
              {novel.title} — Practice Drill
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Quiz Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* Progress Tracker */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
              <span>
                Question {currentIndex + 1} of {questions.length}
              </span>
              <span>
                Answered: {totalAnswered}/{questions.length}
              </span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-full transition-all duration-300 rounded-full"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* If Result Summary is Shown */}
          {isSubmitted ? (
            <div className="p-6 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border-2 border-blue-200 dark:border-blue-800 text-center space-y-4 animate-fade-in">
              <div className="w-16 h-16 mx-auto rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg">
                <Trophy size={32} />
              </div>
              <div>
                <h4 className="text-xl font-black text-slate-900 dark:text-white">
                  Practice Assessment Complete!
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                  You scored <strong className="text-blue-600 dark:text-blue-400">{correctCount}</strong> out of{' '}
                  <strong>{questions.length}</strong> questions ({scorePercent}%)
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleResetQuiz}
                  className="px-5 py-2.5 rounded-xl border-2 border-slate-300 dark:border-slate-700 hover:border-slate-400 font-bold text-xs text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-all"
                >
                  <RotateCcw size={14} />
                  <span>Retry Test</span>
                </button>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-xs text-white flex items-center gap-1.5 shadow-md transition-all"
                >
                  <BookOpen size={14} />
                  <span>Review Answers & Explanations</span>
                </button>
              </div>
            </div>
          ) : null}

          {/* Question Card */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {currentQ.topic && (
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  Topic: {currentQ.topic}
                </span>
              )}
              {currentQ.year && (
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  UTME {currentQ.year}
                </span>
              )}
            </div>

            <h4 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white leading-relaxed">
              {currentQ.question}
            </h4>

            {/* Options List */}
            <div className="space-y-2.5 pt-2">
              {currentQ.options.map((opt, optIdx) => {
                let btnStyle = 'border-slate-200 dark:border-slate-750 hover:border-blue-300 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200';

                if (isAnswered) {
                  if (optIdx === currentQ.correctAnswer) {
                    btnStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-bold shadow-sm';
                  } else if (userSelected === optIdx) {
                    btnStyle = 'border-red-400 bg-red-50 dark:bg-red-950/40 text-red-900 dark:text-red-200 font-medium';
                  } else {
                    btnStyle = 'opacity-60 border-slate-200 dark:border-slate-800 text-slate-500';
                  }
                }

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border-2 transition-all flex items-start justify-between gap-3 text-sm leading-snug ${btnStyle}`}
                  >
                    <span className="flex-1">{opt}</span>
                    {isAnswered && optIdx === currentQ.correctAnswer && (
                      <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    )}
                    {isAnswered && userSelected === optIdx && optIdx !== currentQ.correctAnswer && (
                      <XCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Answer Explanation */}
            {showExplanation && (
              <div className="mt-4 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300 space-y-1.5 animate-fade-in">
                <div className="flex items-center gap-1.5 text-amber-800 dark:text-amber-300 font-extrabold">
                  <Award size={16} />
                  <span>JAMB Examination Explanation</span>
                </div>
                <p className="leading-relaxed">{currentQ.explanation}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1 disabled:opacity-40 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Previous</span>
          </button>

          {/* Jump Bubbles */}
          <div className="hidden sm:flex items-center gap-1.5">
            {questions.map((_, idx) => {
              const answered = selectedAnswers[idx] !== undefined;
              const isCurr = idx === currentIndex;
              return (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                    isCurr
                      ? 'bg-blue-600 text-white ring-2 ring-blue-400'
                      : answered
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300'
                      : 'bg-slate-200 dark:bg-slate-750 text-slate-600 dark:text-slate-400 hover:bg-slate-300'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            {currentIndex < questions.length - 1 ? (
              <button
                onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition-all"
              >
                <span>Next</span>
                <ArrowRight size={14} />
              </button>
            ) : !isSubmitted ? (
              <button
                onClick={handleFinishQuiz}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition-all"
              >
                <CheckCircle2 size={14} />
                <span>Submit CBT</span>
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs"
              >
                Done
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
