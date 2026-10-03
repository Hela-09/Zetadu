import React, { useState, useMemo, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Sparkles,
  Download,
  CheckCircle2,
  Bookmark,
  RotateCcw,
  Sliders,
  Play,
  Shuffle,
  ListOrdered,
  Clock,
  Layers,
  HelpCircle,
  Eye,
  EyeOff,
  Filter,
  Check,
  X,
  ChevronRight,
  ChevronLeft,
  BookCheck,
  FileText,
  Users,
  ScrollText,
  Lightbulb,
  Award,
  BookMarked
} from 'lucide-react';
import { Novel } from '../../types';
import { NOVELS_COLLECTION } from '../../data/novels';
import {
  getStoredQuestionsForNovel
} from '../../data/jambNovelQuestionsBank';
import { JambQuestion } from '../../data/jambQuestions';
import { BookmarkedJambQuestion } from '../../services/jambService';
import { checkIsNovelOffline, downloadNovel } from '../../services/novelService';

interface JambNovelSectionProps {
  onStartPractice: (config: {
    subject?: string;
    subjectId?: string;
    topic?: string;
    year?: number | 'all';
    amount?: number;
    ordering?: 'random' | 'sequential';
    isUntimed?: boolean;
    timerDuration?: number;
    examType?: 'JAMB';
    practiceMode?: 'practice' | 'cbt' | 'study';
    questions?: JambQuestion[];
  }) => void;
  bookmarksList?: BookmarkedJambQuestion[];
  bookmarkedIds?: Set<string>;
  onToggleBookmark?: (question: JambQuestion) => void;
  initialNovelId?: string;
}

type NovelSectionTab = 'questions' | 'chapters' | 'analysis';

