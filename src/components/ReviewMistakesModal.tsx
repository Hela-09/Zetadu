import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  MessageSquare, 
  RotateCcw, 
  Check, 
  Sparkles,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { ViewType } from '../types';
import { TopicResultSummary, TopicMistakeDetail } from '../utils/weakTopics';

interface ReviewMistakesModalProps {
  topicSummary: TopicResultSummary | null;
  onClose: () => void;
  onCompleteReview: () => void;
  setView: (view: ViewType) => void;
}

export default function ReviewMistakesModal({
  topicSummary,
  onClose,
  onCompleteReview,
  setView
}: ReviewMistakesModalProps) {
  if (!topicSummary) return null;

  const [reviewedIndices, setReviewedIndices] = useState<Record<number, boolean>>({});

  const mistakes: TopicMistakeDetail[] = (topicSummary.mistakeDetails && topicSummary.mistakeDetails.length > 0)
    ? topicSummary.mistakeDetails
    : (topicSummary.mistakes || []).map(m => ({ question: m }));

  const toggleReviewed = (index: number) => {
    setReviewedIndices(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleAskTutor = (mistake: TopicMistakeDetail) => {
    localStorage.setItem('zetadu_target_subject', topicSummary.subject);
    localStorage.setItem('zetadu_target_topic', topicSummary.topic);
    
    let prompt = `I made a mistake in ${topicSummary.subject} on ${topicSummary.topic}. Question: "${mistake.question}"`;
    if (mistake.correctAnswer !== undefined) {
      prompt += ` The correct answer is: "${mistake.correctAnswer}".`;
    }
    if (mistake.explanation) {
      prompt += ` Explanation: "${mistake.explanation}".`;
    }
    prompt += ` Can you help me understand why this answer is correct and how to solve problems like this step-by-step?`;
    
    localStorage.setItem('zetadu_tutor_prompt', prompt);
    onCompleteReview();
    onClose();
    setView('tutor');
  };

  const handleFinishReview = () => {
    onCompleteReview();
    onClose();
  };

  const handleStartRetest = () => {
    localStorage.removeItem('practice_session');
    localStorage.setItem('zetadu_target_topic', topicSummary.topic);
    localStorage.setItem('zetadu_target_subject', topicSummary.subject);
    localStorage.setItem('zetadu_target_subject_id', topicSummary.subjectId);
    onCompleteReview();
    onClose();
    setView('practice');
  };

  return (
    <div
      id="review-mistakes-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div
        id="review-mistakes-modal-card"
        className="bg-white dark:bg-slate-900 w-full max-w-2xl max-h-[90vh] rounded-3xl border-2 border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 border border-rose-100 dark:border-rose-900/50">
              <RotateCcw size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300">
                  Mistake Review • {topicSummary.accuracy}% Accuracy
                </span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {topicSummary.subject}
                </span>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Review Mistakes in {topicSummary.topic}
              </h3>
            </div>
          </div>
          <button
            id="close-mistake-review-modal-btn"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Diagnostic Banner */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-600 dark:text-slate-300 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span>
            {topicSummary.incorrectCount} missed questions recorded out of {topicSummary.totalQuestions} attempted.
          </span>
          <span className="font-semibold text-rose-600 dark:text-rose-400">
            Daily Study Task
          </span>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {mistakes.length > 0 ? (
            <div className="space-y-4">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Study the questions you missed and verify explanations:
              </p>
              
              {mistakes.map((m, idx) => {
                const isChecked = !!reviewedIndices[idx];
                return (
                  <div
                    key={`mistake-${idx}`}
                    className={`p-4 rounded-2xl border-2 transition-all ${
                      isChecked
                        ? 'border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/40 dark:bg-emerald-950/20'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-850'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300">
                          Missed #{idx + 1}
                        </span>
                        {isChecked && (
                          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <Check size={12} /> Understood
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => toggleReviewed(idx)}
                        className={`text-xs px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                          isChecked
                            ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-emerald-100 dark:hover:bg-emerald-900'
                        }`}
                      >
                        {isChecked ? 'Marked Understood' : 'Mark as Understood'}
                      </button>
                    </div>

                    <p className="text-sm font-bold text-slate-900 dark:text-white mb-2 leading-relaxed">
                      {m.question}
                    </p>

                    {/* Options list if available */}
                    {m.options && m.options.length > 0 && (
                      <div className="space-y-1 mb-3 text-xs">
                        {m.options.map((opt, oIdx) => {
                          const isCorrectOpt = m.correctAnswer === oIdx || m.correctAnswer === opt;
                          const isUserOpt = m.userAnswer === oIdx || m.userAnswer === opt;
                          return (
                            <div
                              key={`opt-${oIdx}`}
                              className={`p-2 rounded-lg flex items-center justify-between ${
                                isCorrectOpt
                                  ? 'bg-emerald-100/70 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200 font-semibold'
                                  : isUserOpt
                                  ? 'bg-rose-100/70 dark:bg-rose-900/40 text-rose-800 dark:text-rose-200 line-through'
                                  : 'bg-white/60 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                              }`}
                            >
                              <span>{opt}</span>
                              {isCorrectOpt && (
                                <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">
                                  Correct Answer
                                </span>
                              )}
                              {isUserOpt && !isCorrectOpt && (
                                <span className="text-[10px] uppercase font-bold text-rose-600 dark:text-rose-400">
                                  Your Answer
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {m.explanation && (
                      <div className="p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 text-xs text-blue-900 dark:text-blue-200 mb-3">
                        <span className="font-bold block mb-1">Explanation:</span>
                        <span>{m.explanation}</span>
                      </div>
                    )}

                    <button
                      onClick={() => handleAskTutor(m)}
                      className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-1.5 cursor-pointer"
                    >
                      <MessageSquare size={13} />
                      <span>Ask AI Tutor to explain this question</span>
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <BookOpen size={24} />
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-base">
                Ready to review concepts in {topicSummary.topic}?
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                Review key formulas, test your weak areas, or ask the AI Tutor for a diagnostic walkthrough of common pitfall traps.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={handleStartRetest}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-all cursor-pointer"
                >
                  Practice Questions Now
                </button>
                <button
                  onClick={() => handleAskTutor({ question: `Key concepts and common pitfalls in ${topicSummary.topic}` })}
                  className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs hover:bg-slate-300 transition-all cursor-pointer"
                >
                  Ask AI Tutor Walkthrough
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Clicking complete marks today's task as finished.
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="complete-mistake-review-btn"
              onClick={handleFinishReview}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 size={16} />
              <span>Complete Review</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
