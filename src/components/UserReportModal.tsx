import React, { useState, useEffect } from 'react';
import { 
  X, ShieldAlert, CheckCircle2, Ban, BrainCircuit, BookOpen, 
  Layers, Activity, Calendar, Clock, DollarSign, Mail, 
  User as UserIcon, Award, RefreshCw, AlertCircle, Sparkles,
  GraduationCap, Globe, Check
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc, updateDoc, setDoc, deleteDoc, collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface UserReportModalProps {
  userId: string;
  userInitialData?: any;
  onClose: () => void;
  onStatusChange?: (userId: string, newStatus: 'active' | 'disabled') => void;
}

export default function UserReportModal({ userId, userInitialData, onClose, onStatusChange }: UserReportModalProps) {
  const { getToken, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reportData, setReportData] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchReport = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch server-side AI usage & auth status
      let serverData: any = {};
      try {
        const token = await getToken();
        const res = await fetch(`/api/admin/users/${userId}/report`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          serverData = await res.json();
        }
      } catch (srvErr) {
        console.warn("[UserReportModal] Could not load server-side stats:", srvErr);
      }

      // 2. Fetch live data from Firestore directly using Super Admin credentials
      let uData = userInitialData || {};
      if (db) {
        try {
          const userSnap = await getDoc(doc(db, 'users', userId));
          if (userSnap.exists()) {
            uData = { ...uData, ...userSnap.data() };
          }
        } catch (_) {}
      }

      // Learning data (practice sessions)
      let learningItems: any[] = [];
      if (db) {
        try {
          const learnQ = query(collection(db, 'learning_data'), where('uid', '==', userId), limit(50));
          const learnSnap = await getDocs(learnQ);
          learnSnap.forEach(d => learningItems.push({ id: d.id, ...d.data() }));
        } catch (_) {}
      }

      // Flashcards count
      let flashcardsCount = 0;
      if (db) {
        try {
          const fcQ = query(collection(db, 'flashcards'), where('uid', '==', userId), limit(100));
          const fcSnap = await getDocs(fcQ);
          flashcardsCount = fcSnap.size;
        } catch (_) {}
      }

      // Flashcard decks count
      let flashcardDecksCount = 0;
      if (db) {
        try {
          const deckQ = query(collection(db, 'flashcard_decks'), where('uid', '==', userId), limit(50));
          const deckSnap = await getDocs(deckQ);
          flashcardDecksCount = deckSnap.size;
        } catch (_) {}
      }

      // Tutor conversations count
      let tutorConversationsCount = 0;
      if (db) {
        try {
          const tutorQ = query(collection(db, 'tutor_conversations'), where('uid', '==', userId), limit(50));
          const tutorSnap = await getDocs(tutorQ);
          tutorConversationsCount = tutorSnap.size;
        } catch (_) {}
      }

      // User progress
      let userProgressItems: any[] = [];
      if (db) {
        try {
          const progQ = query(collection(db, 'user_progress'), where('uid', '==', userId), limit(50));
          const progSnap = await getDocs(progQ);
          progSnap.forEach(d => userProgressItems.push({ id: d.id, ...d.data() }));
        } catch (_) {}
      }

      // Metrics calculation
      let totalScore = 0;
      let totalQuestions = 0;
      const subjectsMap: Record<string, number> = {};

      learningItems.forEach((item: any) => {
        if (typeof item.score === 'number' && typeof item.total === 'number' && item.total > 0) {
          totalScore += item.score;
          totalQuestions += item.total;
        }
        const subj = item.subject || item.topic || 'General Practice';
        subjectsMap[subj] = (subjectsMap[subj] || 0) + 1;
      });

      const averageScorePercent = totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : 0;
      const isActuallyDisabled = !!(uData.disabled || uData.status === 'disabled' || serverData?.disabledStatus?.disabled);

      setReportData({
        uid: userId,
        user: {
          name: uData.name || uData.displayName || (uData.email ? uData.email.split('@')[0] : 'User'),
          email: uData.email || '',
          username: uData.username || '',
          status: isActuallyDisabled ? 'disabled' : (uData.status || 'active'),
          disabled: isActuallyDisabled,
          disabledAt: uData.disabledAt || serverData?.disabledStatus?.disabledAt || null,
          disabledBy: uData.disabledBy || serverData?.disabledStatus?.disabledBy || null,
          statusReason: uData.statusReason || serverData?.disabledStatus?.reason || null,
          createdAt: uData.createdAt || serverData?.authRecord?.creationTime || null,
          lastLoginAt: uData.lastLoginAt || serverData?.authRecord?.lastSignInTime || uData.updatedAt || null,
          educationLevel: uData.educationLevel || 'Secondary',
          country: uData.country || 'International',
          subscriptionStatus: uData.subscriptionStatus || 'free',
          paymentStatus: uData.paymentStatus || 'none',
          subscriptionStart: uData.subscriptionStart || null,
          subscriptionExpires: uData.subscriptionExpires || null,
        },
        aiUsage: serverData?.aiUsage || {
          requestsCount: 0,
          inputTokens: 0,
          outputTokens: 0,
          totalTokens: 0,
          tutorRequests: tutorConversationsCount,
          practiceGenerations: 0,
          flashcardGenerations: 0,
          estimatedCost: 0,
          lastUsedAt: 0,
          dailyStats: {}
        },
        practice: {
          completedSessions: learningItems.length,
          averageScorePercent,
          totalQuestionsAnswered: totalQuestions,
          subjectsPracticed: Object.keys(subjectsMap),
          recentSessions: learningItems.slice(0, 10).map((s: any) => ({
            id: s.id,
            subject: s.subject || s.topic || 'Practice',
            topic: s.topic || '',
            score: s.score || 0,
            total: s.total || 0,
            date: s.date || s.completedAt || s.createdAt || null
          }))
        },
        flashcards: {
          savedFlashcardsCount: flashcardsCount,
          decksCount: flashcardDecksCount
        },
        tutor: {
          conversationsCount: tutorConversationsCount,
          requestsCount: serverData?.aiUsage?.tutorRequests || tutorConversationsCount
        },
        studyProgress: {
          recordsCount: userProgressItems.length,
          subjects: userProgressItems.map((p: any) => ({
            id: p.id,
            subject: p.subject || p.name || 'General',
            progress: p.progress || p.percentage || 0,
            topicsCompleted: p.topicsCompleted || 0,
            totalTopics: p.totalTopics || 0
          }))
        },
        authRecord: serverData?.authRecord || null
      });
    } catch (err: any) {
      console.error("[UserReportModal] Report load error:", err);
      setError(err?.message || "Failed to load report data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [userId]);

  const handleToggleStatus = async (targetAction: 'disable' | 'enable') => {
    const isDisabling = targetAction === 'disable';
    const confirmText = isDisabling
      ? "Are you sure you want to disable this user? They will immediately lose access to Zetadu, active sessions will be terminated, and login with this email will be blocked. Account data will remain safe."
      : "Are you sure you want to re-enable this user? Their access will be restored and all previous data remains intact.";

    if (!window.confirm(confirmText)) return;

    setActionLoading(true);
    setActionMessage(null);
    try {
      const now = Date.now();
      const userEmail = reportData?.user?.email || '';

      // 1. Direct Firestore update using Super Admin permissions
      if (db) {
        try {
          await updateDoc(doc(db, 'users', userId), {
            disabled: isDisabling,
            status: isDisabling ? 'disabled' : 'active',
            disabledAt: isDisabling ? now : null,
            disabledBy: isDisabling ? (user?.email || 'Super Admin') : null,
            statusReason: isDisabling ? 'Disabled by Super Admin' : null,
            updatedAt: new Date().toISOString()
          });

          if (isDisabling) {
            await setDoc(doc(db, 'disabled_users', userId), {
              uid: userId,
              email: userEmail,
              disabled: true,
              disabledAt: now,
              disabledBy: user?.email || 'Super Admin',
              reason: 'Disabled by Super Admin'
            }, { merge: true });
          } else {
            await deleteDoc(doc(db, 'disabled_users', userId)).catch(() => {});
          }
        } catch (fsErr) {
          console.warn("[UserReportModal] Firestore direct update notice:", fsErr);
        }
      }

      // 2. Notify backend server
      const token = await getToken();
      const endpoint = isDisabling ? '/api/admin/users/disable' : '/api/admin/users/enable';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          uid: userId,
          email: userEmail,
          reason: isDisabling ? 'Disabled by Super Admin' : undefined
        })
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || `Failed to ${targetAction} user`);
      }

      setActionMessage({
        type: 'success',
        text: isDisabling ? 'Account successfully disabled.' : 'Account successfully re-enabled.'
      });

      // Update local report data immediately
      setReportData((prev: any) => {
        if (!prev) return prev;
        return {
          ...prev,
          user: {
            ...prev.user,
            disabled: isDisabling,
            status: isDisabling ? 'disabled' : 'active',
            disabledAt: isDisabling ? now : null
          }
        };
      });

      if (onStatusChange) {
        onStatusChange(userId, isDisabling ? 'disabled' : 'active');
      }
    } catch (err: any) {
      console.error(`[UserReportModal] Error toggling status:`, err);
      setActionMessage({
        type: 'error',
        text: err?.message || `Failed to ${targetAction} account.`
      });
    } finally {
      setActionLoading(false);
    }
  };

  const u = reportData?.user || userInitialData || {};
  const isUserDisabled = u.disabled === true || u.status === 'disabled';
  const ai = reportData?.aiUsage || {};
  const practice = reportData?.practice || { completedSessions: 0, averageScorePercent: 0, totalQuestionsAnswered: 0, subjectsPracticed: [], recentSessions: [] };
  const flashcards = reportData?.flashcards || { savedFlashcardsCount: 0, decksCount: 0 };
  const tutor = reportData?.tutor || { conversationsCount: 0, requestsCount: 0 };
  const progress = reportData?.studyProgress || { recordsCount: 0, subjects: [] };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg text-white shadow-sm shrink-0 ${
              isUserDisabled ? 'bg-red-600' : 'bg-blue-600'
            }`}>
              {(u.name || u.email || 'U').charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {u.name || 'Anonymous User'}
                </h3>
                {isUserDisabled ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800">
                    <Ban size={12} /> Disabled
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                    <CheckCircle2 size={12} /> Active
                  </span>
                )}
                {u.subscriptionStatus === 'active' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                    Subscribed
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
                {u.email || userId}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchReport}
              title="Refresh Report Data"
              disabled={loading}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Action notification banner */}
        {actionMessage && (
          <div className={`px-6 py-2.5 text-xs font-medium flex items-center justify-between ${
            actionMessage.type === 'success' 
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-b border-emerald-200 dark:border-emerald-900/50'
              : 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border-b border-red-200 dark:border-red-900/50'
          }`}>
            <span>{actionMessage.text}</span>
            <button onClick={() => setActionMessage(null)} className="underline ml-2">Dismiss</button>
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {loading && !reportData ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <RefreshCw size={32} className="animate-spin text-blue-600 mb-3" />
              <p className="text-sm font-medium">Gathering real user metrics...</p>
            </div>
          ) : error && !reportData ? (
            <div className="p-6 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-center">
              <AlertCircle className="mx-auto text-red-500 mb-2" size={32} />
              <p className="text-sm font-medium text-red-800 dark:text-red-200">{error}</p>
              <button 
                onClick={fetchReport} 
                className="mt-3 px-4 py-1.5 text-xs font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              {/* Account Management & Status Control */}
              <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isUserDisabled 
                  ? 'bg-red-50/70 dark:bg-red-950/20 border-red-200 dark:border-red-900/50' 
                  : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
              }`}>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Account Access Control
                    </span>
                    {isUserDisabled ? (
                      <span className="text-xs font-semibold text-red-600 dark:text-red-400 flex items-center gap-1">
                        <Ban size={12} /> Access Currently Revoked
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 size={12} /> Account Active & Operational
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    {isUserDisabled
                      ? `This account was disabled${u.disabledAt ? ` on ${new Date(u.disabledAt).toLocaleDateString()}` : ''}${u.disabledBy ? ` by ${u.disabledBy}` : ''}. The user cannot sign in or create a new account with this email.`
                      : "Active accounts can sign in via Google or password and access all Zetadu features."
                    }
                  </p>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  {isUserDisabled ? (
                    <button
                      onClick={() => handleToggleStatus('enable')}
                      disabled={actionLoading}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5"
                    >
                      {actionLoading ? <RefreshCw size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                      Re-Enable Account
                    </button>
                  ) : (
                    <button
                      onClick={() => handleToggleStatus('disable')}
                      disabled={actionLoading}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5"
                    >
                      {actionLoading ? <RefreshCw size={14} className="animate-spin" /> : <Ban size={14} />}
                      Disable Account
                    </button>
                  )}
                </div>
              </div>

              {/* 1. Account & Profile Info Grid */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
                  <UserIcon size={14} /> Profile & Registration
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80">
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Account Status</p>
                    <p className={`text-sm font-semibold mt-0.5 ${isUserDisabled ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                      {isUserDisabled ? 'Disabled' : 'Active'}
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80">
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Member Since</p>
                    <p className="text-sm font-semibold text-slate-800 dark:text-white mt-0.5">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80">
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Last Activity</p>
                    <p className="text-sm font-semibold text-slate-800 dark:text-white mt-0.5">
                      {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80">
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Subscription</p>
                    <p className="text-sm font-semibold text-slate-800 dark:text-white mt-0.5 capitalize">
                      {u.subscriptionStatus || 'Free'}
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80">
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Education Level</p>
                    <p className="text-sm font-semibold text-slate-800 dark:text-white mt-0.5">
                      {u.educationLevel || 'Secondary'}
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80">
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Country / Region</p>
                    <p className="text-sm font-semibold text-slate-800 dark:text-white mt-0.5">
                      {u.country || 'International'}
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80">
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Payment Status</p>
                    <p className="text-sm font-semibold text-slate-800 dark:text-white mt-0.5 capitalize">
                      {u.paymentStatus || 'None'}
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80">
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Subscription Expiry</p>
                    <p className="text-sm font-semibold text-slate-800 dark:text-white mt-0.5">
                      {u.subscriptionExpires ? new Date(u.subscriptionExpires).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* 2. AI Usage & Token Tracking */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
                  <BrainCircuit size={14} className="text-blue-500" /> AI Usage & Resource Consumption
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80">
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Total AI Calls</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                      {ai.requestsCount || 0}
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80">
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Total Tokens</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                      {(ai.totalTokens || 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80">
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">AI Tutor Calls</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                      {ai.tutorRequests || tutor.conversationsCount || 0}
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80">
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Estimated Cost</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                      ${(ai.estimatedCost || 0).toFixed(4)}
                    </p>
                  </div>
                </div>
                <div className="mt-2 text-right">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Input: {(ai.inputTokens || 0).toLocaleString()} tokens • Output: {(ai.outputTokens || 0).toLocaleString()} tokens
                  </span>
                </div>
              </div>

              {/* 3. Learning, Practice & Flashcards Real Activity */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
                  <Activity size={14} className="text-emerald-500" /> Academic & Study Activity
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80">
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Practice Completed</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                      {practice.completedSessions || 0}
                    </p>
                    <span className="text-[10px] text-slate-400">sessions</span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80">
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Average Score</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                      {practice.averageScorePercent || 0}%
                    </p>
                    <span className="text-[10px] text-slate-400">{practice.totalQuestionsAnswered || 0} questions answered</span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80">
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Saved Flashcards</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                      {flashcards.savedFlashcardsCount || 0}
                    </p>
                    <span className="text-[10px] text-slate-400">{flashcards.decksCount || 0} decks</span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80">
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Tutor Conversations</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                      {tutor.conversationsCount || 0}
                    </p>
                    <span className="text-[10px] text-slate-400">sessions opened</span>
                  </div>
                </div>
              </div>

              {/* 4. Recent Practice Sessions Log */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                  <BookOpen size={14} /> Recent Practice Attempts
                </h4>
                {practice.recentSessions && practice.recentSessions.length > 0 ? (
                  <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
                    {practice.recentSessions.map((s: any) => (
                      <div key={s.id} className="p-3 flex items-center justify-between text-xs hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-white">{s.subject}</p>
                          {s.topic && <p className="text-slate-500 text-[11px]">{s.topic}</p>}
                        </div>
                        <div className="text-right">
                          <span className={`inline-block font-bold ${
                            s.total > 0 && (s.score / s.total) >= 0.7 
                              ? 'text-emerald-600 dark:text-emerald-400' 
                              : 'text-amber-600 dark:text-amber-400'
                          }`}>
                            {s.score} / {s.total} ({s.total > 0 ? Math.round((s.score / s.total) * 100) : 0}%)
                          </span>
                          {s.date && <p className="text-slate-400 text-[10px]">{new Date(s.date).toLocaleDateString()}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-center text-xs text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800">
                    No practice session records found for this user yet.
                  </div>
                )}
              </div>

              {/* 5. Subjects & Progress Breakdown */}
              {practice.subjectsPracticed && practice.subjectsPracticed.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                    Subjects Practiced
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {practice.subjectsPracticed.map((subj: string) => (
                      <span 
                        key={subj}
                        className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                      >
                        {subj}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            User ID: {userId}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-white rounded-lg text-xs font-semibold transition-colors"
          >
            Close Report
          </button>
        </div>

      </div>
    </div>
  );
}
