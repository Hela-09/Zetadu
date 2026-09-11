import React, { useState, useEffect } from 'react';
import { 
  BrainCircuit, RefreshCw, Zap, TrendingUp, DollarSign, Users, 
  MessageSquare, PenTool, Layers, Search, Clock, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { fetchAdminAiStats, AdminAiStatsResponse } from '../utils/aiUsageService';

export default function AiUsageAdminTab() {
  const { getToken } = useAuth();
  const [stats, setStats] = useState<AdminAiStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'requests' | 'tokens' | 'cost'>('requests');
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

  const loadStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      const data = await fetchAdminAiStats(token);
      setStats(data);
      setLastRefreshed(new Date());
    } catch (err: any) {
      console.error('Failed to load AI stats:', err);
      setError(err?.message || 'Failed to load AI usage statistics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const filteredUsers = (stats?.usagePerUser || [])
    .filter(u => 
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (u.displayName && u.displayName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      u.uid.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'requests') return b.requestsCount - a.requestsCount;
      if (sortBy === 'tokens') return b.totalTokens - a.totalTokens;
      return b.estimatedCost - a.estimatedCost;
    });

  if (loading && !stats) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-500 dark:text-slate-400">
        <RefreshCw size={36} className="animate-spin text-blue-600 mb-4" />
        <p className="font-medium text-sm">Aggregating AI usage analytics across Zetadu...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BrainCircuit className="text-blue-600 dark:text-blue-400" size={22} />
            AI Usage & Cost Monitoring
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time server-side tracking for Gemini Tutor, Practice & Flashcards
            {lastRefreshed && (
              <span className="ml-2 font-mono text-[11px] text-slate-400">
                (Updated: {lastRefreshed.toLocaleTimeString()})
              </span>
            )}
          </p>
        </div>
        <button
          onClick={loadStats}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh Stats
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-xl border border-red-200 dark:border-red-800 text-sm">
          {error}
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Requests */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">AI Requests</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Zap size={18} />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {(stats?.totalRequestsToday || 0).toLocaleString()}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
              <span>Today</span>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {(stats?.totalRequestsMonth || 0).toLocaleString()} this month
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Cost */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Estimated Cost</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <DollarSign size={18} />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              ${(stats?.estimatedCostToday || 0).toFixed(4)}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
              <span>Today</span>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                ${(stats?.estimatedCostMonth || 0).toFixed(4)} this month
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Tokens */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Tokens</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <TrendingUp size={18} />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {(stats?.totalTokensUsed || 0).toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between">
              <span>In: {(stats?.totalInputTokens || 0).toLocaleString()}</span>
              <span>Out: {(stats?.totalOutputTokens || 0).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Card 4: Active Users */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Active AI Users</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Users size={18} />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {(stats?.usagePerUser?.length || 0).toLocaleString()}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Total lifetime: ${(stats?.totalEstimatedCost || 0).toFixed(4)}
            </div>
          </div>
        </div>
      </div>

      {/* Feature Breakdown & Most Active Users */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Usage by Feature */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex flex-col justify-between">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <BrainCircuit size={16} className="text-blue-500" />
            Usage by AI Feature
          </h4>

          <div className="space-y-4">
            {/* AI Tutor */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700/50">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <MessageSquare size={14} className="text-blue-500" />
                  AI Tutor
                </span>
                <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                  {stats?.usageByCategory?.tutor?.requests || 0} requests
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span>{(stats?.usageByCategory?.tutor?.totalTokens || 0).toLocaleString()} tokens</span>
                <span>${(stats?.usageByCategory?.tutor?.estimatedCost || 0).toFixed(4)}</span>
              </div>
            </div>

            {/* AI Practice */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700/50">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <PenTool size={14} className="text-emerald-500" />
                  AI Practice
                </span>
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {stats?.usageByCategory?.practice?.requests || 0} generations
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span>{(stats?.usageByCategory?.practice?.totalTokens || 0).toLocaleString()} tokens</span>
                <span>${(stats?.usageByCategory?.practice?.estimatedCost || 0).toFixed(4)}</span>
              </div>
            </div>

            {/* AI Flashcards */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700/50">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Layers size={14} className="text-purple-500" />
                  AI Flashcards
                </span>
                <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400">
                  {stats?.usageByCategory?.flashcards?.requests || 0} generations
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span>{(stats?.usageByCategory?.flashcards?.totalTokens || 0).toLocaleString()} tokens</span>
                <span>${(stats?.usageByCategory?.flashcards?.estimatedCost || 0).toFixed(4)}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 text-[11px] text-slate-400 text-center">
            Rates: $0.10 / 1M input tokens • $0.40 / 1M output tokens
          </div>
        </div>

        {/* Most Active AI Users */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-amber-500" />
            Most Active AI Users
          </h4>

          {(!stats?.mostActiveUsers || stats.mostActiveUsers.length === 0) ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No AI usage recorded yet. User requests will appear here automatically.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {stats.mostActiveUsers.slice(0, 5).map((user, idx) => (
                <div key={user.uid} className="py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center font-bold text-xs">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="text-xs font-semibold text-slate-900 dark:text-white truncate max-w-[180px] sm:max-w-xs">
                        {user.displayName || user.email}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[180px]">
                        {user.email}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold font-mono text-slate-900 dark:text-white">
                      {user.requestsCount} reqs
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {user.totalTokens.toLocaleString()} tokens (${user.estimatedCost.toFixed(4)})
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Detailed User Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200/80 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Usage Per User ({filteredUsers.length})
            </h4>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search user..."
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 w-40 sm:w-56"
              />
            </div>

            {/* Sort Filter */}
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="requests">Sort: Requests</option>
              <option value="tokens">Sort: Tokens</option>
              <option value="cost">Sort: Cost</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4 text-right">Requests</th>
                <th className="py-3 px-4 text-right">Input / Output</th>
                <th className="py-3 px-4 text-right">Total Tokens</th>
                <th className="py-3 px-4 text-center">Tutor / Pract. / Flash</th>
                <th className="py-3 px-4 text-right">Est. Cost</th>
                <th className="py-3 px-4 text-right">Last Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No matching users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => (
                  <tr key={user.uid} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {user.displayName || 'User'}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono truncate max-w-[200px]">
                        {user.email}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900 dark:text-white font-mono">
                      {user.requestsCount}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-500 font-mono text-[11px]">
                      {user.inputTokens.toLocaleString()} / {user.outputTokens.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-semibold text-blue-600 dark:text-blue-400">
                      {user.totalTokens.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-[11px] text-slate-600 dark:text-slate-300">
                      <span className="text-blue-600 dark:text-blue-400 font-semibold">{user.tutorRequests}</span>
                      {' / '}
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{user.practiceGenerations}</span>
                      {' / '}
                      <span className="text-purple-600 dark:text-purple-400 font-semibold">{user.flashcardGenerations}</span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                      ${user.estimatedCost.toFixed(4)}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-400 text-[11px]">
                      {user.lastUsedAt ? new Date(user.lastUsedAt).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
