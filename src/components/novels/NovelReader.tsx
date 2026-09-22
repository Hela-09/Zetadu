import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Novel, NovelChapter, NovelReadingProgress, NovelBookmark } from '../../types';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Bookmark,
  CheckCircle2,
  List,
  Type,
  Sun,
  Moon,
  Coffee,
  Download,
  Wifi,
  WifiOff,
  Sparkles,
  Share2,
  Trash2,
  X,
  Clock,
  ExternalLink,
  HelpCircle
} from 'lucide-react';
import {
  getChapterContent,
  saveReadingProgress,
  getNovelReadingProgress,
  saveBookmark,
  deleteBookmark,
  getUserBookmarks,
  checkIsNovelOffline,
  downloadNovel,
  isOnline,
  syncPendingNovelData
} from '../../services/novelService';
import { useAuth } from '../../contexts/AuthContext';

interface NovelReaderProps {
  novel: Novel;
  initialChapterIndex?: number;
  onBack: () => void;
  onOpenPractice?: (chapterIndex: number) => void;
}

type ReaderTheme = 'light' | 'sepia' | 'dark' | 'midnight';

export default function NovelReader({
  novel,
  initialChapterIndex = 0,
  onBack,
  onOpenPractice
}: NovelReaderProps) {
  const { user } = useAuth();
  const [currentChapterIndex, setCurrentChapterIndex] = useState<number>(initialChapterIndex);
  const [chapter, setChapter] = useState<NovelChapter | null>(null);
  const [isLoadingChapter, setIsLoadingChapter] = useState<boolean>(true);
  const [fontSize, setFontSize] = useState<number>(18);
  const [readerTheme, setReaderTheme] = useState<ReaderTheme>('light');
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [completedChapters, setCompletedChapters] = useState<number[]>([]);
  const [isOfflineAvailable, setIsOfflineAvailable] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);

  // Modals & Panels
  const [showToc, setShowToc] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showBookmarksModal, setShowBookmarksModal] = useState<boolean>(false);
  const [bookmarks, setBookmarks] = useState<NovelBookmark[]>([]);
  const [isBookmarkedCurrent, setIsBookmarkedCurrent] = useState<boolean>(false);
  const [bookmarkNote, setBookmarkNote] = useState<string>('');
  const [showAddBookmarkDialog, setShowAddBookmarkDialog] = useState<boolean>(false);
  const [selectedParagraphForBookmark, setSelectedParagraphForBookmark] = useState<string>('');
  const [syncStatusNotice, setSyncStatusNotice] = useState<string>('');

  const contentRef = useRef<HTMLDivElement>(null);
  const readerContainerRef = useRef<HTMLDivElement>(null);
  const isProgressInitializedRef = useRef<boolean>(false);
  const lastSavedRef = useRef<{
    chapter: number;
    scroll: number;
    completedCount: number;
    timestamp: number;
  } | null>(null);

  // Check offline status
  useEffect(() => {
    checkIsNovelOffline(novel.id).then(setIsOfflineAvailable);
  }, [novel.id]);

  // Load user progress safely without overriding
  useEffect(() => {
    if (!user) return;
    let isCancelled = false;

    getNovelReadingProgress(user.uid, novel.id).then((prog) => {
      if (isCancelled) return;
      if (prog) {
        if (prog.completedChapters) {
          setCompletedChapters(prog.completedChapters);
        }
        // If initialChapterIndex was default 0 and remote has progress, resume chapter
        if (initialChapterIndex === 0 && prog.currentChapterIndex !== undefined) {
          setCurrentChapterIndex(prog.currentChapterIndex);
        }
        lastSavedRef.current = {
          chapter: prog.currentChapterIndex !== undefined ? prog.currentChapterIndex : initialChapterIndex,
          scroll: prog.scrollPercentage || 0,
          completedCount: (prog.completedChapters || []).length,
          timestamp: Date.now(),
        };
      } else {
        lastSavedRef.current = {
          chapter: initialChapterIndex,
          scroll: 0,
          completedCount: 0,
          timestamp: Date.now(),
        };
      }
      isProgressInitializedRef.current = true;
    }).catch((err) => {
      console.warn('Error loading reading progress:', err);
      if (!isCancelled) {
        isProgressInitializedRef.current = true;
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [user, novel.id, initialChapterIndex]);

  // Automatically sync pending offline reading progress when internet returns
  useEffect(() => {
    const handleOnlineSync = async () => {
      if (!user) return;
      try {
        const res = await syncPendingNovelData(user.uid);
        if (res.syncedProgress > 0 || res.syncedBookmarks > 0) {
          setSyncStatusNotice(`Internet restored: synced ${res.syncedProgress} progress to cloud`);
          setTimeout(() => setSyncStatusNotice(''), 3500);
        }
      } catch (err) {
        console.warn('Auto-sync on online event failed:', err);
      }
    };

    window.addEventListener('online', handleOnlineSync);
    window.addEventListener('learndean-novel-online-sync', handleOnlineSync);
    return () => {
      window.removeEventListener('online', handleOnlineSync);
      window.removeEventListener('learndean-novel-online-sync', handleOnlineSync);
    };
  }, [user]);

  // Load bookmarks
  const refreshBookmarks = () => {
    if (!user) return;
    getUserBookmarks(user.uid, novel.id).then(setBookmarks);
  };

  useEffect(() => {
    refreshBookmarks();
  }, [user, novel.id]);

  // Load chapter content
  useEffect(() => {
    let isCancelled = false;
    setIsLoadingChapter(true);

    getChapterContent(novel.id, currentChapterIndex)
      .then((chap) => {
        if (!isCancelled) {
          setChapter(chap || novel.chapters[currentChapterIndex] || null);
          setIsLoadingChapter(false);
          // Scroll to top on chapter change
          if (readerContainerRef.current) {
            readerContainerRef.current.scrollTo({ top: 0, behavior: 'instant' });
          }
          setScrollProgress(0);
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setChapter(novel.chapters[currentChapterIndex] || null);
          setIsLoadingChapter(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [novel.id, currentChapterIndex]);

  // Check if current chapter has bookmarks
  useEffect(() => {
    const hasBm = bookmarks.some((b) => b.chapterIndex === currentChapterIndex);
    setIsBookmarkedCurrent(hasBm);
  }, [bookmarks, currentChapterIndex]);

  // Scroll listener for reading progress
  useEffect(() => {
    const handleScroll = () => {
      const el = readerContainerRef.current;
      if (!el) return;

      const scrollTop = el.scrollTop;
      const scrollHeight = el.scrollHeight - el.clientHeight;
      if (scrollHeight > 0) {
        const percent = Math.min(100, Math.max(0, Math.round((scrollTop / scrollHeight) * 100)));
        setScrollProgress(percent);

        // Auto mark chapter completed if scrolled >= 95%
        if (percent >= 95 && !completedChapters.includes(currentChapterIndex)) {
          handleMarkChapterCompleted(currentChapterIndex);
        }
      }
    };

    const container = readerContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [currentChapterIndex, completedChapters]);

  // Save reading progress only when values actually change or on critical transitions
  const saveCurrentProgress = (
    chapIdx: number,
    scrollPct: number,
    completedList: number[],
    force = false
  ) => {
    if (!user || !isProgressInitializedRef.current) return;

    const now = Date.now();
    const lastSaved = lastSavedRef.current;

    if (!force && lastSaved) {
      const isSameChapter = lastSaved.chapter === chapIdx;
      const isSameCompleted = lastSaved.completedCount === completedList.length;
      const isScrollClose = Math.abs(lastSaved.scroll - scrollPct) < 5;
      const isRecent = (now - lastSaved.timestamp) < 3500;

      // Skip duplicate writes to avoid unnecessary network calls
      if (isSameChapter && isSameCompleted && (isScrollClose || isRecent)) {
        return;
      }
    }

    lastSavedRef.current = {
      chapter: chapIdx,
      scroll: scrollPct,
      completedCount: completedList.length,
      timestamp: now,
    };

    const totalChapters = novel.chapters.length;
    const overallPct = Math.round(
      ((completedList.length) / totalChapters) * 100
    );

    const progData: NovelReadingProgress = {
      uid: user.uid,
      novelId: novel.id,
      novelTitle: novel.title,
      currentChapterIndex: chapIdx,
      currentChapterTitle: novel.chapters[chapIdx]?.title || `Chapter ${chapIdx + 1}`,
      scrollPercentage: scrollPct,
      completedChapters: completedList,
      totalChapters,
      percentage: Math.min(100, Math.max(overallPct, Math.round(((chapIdx) / totalChapters) * 100))),
      lastReadAt: now,
      updatedAt: now,
    };

    saveReadingProgress(progData, force).catch(console.warn);
  };

  // Debounced auto-save on scroll / reading progress change
  useEffect(() => {
    if (!isProgressInitializedRef.current) return;

    const timer = setTimeout(() => {
      saveCurrentProgress(currentChapterIndex, scrollProgress, completedChapters, false);
    }, 2500);

    return () => clearTimeout(timer);
  }, [currentChapterIndex, scrollProgress, completedChapters]);

  // Track latest state for safe flush on exit/unmount
  const latestStateRef = useRef({
    chapterIndex: currentChapterIndex,
    scrollProgress,
    completedChapters,
  });

  useEffect(() => {
    latestStateRef.current = {
      chapterIndex: currentChapterIndex,
      scrollProgress,
      completedChapters,
    };
  }, [currentChapterIndex, scrollProgress, completedChapters]);

  // Safe exit handler that guarantees progress is saved
  const handleExitWithSave = () => {
    if (user && isProgressInitializedRef.current) {
      const { chapterIndex, scrollProgress: sp, completedChapters: cc } = latestStateRef.current;
      saveCurrentProgress(chapterIndex, sp, cc, true);
    }
    onBack();
  };

  const handleMarkChapterCompleted = (chapterIdx: number) => {
    setCompletedChapters((prev) => {
      if (prev.includes(chapterIdx)) return prev;
      const updated = [...prev, chapterIdx];
      saveCurrentProgress(chapterIdx, 100, updated, true);
      return updated;
    });
  };

  const handleNextChapter = () => {
    if (currentChapterIndex < novel.chapters.length - 1) {
      handleMarkChapterCompleted(currentChapterIndex);
      const nextIdx = currentChapterIndex + 1;
      setCurrentChapterIndex(nextIdx);
      saveCurrentProgress(nextIdx, 0, completedChapters, true);
    }
  };

  const handlePrevChapter = () => {
    if (currentChapterIndex > 0) {
      const prevIdx = currentChapterIndex - 1;
      setCurrentChapterIndex(prevIdx);
      saveCurrentProgress(prevIdx, 0, completedChapters, true);
    }
  };

  const handleAddBookmark = async () => {
    if (!user || !chapter) return;
    const newBm: NovelBookmark = {
      id: `bm_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      uid: user.uid,
      novelId: novel.id,
      novelTitle: novel.title,
      chapterIndex: currentChapterIndex,
      chapterTitle: chapter.title,
      paragraphText: selectedParagraphForBookmark || chapter.content.slice(0, 200) + '...',
      note: bookmarkNote.trim(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await saveBookmark(newBm);
    refreshBookmarks();
    setShowAddBookmarkDialog(false);
    setBookmarkNote('');
    setSelectedParagraphForBookmark('');

    setSyncStatusNotice(isOnline() ? 'Bookmark saved and synced!' : 'Bookmark saved offline (will sync when online)');
    setTimeout(() => setSyncStatusNotice(''), 3500);
  };

  const handleDeleteBookmark = async (id: string) => {
    if (!user) return;
    await deleteBookmark(id, user.uid);
    refreshBookmarks();
  };

  const handleDownload = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    setDownloadProgress(10);

    const success = await downloadNovel(novel.id, (pct) => {
      setDownloadProgress(pct);
    });

    setIsDownloading(false);
    if (success) {
      setIsOfflineAvailable(true);
      setSyncStatusNotice('Novel chapters downloaded for full offline reading!');
      setTimeout(() => setSyncStatusNotice(''), 4000);
    }
  };

  // Theme styling helpers
  const themeStyles = useMemo(() => {
    switch (readerTheme) {
      case 'sepia':
        return {
          wrapper: 'bg-[#fbf0d9] text-[#433422]',
          header: 'bg-[#f4e4c1]/90 border-[#e6d1a6] text-[#433422]',
          subtext: 'text-[#7d6549]',
          card: 'bg-[#f4e4c1] border-[#e6d1a6]',
          divider: 'border-[#e6d1a6]',
          highlight: 'bg-[#eed7a1]/60',
          accentBtn: 'bg-[#7d6549] text-white hover:bg-[#634e36]',
        };
      case 'dark':
        return {
          wrapper: 'bg-slate-900 text-slate-100',
          header: 'bg-slate-900/90 border-slate-800 text-slate-100',
          subtext: 'text-slate-400',
          card: 'bg-slate-800 border-slate-700',
          divider: 'border-slate-800',
          highlight: 'bg-slate-800/80',
          accentBtn: 'bg-blue-600 text-white hover:bg-blue-500',
        };
      case 'midnight':
        return {
          wrapper: 'bg-black text-zinc-200',
          header: 'bg-black/90 border-zinc-900 text-zinc-100',
          subtext: 'text-zinc-500',
          card: 'bg-zinc-950 border-zinc-900',
          divider: 'border-zinc-900',
          highlight: 'bg-zinc-900',
          accentBtn: 'bg-zinc-100 text-black hover:bg-white',
        };
      case 'light':
      default:
        return {
          wrapper: 'bg-[#fafafa] text-slate-900',
          header: 'bg-white/90 border-slate-200 text-slate-900',
          subtext: 'text-slate-500',
          card: 'bg-white border-slate-200',
          divider: 'border-slate-200',
          highlight: 'bg-slate-100',
          accentBtn: 'bg-slate-900 text-white hover:bg-slate-800',
        };
    }
  }, [readerTheme]);

  // Split content into paragraphs for readable typography & selective bookmarking
  const paragraphs = useMemo(() => {
    if (!chapter?.content) return [];
    return chapter.content.split('\n\n').filter((p) => p.trim().length > 0);
  }, [chapter?.content]);

  return (
    <div className={`fixed inset-0 z-50 flex flex-col transition-colors duration-300 ${themeStyles.wrapper}`}>
      {/* Top Reading Progress bar */}
      <div className="w-full h-1 bg-slate-200 dark:bg-slate-800 fixed top-0 left-0 z-50">
        <div
          className="h-full bg-blue-600 dark:bg-blue-400 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Reader Sticky Header */}
      <header
        className={`w-full px-4 py-3 flex items-center justify-between border-b backdrop-blur-md sticky top-0 z-40 transition-colors ${themeStyles.header}`}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={handleExitWithSave}
            className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center gap-1.5 font-bold text-sm"
            title="Back to Novels Library"
          >
            <ArrowLeft size={18} />
            <span className="hidden sm:inline">Library</span>
          </button>

          <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 hidden sm:block" />

          <div className="max-w-[180px] sm:max-w-md truncate">
            <h1 className="text-sm sm:text-base font-bold truncate leading-snug">{novel.title}</h1>
            <p className={`text-xs truncate ${themeStyles.subtext}`}>
              Ch. {currentChapterIndex + 1}: {chapter?.title || 'Loading...'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          {/* Offline indicator / Download */}
          {isOfflineAvailable ? (
            <span className="hidden md:flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-2 py-1 rounded-lg">
              <WifiOff size={12} />
              <span>Offline Ready</span>
            </span>
          ) : (
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 text-blue-600 dark:text-blue-400 transition-colors flex items-center gap-1 text-xs font-semibold"
              title="Download for offline reading"
            >
              <Download size={18} className={isDownloading ? 'animate-bounce' : ''} />
              <span className="hidden lg:inline">{isDownloading ? `${downloadProgress}%` : 'Download'}</span>
            </button>
          )}

          {/* Bookmarks Toggle */}
          <button
            onClick={() => setShowBookmarksModal(true)}
            className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors relative"
            title="View Saved Bookmarks"
          >
            <Bookmark size={18} className={isBookmarkedCurrent ? 'fill-amber-500 text-amber-500' : ''} />
            {bookmarks.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500" />
            )}
          </button>

          {/* Table of contents */}
          <button
            onClick={() => setShowToc(true)}
            className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center gap-1 text-xs font-semibold"
            title="Chapters List"
          >
            <List size={18} />
            <span className="hidden sm:inline">Chapters</span>
          </button>

          {/* Chapter CBT Practice */}
          {onOpenPractice && (
            <button
              onClick={() => onOpenPractice(currentChapterIndex)}
              className="px-2.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 transition-colors flex items-center gap-1.5 text-xs font-bold"
              title="Practice Chapter CBT Questions"
            >
              <HelpCircle size={15} />
              <span className="hidden md:inline">Practice Quiz</span>
            </button>
          )}

          {/* Settings (Font, Theme) */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            title="Reading Appearance"
          >
            <Type size={18} />
          </button>
        </div>
      </header>

      {/* Sync / Notification Toast */}
      {syncStatusNotice && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 dark:bg-slate-100/95 text-white dark:text-slate-900 text-xs font-bold px-4 py-2 rounded-full shadow-xl flex items-center gap-2 animate-fade-in backdrop-blur-md">
          <Sparkles size={14} className="text-amber-400" />
          <span>{syncStatusNotice}</span>
        </div>
      )}

      {/* Settings Dropdown Popover */}
      {showSettings && (
        <div
          className={`absolute top-14 right-4 z-50 w-72 rounded-2xl p-4 shadow-2xl border ${themeStyles.card} animate-scale-in`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Appearance</span>
            <button
              onClick={() => setShowSettings(false)}
              className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
            >
              <X size={14} />
            </button>
          </div>

          {/* Font Size */}
          <div className="mb-4">
            <div className="flex justify-between text-xs font-semibold mb-2">
              <span>Text Size</span>
              <span>{fontSize}px</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFontSize((prev) => Math.max(14, prev - 2))}
                className="flex-1 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 text-xs font-bold hover:bg-black/5 dark:hover:bg-white/5"
              >
                A-
              </button>
              <button
                onClick={() => setFontSize(18)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/5"
              >
                Reset
              </button>
              <button
                onClick={() => setFontSize((prev) => Math.min(26, prev + 2))}
                className="flex-1 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 text-sm font-bold hover:bg-black/5 dark:hover:bg-white/5"
              >
                A+
              </button>
            </div>
          </div>

          {/* Reading Themes */}
          <div>
            <span className="text-xs font-semibold block mb-2">Theme</span>
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => setReaderTheme('light')}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl border text-[11px] font-bold ${
                  readerTheme === 'light'
                    ? 'border-blue-600 ring-2 ring-blue-500/30'
                    : 'border-slate-200 hover:border-slate-400'
                } bg-[#fafafa] text-slate-900`}
              >
                <Sun size={14} />
                <span>Day</span>
              </button>

              <button
                onClick={() => setReaderTheme('sepia')}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl border text-[11px] font-bold ${
                  readerTheme === 'sepia'
                    ? 'border-amber-600 ring-2 ring-amber-500/30'
                    : 'border-[#e6d1a6] hover:border-amber-500'
                } bg-[#fbf0d9] text-[#433422]`}
              >
                <Coffee size={14} />
                <span>Sepia</span>
              </button>

              <button
                onClick={() => setReaderTheme('dark')}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl border text-[11px] font-bold ${
                  readerTheme === 'dark'
                    ? 'border-blue-500 ring-2 ring-blue-500/30'
                    : 'border-slate-700 hover:border-slate-500'
                } bg-slate-900 text-slate-100`}
              >
                <Moon size={14} />
                <span>Dark</span>
              </button>

              <button
                onClick={() => setReaderTheme('midnight')}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl border text-[11px] font-bold ${
                  readerTheme === 'midnight'
                    ? 'border-white ring-2 ring-white/30'
                    : 'border-zinc-800 hover:border-zinc-600'
                } bg-black text-zinc-100`}
              >
                <div className="w-3.5 h-3.5 rounded-full bg-white" />
                <span>OLED</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main
        ref={readerContainerRef}
        className="flex-1 overflow-y-auto px-4 sm:px-8 md:px-12 py-8 flex flex-col items-center"
      >
        <div className="w-full max-w-2xl mx-auto flex flex-col flex-1">
          {isLoadingChapter ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <p className={`text-sm ${themeStyles.subtext}`}>Loading chapter...</p>
            </div>
          ) : chapter ? (
            <article ref={contentRef} className="flex flex-col flex-1">
              {/* Chapter Meta Header */}
              <div className="text-center pb-8 mb-8 border-b border-dashed border-current/20">
                <span className={`text-xs font-bold uppercase tracking-widest ${themeStyles.subtext}`}>
                  Chapter {chapter.chapterNumber} of {novel.chapters.length}
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mt-2 mb-3 tracking-tight">
                  {chapter.title}
                </h2>
                <div className={`flex items-center justify-center gap-4 text-xs font-semibold ${themeStyles.subtext}`}>
                  <span className="flex items-center gap-1">
                    <Clock size={13} /> {chapter.estimatedMinutes} min read
                  </span>
                  <span>•</span>
                  <span>{chapter.wordCount} words</span>
                  <span>•</span>
                  <span>{scrollProgress}% read</span>
                </div>
              </div>

              {/* Formatted Paragraphs */}
              <div
                className="space-y-6 leading-relaxed select-text font-serif transition-all"
                style={{ fontSize: `${fontSize}px`, lineHeight: 1.75 }}
              >
                {paragraphs.map((p, idx) => (
                  <div key={idx} className="group relative">
                    <p className="tracking-normal text-justify sm:text-left">{p}</p>
                    {/* Inline paragraph bookmark button on hover/focus */}
                    <button
                      onClick={() => {
                        setSelectedParagraphForBookmark(p);
                        setShowAddBookmarkDialog(true);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity absolute -right-6 top-1 text-slate-400 hover:text-amber-500 p-1 rounded"
                      title="Bookmark this excerpt"
                    >
                      <Bookmark size={14} />
                    </button>
                  </div>
                ))}
              </div>

              {/* End of Chapter Section */}
              <div className="mt-16 pt-8 border-t border-current/20 flex flex-col items-center">
                <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
                  {onOpenPractice && (
                    <button
                      onClick={() => onOpenPractice(currentChapterIndex)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 transition-all shadow-sm"
                    >
                      <HelpCircle size={16} />
                      <span>Practice Chapter {currentChapterIndex + 1} CBT Questions</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleMarkChapterCompleted(currentChapterIndex)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                      completedChapters.includes(currentChapterIndex)
                        ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
                        : 'border-current/30 hover:bg-current/10'
                    }`}
                  >
                    <CheckCircle2 size={16} />
                    <span>
                      {completedChapters.includes(currentChapterIndex) ? 'Completed' : 'Mark as Completed'}
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedParagraphForBookmark(paragraphs[0] || chapter.title);
                      setShowAddBookmarkDialog(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border border-current/30 hover:bg-current/10 transition-all"
                  >
                    <Bookmark size={16} />
                    <span>Bookmark Chapter</span>
                  </button>
                </div>

                {/* Chapter Navigation Controls */}
                <div className="w-full flex items-center justify-between gap-4">
                  <button
                    onClick={handlePrevChapter}
                    disabled={currentChapterIndex === 0}
                    className="flex items-center gap-2 px-4 py-3 rounded-2xl border border-current/20 hover:bg-current/5 disabled:opacity-30 disabled:pointer-events-none transition-all text-xs sm:text-sm font-bold"
                  >
                    <ChevronLeft size={18} />
                    <span>Previous Chapter</span>
                  </button>

                  <span className={`text-xs font-bold ${themeStyles.subtext}`}>
                    {currentChapterIndex + 1} / {novel.chapters.length}
                  </span>

                  {currentChapterIndex < novel.chapters.length - 1 ? (
                    <button
                      onClick={handleNextChapter}
                      className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm shadow-md transition-all ${themeStyles.accentBtn}`}
                    >
                      <span>Next Chapter</span>
                      <ChevronRight size={18} />
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        handleMarkChapterCompleted(currentChapterIndex);
                        handleExitWithSave();
                      }}
                      className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all"
                    >
                      <CheckCircle2 size={18} />
                      <span>Finish Book</span>
                    </button>
                  )}
                </div>
              </div>
            </article>
          ) : (
            <div className="text-center py-24">
              <p className="text-lg font-bold">Chapter not found</p>
              <button
                onClick={handleExitWithSave}
                className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs"
              >
                Return to Library
              </button>
            </div>
          )}

          {/* Bottom spacing */}
          <div className="h-16 w-full shrink-0" />
        </div>
      </main>

      {/* Chapters TOC Drawer Modal */}
      {showToc && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-start animate-fade-in">
          <div
            className={`w-full max-w-sm h-full flex flex-col p-6 shadow-2xl border-r ${themeStyles.card} animate-slide-right`}
          >
            <div className="flex items-center justify-between pb-4 border-b border-current/10 mb-4">
              <div>
                <h3 className="text-base font-extrabold">{novel.title}</h3>
                <p className={`text-xs ${themeStyles.subtext}`}>Table of Contents</p>
              </div>
              <button
                onClick={() => setShowToc(false)}
                className="p-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {novel.chapters.map((ch, idx) => {
                const isCurrent = idx === currentChapterIndex;
                const isCompleted = completedChapters.includes(idx);
                return (
                  <button
                    key={ch.id}
                    onClick={() => {
                      setCurrentChapterIndex(idx);
                      setShowToc(false);
                    }}
                    className={`w-full text-left p-3 rounded-xl transition-all flex items-start gap-3 ${
                      isCurrent
                        ? 'bg-blue-600 text-white shadow-sm font-bold'
                        : 'hover:bg-current/5 border border-transparent hover:border-current/10'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5 ${
                        isCurrent
                          ? 'bg-white/20 text-white'
                          : isCompleted
                          ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                          : 'bg-current/10'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 size={13} /> : idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-semibold truncate leading-tight">{ch.title}</p>
                      <p
                        className={`text-[10px] mt-0.5 ${
                          isCurrent ? 'text-blue-100' : themeStyles.subtext
                        }`}
                      >
                        {ch.estimatedMinutes} mins • {ch.wordCount} words
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Offline download button inside TOC */}
            <div className="pt-4 mt-auto border-t border-current/10">
              <button
                onClick={handleDownload}
                disabled={isDownloading || isOfflineAvailable}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-current/20 text-xs font-bold hover:bg-current/5 disabled:opacity-50 transition-all"
              >
                {isOfflineAvailable ? (
                  <>
                    <CheckCircle2 size={16} className="text-emerald-500" />
                    <span>Saved for Offline Reading</span>
                  </>
                ) : (
                  <>
                    <Download size={16} />
                    <span>{isDownloading ? `Downloading (${downloadProgress}%)` : 'Download Book Offline'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="flex-1" onClick={() => setShowToc(false)} />
        </div>
      )}

      {/* Bookmarks Modal */}
      {showBookmarksModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4 animate-fade-in">
          <div className={`w-full max-w-md max-h-[85vh] rounded-3xl p-6 flex flex-col shadow-2xl ${themeStyles.card}`}>
            <div className="flex items-center justify-between pb-3 border-b border-current/10 mb-4">
              <div className="flex items-center gap-2">
                <Bookmark size={18} className="text-amber-500 fill-amber-500" />
                <h3 className="text-base font-extrabold">Saved Bookmarks</h3>
              </div>
              <button
                onClick={() => setShowBookmarksModal(false)}
                className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3">
              {bookmarks.length === 0 ? (
                <div className="py-12 text-center">
                  <Bookmark size={32} className="mx-auto mb-2 text-slate-400 opacity-40" />
                  <p className="text-sm font-semibold">No bookmarks yet</p>
                  <p className={`text-xs mt-1 ${themeStyles.subtext}`}>
                    Bookmark important quotes or notes while reading chapters.
                  </p>
                </div>
              ) : (
                bookmarks.map((bm) => (
                  <div
                    key={bm.id}
                    className="p-3.5 rounded-2xl border border-current/10 hover:border-amber-400/40 transition-all bg-black/5 dark:bg-white/5 flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => {
                          setCurrentChapterIndex(bm.chapterIndex);
                          setShowBookmarksModal(false);
                        }}
                        className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
                      >
                        <span>Ch. {bm.chapterIndex + 1}: {bm.chapterTitle}</span>
                        <ExternalLink size={12} />
                      </button>
                      <button
                        onClick={() => handleDeleteBookmark(bm.id)}
                        className="text-slate-400 hover:text-red-500 p-1"
                        title="Delete Bookmark"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <p className="text-xs italic line-clamp-3 leading-relaxed opacity-90">
                      "{bm.paragraphText}"
                    </p>

                    {bm.note && (
                      <p className="text-[11px] font-medium bg-amber-500/10 text-amber-800 dark:text-amber-300 p-2 rounded-lg">
                        <strong>Note:</strong> {bm.note}
                      </p>
                    )}

                    <span className="text-[10px] text-slate-400">
                      {new Date(bm.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Bookmark Dialog */}
      {showAddBookmarkDialog && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4 animate-fade-in">
          <div className={`w-full max-w-sm rounded-3xl p-6 shadow-2xl ${themeStyles.card}`}>
            <h3 className="text-base font-extrabold mb-2">Bookmark Excerpt</h3>
            <p className={`text-xs mb-3 italic line-clamp-2 ${themeStyles.subtext}`}>
              "{selectedParagraphForBookmark || chapter?.title}"
            </p>

            <textarea
              placeholder="Add an optional study note or reflection..."
              value={bookmarkNote}
              onChange={(e) => setBookmarkNote(e.target.value)}
              className="w-full h-24 p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 text-xs outline-none focus:ring-2 focus:ring-amber-500 mb-4 resize-none"
            />

            <div className="flex gap-2">
              <button
                onClick={() => setShowAddBookmarkDialog(false)}
                className="flex-1 py-2 rounded-xl border border-current/20 text-xs font-bold hover:bg-current/5"
              >
                Cancel
              </button>
              <button
                onClick={handleAddBookmark}
                className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-md"
              >
                Save Bookmark
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
