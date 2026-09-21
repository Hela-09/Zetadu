import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  WifiOff, 
  Wifi, 
  BookOpen, 
  Layers, 
  Bookmark, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Play, 
  RefreshCw, 
  Sparkles, 
  Brain, 
  CloudOff, 
  Cloud, 
  AlertCircle, 
  Download, 
  HardDrive, 
  Trophy, 
  Target, 
  ChevronRight,
  ShieldCheck,
  FileText,
  Lock,
  Compass,
  Trash2,
  Search,
  Filter,
  X,
  CheckSquare,
  HelpCircle,
  Award
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  fetchOfflineHubData, 
  OfflineHubData, 
  UnfinishedPracticeInfo, 
  OfflineNovelItem,
  downloadJambSubjectOffline,
  removeDownloadedJambSubject
} from '../../services/offlineHubService';
import { 
  jambOfflineDb, 
  DownloadedSubjectMeta 
} from '../../services/jambOfflineDb';
import { 
  jambService, 
  JambExamAttempt, 
  BookmarkedJambQuestion 
} from '../../services/jambService';
import { OFFICIAL_JAMB_SUBJECTS, JambSubject } from '../../data/jambSubjects';
import { getRealAvailableQuestionsForSubject } from '../../data/jambQuestions';
import { FlashcardDeck } from '../../types';
import Quiz, { QuizProps } from '../Quiz';
import PrepareForOfflineModal from './PrepareForOfflineModal';

interface OfflineLearningHubProps {
  setView: (view: string, options?: any) => void;
  onRetryConnection?: () => void;
  isOnlineActual?: boolean;
}

