import React, { useState, useEffect, useCallback } from 'react';
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
  Compass
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  fetchOfflineHubData, 
  OfflineHubData, 
  UnfinishedPracticeInfo, 
  OfflineNovelItem 
} from '../../services/offlineHubService';
import { DownloadedSubjectMeta } from '../../services/jambOfflineDb';
import { FlashcardDeck } from '../../types';
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
  const [selectedBookmark, setSelectedBookmark] = useState<any | null>(null);
  const [checkingConnection, setCheckingConnection] = useState<boolean>(false);
  const [onlineNotification, setOnlineNotification] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const hubData = await fetchOfflineHubData(user.uid);
      setData(hubData);
    } catch (err) {
      console.warn('Failed to load offline hub data:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Check connection manually
  const handleCheckConnection = async () => {
    setCheckingConnection(true);
    if (typeof navigator !== 'undefined' && navigator.onLine) {
      // Test fetch or trigger online
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

  // Launch Resume Practice
  const handleResumePractice = () => {
    setView('practice');
  };

  // Launch Offline JAMB Subject Practice
  const handleStartJambSubject = (subjectId: string, subjectName: string) => {
    try {
      localStorage.setItem('zetadu_target_subject', subjectName);
      localStorage.setItem('zetadu_target_subject_id', subjectId);
    } catch (_) {}
    setView('jamb');
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

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 min-h-[400px]">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">
          Loading offline storage...
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
  const jambBookmarks = data?.bookmarks.jambBookmarks || [];
  const novelBookmarks = data?.bookmarks.novelBookmarks || [];
  const progress = data?.studyProgress;
  const unsyncedCount = data?.unsyncedCount || 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* 1. Offline Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-600/5 to-orange-500/10 dark:from-amber-950/40 dark:via-slate-900 dark:to-orange-950/40 border border-amber-300 dark:border-amber-800/80 p-5 sm:p-7 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-xs">
                <WifiOff className="w-3.5 h-3.5" />
                Offline Mode Active
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                <ShieldCheck className="w-3.5 h-3.5" />
                Local Storage Ready
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              LearnDean Offline Learning Hub
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              No internet connection detected. You have immediate, full access to your downloaded JAMB past questions, saved flashcards, offline literature texts, and unfinished practice sessions.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2.5 flex-wrap shrink-0">
            <button
              onClick={() => setIsPrepareModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 text-xs sm:text-sm font-semibold transition-all inline-flex items-center gap-2 shadow-2xs cursor-pointer"
            >
              <Download className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Manage Downloads
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

      {/* 2. Continue Learning Hero Section */}
      {continueItem && (
        <div className="rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              <Compass className="w-4 h-4" />
              Continue Learning
            </div>
            {continueItem.progressPercent !== undefined && (
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {continueItem.progressPercent}% Completed
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                {continueItem.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                {continueItem.subtitle}
              </p>
            </div>

            <button
              onClick={() => {
                if (continueItem.type === 'unfinished_practice') {
                  handleResumePractice();
                } else if (continueItem.type === 'novel') {
                  handleReadNovel(continueItem.metadata?.novelId);
                } else {
                  setView('journey');
                }
              }}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm inline-flex items-center justify-center gap-2 transition-all shadow-xs shrink-0 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              {continueItem.actionLabel}
            </button>
          </div>

          {continueItem.progressPercent !== undefined && (
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${Math.max(5, continueItem.progressPercent)}%` }}
              />
            </div>
          )}
        </div>
      )}

      {/* 3. Unfinished Practice Section (Detailed) */}
      {unfinished && (
        <div className="rounded-2xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/40 dark:bg-blue-950/20 p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                Unfinished Practice Session
              </h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
              Active Session
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-slate-400 text-[11px] block">Subject</span>
              <span className="font-bold text-slate-800 dark:text-white truncate block">
                {unfinished.subject}
              </span>
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-slate-400 text-[11px] block">Topic</span>
              <span className="font-bold text-slate-800 dark:text-white truncate block">
                {unfinished.topic}
              </span>
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-slate-400 text-[11px] block">Progress</span>
              <span className="font-bold text-slate-800 dark:text-white block">
                {unfinished.answeredCount} of {unfinished.totalQuestions} Answered
              </span>
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-slate-400 text-[11px] block">Timer Left</span>
              <span className="font-bold text-slate-800 dark:text-white block">
                {Math.floor(unfinished.timerRemaining / 60)}m {unfinished.timerRemaining % 60}s
              </span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={handleResumePractice}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              Resume Practice Test
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 4. Downloaded JAMB Content */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Downloaded JAMB Content
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Official past questions and answers cached locally for full CBT practice
            </p>
          </div>

          <button
            onClick={() => setIsPrepareModalOpen(true)}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
          >
            Manage Offline Data
          </button>
        </div>

        {downloadedSubs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {downloadedSubs.map(subj => (
              <div
                key={subj.subjectId}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/80 hover:border-blue-300 dark:hover:border-blue-700 transition-all flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                        {subj.name}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Code: {subj.code}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                      Offline Ready
                    </span>
                  </div>

                  <div className="mt-3 flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300 flex-wrap">
                    <span className="bg-slate-100 dark:bg-slate-700/60 px-2 py-0.5 rounded-md font-medium">
                      {subj.questionCount} Questions
                    </span>
                    <span className="bg-slate-100 dark:bg-slate-700/60 px-2 py-0.5 rounded-md font-medium">
                      Years: {subj.years?.slice(0, 3).join(', ')}...
                    </span>
                    <span className="text-slate-400 text-[11px]">
                      ~{Math.round(subj.sizeKb)} KB
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Saved on {new Date(subj.downloadedAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => handleStartJambSubject(subj.subjectId, subj.name)}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    Practice
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400">
              <Download className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-white">
                No JAMB Subjects Saved Offline
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1">
                You haven't downloaded any JAMB past questions yet. Click "Manage Downloads" below to cache subjects for offline study.
              </p>
            </div>
            <button
              onClick={() => setIsPrepareModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Download JAMB Subjects Now
            </button>
          </div>
        )}
      </div>

      {/* 5. Saved Flashcards Section */}
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
                    {deck.bookmarkedCount > 0 && (
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium">
                        {deck.bookmarkedCount} Bookmarked
                      </span>
                    )}
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
          <div className="p-6 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-white">
                No Flashcards Cached Offline
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1">
                Save your flashcards locally to practice spaced-repetition without internet connection.
              </p>
            </div>
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

      {/* 6. Offline Novels Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              Offline Literature Novels
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Prescribed UTME prose and drama texts with full chapter summaries and analyses
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
                        Full text & practice offline
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
          <div className="p-6 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-white">
                No Literature Novels Downloaded
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1">
                Download the official JAMB novel (*The Lekki Headmaster*) to read full chapters and answer study questions offline.
              </p>
            </div>
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

      {/* 7. Bookmarks Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Saved Bookmarks
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {jambBookmarks.length} question{jambBookmarks.length === 1 ? '' : 's'} and {novelBookmarks.length} literature quote{novelBookmarks.length === 1 ? '' : 's'} bookmarked for review
            </p>
          </div>
        </div>

        {jambBookmarks.length > 0 || novelBookmarks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {jambBookmarks.slice(0, 4).map(b => (
              <div
                key={b.questionId}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/80 space-y-2 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 uppercase">
                    {b.subject} {b.question?.year ? `• ${b.question.year}` : ''}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(b.savedAt || Date.now()).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-slate-800 dark:text-slate-200 font-medium line-clamp-2">
                  {b.question?.question || 'Saved JAMB question'}
                </p>
                <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400">
                    Topic: {b.question?.topic || 'General'}
                  </span>
                  <button
                    onClick={() => setSelectedBookmark(b)}
                    className="text-emerald-600 dark:text-emerald-400 hover:underline font-semibold text-[11px] cursor-pointer"
                  >
                    View Explanation
                  </button>
                </div>
              </div>
            ))}

            {novelBookmarks.slice(0, 2).map(nb => (
              <div
                key={nb.id}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/80 space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300">
                    {nb.novelTitle || 'Novel'} • Chapter {nb.chapterIndex + 1}
                  </span>
                </div>
                <p className="text-xs italic text-slate-700 dark:text-slate-300 line-clamp-2">
                  "{nb.paragraphText}"
                </p>
                <div className="text-[11px] text-slate-400">
                  {nb.note ? `Note: ${nb.note}` : (nb.chapterTitle || 'Saved Passage')}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 text-xs text-slate-500 dark:text-slate-400">
            No bookmarks saved yet. You can bookmark challenging questions or novel quotes during practice to review them here anytime.
          </div>
        )}
      </div>

      {/* 8. Saved Study Progress Section */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/90 p-5 sm:p-6 space-y-4">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          Saved Study Progress
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 space-y-1">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Level & XP
            </span>
            <span className="text-lg font-extrabold text-slate-900 dark:text-white block">
              Lvl {progress?.level || 1}
            </span>
            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold block">
              {progress?.xp || 0} XP
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 space-y-1">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Exam Readiness
            </span>
            <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 block">
              {progress?.examReadiness ? `${progress.examReadiness}%` : 'High'}
            </span>
            <span className="text-[10px] text-slate-400 block">
              Diagnostic Rating
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 space-y-1">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Offline Tests
            </span>
            <span className="text-lg font-extrabold text-slate-900 dark:text-white block">
              {progress?.offlineAttemptsCount || 0}
            </span>
            <span className="text-[10px] text-slate-400 block">
              Completed Locally
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 space-y-1">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Literature Progress
            </span>
            <span className="text-lg font-extrabold text-slate-900 dark:text-white block">
              {progress?.chaptersReadCount || 0}
            </span>
            <span className="text-[10px] text-slate-400 block">
              Chapters Completed
            </span>
          </div>
        </div>
      </div>

      {/* 9. Online-Only Features (Visible & Labeled "Online Required") */}
      <div className="space-y-3 pt-2">
        <div className="space-y-0.5">
          <h3 className="text-sm sm:text-base font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Lock className="w-4 h-4 text-slate-400" />
            Cloud & AI Features (Online Required)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            The following tools require an active internet connection and will become active automatically when you reconnect.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Card 1: AI Tutor */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 relative space-y-2 opacity-85">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center">
                <Brain className="w-4 h-4" />
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                Online Required
              </span>
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                AI Interactive Tutor
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-normal">
                Real-time Gemini AI tutoring and conversational step-by-step problem guidance.
              </p>
            </div>
          </div>

          {/* Card 2: AI Practice & Flashcard Gen */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 relative space-y-2 opacity-85">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                Online Required
              </span>
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                AI Question & Flashcard Gen
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-normal">
                Generating dynamic questions or custom decks from uploaded lesson notes.
              </p>
            </div>
          </div>

          {/* Card 3: Cloud Sync */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 relative space-y-2 opacity-85">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center">
                <Cloud className="w-4 h-4" />
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                Online Required
              </span>
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                Cloud Sync Engine
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-normal">
                {unsyncedCount > 0 
                  ? `${unsyncedCount} offline record${unsyncedCount === 1 ? '' : 's'} queued to sync upon reconnection.` 
                  : 'Synchronizes your device progress and test scores across multiple browsers.'}
              </p>
            </div>
          </div>

          {/* Card 4: New Downloads */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 relative space-y-2 opacity-85">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center">
                <Download className="w-4 h-4" />
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                Online Required
              </span>
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                New Content Downloads
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-normal">
                Downloading newly released UTME subjects, past years, or supplemental textbooks.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bookmark Explanation Modal */}
      {selectedBookmark && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                {selectedBookmark.subject} • {selectedBookmark.question?.topic || selectedBookmark.topic || 'General'}
              </span>
              <button
                onClick={() => setSelectedBookmark(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                Question:
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                {selectedBookmark.question?.question || selectedBookmark.questionText}
              </p>
            </div>
            {(selectedBookmark.question?.explanation || selectedBookmark.explanation) && (
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-1">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                  Explanation:
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-300">
                  {selectedBookmark.question?.explanation || selectedBookmark.explanation}
                </p>
              </div>
            )}
            <button
              onClick={() => setSelectedBookmark(null)}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
            >
              Done
            </button>
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
