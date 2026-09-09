import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ViewType } from '../types';
import {
  fetchStudentTopicAnalysis,
  StudentTopicAnalysis,
  TopicResultSummary
} from '../utils/weakTopics';
import WeakTopicActionModal from './WeakTopicActionModal';
import {
  AlertTriangle,
  Activity,
  CheckCircle2,
  Search,
  X,
  PenTool,
  Layers,
  MessageSquare,
  ArrowRight,
  TrendingDown,
  Sparkles,
  BarChart3,
  RefreshCw
} from 'lucide-react';

interface WeakTopicsProps {
  setView: (view: ViewType) => void;
  onSelectTopic?: (topic: TopicResultSummary) => void;
  inline?: boolean;
}

export default function WeakTopics({ setView, onSelectTopic, inline = false }: WeakTopicsProps) {
  const { user } = useAuth();
  const [analysis, setAnalysis] = useState<StudentTopicAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'weak' | 'average' | 'strong'>('weak');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopicForModal, setSelectedTopicForModal] = useState<TopicResultSummary | null>(null);

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await fetchStudentTopicAnalysis(user.uid);
      setAnalysis(data);
      // Default to 'weak' if there are weak topics, else 'all'
      if (data.weakTopics.length > 0) {
        setActiveTab('weak');
      } else {
        setActiveTab('all');
      }
    } catch (err) {
      console.error('Error fetching weak topics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const filteredTopics = useMemo(() => {
    if (!analysis) return [];

    let list: TopicResultSummary[] = [];
    if (activeTab === 'all') list = analysis.allTopics;
    else if (activeTab === 'weak') list = analysis.weakTopics;
    else if (activeTab === 'average') list = analysis.averageTopics;
    else if (activeTab === 'strong') list = analysis.strongTopics;

    if (!searchQuery.trim()) return list;

    const query = searchQuery.trim().toLowerCase();
    return list.filter(
      (t) =>
        t.topic.toLowerCase().includes(query) ||
        t.subject.toLowerCase().includes(query)
    );
  }, [analysis, activeTab, searchQuery]);

  const handleTopicClick = (topic: TopicResultSummary) => {
    if (onSelectTopic) {
      onSelectTopic(topic);
    }
    // Always open action modal for weak topics
    setSelectedTopicForModal(topic);
  };

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center p-12 min-h-[300px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Analyzing student practice results...
          </p>
        </div>
      </div>
    );
  }

  const weakCount = analysis?.weakTopics.length || 0;
  const avgCount = analysis?.averageTopics.length || 0;
  const strongCount = analysis?.strongTopics.length || 0;
  const totalAttempted = analysis?.totalQuestionsAttempted || 0;
  const overallAcc = analysis?.overallAccuracy || 0;

  return (
    <div id="weak-topics-section" className="w-full flex flex-col gap-6">
      {/* Header */}
      {!inline && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400">
                <TrendingDown size={18} />
              </span>
              <span className="text-xs uppercase font-bold tracking-wider text-rose-600 dark:text-rose-400">
                Performance Diagnostics
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Topic Mastery & Weak Areas
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Computed from your real practice results. Click any weak topic to practice, review flashcards, or ask AI Tutor.
            </p>
          </div>
          <button
            onClick={loadData}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer shrink-0"
            title="Refresh results"
          >
            <RefreshCw size={14} />
            <span>Refresh</span>
          </button>
        </div>
      )}

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {/* Weak Topics */}
        <button
          onClick={() => setActiveTab('weak')}
          className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
            activeTab === 'weak'
              ? 'bg-rose-50/80 dark:bg-rose-950/30 border-rose-500 shadow-sm'
              : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700/60 hover:border-rose-200'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
              Weak
            </span>
            <AlertTriangle size={16} className="text-rose-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {weakCount}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            &lt; 50% accuracy
          </p>
        </button>

        {/* Average Topics */}
        <button
          onClick={() => setActiveTab('average')}
          className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
            activeTab === 'average'
              ? 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-500 shadow-sm'
              : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700/60 hover:border-amber-200'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Average
            </span>
            <Activity size={16} className="text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {avgCount}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            50% - 74% accuracy
          </p>
        </button>

        {/* Strong Topics */}
        <button
          onClick={() => setActiveTab('strong')}
          className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
            activeTab === 'strong'
              ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-500 shadow-sm'
              : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700/60 hover:border-emerald-200'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Strong
            </span>
            <CheckCircle2 size={16} className="text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {strongCount}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            &ge; 75% accuracy
          </p>
        </button>

        {/* Total Questions Attempted */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Practice
            </span>
            <BarChart3 size={16} className="text-blue-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {totalAttempted}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            {overallAcc}% overall accuracy
          </p>
        </div>
      </div>

      {/* Tabs & Search Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Category Tabs */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl border border-slate-200/70 dark:border-slate-700/60">
          <button
            id="tab-weak-topics"
            onClick={() => setActiveTab('weak')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'weak'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <AlertTriangle size={13} />
            <span>Weak Topics</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                activeTab === 'weak'
                  ? 'bg-rose-600 text-white'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              {weakCount}
            </span>
          </button>

          <button
            id="tab-average-topics"
            onClick={() => setActiveTab('average')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'average'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <Activity size={13} />
            <span>Average Topics</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                activeTab === 'average'
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              {avgCount}
            </span>
          </button>

          <button
            id="tab-strong-topics"
            onClick={() => setActiveTab('strong')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'strong'
                ? 'bg-emerald-500 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <CheckCircle2 size={13} />
            <span>Strong Topics</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                activeTab === 'strong'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              {strongCount}
            </span>
          </button>

          <button
            id="tab-all-topics"
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            All ({(analysis?.allTopics || []).length})
          </button>
        </div>

        {/* Search bar */}
        <div className="relative w-full sm:w-64">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            id="weak-topics-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search topics or subjects..."
            className="w-full pl-9 pr-8 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Topics Grid / List */}
      {filteredTopics.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredTopics.map((topic, i) => {
            const isWeak = topic.category === 'weak';
            const isAvg = topic.category === 'average';
            const isStrong = topic.category === 'strong';

            const badgeColor = isWeak
              ? 'bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
              : isAvg
              ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
              : 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';

            const barColor = isWeak ? 'bg-rose-500' : isAvg ? 'bg-amber-500' : 'bg-emerald-500';

            return (
              <div
                key={`${topic.subject}-${topic.topic}-${i}`}
                id={`topic-item-${i}`}
                onClick={() => handleTopicClick(topic)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer bg-white dark:bg-slate-800 group relative ${
                  isWeak
                    ? 'border-slate-200/80 dark:border-slate-700 hover:border-rose-500 dark:hover:border-rose-500 hover:shadow-md'
                    : isAvg
                    ? 'border-slate-200/80 dark:border-slate-700 hover:border-amber-500 dark:hover:border-amber-500 hover:shadow-md'
                    : 'border-slate-200/80 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 hover:shadow-md'
                }`}
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block truncate">
                      {topic.subject}
                    </span>
                    <h4 className="font-bold text-slate-900 dark:text-white text-base leading-snug truncate group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                      {topic.topic}
                    </h4>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold border shrink-0 ${badgeColor}`}
                  >
                    {topic.accuracy}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 mb-2.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                    style={{ width: `${Math.max(5, topic.accuracy)}%` }}
                  />
                </div>

                {/* Bottom stats & quick action hint */}
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>
                    {topic.correctCount}/{topic.totalQuestions} questions correct ({topic.incorrectCount} missed)
                  </span>

                  {isWeak ? (
                    <span className="inline-flex items-center gap-1 font-bold text-rose-600 dark:text-rose-400 group-hover:translate-x-0.5 transition-transform">
                      <span>Take Action</span>
                      <ArrowRight size={13} />
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 font-semibold text-slate-400 dark:text-slate-500">
                      <span>Details</span>
                      <ArrowRight size={12} />
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty state */
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 text-center flex flex-col items-center justify-center">
          {searchQuery ? (
            <div>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                No matching topics found for "{searchQuery}"
              </p>
              <p className="text-xs text-slate-500 mt-1">Try another keyword or clear the search</p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-3 px-4 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200"
              >
                Clear Search
              </button>
            </div>
          ) : !analysis?.hasResults ? (
            <div className="max-w-md mx-auto flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center mb-3">
                <Sparkles size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                No Practice Results Yet
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                As you take practice quizzes or complete Study Journeys, your real performance will automatically populate here into Weak, Average, and Strong topics.
              </p>
              <div className="flex items-center gap-3 mt-5">
                <button
                  onClick={() => setView('practice')}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2"
                >
                  <PenTool size={15} /> Start Practice
                </button>
                <button
                  onClick={() => setView('journey')}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all"
                >
                  Study Journey
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                No {activeTab} topics found in your records.
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {activeTab === 'weak'
                  ? 'Great job! You have zero topics under 50% accuracy.'
                  : `Check the other tabs to see your topic distribution.`}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Weak Topic Interactive Options Modal */}
      <WeakTopicActionModal
        topic={selectedTopicForModal}
        onClose={() => setSelectedTopicForModal(null)}
        setView={setView}
      />
    </div>
  );
}
