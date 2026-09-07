import React, { useState } from 'react';
import { 
  Calendar, 
  CheckCircle2, 
  Circle, 
  Layers, 
  PenTool, 
  RotateCcw, 
  ArrowRight, 
  Target, 
  Sparkles, 
  AlertTriangle,
  Flame,
  Check,
  RefreshCw
} from 'lucide-react';
import { ViewType, DailyStudyPlan, DailyStudyTask } from '../types';
import { toggleDailyTaskCompleted } from '../utils/dailyStudyPlan';
import { TopicResultSummary } from '../utils/weakTopics';

interface DailyStudyPlanCardProps {
  plan: DailyStudyPlan | null;
  loading: boolean;
  topicSummary: TopicResultSummary | null;
  onRefresh: () => void;
  onOpenMistakeReview: () => void;
  setView: (view: ViewType) => void;
  onPlanUpdated: (updatedPlan: DailyStudyPlan) => void;
}

export default function DailyStudyPlanCard({
  plan,
  loading,
  topicSummary,
  onRefresh,
  onOpenMistakeReview,
  setView,
  onPlanUpdated
}: DailyStudyPlanCardProps) {
  const [togglingId, setTogglingId] = useState<string | null>(null);

  if (loading && !plan) {
    return (
      <div 
        id="daily-study-plan-loading"
        className="bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-3xl p-6 md:p-8 animate-pulse"
      >
        <div className="h-6 w-48 bg-slate-200 dark:bg-slate-700 rounded-lg mb-3"></div>
        <div className="h-4 w-64 bg-slate-100 dark:bg-slate-750 rounded-lg mb-6"></div>
        <div className="space-y-4">
          <div className="h-20 bg-slate-50 dark:bg-slate-850 rounded-2xl"></div>
          <div className="h-20 bg-slate-50 dark:bg-slate-850 rounded-2xl"></div>
          <div className="h-20 bg-slate-50 dark:bg-slate-850 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  if (!plan) return null;

  const progressPercent = plan.totalTasks > 0
    ? Math.round((plan.completedCount / plan.totalTasks) * 100)
    : 0;

  // Format today's date nicely
  const dateObj = new Date();
  const formattedDate = dateObj.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  const handleToggleTask = async (e: React.MouseEvent, taskId: string) => {
    e.stopPropagation();
    if (!plan || togglingId) return;
    setTogglingId(taskId);
    try {
      const updated = await toggleDailyTaskCompleted(plan, taskId);
      onPlanUpdated(updated);
    } catch (err) {
      console.warn("Failed to toggle task:", err);
    } finally {
      setTogglingId(null);
    }
  };

  const handleExecuteTask = (task: DailyStudyTask) => {
    if (task.type === 'flashcards') {
      if (task.topic) {
        localStorage.setItem('zetadu_target_topic', task.topic);
        localStorage.setItem('zetadu_flashcard_topic', task.topic);
      }
      if (task.subject) {
        localStorage.setItem('zetadu_target_subject', task.subject);
      }
      setView('flashcards');
    } else if (task.type === 'questions') {
      localStorage.removeItem('practice_session');
      if (task.topic) {
        localStorage.setItem('zetadu_target_topic', task.topic);
      }
      if (task.subject) {
        localStorage.setItem('zetadu_target_subject', task.subject);
      }
      if (task.subjectId) {
        localStorage.setItem('zetadu_target_subject_id', task.subjectId);
      }
      setView('practice');
    } else if (task.type === 'review_mistakes') {
      onOpenMistakeReview();
    }
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'flashcards':
        return <Layers size={20} className="text-indigo-600 dark:text-indigo-400" />;
      case 'questions':
        return <PenTool size={20} className="text-blue-600 dark:text-blue-400" />;
      case 'review_mistakes':
        return <RotateCcw size={20} className="text-rose-600 dark:text-rose-400" />;
      default:
        return <CheckCircle2 size={20} className="text-emerald-600 dark:text-emerald-400" />;
    }
  };

  return (
    <div
      id="daily-study-plan-card"
      className="bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-3xl p-6 md:p-8 shadow-sm transition-all"
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-blue-900/50 shrink-0">
            <Calendar size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
                Daily Study Plan
              </span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {formattedDate}
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Today's Study Plan
            </h2>
          </div>
        </div>

        {/* Refresh & Progress Stats */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            id="refresh-daily-plan-btn"
            onClick={onRefresh}
            title="Refresh progress"
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
          >
            <RefreshCw size={16} />
          </button>
          <div className="text-right">
            <div className="text-xs font-bold text-slate-700 dark:text-slate-200">
              {plan.completedCount} of {plan.totalTasks} Done
            </div>
            <div className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">
              {progressPercent}% completed
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 mb-6 overflow-hidden">
        <div
          className={`h-full transition-all duration-500 rounded-full ${
            plan.allCompleted ? 'bg-emerald-500' : 'bg-blue-600'
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Focus Area Banner */}
      {plan.primaryTopic && (
        <div
          id="daily-plan-focus-banner"
          className="mb-6 p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
              <Target size={18} />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">
                Targeted Weak Area
              </div>
              <div className="text-sm font-extrabold text-slate-900 dark:text-white">
                {plan.primaryTopic} <span className="font-semibold text-slate-500 dark:text-slate-400">({plan.primarySubject})</span>
              </div>
            </div>
          </div>
          {plan.primaryAccuracy !== undefined && (
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-rose-100 dark:bg-rose-900/70 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
                {plan.primaryAccuracy}% Mastery
              </span>
              <button
                onClick={() => setView('weak_topics')}
                className="text-xs font-bold text-rose-700 dark:text-rose-300 hover:underline cursor-pointer"
              >
                View all weak topics &rarr;
              </button>
            </div>
          )}
        </div>
      )}

      {/* All Complete Celebration Banner */}
      {plan.allCompleted && (
        <div
          id="daily-plan-completed-banner"
          className="mb-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 flex items-center gap-3 animate-fadeIn"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-300 flex items-center justify-center shrink-0">
            <Sparkles size={20} />
          </div>
          <div>
            <h4 className="text-sm font-bold">Daily Study Plan Completed! 🎉</h4>
            <p className="text-xs text-emerald-700 dark:text-emerald-300">
              Fantastic work! You've strengthened your weak areas and stayed on track today.
            </p>
          </div>
        </div>
      )}

      {/* Task List */}
      <div className="space-y-3.5" id="daily-study-tasks-list">
        {plan.tasks.map((task, idx) => {
          const isDone = task.completed;
          const taskPct = task.targetCount > 0 
            ? Math.min(100, Math.round((task.currentCount / task.targetCount) * 100))
            : (isDone ? 100 : 0);

          return (
            <div
              key={task.id}
              id={`daily-task-item-${idx}`}
              className={`p-4 md:p-5 rounded-2xl border-2 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isDone
                  ? 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/30 dark:bg-emerald-950/20'
                  : 'border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 bg-slate-50/50 dark:bg-slate-850/60'
              }`}
            >
              {/* Checkbox and Task Details */}
              <div className="flex items-start gap-3.5 flex-1 min-w-0">
                <button
                  id={`toggle-task-${task.id}-btn`}
                  onClick={(e) => handleToggleTask(e, task.id)}
                  title={isDone ? "Mark incomplete" : "Mark completed"}
                  className="mt-0.5 p-1 rounded-lg text-slate-400 hover:text-emerald-600 transition-colors shrink-0 cursor-pointer"
                >
                  {isDone ? (
                    <CheckCircle2 size={22} className="text-emerald-600 dark:text-emerald-400 fill-emerald-100 dark:fill-emerald-950" />
                  ) : (
                    <Circle size={22} className="text-slate-300 dark:text-slate-600 hover:text-blue-500" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="p-1 rounded-md bg-slate-100 dark:bg-slate-700">
                      {getTaskIcon(task.type)}
                    </span>
                    <h3 className={`text-base font-bold truncate ${
                      isDone ? 'line-through text-slate-500 dark:text-slate-400' : 'text-slate-900 dark:text-white'
                    }`}>
                      {task.title}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 leading-relaxed">
                    {task.description}
                  </p>

                  {/* Micro Progress Bar */}
                  <div className="flex items-center gap-3">
                    <div className="w-28 sm:w-36 bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 rounded-full ${
                          isDone ? 'bg-emerald-500' : 'bg-blue-600'
                        }`}
                        style={{ width: `${taskPct}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
                      {task.type === 'review_mistakes'
                        ? (isDone ? 'Completed' : 'Pending')
                        : `${task.currentCount} / ${task.targetCount} done`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  id={`action-task-${task.id}-btn`}
                  onClick={() => handleExecuteTask(task)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer ${
                    isDone
                      ? 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200'
                      : task.type === 'review_mistakes'
                      ? 'bg-rose-600 hover:bg-rose-700 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  <span>{isDone ? 'Review Again' : task.actionText}</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
