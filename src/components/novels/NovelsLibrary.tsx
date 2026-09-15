import React, { useState, useEffect, useMemo } from 'react';
import { Novel, NovelReadingProgress, NovelBookmark } from '../../types';
import {
  Search,
  BookOpen,
  Download,
  CheckCircle2,
  Trash2,
  Bookmark,
  WifiOff,
  Clock,
  Sparkles,
  ArrowRight,
  Filter,
  HelpCircle,
  FileText,
  BookmarkCheck,
  Award,
  ChevronRight,
  GraduationCap
} from 'lucide-react';
import {
  getAllNovels,
  getAllUserReadingProgress,
  checkIsNovelOffline,
  downloadNovel,
  removeDownloadedNovel,
  listAllDownloadedNovels,
  syncPendingNovelData,
  isOnline,
  getUserBookmarks,
  deleteBookmark
} from '../../services/novelService';
import { JAMB_SUBJECTS, JAMB_CATEGORIES } from '../../data/novels';
import { useAuth } from '../../contexts/AuthContext';
import NovelReader from './NovelReader';
import NovelPracticeQuiz from './NovelPracticeQuiz';
import NovelStudyMaterialsModal from './NovelStudyMaterialsModal';

export default function NovelsLibrary() {
  const { user } = useAuth();
  const novels = useMemo(() => getAllNovels(), []);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('All Subjects');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');
  const [filterOfflineOnly, setFilterOfflineOnly] = useState<boolean>(false);

  // Active view states
  const [activeNovelForReading, setActiveNovelForReading] = useState<Novel | null>(null);
  const [resumeChapterIndex, setResumeChapterIndex] = useState<number>(0);

  const [activeNovelForQuiz, setActiveNovelForQuiz] = useState<Novel | null>(null);
  const [activeNovelForStudyNotes, setActiveNovelForStudyNotes] = useState<Novel | null>(null);

  // States for offline and progress
  const [offlineMap, setOfflineMap] = useState<Record<string, boolean>>({});
  const [progressMap, setProgressMap] = useState<Record<string, NovelReadingProgress>>({});
  const [downloadingMap, setDownloadingMap] = useState<Record<string, number>>({});
  const [syncNotice, setSyncNotice] = useState<string>('');
  const [showBookmarksDrawer, setShowBookmarksDrawer] = useState<boolean>(false);
  const [allBookmarks, setAllBookmarks] = useState<NovelBookmark[]>([]);

  // Load offline statuses
  const refreshOfflineStatuses = async () => {
    const list = await listAllDownloadedNovels();
    const map: Record<string, boolean> = {};
    list.forEach((item) => {
      map[item.novelId] = true;
    });
    setOfflineMap(map);
  };

  // Load reading progress
  const refreshProgress = async () => {
    if (!user) return;
    const progs = await getAllUserReadingProgress(user.uid);
    setProgressMap(progs);
  };

  // Load all bookmarks
  const refreshAllBookmarks = async () => {
    if (!user) return;
    const bms = await getUserBookmarks(user.uid);
    setAllBookmarks(bms);
  };

  useEffect(() => {
    refreshOfflineStatuses();
    refreshProgress();
    refreshAllBookmarks();
  }, [user]);

  // Listen to custom auto-sync event
  useEffect(() => {
    const handleAutoSync = async () => {
      if (!user) return;
      const res = await syncPendingNovelData(user.uid);
      if (res.syncedProgress > 0 || res.syncedBookmarks > 0) {
        setSyncNotice(`Synced ${res.syncedProgress} progress & ${res.syncedBookmarks} bookmarks to cloud`);
        setTimeout(() => setSyncNotice(''), 4000);
      }
      refreshProgress();
      refreshAllBookmarks();
    };

    window.addEventListener('learndean-novel-online-sync', handleAutoSync);
    if (isOnline() && user) {
      handleAutoSync();
    }

    return () => {
      window.removeEventListener('learndean-novel-online-sync', handleAutoSync);
    };
  }, [user]);

  // Handler: Download novel for offline
  const handleDownloadNovel = async (e: React.MouseEvent, novelId: string) => {
    e.stopPropagation();
    if (downloadingMap[novelId] !== undefined) return;

    setDownloadingMap((prev) => ({ ...prev, [novelId]: 5 }));

    const success = await downloadNovel(novelId, (pct) => {
      setDownloadingMap((prev) => ({ ...prev, [novelId]: pct }));
    });

    setDownloadingMap((prev) => {
      const copy = { ...prev };
      delete copy[novelId];
      return copy;
    });

    if (success) {
      setOfflineMap((prev) => ({ ...prev, [novelId]: true }));
      setSyncNotice('Study material downloaded! Full offline reading and CBT practice available.');
      setTimeout(() => setSyncNotice(''), 3500);
    }
  };

  // Handler: Remove offline download
  const handleRemoveOffline = async (e: React.MouseEvent, novelId: string) => {
    e.stopPropagation();
    if (!window.confirm('Remove this text from offline storage to free device space?')) return;

    await removeDownloadedNovel(novelId);
    setOfflineMap((prev) => {
      const copy = { ...prev };
      delete copy[novelId];
      return copy;
    });
  };

  // Find most recently read text for "Continue Reading" banner
  const mostRecentProgress = useMemo(() => {
    const progressList = Object.values(progressMap);
    if (progressList.length === 0) return null;
    progressList.sort((a, b) => (b.lastReadAt || 0) - (a.lastReadAt || 0));
    const recent = progressList[0];
    const novel = novels.find((n) => n.id === recent.novelId);
    if (!novel) return null;
    return { progress: recent, novel };
  }, [progressMap, novels]);

  // Filter novels
  const filteredNovels = useMemo(() => {
    return novels.filter((novel) => {
      const matchesSearch =
        novel.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        novel.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        novel.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        novel.themes.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesSubject =
        selectedSubject === 'All Subjects' || novel.subject === selectedSubject;

      const matchesCat =
        selectedCategory === 'All Categories' || novel.category === selectedCategory;

      const matchesOffline = !filterOfflineOnly || offlineMap[novel.id];

      return matchesSearch && matchesSubject && matchesCat && matchesOffline;
    });
  }, [novels, searchQuery, selectedSubject, selectedCategory, filterOfflineOnly, offlineMap]);

  // Grouped structure for the requested organized layout
  const organizedSections = useMemo(() => {
    const useOfEnglishNovels = filteredNovels.filter(
      (n) => n.subject === 'JAMB Use of English' && n.category === 'Current JAMB Novel'
    );
    const useOfEnglishTextbooks = filteredNovels.filter(
      (n) => n.subject === 'JAMB Use of English' && n.category === 'Recommended Textbooks'
    );

    const litDrama = filteredNovels.filter(
      (n) => n.subject === 'JAMB Literature-in-English' && n.category === 'Drama'
    );
    const litProse = filteredNovels.filter(
      (n) => n.subject === 'JAMB Literature-in-English' && n.category === 'Prose'
    );
    const litPoetry = filteredNovels.filter(
      (n) => n.subject === 'JAMB Literature-in-English' && n.category === 'Poetry'
    );
    const litTextbooks = filteredNovels.filter(
      (n) => n.subject === 'JAMB Literature-in-English' && n.category === 'Recommended Textbooks'
    );

    return {
      useOfEnglishNovels,
      useOfEnglishTextbooks,
      litDrama,
      litProse,
      litPoetry,
      litTextbooks
    };
  }, [filteredNovels]);

  // If reader view is active, render NovelReader
  if (activeNovelForReading) {
    return (
      <NovelReader
        novel={activeNovelForReading}
        initialChapterIndex={resumeChapterIndex}
        onBack={() => {
          setActiveNovelForReading(null);
          refreshProgress();
          refreshOfflineStatuses();
          refreshAllBookmarks();
        }}
      />
    );
  }

  // Component to render a Material Card with all required data
  const renderMaterialCard = (novel: Novel) => {
    const isDownloaded = offlineMap[novel.id];
    const downloadProgress = downloadingMap[novel.id];
    const userProgress = progressMap[novel.id];
    const percentDone = userProgress?.percentage || 0;
    const completedCount = userProgress?.completedChapters?.length || 0;
    const novelBookmarks = allBookmarks.filter((b) => b.novelId === novel.id);
    const questionsCount = novel.practiceQuestions?.length || 0;

    return (
      <div
        key={novel.id}
        className="bg-white dark:bg-slate-800 rounded-3xl border-2 border-slate-200 dark:border-slate-700/80 hover:border-blue-400 dark:hover:border-blue-500 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between overflow-hidden group"
      >
        <div>
          {/* Header Cover & Quick Meta */}
          <div className="relative h-48 overflow-hidden bg-slate-900">
            <img
              src={novel.coverImage}
              alt={novel.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
              referrerPolicy="no-referrer"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />

            {/* Top Badges */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase bg-blue-600/90 text-white shadow-sm">
                  {novel.subject === 'JAMB Use of English' ? 'Use of English' : 'Literature'}
                </span>
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-black/60 backdrop-blur-md text-slate-200 border border-white/20">
                  {novel.category} {novel.subCategory ? `• ${novel.subCategory}` : ''}
                </span>
              </div>

              {/* Offline download trigger */}
              {isDownloaded ? (
                <div className="flex items-center gap-1 bg-emerald-500 text-white px-2.5 py-1 rounded-lg text-[10px] font-extrabold shadow-md shrink-0">
                  <CheckCircle2 size={12} />
                  <span>Offline</span>
                  <button
                    onClick={(e) => handleRemoveOffline(e, novel.id)}
                    className="ml-1 hover:text-red-200"
                    title="Remove offline download"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={(e) => handleDownloadNovel(e, novel.id)}
                  disabled={downloadProgress !== undefined}
                  className="flex items-center gap-1 bg-white/95 hover:bg-white text-slate-900 px-2.5 py-1 rounded-lg text-[10px] font-bold shadow-md transition-all disabled:opacity-50 shrink-0"
                  title="Save for offline study"
                >
                  <Download size={12} className={downloadProgress !== undefined ? 'animate-bounce' : ''} />
                  <span>
                    {downloadProgress !== undefined ? `${downloadProgress}%` : 'Save Offline'}
                  </span>
                </button>
              )}
            </div>

            {/* Title & Author at bottom of image */}
            <div className="absolute bottom-3 left-4 right-4">
              <p className="text-white/90 text-xs font-semibold">{novel.author} ({novel.year})</p>
              <h4 className="text-lg font-black text-white leading-snug tracking-tight line-clamp-1">
                {novel.title}
              </h4>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-5 space-y-3.5">
            {/* Syllabus Relevance Callout */}
            {novel.syllabusRelevance && (
              <div className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-850/60 text-amber-900 dark:text-amber-300 text-[11px] font-semibold flex items-center gap-1.5">
                <BookmarkCheck size={14} className="text-amber-600 shrink-0" />
                <span className="line-clamp-1">{novel.syllabusRelevance}</span>
              </div>
            )}

            {/* Description */}
            <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
              {novel.description}
            </p>

            {/* Themes / Topics */}
            <div className="flex flex-wrap gap-1.5">
              {novel.themes.slice(0, 2).map((t, idx) => (
                <span
                  key={idx}
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300"
                >
                  {t}
                </span>
              ))}
            </div>

            {/* Stats: Chapters, Reading Time, Bookmarks */}
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-700/50">
              <span className="flex items-center gap-1">
                <BookOpen size={13} /> {novel.totalChapters} {novel.category === 'Poetry' ? 'Poems' : 'Chapters'}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={13} /> {novel.estimatedReadingTime}
              </span>
              {novelBookmarks.length > 0 && (
                <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold">
                  <Bookmark size={12} className="fill-amber-500 text-amber-500" />
                  {novelBookmarks.length} saved
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Card Footer: Progress Bar & Interactive Action Buttons */}
        <div className="p-5 pt-0 space-y-3">
          {/* Progress Tracker */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-bold text-slate-600 dark:text-slate-300">
              <span>Study Progress</span>
              <span>{percentDone}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-700"
                style={{ width: `${percentDone}%` }}
              />
            </div>
            {percentDone > 0 && (
              <p className="text-[10px] text-slate-400 text-right">
                {completedCount} of {novel.totalChapters} parts completed
              </p>
            )}
          </div>

          {/* Action Buttons: Study Materials, Practice Questions, Read Text */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => setActiveNovelForStudyNotes(novel)}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 bg-slate-50 dark:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              title="View Study Notes, Character Profiles, and Themes"
            >
              <FileText size={13} className="text-blue-500" />
              <span>Study Notes</span>
            </button>

            <button
              onClick={() => setActiveNovelForQuiz(novel)}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-amber-400 dark:hover:border-amber-500 bg-slate-50 dark:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              title="Take authentic UTME CBT practice questions"
            >
              <HelpCircle size={13} className="text-amber-500" />
              <span>CBT Practice ({questionsCount})</span>
            </button>
          </div>

          {/* Read / Resume Button */}
          <button
            onClick={() => {
              setActiveNovelForReading(novel);
              setResumeChapterIndex(userProgress?.currentChapterIndex || 0);
            }}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-sm transition-all"
          >
            <BookOpen size={14} />
            <span>{percentDone > 0 ? 'Continue Reading' : 'Start Reading Material'}</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col">
      {/* Top Banner Notice */}
      {syncNotice && (
        <div className="mb-6 p-3 rounded-2xl bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center justify-between animate-fade-in shadow-sm">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-blue-500 animate-pulse" />
            <span>{syncNotice}</span>
          </div>
          <button
            onClick={() => setSyncNotice('')}
            className="text-xs text-blue-500 hover:text-blue-700 font-semibold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header & Bookmarks Button */}
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 dark:text-blue-400">
              JAMB Prescribed Texts & Syllabus Study Materials
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <WifiOff size={11} />
              100% Offline Capable
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            JAMB Literature & English Texts
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-3xl">
            Strictly authentic materials for UTME Use of English and Literature-in-English: Prescribed novels, drama, prose, poetry, and official recommended textbooks with chapter breakdowns, character profiles, themes, and CBT practice questions.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowBookmarksDrawer(true)}
            className="px-4 py-2.5 rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-amber-400 dark:hover:border-amber-500 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-2 transition-all shadow-sm"
          >
            <Bookmark size={16} className="text-amber-500 fill-amber-500" />
            <span>My Bookmarks ({allBookmarks.length})</span>
          </button>
        </div>
      </div>

      {/* CONTINUE READING HERO BANNER (If User Has In-Progress Text) */}
      {mostRecentProgress && (
        <div className="mb-8 p-6 md:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-indigo-950 text-white shadow-xl border border-slate-700/60 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-start sm:items-center gap-5">
              <div className="w-16 h-24 sm:w-20 sm:h-28 rounded-xl overflow-hidden shadow-lg border border-white/20 shrink-0 relative bg-slate-800">
                <img
                  src={mostRecentProgress.novel.coverImage}
                  alt={mostRecentProgress.novel.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30">
                    Continue Reading
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/10 text-slate-300">
                    {mostRecentProgress.novel.subject}
                  </span>
                  {offlineMap[mostRecentProgress.novel.id] && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                      <CheckCircle2 size={11} /> Offline Ready
                    </span>
                  )}
                </div>

                <h3 className="text-lg sm:text-2xl font-black text-white tracking-tight leading-snug">
                  {mostRecentProgress.novel.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 font-medium">
                  {mostRecentProgress.novel.author} • Chapter {mostRecentProgress.progress.currentChapterIndex + 1}: {mostRecentProgress.progress.currentChapterTitle}
                </p>

                {/* Progress bar */}
                <div className="mt-3 flex items-center gap-3">
                  <div className="w-36 sm:w-56 h-2 rounded-full bg-slate-700/80 overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-700"
                      style={{ width: `${mostRecentProgress.progress.percentage || 0}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-blue-300">
                    {mostRecentProgress.progress.percentage || 0}% Completed
                  </span>
                </div>
              </div>
            </div>

            {/* Resume button */}
            <button
              onClick={() => {
                setActiveNovelForReading(mostRecentProgress.novel);
                setResumeChapterIndex(mostRecentProgress.progress.currentChapterIndex || 0);
              }}
              className="px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm shadow-lg hover:shadow-blue-500/25 transition-all flex items-center justify-center gap-2 group/btn shrink-0"
            >
              <span>Resume Study</span>
              <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      )}

      {/* Search Bar & Offline Toggle */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Search JAMB texts, authors, themes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm shadow-sm"
          />
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          <button
            onClick={() => setFilterOfflineOnly(!filterOfflineOnly)}
            className={`px-4 py-2.5 rounded-2xl border-2 text-xs font-bold flex items-center gap-2 transition-all ${
              filterOfflineOnly
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-700'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-400'
            }`}
          >
            <WifiOff size={15} />
            <span>Downloaded Only</span>
            {filterOfflineOnly && <CheckCircle2 size={14} className="text-emerald-500" />}
          </button>
        </div>
      </div>

      {/* Primary Subject Tabs */}
      <div className="flex gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 mb-4 max-w-2xl">
        {JAMB_SUBJECTS.map((subj) => (
          <button
            key={subj}
            onClick={() => {
              setSelectedSubject(subj);
              setSelectedCategory('All Categories');
            }}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-extrabold transition-all text-center ${
              selectedSubject === subj
                ? 'bg-white dark:bg-slate-750 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {subj}
          </button>
        ))}
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar shrink-0 snap-x">
        {JAMB_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all snap-start ${
              selectedCategory === cat
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 border-2 border-slate-200 dark:border-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* STRUCTURED SYLLABUS LAYOUT (When "All Categories" is active)              */}
      {/* ========================================================================= */}
      {selectedCategory === 'All Categories' && searchQuery === '' && !filterOfflineOnly ? (
        <div className="space-y-12 pb-24">
          {/* 1. JAMB Use of English Section */}
          {(selectedSubject === 'All Subjects' || selectedSubject === 'JAMB Use of English') && (
            <div className="space-y-6">
              <div className="border-b-2 border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-600" />
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    JAMB Use of English
                  </h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Prescribed novel (15-20 compulsory exam questions) and core syllabus reference handbooks
                </p>
              </div>

              {/* Sub-group: Current JAMB Novel */}
              {organizedSections.useOfEnglishNovels.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      • Current Prescribed Novel
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {organizedSections.useOfEnglishNovels.map(renderMaterialCard)}
                  </div>
                </div>
              )}

              {/* Sub-group: Recommended Textbooks for Use of English */}
              {organizedSections.useOfEnglishTextbooks.length > 0 && (
                <div className="space-y-3 pt-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      • Recommended Textbooks (Grammar, Lexis & Oral English)
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {organizedSections.useOfEnglishTextbooks.map(renderMaterialCard)}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 2. JAMB Literature-in-English Section */}
          {(selectedSubject === 'All Subjects' || selectedSubject === 'JAMB Literature-in-English') && (
            <div className="space-y-8">
              <div className="border-b-2 border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-500" />
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    JAMB Literature-in-English
                  </h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Official prescribed texts organized by Drama, Prose, Poetry, and General Literary Principles
                </p>
              </div>

              {/* Drama Sub-section */}
              {organizedSections.litDrama.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                      <span>• Drama</span>
                      <span className="text-[10px] text-slate-400 normal-case font-normal">(African & Non-African)</span>
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {organizedSections.litDrama.map(renderMaterialCard)}
                  </div>
                </div>
              )}

              {/* Prose Sub-section */}
              {organizedSections.litProse.length > 0 && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                      <span>• Prose</span>
                      <span className="text-[10px] text-slate-400 normal-case font-normal">(African & Non-African)</span>
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {organizedSections.litProse.map(renderMaterialCard)}
                  </div>
                </div>
              )}

              {/* Poetry Sub-section */}
              {organizedSections.litPoetry.length > 0 && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                      <span>• Poetry</span>
                      <span className="text-[10px] text-slate-400 normal-case font-normal">(African & Non-African Anthologies)</span>
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {organizedSections.litPoetry.map(renderMaterialCard)}
                  </div>
                </div>
              )}

              {/* Recommended Textbooks Sub-section */}
              {organizedSections.litTextbooks.length > 0 && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                      <span>• Recommended Textbooks</span>
                      <span className="text-[10px] text-slate-400 normal-case font-normal">(Literary Terms & Unseen Passages)</span>
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {organizedSections.litTextbooks.map(renderMaterialCard)}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* FLAT FILTERED GRID (When user searches or clicks a specific category) */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-24">
          {filteredNovels.map(renderMaterialCard)}

          {filteredNovels.length === 0 && (
            <div className="col-span-full py-20 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-400">
                <BookOpen size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No JAMB materials found</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md">
                {filterOfflineOnly
                  ? 'You have not saved any materials for offline reading yet. Download any text using the "Save Offline" button.'
                  : 'Try adjusting your search query or subject filters.'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Study Materials & Character Profiles Modal */}
      {activeNovelForStudyNotes && (
        <NovelStudyMaterialsModal
          novel={activeNovelForStudyNotes}
          onClose={() => setActiveNovelForStudyNotes(null)}
          onOpenReader={(chapterIndex = 0) => {
            setActiveNovelForStudyNotes(null);
            setActiveNovelForReading(activeNovelForStudyNotes);
            setResumeChapterIndex(chapterIndex);
          }}
          onOpenPractice={() => {
            const currentNovel = activeNovelForStudyNotes;
            setActiveNovelForStudyNotes(null);
            setActiveNovelForQuiz(currentNovel);
          }}
        />
      )}

      {/* CBT Practice Quiz Modal */}
      {activeNovelForQuiz && (
        <NovelPracticeQuiz
          novel={activeNovelForQuiz}
          onClose={() => setActiveNovelForQuiz(null)}
          onSaveScore={(score) => {
            // Save quiz score
            refreshProgress();
          }}
        />
      )}

      {/* Global Bookmarks Drawer Modal */}
      {showBookmarksDrawer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end animate-fade-in">
          <div className="w-full max-w-md h-full bg-white dark:bg-slate-900 flex flex-col p-6 shadow-2xl border-l border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Bookmark size={20} className="text-amber-500 fill-amber-500" />
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  My Saved Bookmarks
                </h3>
              </div>
              <button
                onClick={() => setShowBookmarksDrawer(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3">
              {allBookmarks.length === 0 ? (
                <div className="py-24 text-center">
                  <Bookmark size={36} className="mx-auto mb-3 text-slate-300 dark:text-slate-600" />
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-200">No bookmarks saved yet</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Bookmark key quotes, character revelations, or study passages while reading.
                  </p>
                </div>
              ) : (
                allBookmarks.map((bm) => {
                  const targetNovel = novels.find((n) => n.id === bm.novelId);
                  return (
                    <div
                      key={bm.id}
                      className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500 bg-slate-50/50 dark:bg-slate-800/40 transition-all flex flex-col gap-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {bm.novelTitle}
                        </span>
                        <button
                          onClick={async () => {
                            if (!user) return;
                            await deleteBookmark(bm.id, user.uid);
                            refreshAllBookmarks();
                          }}
                          className="text-slate-400 hover:text-red-500 p-1"
                          title="Delete Bookmark"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                      <p className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                        Ch. {bm.chapterIndex + 1}: {bm.chapterTitle}
                      </p>

                      <p className="text-xs italic text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                        "{bm.paragraphText}"
                      </p>

                      {bm.note && (
                        <p className="text-[11px] font-medium bg-amber-500/10 text-amber-800 dark:text-amber-300 p-2 rounded-lg">
                          <strong>Note:</strong> {bm.note}
                        </p>
                      )}

                      {targetNovel && (
                        <button
                          onClick={() => {
                            setShowBookmarksDrawer(false);
                            setActiveNovelForReading(targetNovel);
                            setResumeChapterIndex(bm.chapterIndex);
                          }}
                          className="mt-1 self-start text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                        >
                          <span>Jump to Text</span>
                          <ArrowRight size={12} />
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="flex-1" onClick={() => setShowBookmarksDrawer(false)} />
        </div>
      )}

      {/* Mobile Clearance Spacer */}
      <div className="md:hidden h-20 sm:h-24 w-full shrink-0 pointer-events-none" aria-hidden="true" />
    </div>
  );
}
