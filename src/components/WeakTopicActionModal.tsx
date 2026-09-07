import React from 'react';
import { TopicResultSummary } from '../utils/weakTopics';
import { ViewType } from '../types';
import { PenTool, Layers, MessageSquare, X, AlertTriangle, ArrowRight } from 'lucide-react';

interface WeakTopicActionModalProps {
  topic: TopicResultSummary | null;
  onClose: () => void;
  setView: (view: ViewType) => void;
}

export default function WeakTopicActionModal({
  topic,
  onClose,
  setView
}: WeakTopicActionModalProps) {
  if (!topic) return null;

  const handlePractice = () => {
    localStorage.removeItem('practice_session');
    localStorage.setItem('zetadu_target_topic', topic.topic);
    localStorage.setItem('zetadu_target_subject', topic.subject);
    localStorage.setItem('zetadu_target_subject_id', topic.subjectId);
    onClose();
    setView('practice');
  };

  const handleFlashcards = () => {
    localStorage.setItem('zetadu_target_topic', topic.topic);
    localStorage.setItem('zetadu_target_subject', topic.subject);
    localStorage.setItem('zetadu_flashcard_topic', topic.topic);
    onClose();
    setView('flashcards');
  };

  const handleAskTutor = () => {
    localStorage.setItem('zetadu_target_subject', topic.subject);
    localStorage.setItem('zetadu_target_topic', topic.topic);
    const prompt = `I'm struggling with ${topic.topic} in ${topic.subject} (my practice accuracy was ${topic.accuracy}%). Can you explain the core concepts step-by-step and show me how to avoid common mistakes?`;
    localStorage.setItem('zetadu_tutor_prompt', prompt);
    onClose();
    setView('tutor');
  };

  return (
    <div
      id="weak-topic-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div
        id="weak-topic-modal-card"
        className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl border-2 border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 border border-rose-100 dark:border-rose-900/50">
              <AlertTriangle size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300">
                  Weak Topic • {topic.accuracy}% Accuracy
                </span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {topic.subject}
                </span>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {topic.topic}
              </h3>
            </div>
          </div>
          <button
            id="close-weak-topic-modal-btn"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Performance Context */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-600 dark:text-slate-300 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span>
            Based on {topic.totalQuestions} questions attempted ({topic.correctCount} correct, {topic.incorrectCount} missed)
          </span>
          <span className="font-semibold text-rose-600 dark:text-rose-400">
            Needs attention
          </span>
        </div>

        {/* Action Options */}
        <div className="p-6 flex flex-col gap-3">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Choose how you'd like to improve this topic:
          </p>

          {/* Option 1: Practice */}
          <button
            id="weak-topic-practice-btn"
            onClick={handlePractice}
            className="w-full flex items-center justify-between p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50/40 dark:hover:bg-blue-950/20 text-left transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <PenTool size={20} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  Practice
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Answer targeted questions to drill concepts and boost accuracy
                </p>
              </div>
            </div>
            <ArrowRight size={18} className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0" />
          </button>

          {/* Option 2: Study Flashcards */}
          <button
            id="weak-topic-flashcards-btn"
            onClick={handleFlashcards}
            className="w-full flex items-center justify-between p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/20 text-left transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Layers size={20} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  Study Flashcards
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Review key definitions, formulas, and flashcard memory drills
                </p>
              </div>
            </div>
            <ArrowRight size={18} className="text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all shrink-0" />
          </button>

          {/* Option 3: Ask AI Tutor */}
          <button
            id="weak-topic-tutor-btn"
            onClick={handleAskTutor}
            className="w-full flex items-center justify-between p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20 text-left transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <MessageSquare size={20} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  Ask AI Tutor
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Get step-by-step explanations and clear up confusing topics
                </p>
              </div>
            </div>
            <ArrowRight size={18} className="text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all shrink-0" />
          </button>
        </div>

        {/* Footer */}
        <div className="p-4 px-6 bg-slate-50 dark:bg-slate-850 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
