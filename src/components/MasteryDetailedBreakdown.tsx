import React from 'react';
import { Target, Activity, CheckCircle, ChevronRight } from 'lucide-react';
import { StudentTopicAnalysis, TopicResultSummary } from '../utils/weakTopics';

interface MasteryDetailedBreakdownProps {
  topicAnalysis: StudentTopicAnalysis | null;
  onSelectTopic: (topic: TopicResultSummary) => void;
}

export default function MasteryDetailedBreakdown({
  topicAnalysis,
  onSelectTopic,
}: MasteryDetailedBreakdownProps) {
  const weakTopics = topicAnalysis?.weakTopics || [];
  const averageTopics = topicAnalysis?.averageTopics || [];
  const strongTopics = topicAnalysis?.strongTopics || [];

  return (
    <div 
      id="granular-mastery-analysis" 
      className="flex flex-col gap-8 animate-in fade-in duration-200 pt-2 border-t border-slate-100 dark:border-slate-700/60"
    >
      {/* Weak Subjects & Topics (<50%) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Target size={18} className="text-rose-500" />
            <span>Weak Topics</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900">
              &lt; 50%
            </span>
          </h3>
          <span className="text-xs text-slate-400 hidden sm:inline">
            Click any weak topic to practice, review cards, or ask tutor
          </span>
        </div>

        {weakTopics.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {weakTopics.map((topic, i) => (
              <div
                key={`weak-${i}`}
                id={`weak-topic-item-${i}`}
                onClick={() => onSelectTopic(topic)}
                className="group flex flex-col justify-between bg-rose-50/40 dark:bg-rose-950/20 hover:bg-rose-50 dark:hover:bg-rose-950/40 p-4 rounded-2xl border-2 border-rose-200/80 dark:border-rose-900/60 hover:border-rose-500 dark:hover:border-rose-500 transition-all cursor-pointer shadow-xs"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block truncate">
                      {topic.subject}
                    </span>
                    <span 
                      className="font-bold text-slate-900 dark:text-white truncate block text-sm group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors" 
                      title={topic.topic}
                    >
                      {topic.topic}
                    </span>
                  </div>
                  <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800 shrink-0">
                    {topic.accuracy}%
                  </span>
                </div>

                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 mb-2 overflow-hidden">
                  <div 
                    className="h-full bg-rose-500 rounded-full" 
                    style={{ width: `${Math.max(6, topic.accuracy)}%` }} 
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span>
                    {topic.correctCount}/{topic.totalQuestions} correct ({topic.incorrectCount} missed)
                  </span>
                  <span className="font-bold text-rose-600 dark:text-rose-400 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>Take Action</span>
                    <ChevronRight size={13} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 text-slate-500 text-xs italic">
            {topicAnalysis?.hasResults
              ? 'No weak topics identified! You are performing at or above 50% in all tested topics.'
              : 'No practice results yet. Complete a quiz to analyze weak topics.'}
          </div>
        )}
      </div>

      {/* Average Subjects & Topics (50% - 74%) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Activity size={18} className="text-amber-500" />
            <span>Average Topics</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900">
              50% - 74%
            </span>
          </h3>
        </div>

        {averageTopics.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {averageTopics.map((topic, i) => (
              <div
                key={`avg-${i}`}
                id={`avg-topic-item-${i}`}
                onClick={() => onSelectTopic(topic)}
                className="group flex flex-col justify-between bg-slate-50/70 dark:bg-slate-900/50 hover:bg-slate-100/70 dark:hover:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-amber-400 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block truncate">
                      {topic.subject}
                    </span>
                    <span className="font-bold text-slate-800 dark:text-white truncate block text-sm" title={topic.topic}>
                      {topic.topic}
                    </span>
                  </div>
                  <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800 shrink-0">
                    {topic.accuracy}%
                  </span>
                </div>

                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 mb-2 overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${topic.accuracy}%` }} />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span>{topic.correctCount}/{topic.totalQuestions} questions correct</span>
                  <span className="font-semibold text-amber-600 dark:text-amber-400">Review</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 text-slate-500 text-xs italic">
            No average topics identified yet.
          </div>
        )}
      </div>

      {/* Strong Subjects & Topics (>=75%) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <CheckCircle size={18} className="text-emerald-500" />
            <span>Strong Topics</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900">
              &ge; 75%
            </span>
          </h3>
        </div>

        {strongTopics.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {strongTopics.map((topic, i) => (
              <div
                key={`strong-${i}`}
                id={`strong-topic-item-${i}`}
                onClick={() => onSelectTopic(topic)}
                className="group flex flex-col justify-between bg-slate-50/70 dark:bg-slate-900/50 hover:bg-slate-100/70 dark:hover:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-emerald-400 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block truncate">
                      {topic.subject}
                    </span>
                    <span className="font-bold text-slate-800 dark:text-white truncate block text-sm" title={topic.topic}>
                      {topic.topic}
                    </span>
                  </div>
                  <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 shrink-0">
                    {topic.accuracy}%
                  </span>
                </div>

                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 mb-2 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${topic.accuracy}%` }} />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span>{topic.correctCount}/{topic.totalQuestions} questions correct</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">Mastered</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 text-slate-500 text-xs italic">
            No strong topics identified yet.
          </div>
        )}
      </div>
    </div>
  );
}