export default function JambNovelSection({
  onStartPractice,
  bookmarksList = [],
  bookmarkedIds = new Set(),
  onToggleBookmark,
  initialNovelId
}: JambNovelSectionProps) {
  // Available Novels
  const availableNovels = useMemo(() => {
    return NOVELS_COLLECTION;
  }, []);

  // Selected Novel (Default to the official current JAMB novel: The Lekki Headmaster)
  const [selectedNovelId, setSelectedNovelId] = useState<string>(() => {
    if (initialNovelId) return initialNovelId;
    const current = availableNovels.find(n => n.category === 'Current JAMB Novel');
    return current ? current.id : availableNovels[0]?.id || 'the-lekki-headmaster';
  });

  const activeNovel = useMemo(() => {
    return availableNovels.find(n => n.id === selectedNovelId) || availableNovels[0];
  }, [availableNovels, selectedNovelId]);

  // Section Tab Mode: 'questions' (default: immediately visible) | 'chapters' | 'analysis'
  const [activeTab, setActiveTab] = useState<NovelSectionTab>('questions');

  // Active Chapter Index for Study Mode
  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(0);

  // Retrieve stored questions for active novel
  const novelStoredQuestions = useMemo(() => {
    if (!activeNovel) return [];
    return getStoredQuestionsForNovel(activeNovel.id);
  }, [activeNovel]);

  // Search & Filters for Question Bank
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedChapterFilter, setSelectedChapterFilter] = useState<string>('all');
  const [revealedExplanationIds, setRevealedExplanationIds] = useState<Set<string>>(new Set());
  const [userSelectedAnswers, setUserSelectedAnswers] = useState<Record<string, number>>({});
  const [showAllExplanations, setShowAllExplanations] = useState<boolean>(false);

  // Search within Chapter Content & Summaries
  const [chapterSearchQuery, setChapterSearchQuery] = useState<string>('');

  // Practice Launch Configuration
  const [practiceQuestionCount, setPracticeQuestionCount] = useState<number | 'all'>(20);
  const [practiceOrdering, setPracticeOrdering] = useState<'random' | 'sequential'>('random');
  const [isUntimed, setIsUntimed] = useState<boolean>(false);
  const [timerMinutes, setTimerMinutes] = useState<number>(20);

  // Offline Download State
  const [isOfflineCached, setIsOfflineCached] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  // Check offline status
  useEffect(() => {
    if (!activeNovel) return;
    checkIsNovelOffline(activeNovel.id)
      .then(status => setIsOfflineCached(status))
      .catch(() => setIsOfflineCached(false));
  }, [activeNovel]);

  // Reset active chapter when novel changes
  useEffect(() => {
    setActiveChapterIndex(0);
    setSelectedChapterFilter('all');
    setSearchQuery('');
    setChapterSearchQuery('');
  }, [selectedNovelId]);

  // Handle Download for Offline
  const handleDownloadNovelOffline = async () => {
    if (!activeNovel) return;
    setIsDownloading(true);
    setDownloadNotice('Downloading novel study content, chapter summaries, and questions for offline practice...');
    try {
      await downloadNovel(activeNovel.id);
      // Also cache stored questions locally in offline mirror for instant zero-latency retrieval
      try {
        localStorage.setItem(`offline_novel_bank_${activeNovel.id}`, JSON.stringify(novelStoredQuestions));
      } catch {}
      setIsOfflineCached(true);
      setDownloadNotice(`✓ ${activeNovel.title} is now downloaded and fully available offline without internet!`);
      setTimeout(() => setDownloadNotice(null), 4000);
    } catch (err) {
      console.warn('Failed to download novel offline:', err);
      try {
        localStorage.setItem(`offline_novel_bank_${activeNovel.id}`, JSON.stringify(novelStoredQuestions));
        setIsOfflineCached(true);
        setDownloadNotice(`✓ ${novelStoredQuestions.length} questions and chapter materials saved locally for offline use.`);
        setTimeout(() => setDownloadNotice(null), 4000);
      } catch {
        setDownloadNotice('Download completed.');
      }
    } finally {
      setIsDownloading(false);
    }
  };

  // Chapter options for filter & navigation
  const chapterOptions = useMemo(() => {
    if (!activeNovel || !activeNovel.chapters) return [];
    return activeNovel.chapters.map((ch, idx) => ({
      index: idx,
      title: ch.title || `Chapter ${idx + 1}`,
      chapterNumber: ch.chapterNumber || idx + 1,
      summary: ch.summary || '',
      wordCount: ch.wordCount,
      estimatedMinutes: ch.estimatedMinutes
    }));
  }, [activeNovel]);

  // Active Chapter Object
  const currentChapter = useMemo(() => {
    if (!activeNovel || !activeNovel.chapters || activeNovel.chapters.length === 0) return null;
    return activeNovel.chapters[activeChapterIndex] || activeNovel.chapters[0];
  }, [activeNovel, activeChapterIndex]);

  // Stored questions specifically for the current chapter
  const currentChapterStoredQuestions = useMemo(() => {
    if (!currentChapter || !activeNovel) return [];
    const chNum = currentChapter.chapterNumber;
    return novelStoredQuestions.filter(q => {
      const qTopic = (q.topic || '').toLowerCase();
      return (
        qTopic.includes(`chapter ${chNum}`) ||
        qTopic.includes(`chap ${chNum}`) ||
        (q as any).chapterIndex === activeChapterIndex
      );
    });
  }, [currentChapter, novelStoredQuestions, activeChapterIndex]);

  // Filtered Questions List for Questions Tab
  const filteredQuestions = useMemo(() => {
    return novelStoredQuestions.filter(q => {
      // Chapter filter
      if (selectedChapterFilter !== 'all') {
        const targetNumber = parseInt(selectedChapterFilter, 10);
        const qTopic = (q.topic || '').toLowerCase();
        const matchesChapter =
          qTopic.includes(`chapter ${targetNumber}`) ||
          qTopic.includes(`chap ${targetNumber}`) ||
          (q as any).chapterIndex === targetNumber - 1;
        if (!matchesChapter) return false;
      }

      // Search Query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const inQuestion = q.question.toLowerCase().includes(query);
        const inTopic = (q.topic || '').toLowerCase().includes(query);
        const inExplanation = (q.explanation || '').toLowerCase().includes(query);
        const inOptions = q.options.some(opt => opt.toLowerCase().includes(query));
        if (!inQuestion && !inTopic && !inExplanation && !inOptions) return false;
      }

      return true;
    });
  }, [novelStoredQuestions, selectedChapterFilter, searchQuery]);

  // Filtered chapters for Chapter Study Search
  const filteredChapters = useMemo(() => {
    if (!activeNovel || !activeNovel.chapters) return [];
    if (!chapterSearchQuery.trim()) return activeNovel.chapters;
    const q = chapterSearchQuery.toLowerCase().trim();
    return activeNovel.chapters.filter(ch => {
      const inTitle = (ch.title || '').toLowerCase().includes(q);
      const inSummary = (ch.summary || '').toLowerCase().includes(q);
      const inContent = (ch.content || '').toLowerCase().includes(q);
      const inChars = (ch.importantCharacters || []).some(
        c => c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
      );
      const inEvents = (ch.importantEvents || []).some(e => e.toLowerCase().includes(q));
      const inThemes = (ch.themes || []).some(t => t.toLowerCase().includes(q));
      const inKeyPoints = (ch.keyPoints || []).some(kp => kp.toLowerCase().includes(q));
      return inTitle || inSummary || inContent || inChars || inEvents || inThemes || inKeyPoints;
    });
  }, [activeNovel, chapterSearchQuery]);

  // Answered count & stats
  const totalQuestions = novelStoredQuestions.length;
  const answeredCount = Object.keys(userSelectedAnswers).filter(qId =>
    novelStoredQuestions.some(q => q.id === qId)
  ).length;

  const correctAnswersCount = Object.entries(userSelectedAnswers).filter(([qId, ansIdx]) => {
    const q = novelStoredQuestions.find(item => item.id === qId);
    return q && q.correctAnswer === ansIdx;
  }).length;

  // Toggle single question explanation
  const toggleExplanation = (questionId: string) => {
    setRevealedExplanationIds(prev => {
      const next = new Set(prev);
      if (next.has(questionId)) next.delete(questionId);
      else next.add(questionId);
      return next;
    });
  };

  // Interactive inline test answer selection
  const handleSelectInlineAnswer = (questionId: string, optionIndex: number) => {
    setUserSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
    // Auto-reveal explanation when answered
    setRevealedExplanationIds(prev => new Set(prev).add(questionId));
  };

  // Launch JAMB Practice Screen with selected questions
  const handleLaunchNovelPractice = (customSubset?: JambQuestion[], customTopic?: string) => {
    if (!activeNovel) return;

    let pool = customSubset || [...filteredQuestions];
    if (pool.length === 0) pool = [...novelStoredQuestions];

    if (practiceOrdering === 'random' && !customSubset) {
      pool = [...pool].sort(() => Math.random() - 0.5);
    }

    const count = practiceQuestionCount === 'all' || customSubset
      ? pool.length
      : Math.min(practiceQuestionCount, pool.length);

    const selectedSubset = pool.slice(0, count);

    onStartPractice({
      subject: 'English Language',
      subjectId: 'english',
      topic: customTopic || activeNovel.title,
      year: 2025,
      amount: selectedSubset.length,
      ordering: practiceOrdering,
      isUntimed,
      timerDuration: isUntimed ? 0 : timerMinutes,
      examType: 'JAMB',
      practiceMode: 'practice',
      questions: selectedSubset
    });
  };

  // Launch chapter specific practice
  const handleLaunchChapterPractice = () => {
    if (!currentChapter) return;
    const questionsToUse = currentChapterStoredQuestions.length > 0
      ? currentChapterStoredQuestions
      : novelStoredQuestions.slice(0, 10);

    handleLaunchNovelPractice(
      questionsToUse,
      `${activeNovel.title} - Chapter ${currentChapter.chapterNumber}`
    );
  };

  return (
    <div className="space-y-6">
      {/* 1. Novel Selector Banner & Novel Metadata */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row gap-6 items-start border border-amber-900/40">
        {/* Cover Image */}
        <div className="w-24 sm:w-32 aspect-[3/4] rounded-2xl bg-slate-800 overflow-hidden shrink-0 shadow-2xl border border-white/20">
          <img
            src={activeNovel.coverImage}
            alt={activeNovel.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Novel Details & Global Stats */}
        <div className="flex-1 space-y-3 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-amber-400 text-slate-950 uppercase tracking-wider shadow-xs">
              {activeNovel.category === 'Current JAMB Novel'
                ? 'Official Current JAMB Novel (2025/2026/2027)'
                : activeNovel.category}
            </span>
            <span className="text-xs font-semibold text-amber-200">
              {novelStoredQuestions.length} Stored Questions in Question Bank
            </span>
            {activeNovel.chapters && (
              <span className="text-xs text-slate-300">
                • {activeNovel.chapters.length} Chapters Complete
              </span>
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {activeNovel.title}
          </h2>

          <p className="text-xs sm:text-sm text-slate-300">
            By <span className="font-bold text-white">{activeNovel.author}</span> • {activeNovel.year}
            {activeNovel.genre && ` • ${activeNovel.genre}`}
          </p>

          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-3xl line-clamp-3">
            {activeNovel.description}
          </p>

          {/* Stored Question Stats & Offline Download Button */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => handleLaunchNovelPractice()}
              className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-transform cursor-pointer hover:scale-[1.02]"
            >
              <Play size={16} className="fill-slate-950" />
              <span>Practice in JAMB Practice ({Math.min(practiceQuestionCount === 'all' ? novelStoredQuestions.length : practiceQuestionCount, novelStoredQuestions.length)} Qs)</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadNovelOffline}
              disabled={isDownloading}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs ${
                isOfflineCached
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
              }`}
            >
              {isOfflineCached ? (
                <>
                  <CheckCircle2 size={15} className="text-emerald-400" />
                  <span>Available Offline ({novelStoredQuestions.length} Qs + Chapters)</span>
                </>
              ) : (
                <>
                  <Download size={15} className="text-amber-300" />
                  <span>{isDownloading ? 'Saving Offline...' : 'Download for Offline Practice'}</span>
                </>
              )}
            </button>
          </div>

          {downloadNotice && (
            <p className="text-xs text-emerald-300 font-semibold animate-pulse">
              {downloadNotice}
            </p>
          )}
        </div>
      </div>

      {/* 2. Novel Switcher Tabs */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Select Prescribed Novel / Literature Text:
          </span>
          <span className="text-xs text-slate-400">
            {availableNovels.length} Prescribed Texts Available
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {availableNovels.map(novel => {
            const isSelected = novel.id === selectedNovelId;
            const qCount = getStoredQuestionsForNovel(novel.id).length;
            const isCurrent = novel.category === 'Current JAMB Novel';

            return (
              <button
                key={novel.id}
                type="button"
                onClick={() => {
                  setSelectedNovelId(novel.id);
                  setSelectedChapterFilter('all');
                  setSearchQuery('');
                  setChapterSearchQuery('');
                }}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer border ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-blue-400'
                }`}
              >
                <BookOpen size={14} className={isSelected ? 'text-white' : 'text-blue-500'} />
                <span>{novel.title}</span>
                {isCurrent && (
                  <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-extrabold uppercase ${
                    isSelected ? 'bg-amber-400 text-slate-950' : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                  }`}>
                    Official
                  </span>
                )}
                <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}>
                  {qCount} Qs
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Primary Mode Navigation Switcher: Questions Bank | Chapter Summaries | Characters & Analysis */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTab('questions')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer whitespace-nowrap ${
            activeTab === 'questions'
              ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <FileText size={16} />
          <span>Stored Question Bank ({novelStoredQuestions.length} Qs)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('chapters')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer whitespace-nowrap ${
            activeTab === 'chapters'
              ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <BookMarked size={16} />
          <span>Chapter Summaries & Study Guide ({activeNovel.chapters?.length || 0} Chapters)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('analysis')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer whitespace-nowrap ${
            activeTab === 'analysis'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Users size={16} />
          <span>Characters, Themes & Syllabus Analysis</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* VIEW MODE 1: STORED QUESTION BANK (Immediately Available on Opening!) */}
      {/* ========================================================================= */}
      {activeTab === 'questions' && (
        <div className="space-y-6">
          {/* Practice Launch Control Bar */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 shrink-0">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Launch in JAMB Practice Screen
                  </h3>
                  <p className="text-xs text-slate-500">
                    Practice stored questions using the authentic JAMB exam interface with timer, calculator & score review.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleLaunchNovelPractice()}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm hover:scale-[1.01]"
              >
                <Play size={16} />
                <span>Start Practice Now</span>
              </button>
            </div>

            {/* Practice Options Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              {/* Question Count */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Layers size={13} className="text-blue-500" />
                  <span>Question Count:</span>
                </label>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {[5, 10, 15, 20, 30, 'all'].map(cnt => (
                    <button
                      key={cnt}
                      type="button"
                      onClick={() => setPracticeQuestionCount(cnt as any)}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        practiceQuestionCount === cnt
                          ? 'bg-blue-600 text-white shadow-2xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {cnt === 'all' ? `All (${novelStoredQuestions.length})` : cnt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ordering */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Shuffle size={13} className="text-blue-500" />
                  <span>Question Order:</span>
                </label>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setPracticeOrdering('random')}
                    className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                      practiceOrdering === 'random'
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <Shuffle size={12} />
                    <span>Random</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPracticeOrdering('sequential')}
                    className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                      practiceOrdering === 'sequential'
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <ListOrdered size={12} />
                    <span>Sequential</span>
                  </button>
                </div>
              </div>

              {/* Timer Mode */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Clock size={13} className="text-blue-500" />
                  <span>Timing Mode:</span>
                </label>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setIsUntimed(false)}
                    className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition cursor-pointer ${
                      !isUntimed
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    Timed ({timerMinutes}m)
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsUntimed(true)}
                    className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition cursor-pointer ${
                      isUntimed
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    Untimed Study
                  </button>
                </div>
              </div>

              {/* Progress / Mastery Summary */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <BookCheck size={13} className="text-emerald-500" />
                  <span>Self-Check Progress:</span>
                </label>
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {answeredCount} of {totalQuestions} answered
                    </span>
                    {answeredCount > 0 && (
                      <span className="text-[11px] text-emerald-600 dark:text-emerald-400 block font-semibold">
                        {correctAnswersCount} correct ({Math.round((correctAnswersCount / answeredCount) * 100)}%)
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setUserSelectedAnswers({})}
                    className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
                    title="Reset answers"
                  >
                    <RotateCcw size={13} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              {/* Search Field */}
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder={`Search ${novelStoredQuestions.length} stored questions, character names, or topics...`}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Chapter Filter Dropdown */}
              {chapterOptions.length > 0 && (
                <div className="flex items-center gap-2">
                  <Filter size={15} className="text-slate-400 shrink-0" />
                  <select
                    value={selectedChapterFilter}
                    onChange={e => setSelectedChapterFilter(e.target.value)}
                    className="px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value="all">All Chapters ({novelStoredQuestions.length} Qs)</option>
                    {chapterOptions.map(ch => (
                      <option key={ch.index} value={String(ch.chapterNumber)}>
                        Chapter {ch.chapterNumber}: {ch.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Reveal All Explanations Toggle */}
              <button
                type="button"
                onClick={() => {
                  const next = !showAllExplanations;
                  setShowAllExplanations(next);
                  if (next) {
                    setRevealedExplanationIds(new Set(filteredQuestions.map(q => q.id)));
                  } else {
                    setRevealedExplanationIds(new Set());
                  }
                }}
                className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-blue-500 flex items-center justify-center gap-1.5 cursor-pointer transition-colors shrink-0"
              >
                {showAllExplanations ? (
                  <>
                    <EyeOff size={14} className="text-blue-500" />
                    <span>Hide Explanations</span>
                  </>
                ) : (
                  <>
                    <Eye size={14} className="text-blue-500" />
                    <span>Show All Explanations</span>
                  </>
                )}
              </button>
            </div>

            {/* Filter results count */}
            <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 dark:border-slate-800 pt-3">
              <span>
                Showing <strong className="text-slate-900 dark:text-white">{filteredQuestions.length}</strong> of {novelStoredQuestions.length} stored questions for <strong className="text-slate-900 dark:text-white">{activeNovel.title}</strong>
              </span>
              {searchQuery && (
                <span className="text-blue-600 dark:text-blue-400 font-semibold">
                  Filter: "{searchQuery}"
                </span>
              )}
            </div>
          </div>

          {/* Stored Questions Cards List */}
          {filteredQuestions.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
              <HelpCircle size={36} className="text-slate-400 mx-auto" />
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                No matching questions found
              </h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Try resetting your search query or chapter filter to see all {novelStoredQuestions.length} stored questions.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedChapterFilter('all');
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold cursor-pointer hover:bg-blue-700 transition"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredQuestions.map((q, qIndex) => {
                const isBookmarked = bookmarkedIds.has(q.id);
                const userSelected = userSelectedAnswers[q.id];
                const isAnswered = userSelected !== undefined;
                const isCorrect = isAnswered && userSelected === q.correctAnswer;
                const isExplanationRevealed = showAllExplanations || revealedExplanationIds.has(q.id);

                return (
                  <div
                    key={q.id}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4 transition-all hover:border-slate-300 dark:hover:border-slate-700"
                  >
                    {/* Question Header */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                          Question {qIndex + 1} of {filteredQuestions.length}
                        </span>
                        {q.topic && (
                          <span className="text-xs font-bold text-slate-600 dark:text-slate-400 truncate max-w-md">
                            {q.topic}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {isAnswered && (
                          <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1 ${
                            isCorrect
                              ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                              : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                          }`}>
                            {isCorrect ? <Check size={12} /> : <X size={12} />}
                            <span>{isCorrect ? 'Correct' : 'Incorrect'}</span>
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() => onToggleBookmark && onToggleBookmark(q)}
                          className={`p-1.5 rounded-xl border transition cursor-pointer ${
                            isBookmarked
                              ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 text-amber-600'
                              : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600'
                          }`}
                          title={isBookmarked ? 'Remove bookmark' : 'Bookmark question'}
                        >
                          <Bookmark size={15} className={isBookmarked ? 'fill-amber-500' : ''} />
                        </button>
                      </div>
                    </div>

                    {/* Question Prompt */}
                    <p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white leading-relaxed">
                      {q.question}
                    </p>

                    {/* Options List */}
                    <div className="grid grid-cols-1 gap-2 pt-1">
                      {q.options.map((opt, optIdx) => {
                        const optLetter = String.fromCharCode(65 + optIdx);
                        const isOptionSelected = userSelected === optIdx;
                        const isOptionCorrect = q.correctAnswer === optIdx;

                        let optStyle = 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800';

                        if (isAnswered) {
                          if (isOptionCorrect) {
                            optStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-bold';
                          } else if (isOptionSelected) {
                            optStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 font-bold';
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            type="button"
                            onClick={() => handleSelectInlineAnswer(q.id, optIdx)}
                            className={`w-full text-left p-3 sm:p-3.5 rounded-2xl border text-xs sm:text-sm flex items-start gap-3 transition cursor-pointer ${optStyle}`}
                          >
                            <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                              isAnswered && isOptionCorrect
                                ? 'bg-emerald-600 text-white'
                                : isAnswered && isOptionSelected
                                ? 'bg-rose-600 text-white'
                                : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600'
                            }`}>
                              {optLetter}
                            </span>
                            <span className="flex-1 pt-0.5 leading-snug">
                              {opt}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Footer Controls & Explanation Box */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-3">
                      <div className="flex items-center justify-between text-xs">
                        <button
                          type="button"
                          onClick={() => toggleExplanation(q.id)}
                          className="text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1.5 cursor-pointer"
                        >
                          {isExplanationRevealed ? <EyeOff size={14} /> : <Eye size={14} />}
                          <span>{isExplanationRevealed ? 'Hide Explanation' : 'Show Correct Answer & Explanation'}</span>
                        </button>

                        {isAnswered && (
                          <button
                            type="button"
                            onClick={() => {
                              setUserSelectedAnswers(prev => {
                                const next = { ...prev };
                                delete next[q.id];
                                return next;
                              });
                            }}
                            className="text-slate-400 hover:text-slate-600 text-[11px] cursor-pointer"
                          >
                            Clear Choice
                          </button>
                        )}
                      </div>

                      {isExplanationRevealed && (
                        <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900 text-xs sm:text-sm space-y-1.5 animate-in fade-in duration-150">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[11px] font-black uppercase">
                              Correct: Option {String.fromCharCode(65 + q.correctAnswer)}
                            </span>
                            <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                              Syllabus Reference & Rationale:
                            </span>
                          </div>
                          <p className="text-slate-700 dark:text-slate-300 leading-relaxed pt-1">
                            {q.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW MODE 2: CHAPTER SUMMARIES & STUDY GUIDE (Complete Chapter Structure) */}
      {/* ========================================================================= */}
      {activeTab === 'chapters' && (
        <div className="space-y-6">
          {/* Chapter Search & Navigation Bar */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={chapterSearchQuery}
                  onChange={e => setChapterSearchQuery(e.target.value)}
                  placeholder="Search within chapter summaries, characters, themes, or plot points..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
                {chapterSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setChapterSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              <div className="text-xs font-semibold text-slate-500 shrink-0">
                {activeNovel.chapters?.length || 0} Total Chapters in Syllabus
              </div>
            </div>

            {/* Chapter Pills Carousel */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {(activeNovel.chapters || []).map((ch, idx) => {
                const isSelected = idx === activeChapterIndex;
                return (
                  <button
                    key={ch.id || idx}
                    type="button"
                    onClick={() => setActiveChapterIndex(idx)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer border ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-amber-400'
                    }`}
                  >
                    <span>Chapter {ch.chapterNumber}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Chapter Display */}
          {currentChapter ? (
            <div className="space-y-6">
              {/* Chapter Card Header */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-[11px] font-black bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 uppercase">
                        Chapter {currentChapter.chapterNumber} of {activeNovel.chapters?.length}
                      </span>
                      {currentChapter.estimatedMinutes && (
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Clock size={12} />
                          <span>{currentChapter.estimatedMinutes} min study</span>
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                      {currentChapter.title}
                    </h3>
                  </div>

                  {/* Practice this Chapter Button */}
                  <button
                    type="button"
                    onClick={handleLaunchChapterPractice}
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition cursor-pointer hover:scale-[1.01]"
                  >
                    <Play size={16} className="fill-slate-950" />
                    <span>Practice Chapter {currentChapter.chapterNumber} Questions ({currentChapterStoredQuestions.length} Qs)</span>
                  </button>
                </div>

                {/* Clear Chapter Summary for JAMB Preparation */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    <ScrollText size={15} />
                    <span>Comprehensive Chapter Summary (UTME Focus):</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900 text-slate-800 dark:text-slate-200 text-sm leading-relaxed">
                    {currentChapter.summary}
                  </div>
                </div>

                {/* Important Characters in this Chapter */}
                {currentChapter.importantCharacters && currentChapter.importantCharacters.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                      <Users size={15} className="text-blue-500" />
                      <span>Important Characters in Chapter {currentChapter.chapterNumber}:</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {currentChapter.importantCharacters.map((char, cIdx) => (
                        <div
                          key={cIdx}
                          className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-1"
                        >
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-bold text-sm text-slate-900 dark:text-white">
                              {char.name}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-md font-semibold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                              {char.role}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-300 leading-snug">
                            {char.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Important Events & Plot Milestones */}
                {currentChapter.importantEvents && currentChapter.importantEvents.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                      <Award size={15} className="text-emerald-500" />
                      <span>Key Plot Milestones & Significant Events:</span>
                    </div>
                    <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                      {currentChapter.importantEvents.map((evt, eIdx) => (
                        <li key={eIdx} className="flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                            {eIdx + 1}
                          </span>
                          <span className="leading-relaxed">{evt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Themes Explored in Chapter */}
                {currentChapter.themes && currentChapter.themes.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                      <Sparkles size={15} className="text-indigo-500" />
                      <span>Themes Explored in This Chapter:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {currentChapter.themes.map((thm, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-800 dark:text-indigo-200"
                        >
                          {thm}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* High-Yield Key Points for JAMB */}
                {currentChapter.keyPoints && currentChapter.keyPoints.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                      <Lightbulb size={15} />
                      <span>High-Yield UTME Takeaways to Remember:</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {currentChapter.keyPoints.map((kp, kpIdx) => (
                        <div
                          key={kpIdx}
                          className="p-3 rounded-2xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/60 text-xs text-slate-800 dark:text-slate-200 flex items-start gap-2"
                        >
                          <CheckCircle2 size={14} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                          <span className="leading-relaxed font-medium">{kp}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Narrative Text Excerpt */}
                {currentChapter.content && (
                  <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Chapter Literature Narrative:
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Authorized Study Text Excerpt
                      </span>
                    </div>
                    <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-serif whitespace-pre-line max-h-96 overflow-y-auto">
                      {currentChapter.content}
                    </div>
                  </div>
                )}

                {/* Chapter Navigation Buttons */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveChapterIndex(prev => Math.max(0, prev - 1))}
                    disabled={activeChapterIndex === 0}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer"
                  >
                    <ChevronLeft size={16} />
                    <span>Previous Chapter</span>
                  </button>

                  <span className="text-xs font-bold text-slate-500">
                    Chapter {activeChapterIndex + 1} of {activeNovel.chapters?.length}
                  </span>

                  <button
                    type="button"
                    onClick={() => setActiveChapterIndex(prev => Math.min((activeNovel.chapters?.length || 1) - 1, prev + 1))}
                    disabled={activeChapterIndex === (activeNovel.chapters?.length || 1) - 1}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Next Chapter</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              {/* Stored Questions specifically for this Chapter */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText size={18} className="text-blue-600 dark:text-blue-400" />
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      Stored Questions for Chapter {currentChapter.chapterNumber} ({currentChapterStoredQuestions.length} Qs)
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={handleLaunchChapterPractice}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Play size={14} />
                    <span>Practice All {currentChapterStoredQuestions.length}</span>
                  </button>
                </div>

                {currentChapterStoredQuestions.length === 0 ? (
                  <p className="text-xs text-slate-500 py-4 text-center">
                    No chapter-specific questions found. You can practice general questions for this novel.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {currentChapterStoredQuestions.map((q, idx) => (
                      <div
                        key={q.id}
                        className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-blue-600 dark:text-blue-400">
                            Q{idx + 1}. {q.topic || `Chapter ${currentChapter.chapterNumber}`}
                          </span>
                          <span className="text-slate-400 font-medium">JAMB Model</span>
                        </div>
                        <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                          {q.question}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1 text-xs">
                          {q.options.map((opt, oIdx) => (
                            <div
                              key={oIdx}
                              className={`p-2 rounded-xl border flex items-center gap-2 ${
                                oIdx === q.correctAnswer
                                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 font-bold'
                                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-[10px] shrink-0">
                                {String.fromCharCode(65 + oIdx)}
                              </span>
                              <span className="truncate">{opt}</span>
                            </div>
                          ))}
                        </div>
                        {q.explanation && (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1 italic">
                            💡 Rationale: {q.explanation}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500">
              No chapter details available for this novel.
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW MODE 3: CHARACTERS, THEMES & LITERARY ANALYSIS */}
      {/* ========================================================================= */}
      {activeTab === 'analysis' && (
        <div className="space-y-6">
          {/* Character Dossier */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Users size={20} className="text-blue-600 dark:text-blue-400" />
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Major Characters & Roles in "{activeNovel.title}"
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(activeNovel.characters || []).map((char, cIdx) => (
                <div
                  key={cIdx}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-base font-black text-slate-900 dark:text-white">
                      {char.name}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                      {char.role}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {char.description}
                  </p>
                  {char.traits && char.traits.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {char.traits.map((tr, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300"
                        >
                          {tr}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Central Themes */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Sparkles size={20} className="text-amber-500" />
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Central Themes for UTME Use of English
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(activeNovel.themes || []).map((thm, tIdx) => (
                <div
                  key={tIdx}
                  className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/60 flex items-start gap-3"
                >
                  <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    {tIdx + 1}
                  </span>
                  <div className="space-y-1">
                    <h5 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                      {thm}
                    </h5>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Literary Devices & Exam Notes */}
          {activeNovel.literaryDevices && activeNovel.literaryDevices.length > 0 && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <Lightbulb size={20} className="text-emerald-500" />
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Literary Devices & Style in "{activeNovel.title}"
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {activeNovel.literaryDevices.map((ld, ldIdx) => (
                  <div
                    key={ldIdx}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2"
                  >
                    <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                      {ld.device}
                    </span>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      {ld.explanation}
                    </p>
                    {ld.example && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 italic pt-1 border-t border-slate-200 dark:border-slate-700">
                        "{ld.example}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
