import React from 'react';
import { AlertTriangle, Activity, CheckCircle } from 'lucide-react';
import { StudentTopicAnalysis } from '../utils/weakTopics';

interface MasterySummaryBannerProps {
  topicAnalysis: StudentTopicAnalysis | null;
  showDetailedBreakdown: boolean;
  onToggleDetailedBreakdown: () => void;
}

export default function MasterySummaryBanner({
  topicAnalysis,
  showDetailedBreakdown,
  onToggleDetailedBreakdown,
}: MasterySummaryBannerProps) {
  const weakCount = topicAnalysis?.weakTopics.length || 0;
  const avgCount = topicAnalysis?.averageTopics.length || 0;
  const strongCount = topicAnalysis?.strongTopics.length || 0;
  const total = weakCount + avgCount + strongCount;

  return (
    <div 
      id="mastery-summary-banner" 
      className="bg-slate-50/70 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-4 sm:p-5 mb-5 space-y-4"
    >
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
          Mastery Breakdown
        </span>
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          {total} Topics Evaluated
        </span>
      </div>

      {/* Metric Indicators */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 flex-wrap">
        <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300 flex items-center gap-1.5 shrink-0 border border-rose-200 dark:border-rose-800/60">
          <AlertTriangle size={13} />
          <span>Weak: {weakCount} (&lt;50%)</span>
        </span>
        <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 flex items-center gap-1.5 shrink-0 border border-amber-200 dark:border-amber-800/60">
          <Activity size={13} />
          <span>Average: {avgCount} (50-74%)</span>
        </span>
        <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5 shrink-0 border border-emerald-200 dark:border-emerald-800/60">
          <CheckCircle size={13} />
          <span>Strong: {strongCount} (&ge;75%)</span>
        </span>
      </div>

      {/* Progress Distribution Bar */}
      {(() => {
        if (total === 0) {
          return (
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
              <div className="h-full bg-slate-300 dark:bg-slate-600 rounded-full w-full" />
            </div>
          );
        }
        const weakPct = (weakCount / total) * 100;
        const avgPct = (avgCount / total) * 100;
        const strongPct = (strongCount / total) * 100;
        return (
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden flex shadow-2xs">
            <div 
              style={{ width: `${strongPct}%` }} 
              className="bg-emerald-500 h-full transition-all" 
              title={`Strong: ${Math.round(strongPct)}%`} 
            />
            <div 
              style={{ width: `${avgPct}%` }} 
              className="bg-amber-500 h-full transition-all" 
              title={`Average: ${Math.round(avgPct)}%`} 
            />
            <div 
              style={{ width: `${weakPct}%` }} 
              className="bg-rose-500 h-full transition-all" 
              title={`Weak: ${Math.round(weakPct)}%`} 
            />
          </div>
        );
      })()}

      {/* High-Level Status & Optional View Details Trigger */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
        <span>
          {topicAnalysis?.hasResults
            ? (weakCount > 0
                ? `${weakCount} topic${weakCount === 1 ? '' : 's'} require targeted reinforcement.`
                : 'Great job! No weak topics identified in your recent sessions.')
            : 'Complete a practice quiz to view personalized topic mastery.'}
        </span>
        {!showDetailedBreakdown && (
          <button
            onClick={onToggleDetailedBreakdown}
            className="text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer shrink-0 ml-2"
          >
            View Details &rarr;
          </button>
        )}
      </div>
    </div>
  );
}