export default function OfflineLearningHub({
  setView,
  onRetryConnection,
  isOnlineActual = false
}: OfflineLearningHubProps) {
  const { user } = useAuth();
  const [data, setData] = useState<OfflineHubData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isPrepareModalOpen, setIsPrepareModalOpen] = useState<boolean>(false);
  const [selectedBookmark, setSelectedBookmark] = useState<BookmarkedJambQuestion | null>(null);
  const [checkingConnection, setCheckingConnection] = useState<boolean>(false);
  const [onlineNotification, setOnlineNotification] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Subject filtering
  const [subjectSearch, setSubjectSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Active downloads tracking
  const [downloadingSubjects, setDownloadingSubjects] = useState<Record<string, { progress: number; current: number; total: number }>>({});
  const [isDownloadingAll, setIsDownloadingAll] = useState<boolean>(false);
  const [downloadAllProgress, setDownloadAllProgress] = useState<{ current: number; total: number; subjectName: string } | null>(null);

  // Active offline quiz / CBT session
  const [activeQuizConfig, setActiveQuizConfig] = useState<QuizProps['initialConfig'] | null>(null);
  const [activeQuizMode, setActiveQuizMode] = useState<QuizProps['initialMode']>('jamb-practice');

  // History & Bookmarks list for offline review
  const [offlineHistory, setOfflineHistory] = useState<JambExamAttempt[]>([]);
  const [offlineBookmarks, setOfflineBookmarks] = useState<BookmarkedJambQuestion[]>([]);

  // Multi-subject CBT Modal state
  const [isMultiCbtModalOpen, setIsMultiCbtModalOpen] = useState<boolean>(false);
  const [selectedCbtSubjects, setSelectedCbtSubjects] = useState<string[]>(['english', 'mathematics', 'physics', 'chemistry']);
  const [cbtDurationMinutes, setCbtDurationMinutes] = useState<number>(120);

  // Active tab inside hub
  const [activeHubTab, setActiveHubTab] = useState<'subjects' | 'history' | 'bookmarks' | 'novels' | 'flashcards'>('subjects');

  const loadData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const hubData = await fetchOfflineHubData(user.uid);
      setData(hubData);

      // Load offline history
      const history = await jambService.getHistory();
      setOfflineHistory(history);

      // Load offline bookmarks
      const bookmarks = await jambService.getBookmarks();
      setOfflineBookmarks(bookmarks);
    } catch (err) {
      console.warn('Failed to load offline hub data:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Automatic Background Sync when internet returns
  useEffect(() => {
    const handleOnline = async () => {
      try {
        const res = await jambService.syncPendingData();
        const totalSynced = res.syncedAttempts + res.syncedBookmarks + (res.syncedSubjects || 0);
        if (totalSynced > 0) {
          setOnlineNotification(`Internet restored! Automatically synced ${totalSynced} offline session(s) & bookmarks to cloud.`);
        }
        await loadData();
      } catch (err) {
        console.warn('Auto sync failed:', err);
      }
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [loadData]);

  // Check connection manually
  const handleCheckConnection = async () => {
    setCheckingConnection(true);
    if (typeof navigator !== 'undefined' && navigator.onLine) {
      try {
        await fetch('/favicon.ico', { method: 'HEAD', cache: 'no-store' });
        window.dispatchEvent(new Event('online'));
      } catch (_) {
        // Still offline
      }
    }
    if (onRetryConnection) {
      onRetryConnection();
    }
    setTimeout(() => {
      setCheckingConnection(false);
    }, 600);
  };

  // Manual Sync trigger
  const handleManualSync = async () => {
    const isOnline = typeof navigator !== 'undefined' && navigator.onLine;
    if (!isOnline && !isOnlineActual) {
      setToastMessage('You are currently offline. Connect to internet to sync offline records.');
      return;
    }
    try {
      const res = await jambService.syncPendingData();
      const totalSynced = res.syncedAttempts + res.syncedBookmarks + (res.syncedSubjects || 0);
      if (totalSynced > 0) {
        setToastMessage(`Synced ${totalSynced} offline records to the cloud!`);
      } else {
        setToastMessage('All offline attempts and bookmarks are up to date.');
      }
      await loadData();
    } catch (err) {
      console.error('Manual sync failed:', err);
      setToastMessage('Sync failed. Please check your internet connection.');
    }
  };

  // Map of downloaded subjects
  const downloadedMap = useMemo(() => {
    const map = new Map<string, DownloadedSubjectMeta>();
    if (data?.downloadedSubjects) {
      data.downloadedSubjects.forEach(s => {
        map.set(s.subjectId.toLowerCase(), s);
        map.set(s.name.toLowerCase(), s);
      });
    }
    return map;
  }, [data?.downloadedSubjects]);

  // Download single subject
  const handleDownloadSubject = async (subjectId: string, subjectName: string) => {
    const isOnline = typeof navigator !== 'undefined' && navigator.onLine;
    if (!isOnline && !isOnlineActual) {
      setToastMessage('You are currently offline. Connect to the internet to download questions.');
      return;
    }

    setDownloadingSubjects(prev => ({
      ...prev,
      [subjectId]: { progress: 0, current: 0, total: 40 }
    }));

    try {
      await downloadJambSubjectOffline(subjectId, (pct, cur, tot) => {
        setDownloadingSubjects(prev => ({
          ...prev,
          [subjectId]: { progress: pct, current: cur, total: tot }
        }));
      });
      await loadData();
      setToastMessage(`Successfully downloaded ${subjectName} for offline study!`);
    } catch (err: any) {
      console.error('Download subject failed:', err);
      setToastMessage(`Download failed: ${err?.message || 'Error occurred'}`);
    } finally {
      setDownloadingSubjects(prev => {
        const next = { ...prev };
        delete next[subjectId];
        return next;
      });
    }
  };

  // Download all subjects one by one
  const handleDownloadAllSubjects = async () => {
    const isOnline = typeof navigator !== 'undefined' && navigator.onLine;
    if (!isOnline && !isOnlineActual) {
      setToastMessage('You are currently offline. Connect to the internet to download subjects.');
      return;
    }

    const subjectsToDownload = OFFICIAL_JAMB_SUBJECTS.filter(s => {
      const avail = getRealAvailableQuestionsForSubject(s.id).length;
      const isDownloaded = downloadedMap.has(s.id.toLowerCase());
      return avail > 0 && !isDownloaded;
    });

    if (subjectsToDownload.length === 0) {
      setToastMessage('All approved subjects with questions are already downloaded!');
      return;
    }

    setIsDownloadingAll(true);
    setToastMessage(null);

    try {
      for (let i = 0; i < subjectsToDownload.length; i++) {
        const s = subjectsToDownload[i];
        setDownloadAllProgress({
          current: i + 1,
          total: subjectsToDownload.length,
          subjectName: s.name
        });
        await downloadJambSubjectOffline(s.id);
      }
      await loadData();
      setToastMessage(`Downloaded all ${subjectsToDownload.length} approved subjects for offline practice!`);
    } catch (err: any) {
      console.error('Download all failed:', err);
      setToastMessage(`Download stopped: ${err?.message || 'Error occurred'}`);
    } finally {
      setIsDownloadingAll(false);
      setDownloadAllProgress(null);
    }
  };

  // Remove downloaded subject
  const handleRemoveSubject = async (subjectId: string) => {
    try {
      await removeDownloadedJambSubject(subjectId);
      await loadData();
      setToastMessage('Subject removed from offline cache.');
    } catch (err) {
      console.error('Remove subject failed:', err);
    }
  };

  // Launch offline JAMB Practice
  const handleLaunchPractice = (subjectId: string, subjectName: string) => {
    const downloadedMeta = downloadedMap.get(subjectId.toLowerCase());
    const count = downloadedMeta ? Math.min(downloadedMeta.questionCount, 40) : 20;

    setActiveQuizMode('jamb-practice');
    setActiveQuizConfig({
      subject: subjectName,
      subjectId: subjectId,
      amount: count,
      ordering: 'random',
      isUntimed: false,
      timerDuration: Math.round(count * 1.5),
      examType: 'JAMB'
    });
  };

  // Launch offline JAMB CBT Exam
  const handleLaunchCbt = (subjectId: string, subjectName: string) => {
    const downloadedMeta = downloadedMap.get(subjectId.toLowerCase());
    const count = downloadedMeta ? Math.min(downloadedMeta.questionCount, 40) : 40;

    setActiveQuizMode('jamb-cbt');
    setActiveQuizConfig({
      subject: subjectName,
      subjectId: subjectId,
      amount: count,
      ordering: 'random',
      isUntimed: false,
      timerDuration: 40,
      examType: 'JAMB'
    });
  };

  // Launch multi-subject offline CBT Mock Exam
  const handleLaunchMultiSubjectCbt = () => {
    if (selectedCbtSubjects.length === 0) {
      setToastMessage('Please select at least one subject for the CBT mock.');
      return;
    }

    const subjectNames = selectedCbtSubjects.map(id => {
      const match = OFFICIAL_JAMB_SUBJECTS.find(s => s.id === id);
      return match?.name || id;
    });

    const totalQuestions = selectedCbtSubjects.length * 40;

    setActiveQuizMode('jamb-cbt');
    setActiveQuizConfig({
      subjects: subjectNames,
      amount: totalQuestions,
      ordering: 'random',
      isUntimed: false,
      timerDuration: cbtDurationMinutes,
      examType: 'JAMB'
    });
    setIsMultiCbtModalOpen(false);
  };

  // Review answers for a completed attempt offline
  const handleReviewAttempt = (attempt: JambExamAttempt) => {
    if (!attempt.questions || attempt.questions.length === 0) {
      setToastMessage('Question details for this attempt were not cached.');
      return;
    }

    setActiveQuizMode('history-review');
    setActiveQuizConfig({
      subject: attempt.subjectName || attempt.subject,
      subjectId: attempt.subject,
      reviewSession: {
        id: attempt.id,
        questions: attempt.questions as any,
        answers: (attempt.answers || {}) as any,
        score: attempt.score,
        totalQuestions: attempt.totalQuestions,
        percentage: attempt.percentage,
        timeUsedSeconds: attempt.timeSpentSeconds || 0,
        subject: attempt.subject,
        subjectName: attempt.subjectName,
        isJambCbt: Boolean((attempt as any).isJambCbt || attempt.totalQuestions >= 40)
      }
    });
  };

  // Launch Novel Reading
  const handleReadNovel = (novelId: string) => {
    setView('novels');
  };

  // Launch Flashcard Study
  const handleStudyDeck = (deck: FlashcardDeck) => {
    try {
      localStorage.setItem('zetadu_flashcard_topic', deck.topic);
      localStorage.setItem('zetadu_target_subject', deck.subject);
    } catch (_) {}
    setView('flashcards');
  };

  // Filtered approved subjects
  const filteredApprovedSubjects = useMemo(() => {
    return OFFICIAL_JAMB_SUBJECTS.filter(subj => {
      const matchesSearch = 
        subj.name.toLowerCase().includes(subjectSearch.toLowerCase()) ||
        subj.code.toLowerCase().includes(subjectSearch.toLowerCase());
      
      const matchesCategory = 
        selectedCategory === 'all' || 
        subj.category.toLowerCase().includes(selectedCategory.toLowerCase());

      return matchesSearch && matchesCategory;
    });
  }, [subjectSearch, selectedCategory]);

  // Calculate total available questions across all approved subjects
  const totalAvailableQuestionsInBank = useMemo(() => {
    return OFFICIAL_JAMB_SUBJECTS.reduce((acc, subj) => {
      return acc + getRealAvailableQuestionsForSubject(subj.id).length;
    }, 0);
  }, []);

  // Calculate total downloaded questions
  const totalDownloadedQuestions = useMemo(() => {
    if (!data?.downloadedSubjects) return 0;
    return data.downloadedSubjects.reduce((acc, s) => acc + s.questionCount, 0);
  }, [data?.downloadedSubjects]);

  // If a Quiz session is active (Practice, CBT, or Review), render the Quiz engine directly
  if (activeQuizConfig) {
    return (
      <div className="w-full max-w-5xl mx-auto py-2">
        <Quiz
          initialConfig={activeQuizConfig}
          initialMode={activeQuizMode}
          onBack={() => {
            setActiveQuizConfig(null);
            loadData();
          }}
          setView={setView}
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 min-h-[400px]">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">
          Loading offline storage and approved subjects...
        </p>
      </div>
    );
  }

  const continueItem = data?.continueLearning;
  const downloadedSubs = data?.downloadedSubjects || [];
  const flashcardDecks = data?.savedFlashcards.decks || [];
  const totalCards = data?.savedFlashcards.totalCards || 0;
  const unfinished = data?.unfinishedPractice;
  const offlineNovels = data?.offlineNovels || [];
  const novelBookmarks = data?.bookmarks.novelBookmarks || [];
  const progress = data?.studyProgress;
  const unsyncedCount = data?.unsyncedCount || 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs sm:text-sm font-semibold flex items-center justify-between shadow-lg sticky top-4 z-50">
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-white/80 hover:text-white dark:text-slate-800 dark:hover:text-black ml-3 text-xs uppercase font-bold cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Online Toast Notification */}
      {onlineNotification && (
        <div className="p-3.5 rounded-xl bg-emerald-600 text-white text-xs sm:text-sm font-semibold flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <Wifi className="w-4 h-4" />
            <span>{onlineNotification}</span>
          </div>
          <button
            onClick={() => setOnlineNotification(null)}
            className="text-white/80 hover:text-white ml-2 text-xs uppercase font-bold cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 1. Offline Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-600/5 to-orange-500/10 dark:from-amber-950/40 dark:via-slate-900 dark:to-orange-950/40 border border-amber-300 dark:border-amber-800/80 p-5 sm:p-7 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-xs">
                <WifiOff className="w-3.5 h-3.5" />
                Offline Mode Active
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                <ShieldCheck className="w-3.5 h-3.5" />
                {totalDownloadedQuestions} Questions Saved Locally
              </span>
              {unsyncedCount > 0 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                  <Cloud className="w-3.5 h-3.5" />
                  {unsyncedCount} Queued to Sync
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              JAMB Offline Learning & CBT Hub
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              Complete offline access to approved JAMB UTME subjects, past questions, answers, derivations, and timed CBT simulations. When internet returns, your practice scores and bookmarks automatically sync to the cloud.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2.5 flex-wrap shrink-0">
            {unsyncedCount > 0 && (
              <button
                onClick={handleManualSync}
                className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold transition-all inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
                title="Sync queued attempts to cloud"
              >
                <Cloud className="w-4 h-4" />
                Sync Cloud ({unsyncedCount})
              </button>
            )}

            <button
              onClick={() => setIsPrepareModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 text-xs sm:text-sm font-semibold transition-all inline-flex items-center gap-2 shadow-2xs cursor-pointer"
            >
              <Download className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Manage Storage
            </button>

            <button
              onClick={handleCheckConnection}
              disabled={checkingConnection}
              className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-semibold transition-all inline-flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-60"
            >
              <RefreshCw className={`w-4 h-4 ${checkingConnection ? 'animate-spin' : ''}`} />
              {checkingConnection ? 'Checking...' : 'Check Connection'}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveHubTab('subjects')}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold inline-flex items-center gap-2 transition-all cursor-pointer ${
            activeHubTab === 'subjects'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Approved Subjects ({OFFICIAL_JAMB_SUBJECTS.length})
        </button>

        <button
          onClick={() => setActiveHubTab('history')}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold inline-flex items-center gap-2 transition-all cursor-pointer ${
            activeHubTab === 'history'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          Exam History & Reviews ({offlineHistory.length})
        </button>

        <button
          onClick={() => setActiveHubTab('bookmarks')}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold inline-flex items-center gap-2 transition-all cursor-pointer ${
            activeHubTab === 'bookmarks'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          Saved Bookmarks ({offlineBookmarks.length})
        </button>

        <button
          onClick={() => setActiveHubTab('novels')}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold inline-flex items-center gap-2 transition-all cursor-pointer ${
            activeHubTab === 'novels'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Literature Novels ({offlineNovels.length})
        </button>

        <button
          onClick={() => setActiveHubTab('flashcards')}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold inline-flex items-center gap-2 transition-all cursor-pointer ${
            activeHubTab === 'flashcards'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          Flashcards ({totalCards})
        </button>
      </div>

      {/* TAB 1: APPROVED JAMB SUBJECTS */}
      {activeHubTab === 'subjects' && (
        <div className="space-y-5">
          {/* Top Control Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-xs">
            <div className="flex items-center gap-3 flex-1 flex-wrap">
              {/* Search Bar */}
              <div className="relative flex-1 min-w-[220px]">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter subjects (e.g. English, Mathematics, Biology)..."
                  value={subjectSearch}
                  onChange={e => setSubjectSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                />
              </div>

              {/* Category selector */}
              <div className="flex items-center gap-1 overflow-x-auto">
                {['all', 'sciences', 'commercial', 'arts'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors cursor-pointer shrink-0 ${
                      selectedCategory === cat
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                        : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {cat === 'all' ? 'All Subjects' : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleDownloadAllSubjects}
                disabled={isDownloadingAll}
                className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
              >
                {isDownloadingAll ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Downloading All...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    <span>Download All ({totalAvailableQuestionsInBank} Qs)</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setIsMultiCbtModalOpen(true)}
                className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Full JAMB CBT Mock (4 Subjects)</span>
              </button>
            </div>
          </div>

          {/* Download All Progress Bar */}
          {isDownloadingAll && downloadAllProgress && (
            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 space-y-2">
              <div className="flex justify-between text-xs font-bold text-blue-900 dark:text-blue-200">
                <span>Downloading {downloadAllProgress.subjectName} ({downloadAllProgress.current} of {downloadAllProgress.total})...</span>
                <span>{Math.round((downloadAllProgress.current / downloadAllProgress.total) * 100)}%</span>
              </div>
              <div className="w-full h-2 bg-blue-200 dark:bg-blue-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${(downloadAllProgress.current / downloadAllProgress.total) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Subjects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredApprovedSubjects.map(subj => {
              const availableQuestions = getRealAvailableQuestionsForSubject(subj.id);
              const availableCount = availableQuestions.length;
              const downloaded = downloadedMap.get(subj.id.toLowerCase());
              const downloading = downloadingSubjects[subj.id];

              return (
                <div
                  key={subj.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/80 hover:border-slate-300 dark:hover:border-slate-600 transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                            {subj.name}
                          </h4>
                          {subj.compulsory && (
                            <span className="px-1.5 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 rounded">
                              Compulsory
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          Code: {subj.code} • {subj.category}
                        </p>
                      </div>

                      {/* Download status badge */}
                      {downloaded && downloaded.questionCount > 0 ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 shrink-0 inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Downloaded
                        </span>
                      ) : null}
                    </div>

                    {/* Question details */}
                    <div className="text-xs text-slate-600 dark:text-slate-300">
                      {downloaded && downloaded.questionCount > 0 ? (
                        <div className="flex items-center gap-2 flex-wrap text-[11px]">
                          <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                            {downloaded.questionCount} Questions Ready Offline
                          </span>
                          <span className="text-slate-400">•</span>
                          <span className="text-slate-400">
                            ~{Math.round(downloaded.sizeKb)} KB
                          </span>
                        </div>
                      ) : availableCount > 0 ? (
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          <span className="font-semibold text-blue-600 dark:text-blue-400">{availableCount} questions available</span> with full answers & explanations
                        </div>
                      ) : (
                        <div className="text-[11px] text-slate-400 italic">
                          0 questions available (Coming soon)
                        </div>
                      )}
                    </div>

                    {/* Individual download progress */}
                    {downloading && (
                      <div className="space-y-1 pt-1">
                        <div className="flex justify-between text-[11px] font-medium text-slate-600 dark:text-slate-300">
                          <span>Saving questions...</span>
                          <span>{downloading.progress}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-200"
                            style={{ width: `${downloading.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions Footer */}
                  <div className="pt-2.5 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-2">
                    {downloaded && downloaded.questionCount > 0 ? (
                      <>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleLaunchPractice(subj.id, subj.name)}
                            className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                            title="Start untimed practice with instant feedback & answers"
                          >
                            <Play className="w-3 h-3 fill-current" />
                            Practice
                          </button>

                          <button
                            onClick={() => handleLaunchCbt(subj.id, subj.name)}
                            className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                            title="Start timed CBT simulation for this subject"
                          >
                            <Layers className="w-3 h-3" />
                            CBT
                          </button>
                        </div>

                        <button
                          onClick={() => handleRemoveSubject(subj.id)}
                          className="text-rose-600 dark:text-rose-400 hover:text-rose-700 font-medium text-xs inline-flex items-center gap-1 cursor-pointer p-1"
                          title="Remove from offline cache"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    ) : (
                      <>
                        <span className="text-[11px] text-slate-400">
                          {availableCount > 0 ? `${availableCount} Qs Available` : 'No Qs in bank'}
                        </span>
                        {availableCount > 0 ? (
                          <button
                            onClick={() => handleDownloadSubject(subj.id, subj.name)}
                            disabled={Boolean(downloading) || isDownloadingAll}
                            className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:hover:bg-blue-900/70 dark:text-blue-300 font-semibold text-xs inline-flex items-center gap-1 transition-colors disabled:opacity-50 cursor-pointer"
                          >
                            <Download className="w-3 h-3" />
                            Download
                          </button>
                        ) : (
                          <button
                            disabled
                            className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 text-xs font-medium cursor-not-allowed"
                          >
                            Unavailable
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: EXAM HISTORY & ANSWER REVIEWS */}
      {activeHubTab === 'history' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Offline CBT & Practice History
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Completed tests saved in your browser. Click "Review Answers" to examine step-by-step solutions offline.
              </p>
            </div>
          </div>

          {offlineHistory.length > 0 ? (
            <div className="space-y-3">
              {offlineHistory.map(attempt => {
                const isPassed = attempt.percentage >= 50;
                return (
                  <div
                    key={attempt.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-slate-900 dark:text-white">
                          {attempt.subjectName || attempt.subject}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isPassed 
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                        }`}>
                          {attempt.percentage}%
                        </span>
                        {Boolean((attempt as any).isJambCbt || attempt.totalQuestions >= 40) && (
                          <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 rounded">
                            CBT Exam
                          </span>
                        )}
                        {attempt.syncStatus === 'pending' && (
                          <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 rounded inline-flex items-center gap-1">
                            <Cloud className="w-2.5 h-2.5" />
                            Offline Saved
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                        <span>Score: {attempt.score} / {attempt.totalQuestions}</span>
                        <span>•</span>
                        <span>Time: {Math.round((attempt.timeSpentSeconds || 0) / 60)} mins</span>
                        <span>•</span>
                        <span>{new Date(attempt.completedAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleReviewAttempt(attempt)}
                      className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:hover:bg-blue-900/70 dark:text-blue-300 font-semibold text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                    >
                      <CheckSquare className="w-3.5 h-3.5" />
                      Review Answers & Explanations
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 text-center space-y-3">
              <Clock className="w-8 h-8 mx-auto text-slate-400" />
              <h4 className="text-sm font-bold text-slate-800 dark:text-white">
                No Offline Test History Yet
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                Download an approved JAMB subject above and start practicing. Your results and step-by-step solutions will be stored here for review anytime.
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SAVED BOOKMARKS */}
      {activeHubTab === 'bookmarks' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                Offline Bookmarked Questions
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Questions you saved during practice. Review full options, verified answers, and detailed derivations.
              </p>
            </div>
          </div>

          {offlineBookmarks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {offlineBookmarks.map(b => (
                <div
                  key={b.questionId}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/80 space-y-2.5 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 uppercase">
                        {b.subject} {b.question?.year ? `• ${b.question.year}` : ''}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(b.savedAt || Date.now()).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-xs text-slate-800 dark:text-slate-200 font-medium line-clamp-3">
                      {b.question?.question || 'Bookmarked question'}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-400">
                      Topic: {b.question?.topic || 'General'}
                    </span>
                    <button
                      onClick={() => setSelectedBookmark(b)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:hover:bg-emerald-950/70 dark:text-emerald-300 font-semibold text-xs inline-flex items-center gap-1 cursor-pointer"
                    >
                      <HelpCircle className="w-3 h-3" />
                      View Solution
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 text-center space-y-3">
              <Bookmark className="w-8 h-8 mx-auto text-slate-400" />
              <h4 className="text-sm font-bold text-slate-800 dark:text-white">
                No Bookmarked Questions Yet
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                During JAMB practice or CBT, click the Bookmark icon on any tricky question to save it here for offline review.
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: LITERATURE NOVELS */}
      {activeHubTab === 'novels' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                Offline Literature Texts
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Official JAMB UTME prescribed prose and drama texts with full chapter summaries and questions.
              </p>
            </div>

            <button
              onClick={() => setView('novels')}
              className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
            >
              Open Novels Library
            </button>
          </div>

          {offlineNovels.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {offlineNovels.map(novel => {
                const progressPct = novel.readingProgress?.percentage || 0;
                const lastChap = (novel.readingProgress?.currentChapterIndex ?? 0) + 1;

                return (
                  <div
                    key={novel.novelId}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/80 flex flex-col justify-between space-y-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-16 rounded-lg bg-gradient-to-br from-amber-700 to-slate-900 flex items-center justify-center text-white shrink-0 shadow-xs">
                        <BookOpen className="w-6 h-6 opacity-80" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                          {novel.title}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          By {novel.author} • {novel.chapterCount} Chapters
                        </p>
                        <div className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                          Progress: Chapter {lastChap} of {novel.chapterCount} ({progressPct}%)
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-700/60">
                      <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-600 rounded-full"
                          style={{ width: `${Math.max(5, progressPct)}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-xs pt-1">
                        <span className="text-[11px] text-slate-400">
                          Full text & study questions offline
                        </span>
                        <button
                          onClick={() => handleReadNovel(novel.novelId)}
                          className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          Read Offline
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 text-center space-y-3">
              <BookOpen className="w-8 h-8 mx-auto text-slate-400" />
              <h4 className="text-sm font-bold text-slate-800 dark:text-white">
                No Literature Novels Downloaded
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                Download the official JAMB novel (*The Lekki Headmaster*) to read full chapters and practice comprehension questions offline.
              </p>
              <button
                onClick={() => setIsPrepareModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Download Prescribed Novels
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: FLASHCARDS */}
      {activeHubTab === 'flashcards' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                Saved Flashcards
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {totalCards} cards across {flashcardDecks.length} deck{flashcardDecks.length === 1 ? '' : 's'} available offline
              </p>
            </div>

            <button
              onClick={() => setView('flashcards')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              Open All Decks
            </button>
          </div>

          {flashcardDecks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {flashcardDecks.map(deck => (
                <div
                  key={deck.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/80 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                          {deck.name}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {deck.subject} • {deck.topic}
                        </p>
                      </div>
                      {deck.dueTodayCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                          {deck.dueTodayCount} Due
                        </span>
                      )}
                    </div>

                    <div className="mt-3 flex items-center gap-2 text-xs">
                      <span className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-medium">
                        {deck.cardCount} Cards
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-end">
                    <button
                      onClick={() => handleStudyDeck(deck)}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      Study Offline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 text-center space-y-3">
              <Layers className="w-8 h-8 mx-auto text-slate-400" />
              <h4 className="text-sm font-bold text-slate-800 dark:text-white">
                No Flashcards Cached Offline
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                Save your flashcards locally to practice spaced-repetition without internet connection.
              </p>
              <button
                onClick={() => setIsPrepareModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Download My Flashcards
              </button>
            </div>
          )}
        </div>
      )}

      {/* Bookmark Explanation Modal */}
      {selectedBookmark && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                {selectedBookmark.subject} • {selectedBookmark.question?.topic || 'General'}
              </span>
              <button
                onClick={() => setSelectedBookmark(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-semibold cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Question Text & Passage */}
            <div className="space-y-2">
              {selectedBookmark.question?.passage && (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 text-xs text-slate-700 dark:text-slate-300 italic border-l-2 border-blue-500">
                  {selectedBookmark.question.passage}
                </div>
              )}
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                {selectedBookmark.question?.question}
              </h4>
            </div>

            {/* Options */}
            {selectedBookmark.question?.options && (
              <div className="space-y-1.5 pt-1">
                {selectedBookmark.question.options.map((opt, idx) => {
                  const letter = String.fromCharCode(65 + idx);
                  const isCorrect = 
                    idx === selectedBookmark.question?.correctAnswer ||
                    idx === (selectedBookmark.question as any)?.correctAnswerIndex;

                  return (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-xl text-xs flex items-center gap-2 border ${
                        isCorrect
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200 font-semibold'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        isCorrect
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}>
                        {letter}
                      </span>
                      <span>{opt}</span>
                      {isCorrect && (
                        <CheckCircle2 className="w-4 h-4 ml-auto text-emerald-600 dark:text-emerald-400 shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Step-by-step Explanation */}
            {selectedBookmark.question?.explanation && (
              <div className="p-3.5 bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 rounded-xl space-y-1">
                <span className="text-[11px] font-bold text-blue-700 dark:text-blue-300 uppercase block">
                  Verified Derivation & Explanation:
                </span>
                <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line">
                  {selectedBookmark.question.explanation}
                </p>
              </div>
            )}

            <button
              onClick={() => setSelectedBookmark(null)}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
            >
              Close Solution
            </button>
          </div>
        </div>
      )}

      {/* Multi-Subject CBT Mock Setup Modal */}
      {isMultiCbtModalOpen && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Full JAMB CBT Offline Mock
                </h3>
              </div>
              <button
                onClick={() => setIsMultiCbtModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-semibold cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              Simulate the real 4-subject JAMB CBT examination completely offline with a countdown timer and instant multi-subject result scoring.
            </p>

            {/* Subject Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                Select Your 4 Subjects ({selectedCbtSubjects.length}/4 Selected)
              </label>

              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1">
                {OFFICIAL_JAMB_SUBJECTS.map(s => {
                  const isSelected = selectedCbtSubjects.includes(s.id);
                  const isDownloaded = downloadedMap.has(s.id.toLowerCase());

                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          setSelectedCbtSubjects(prev => prev.filter(id => id !== s.id));
                        } else {
                          if (selectedCbtSubjects.length >= 4) {
                            setToastMessage('You can select up to 4 subjects for a JAMB CBT exam.');
                            return;
                          }
                          setSelectedCbtSubjects(prev => [...prev, s.id]);
                        }
                      }}
                      className={`p-2 rounded-xl text-xs font-semibold text-left border flex items-center justify-between transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-500 text-indigo-700 dark:text-indigo-300'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                      }`}
                    >
                      <span className="truncate">{s.name}</span>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Exam Duration */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                Exam Duration
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[60, 90, 120].map(mins => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setCbtDurationMinutes(mins)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                      cbtDurationMinutes === mins
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900 dark:border-white'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {mins} Minutes
                  </button>
                ))}
              </div>
            </div>

            {/* Launch Button */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsMultiCbtModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLaunchMultiSubjectCbt}
                disabled={selectedCbtSubjects.length === 0}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold inline-flex items-center gap-2 transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
              >
                <Play className="w-4 h-4 fill-current" />
                Start Offline JAMB CBT
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Prepare for Offline Modal */}
      {isPrepareModalOpen && (
        <PrepareForOfflineModal
          isOpen={isPrepareModalOpen}
          onClose={() => setIsPrepareModalOpen(false)}
          onRefreshHub={loadData}
        />
      )}
    </div>
  );
}
