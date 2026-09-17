import React, { useState, useEffect } from 'react';
import { 
  X, 
  Download, 
  CheckCircle2, 
  Trash2, 
  BookOpen, 
  Layers, 
  HardDrive, 
  AlertCircle, 
  RefreshCw, 
  Sparkles,
  Wifi,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { OFFICIAL_JAMB_SUBJECTS, JambSubject } from '../../data/jambSubjects';
import { NOVELS_COLLECTION } from '../../data/novels';
import { 
  jambOfflineDb, 
  DownloadedSubjectMeta 
} from '../../services/jambOfflineDb';
import { 
  getDownloadedNovelsList, 
  DownloadedNovelMeta 
} from '../../services/novelOfflineDb';
import { 
  downloadJambSubjectOffline, 
  removeDownloadedJambSubject,
  downloadLiteratureNovelOffline,
  removeLiteratureNovelOffline,
  cacheFlashcardsLocally
} from '../../services/offlineHubService';
import { db } from '../../lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
import { Flashcard } from '../../types';

interface PrepareForOfflineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefreshHub?: () => void;
}

type TabType = 'jamb' | 'novels' | 'flashcards';

export default function PrepareForOfflineModal({
  isOpen,
  onClose,
  onRefreshHub
}: PrepareForOfflineModalProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('jamb');

  // Downloaded tracking
  const [downloadedJambMap, setDownloadedJambMap] = useState<Map<string, DownloadedSubjectMeta>>(new Map());
  const [downloadedNovelMap, setDownloadedNovelMap] = useState<Map<string, DownloadedNovelMeta>>(new Map());
  const [cachedFlashcardsCount, setCachedFlashcardsCount] = useState<number>(0);

  // Active download state per item
  const [downloadingSubjects, setDownloadingSubjects] = useState<Record<string, { progress: number; current: number; total: number }>>({});
  const [downloadingNovels, setDownloadingNovels] = useState<Record<string, { progress: number; current: number; total: number }>>({});
  const [isCachingFlashcards, setIsCachingFlashcards] = useState<boolean>(false);
  const [flashcardMessage, setFlashcardMessage] = useState<string | null>(null);

  // Bundle download state
  const [isDownloadingBundle, setIsDownloadingBundle] = useState<boolean>(false);
  const [bundleProgress, setBundleProgress] = useState<{ step: string; current: number; total: number } | null>(null);

  // Load existing offline status
  const loadDownloadedStatus = async () => {
    try {
      const jambList = await jambOfflineDb.getDownloadedSubjects();
      const jambMap = new Map<string, DownloadedSubjectMeta>();
      jambList.forEach(item => jambMap.set(item.subjectId, item));
      setDownloadedJambMap(jambMap);

      const novelList = await getDownloadedNovelsList();
      const novelMap = new Map<string, DownloadedNovelMeta>();
      novelList.forEach(n => novelMap.set(n.novelId, n));
      setDownloadedNovelMap(novelMap);

      if (user) {
        const rawCards = localStorage.getItem(`learndean_flashcards_cache_${user.uid}`);
        if (rawCards) {
          const parsed = JSON.parse(rawCards);
          setCachedFlashcardsCount(Array.isArray(parsed) ? parsed.length : 0);
        }
      }
    } catch (err) {
      console.warn('Error checking offline status:', err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadDownloadedStatus();
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  // Handle single JAMB download
  const handleDownloadSubject = async (subjectId: string) => {
    setDownloadingSubjects(prev => ({
      ...prev,
      [subjectId]: { progress: 0, current: 0, total: 40 }
    }));

    try {
      await downloadJambSubjectOffline(subjectId, (percent, current, total) => {
        setDownloadingSubjects(prev => ({
          ...prev,
          [subjectId]: { progress: percent, current, total }
        }));
      });

      await loadDownloadedStatus();
      if (onRefreshHub) onRefreshHub();
    } catch (err) {
      console.error(`Failed to download JAMB subject ${subjectId}:`, err);
    } finally {
      setDownloadingSubjects(prev => {
        const next = { ...prev };
        delete next[subjectId];
        return next;
      });
    }
  };

  // Handle JAMB removal
  const handleRemoveSubject = async (subjectId: string) => {
    try {
      await removeDownloadedJambSubject(subjectId);
      await loadDownloadedStatus();
      if (onRefreshHub) onRefreshHub();
    } catch (err) {
      console.error(`Failed to remove JAMB subject ${subjectId}:`, err);
    }
  };

  // Handle Recommended 4-Subject Bundle Download
  const handleDownloadRecommendedBundle = async () => {
    // English + Mathematics + Physics + Chemistry
    const bundleSubjectIds = ['english', 'mathematics', 'physics', 'chemistry'];
    setIsDownloadingBundle(true);

    try {
      for (let i = 0; i < bundleSubjectIds.length; i++) {
        const subId = bundleSubjectIds[i];
        const subName = OFFICIAL_JAMB_SUBJECTS.find(s => s.id === subId)?.name || subId;
        setBundleProgress({
          step: `Downloading ${subName} (${i + 1} of ${bundleSubjectIds.length})...`,
          current: i + 1,
          total: bundleSubjectIds.length
        });

        await downloadJambSubjectOffline(subId);
      }

      await loadDownloadedStatus();
      if (onRefreshHub) onRefreshHub();
    } catch (err) {
      console.error('Error downloading bundle:', err);
    } finally {
      setIsDownloadingBundle(false);
      setBundleProgress(null);
    }
  };

  // Handle Novel download
  const handleDownloadNovel = async (novelId: string) => {
    setDownloadingNovels(prev => ({
      ...prev,
      [novelId]: { progress: 0, current: 0, total: 10 }
    }));

    try {
      await downloadLiteratureNovelOffline(novelId, (percent, currentChapter, totalChapters) => {
        setDownloadingNovels(prev => ({
          ...prev,
          [novelId]: { progress: percent, current: currentChapter, total: totalChapters }
        }));
      });

      await loadDownloadedStatus();
      if (onRefreshHub) onRefreshHub();
    } catch (err) {
      console.error(`Failed to download novel ${novelId}:`, err);
    } finally {
      setDownloadingNovels(prev => {
        const next = { ...prev };
        delete next[novelId];
        return next;
      });
    }
  };

  // Handle Novel removal
  const handleRemoveNovel = async (novelId: string) => {
    try {
      await removeLiteratureNovelOffline(novelId);
      await loadDownloadedStatus();
      if (onRefreshHub) onRefreshHub();
    } catch (err) {
      console.error(`Failed to remove novel ${novelId}:`, err);
    }
  };

  // Handle Flashcards Caching
  const handleCacheFlashcards = async () => {
    if (!user) {
      setFlashcardMessage('Sign in to sync and cache your personalized flashcard decks.');
      return;
    }

    setIsCachingFlashcards(true);
    setFlashcardMessage(null);

    try {
      const q = query(collection(db, 'flashcards'), where('uid', '==', user.uid));
      const snap = await getDocs(q);
      const cards: Flashcard[] = [];
      snap.forEach(d => {
        const data = d.data();
        cards.push({
          id: d.id,
          uid: data.uid,
          subject: data.subject || 'General',
          topic: data.topic || 'General Topics',
          deckName: data.deckName || data.subject || 'General Deck',
          deckId: data.deckId,
          front: data.front || '',
          back: data.back || '',
          explanation: data.explanation || '',
          difficulty: data.difficulty || 'Medium',
          bookmarked: data.bookmarked === true,
          createdAt: data.createdAt || Date.now()
        });
      });

      cacheFlashcardsLocally(user.uid, cards);
      setCachedFlashcardsCount(cards.length);
      setFlashcardMessage(`Successfully cached ${cards.length} flashcard${cards.length === 1 ? '' : 's'} for offline review!`);
      if (onRefreshHub) onRefreshHub();
    } catch (err) {
      console.error('Failed to cache flashcards:', err);
      setFlashcardMessage('Failed to download flashcards from server. Please check your internet connection.');
    } finally {
      setIsCachingFlashcards(false);
    }
  };

  // Calculate total offline storage used
  const totalJambKb = Array.from(downloadedJambMap.values()).reduce((acc, curr) => acc + curr.sizeKb, 0);
  const totalJambQuestions = Array.from(downloadedJambMap.values()).reduce((acc, curr) => acc + curr.questionCount, 0);

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh] overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                Prepare for Offline
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Choose content to download for uninterrupted offline learning
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Storage & Summary Banner */}
        <div className="px-4 sm:px-6 py-3 bg-slate-100/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700/60 flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <HardDrive className="w-4 h-4 text-slate-500 shrink-0" />
            <span>
              Downloaded: <strong className="text-slate-900 dark:text-white">{downloadedJambMap.size}</strong> subjects ({totalJambQuestions} questions), <strong className="text-slate-900 dark:text-white">{downloadedNovelMap.size}</strong> novels
            </span>
          </div>
          <div className="text-slate-500 dark:text-slate-400">
            Storage: <span className="font-semibold text-blue-600 dark:text-blue-400">~{Math.round(totalJambKb)} KB</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 bg-white dark:bg-slate-900">
          <button
            onClick={() => setActiveTab('jamb')}
            className={`flex items-center gap-2 py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'jamb'
                ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            JAMB Subjects ({downloadedJambMap.size})
          </button>
          <button
            onClick={() => setActiveTab('novels')}
            className={`flex items-center gap-2 py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'novels'
                ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Prescribed Novels ({downloadedNovelMap.size})
          </button>
          <button
            onClick={() => setActiveTab('flashcards')}
            className={`flex items-center gap-2 py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'flashcards'
                ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            Flashcards ({cachedFlashcardsCount})
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* TAB 1: JAMB SUBJECTS */}
          {activeTab === 'jamb' && (
            <div className="space-y-4">
              {/* Quick 4-Subject Recommended Bundle */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-200 dark:border-blue-900/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Recommended UTME 4-Subject Starter Pack
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                    Instantly bundle English, Mathematics, Physics, and Chemistry for full offline CBT simulation.
                  </p>
                </div>

                <button
                  onClick={handleDownloadRecommendedBundle}
                  disabled={isDownloadingBundle}
                  className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors shrink-0 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                >
                  {isDownloadingBundle ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Downloading Bundle...
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      Download 4-Subject Bundle
                    </>
                  )}
                </button>
              </div>

              {/* Bundle Progress Indicator if active */}
              {isDownloadingBundle && bundleProgress && (
                <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 space-y-1.5 animate-pulse">
                  <div className="flex justify-between text-xs font-semibold text-blue-800 dark:text-blue-300">
                    <span>{bundleProgress.step}</span>
                    <span>{Math.round((bundleProgress.current / bundleProgress.total) * 100)}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-blue-200 dark:bg-blue-900 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 transition-all duration-300"
                      style={{ width: `${(bundleProgress.current / bundleProgress.total) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Subject List */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-1">
                  Official JAMB UTME Subject Catalog
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {OFFICIAL_JAMB_SUBJECTS.map(subj => {
                    const downloaded = downloadedJambMap.get(subj.id);
                    const downloading = downloadingSubjects[subj.id];

                    return (
                      <div
                        key={subj.id}
                        className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-bold text-sm text-slate-900 dark:text-white">
                                {subj.name}
                              </span>
                              {subj.compulsory && (
                                <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 rounded">
                                  Compulsory
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                              {subj.code} • {subj.category}
                            </p>
                          </div>

                          {downloaded ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                              <CheckCircle2 className="w-3 h-3" />
                              Ready
                            </span>
                          ) : null}
                        </div>

                        {/* Progress bar if currently downloading */}
                        {downloading && (
                          <div className="mt-3 space-y-1">
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

                        {/* Actions */}
                        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs">
                          {downloaded ? (
                            <>
                              <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                                {downloaded.questionCount} Qs • {Math.round(downloaded.sizeKb)} KB
                              </span>
                              <button
                                onClick={() => handleRemoveSubject(subj.id)}
                                className="text-rose-600 dark:text-rose-400 hover:text-rose-700 font-medium inline-flex items-center gap-1 cursor-pointer"
                                title="Delete from offline storage"
                              >
                                <Trash2 className="w-3 h-3" />
                                Remove
                              </button>
                            </>
                          ) : (
                            <>
                              <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                                ~{subj.totalStandardQuestions} Standard Qs
                              </span>
                              <button
                                onClick={() => handleDownloadSubject(subj.id)}
                                disabled={Boolean(downloading)}
                                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium inline-flex items-center gap-1 transition-colors disabled:opacity-50 cursor-pointer"
                              >
                                <Download className="w-3 h-3" />
                                Download
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LITERATURE NOVELS */}
          {activeTab === 'novels' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-800 dark:text-amber-300">
                Offline novels include complete chapters, summaries, character analyses, themes, and study questions.
              </div>

              <div className="space-y-3">
                {NOVELS_COLLECTION.map(novel => {
                  const downloaded = downloadedNovelMap.get(novel.id);
                  const downloading = downloadingNovels[novel.id];

                  return (
                    <div
                      key={novel.id}
                      className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-16 rounded-lg bg-gradient-to-br from-amber-700 to-slate-900 flex items-center justify-center text-white shrink-0 shadow-xs">
                          <BookOpen className="w-6 h-6 opacity-80" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                              {novel.title}
                            </h4>
                            {downloaded && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                                <CheckCircle2 className="w-3 h-3" />
                                Downloaded
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            By {novel.author} • {novel.chapters.length} Chapters • {novel.category}
                          </p>
                          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 line-clamp-1">
                            {novel.syllabusRelevance}
                          </p>
                        </div>
                      </div>

                      <div className="w-full sm:w-auto flex flex-col sm:items-end gap-2">
                        {downloading && (
                          <div className="w-full sm:w-36 space-y-1">
                            <div className="flex justify-between text-[11px] text-slate-600 dark:text-slate-300">
                              <span>Downloading...</span>
                              <span>{downloading.progress}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-blue-600 rounded-full"
                                style={{ width: `${downloading.progress}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {downloaded ? (
                          <div className="flex items-center gap-3">
                            <span className="text-[11px] text-slate-500 dark:text-slate-400">
                              {downloaded.chapterCount} chapters cached
                            </span>
                            <button
                              onClick={() => handleRemoveNovel(novel.id)}
                              className="px-3 py-1.5 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg font-medium inline-flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Remove
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleDownloadNovel(novel.id)}
                            disabled={Boolean(downloading)}
                            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                            Download Full Novel
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: FLASHCARDS */}
          {activeTab === 'flashcards' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                        User Flashcard Decks
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Download and cache all your created and studied flashcards for offline spaced-repetition.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl flex items-center justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-300">
                    Currently Cached Offline:
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {cachedFlashcardsCount} Flashcards
                  </span>
                </div>

                {flashcardMessage && (
                  <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs text-blue-700 dark:text-blue-300">
                    {flashcardMessage}
                  </div>
                )}

                <button
                  onClick={handleCacheFlashcards}
                  disabled={isCachingFlashcards}
                  className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {isCachingFlashcards ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Downloading Flashcards...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Download & Update All My Flashcards
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Stored safely in local device IndexedDB</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
