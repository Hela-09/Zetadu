import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  GraduationCap, 
  History, 
  Bookmark, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  Sliders, 
  Layers, 
  ArrowLeft,
  X,
  CheckCircle2,
  ChevronRight,
  Clock,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { JAMB_SUBJECTS, JambQuestion } from '../../data/jambQuestions';
import { jambService, JambExamAttempt, BookmarkedJambQuestion } from '../../services/jambService';
import { jambOfflineDb, DownloadedSubjectMeta } from '../../services/jambOfflineDb';
import { useAuth } from '../../contexts/AuthContext';
import Quiz, { QuizProps } from '../Quiz';
import JambStudySection, { StudySubTab } from './JambStudySection';
import JambPracticeSection from './JambPracticeSection';
import JambCbtSection from './JambCbtSection';
import { MyJambSubjectsSection } from './MyJambSubjectsSection';
import { AllJambSubjectsSection } from './AllJambSubjectsSection';
import { JambCourseCombinationSection } from './JambCourseCombinationSection';

interface JambPrepProps {
  onBack?: () => void;
  setView?: (v: any) => void;
}

export type MainTab = 
  | 'my-subjects' 
  | 'all-subjects' 
  | 'course-combination' 
  | 'study' 
  | 'practice' 
  | 'cbt';

export default function JambPrep({ onBack, setView }: JambPrepProps) {
  const { user } = useAuth();

  // Top-level Navigation: MY SUBJECTS | ALL SUBJECTS | COURSE COMBO | STUDY | PRACTICE | JAMB CBT
  const [mainTab, setMainTab] = useState<MainTab>('my-subjects');
  const [targetedSubjectId, setTargetedSubjectId] = useState<string>('english');
  const [targetedStudySubTab, setTargetedStudySubTab] = useState<StudySubTab>('subjects');
  const [targetedCbtSubjects, setTargetedCbtSubjects] = useState<string[]>([]);

  // Active Practice / Quiz Session State (delegated to unified Quiz engine)
  const [activeQuizConfig, setActiveQuizConfig] = useState<QuizProps['initialConfig'] | null>(null);
  const [activeQuizMode, setActiveQuizMode] = useState<QuizProps['initialMode']>('jamb-practice');

  // History & Bookmarks State
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const [historyList, setHistoryList] = useState<JambExamAttempt[]>([]);
  const [bookmarksList, setBookmarksList] = useState<BookmarkedJambQuestion[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());

  // Real Offline & Sync States
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [downloadedSubjects, setDownloadedSubjects] = useState<Map<string, DownloadedSubjectMeta>>(new Map());
  const [downloadProgress, setDownloadProgress] = useState<Record<string, { progress: number; current: number; total: number }>>({});
  const [unsyncedCount, setUnsyncedCount] = useState<number>(0);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncToastMessage, setSyncToastMessage] = useState<string | null>(null);

  // Load initial data
  useEffect(() => {
    loadHistoryAndBookmarks();
    loadDownloadedSubjects();
    loadUnsyncedCount();
  }, [user]);

  const loadDownloadedSubjects = async () => {
    try {
      const list = await jambOfflineDb.getDownloadedSubjects();
      const map = new Map<string, DownloadedSubjectMeta>();
      list.forEach(s => map.set(s.subjectId, s));
      setDownloadedSubjects(map);
    } catch (e) {
      console.warn('Failed to load downloaded subjects:', e);
    }
  };

  const loadUnsyncedCount = async () => {
    try {
      const count = await jambService.getUnsyncedCount();
      setUnsyncedCount(count);
    } catch (e) {
      console.warn('Failed to load unsynced count:', e);
    }
  };

  const loadHistoryAndBookmarks = async () => {
    try {
      const history = await jambService.getHistory();
      setHistoryList(history);

      const bookmarks = await jambService.getBookmarks();
      setBookmarksList(bookmarks);
      setBookmarkedIds(new Set(bookmarks.map(b => b.questionId)));
    } catch (e) {
      console.warn('Error loading JAMB history or bookmarks:', e);
    }
  };

  // Automatic Background Sync when internet returns
  useEffect(() => {
    const handleOnlineEvent = async () => {
      setIsOnline(true);
      setIsSyncing(true);
      try {
        const res = await jambService.syncPendingData();
        const totalSynced = res.syncedAttempts + res.syncedBookmarks + (res.syncedSubjects || 0);
        if (totalSynced > 0) {
          setSyncToastMessage(`Internet restored! Synced ${totalSynced} offline item${totalSynced > 1 ? 's' : ''} to Firebase.`);
          await loadHistoryAndBookmarks();
        }
      } catch (err) {
        console.warn('Auto sync on online failed:', err);
      } finally {
        setIsSyncing(false);
        loadUnsyncedCount();
      }
    };

    const handleOfflineEvent = () => setIsOnline(false);

    window.addEventListener('online', handleOnlineEvent);
    window.addEventListener('offline', handleOfflineEvent);

    return () => {
      window.removeEventListener('online', handleOnlineEvent);
      window.removeEventListener('offline', handleOfflineEvent);
    };
  }, []);

  const handleManualSync = async () => {
    if (!isOnline) {
      alert('You are currently offline. Please connect to the internet to sync offline records.');
      return;
    }
    setIsSyncing(true);
    try {
      const res = await jambService.syncPendingData();
      const totalSynced = res.syncedAttempts + res.syncedBookmarks + (res.syncedSubjects || 0);
      if (totalSynced > 0) {
        const parts: string[] = [];
        if (res.syncedSubjects) parts.push(`${res.syncedSubjects} subject profile`);
        if (res.syncedAttempts) parts.push(`${res.syncedAttempts} attempts`);
        if (res.syncedBookmarks) parts.push(`${res.syncedBookmarks} bookmarks`);
        setSyncToastMessage(`Synced ${parts.join(', ')} to cloud!`);
      } else {
        setSyncToastMessage('All practice records and subject combinations are up to date.');
      }
      await loadHistoryAndBookmarks();
      await loadUnsyncedCount();
    } catch (e) {
      console.warn('Manual sync failed:', e);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDownloadSubject = async (subjectId: string) => {
    const subjectMeta = JAMB_SUBJECTS.find(s => s.id === subjectId);
    setDownloadProgress(prev => ({
      ...prev,
      [subjectId]: { progress: 5, current: 0, total: subjectMeta?.totalStandardQuestions || 40 }
    }));

    try {
      await jambOfflineDb.downloadSubject(subjectId, (pct, current, total) => {
        setDownloadProgress(prev => ({
          ...prev,
          [subjectId]: { progress: pct, current, total }
        }));
      });
      await loadDownloadedSubjects();
      setSyncToastMessage(`${subjectMeta?.name || subjectId} downloaded and available offline.`);
    } catch (err: any) {
      console.error('Failed to download subject:', err);
      alert(`Could not download ${subjectMeta?.name}: ${err?.message || 'Please check your connection.'}`);
    } finally {
      setTimeout(() => {
        setDownloadProgress(prev => {
          const next = { ...prev };
          delete next[subjectId];
          return next;
        });
      }, 800);
    }
  };

  const handleDeleteSubjectDownload = async (subjectId: string) => {
    const subjectMeta = JAMB_SUBJECTS.find(s => s.id === subjectId);
    try {
      await jambOfflineDb.deleteDownloadedSubject(subjectId);
      await loadDownloadedSubjects();
      setSyncToastMessage(`Removed offline copy of ${subjectMeta?.name || subjectId}.`);
    } catch (err) {
      console.error('Failed to delete downloaded subject:', err);
    }
  };

  const handleToggleBookmark = async (question: JambQuestion) => {
    try {
      const isNowSaved = await jambService.toggleBookmark(question);
      setBookmarkedIds(prev => {
        const next = new Set(prev);
        if (isNowSaved) next.add(question.id);
        else next.delete(question.id);
        return next;
      });
      const updated = await jambService.getBookmarks();
      setBookmarksList(updated);
    } catch (e) {
      console.error('Failed to toggle bookmark:', e);
    }
  };

  // Launch handlers: directly configure the unified Quiz engine
  const handleLaunchPractice = (config: {
    subject?: string;
    topic?: string;
    year?: number | 'all';
    amount?: number;
    ordering?: 'random' | 'sequential';
    isUntimed?: boolean;
    timerDuration?: number;
    examType?: 'JAMB';
  }) => {
    setActiveQuizMode('jamb-practice');
    setActiveQuizConfig({
      subject: config.subject || 'English Language',
      topic: config.topic,
      year: config.year || 'all',
      amount: config.amount || 20,
      ordering: config.ordering || 'random',
      isUntimed: config.isUntimed ?? false,
      timerDuration: config.timerDuration ?? 20,
      examType: 'JAMB'
    });
  };

  const handleLaunchCbt = (config: {
    subjects: string[];
    amount: number;
    timerDuration: number;
    isUntimed: boolean;
    examType: 'JAMB';
  }) => {
    setActiveQuizMode('jamb-cbt');
    setActiveQuizConfig({
      subject: 'JAMB UTME CBT Mock',
      subjects: config.subjects,
      amount: config.amount,
      timerDuration: config.timerDuration,
      isUntimed: config.isUntimed,
      examType: 'JAMB',
      ordering: 'sequential'
    });
  };

  const handleOpenSubjectStudy = (subjectId: string, subTab: StudySubTab = 'subjects') => {
    setTargetedSubjectId(subjectId);
    setTargetedStudySubTab(subTab);
    setMainTab('study');
  };

  const handleOpenSubjectPractice = (subjectId: string) => {
    setTargetedSubjectId(subjectId);
    setMainTab('practice');
  };

  const handleStartCbtWithSubjects = (subjects: string[]) => {
    setTargetedCbtSubjects(subjects);
    setMainTab('cbt');
  };

  // -----------------------------------------------------------------
  // ACTIVE QUIZ / CBT RUNNING: RENDER UNIFIED QUIZ ENGINE
  // -----------------------------------------------------------------
  if (activeQuizConfig) {
    return (
      <Quiz
        initialMode={activeQuizMode}
        initialConfig={activeQuizConfig}
        onBack={() => {
          setActiveQuizConfig(null);
          loadHistoryAndBookmarks();
        }}
        setView={setView}
      />
    );
  }

  // -----------------------------------------------------------------
  // MAIN JAMB PREP HUB
  // -----------------------------------------------------------------
  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      {/* Top Header with Status & History */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              title="Back"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 uppercase tracking-wider">
                UTME 2025/2026 Ready
              </span>
              <span className="text-xs text-slate-500">Official Syllabus & Question Bank</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
              JAMB Prep Portal
            </h1>
          </div>
        </div>

        {/* Status Badges & History Trigger */}
        <div className="flex flex-wrap items-center gap-2">
          {!isOnline ? (
            <span className="px-2.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-xs font-bold flex items-center gap-1.5 shadow-2xs">
              <WifiOff size={13} className="text-amber-600" />
              <span>Offline Mode</span>
            </span>
          ) : unsyncedCount > 0 ? (
            <button
              type="button"
              onClick={handleManualSync}
              disabled={isSyncing}
              className="px-2.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors shadow-2xs"
            >
              <RefreshCw size={13} className={isSyncing ? "animate-spin text-blue-600" : "text-blue-600"} />
              <span>{unsyncedCount} unsynced • Sync</span>
            </button>
          ) : (
            <span className="hidden sm:flex px-2.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold items-center gap-1.5">
              <Wifi size={13} className="text-emerald-500" />
              <span>Cloud Connected</span>
            </span>
          )}

          <button
            id="jamb-history-toggle-btn"
            type="button"
            onClick={() => setShowHistoryModal(true)}
            className="px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-blue-500 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <History size={16} className="text-blue-600 dark:text-blue-400" />
            <span>History</span>
            {historyList.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-700 text-[10px] font-bold">
                {historyList.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Sync Toast Notification */}
      {syncToastMessage && (
        <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-between gap-3 text-xs text-blue-900 dark:text-blue-100 shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-blue-600 dark:text-blue-400 shrink-0" />
            <span className="font-semibold">{syncToastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setSyncToastMessage(null)}
            className="text-blue-400 hover:text-blue-600 p-1 cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Primary Section Switcher: MY SUBJECTS | ALL SUBJECTS | COURSE COMBO | STUDY | PRACTICE | JAMB CBT */}
      <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 overflow-x-auto no-scrollbar">
        <button
          id="jamb-main-tab-my-subjects"
          type="button"
          onClick={() => setMainTab('my-subjects')}
          className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
            mainTab === 'my-subjects'
              ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <ShieldCheck size={16} />
          <span>My Subjects</span>
        </button>

        <button
          id="jamb-main-tab-all-subjects"
          type="button"
          onClick={() => setMainTab('all-subjects')}
          className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
            mainTab === 'all-subjects'
              ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Layers size={16} />
          <span>All 26 Subjects</span>
        </button>

        <button
          id="jamb-main-tab-course-combination"
          type="button"
          onClick={() => setMainTab('course-combination')}
          className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
            mainTab === 'course-combination'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <GraduationCap size={16} />
          <span>Course Combo</span>
        </button>

        <button
          id="jamb-main-tab-study"
          type="button"
          onClick={() => setMainTab('study')}
          className={`flex-1 min-w-[90px] py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
            mainTab === 'study'
              ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <BookOpen size={16} />
          <span>Study</span>
        </button>

        <button
          id="jamb-main-tab-practice"
          type="button"
          onClick={() => setMainTab('practice')}
          className={`flex-1 min-w-[95px] py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
            mainTab === 'practice'
              ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Sliders size={16} />
          <span>Practice</span>
        </button>

        <button
          id="jamb-main-tab-cbt"
          type="button"
          onClick={() => setMainTab('cbt')}
          className={`flex-1 min-w-[100px] py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
            mainTab === 'cbt'
              ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Sparkles size={16} className="text-amber-500" />
          <span>JAMB CBT</span>
        </button>
      </div>

      {/* Primary Section Content */}
      {mainTab === 'my-subjects' && (
        <MyJambSubjectsSection
          onStartCbtWithSubjects={handleStartCbtWithSubjects}
          onOpenCourseCombination={() => setMainTab('course-combination')}
          onOpenSubjectStudy={subId => handleOpenSubjectStudy(subId, 'subjects')}
          onOpenSubjectPractice={handleOpenSubjectPractice}
        />
      )}

      {mainTab === 'all-subjects' && (
        <AllJambSubjectsSection
          onOpenStudy={subId => handleOpenSubjectStudy(subId, 'subjects')}
          onOpenPastQuestions={subId => handleOpenSubjectStudy(subId, 'past_questions')}
          onOpenPractice={handleOpenSubjectPractice}
          onOpenCourseCombination={() => setMainTab('course-combination')}
        />
      )}

      {mainTab === 'course-combination' && (
        <JambCourseCombinationSection
          onGoToMySubjects={() => setMainTab('my-subjects')}
          onStartCbtWithCombination={handleStartCbtWithSubjects}
        />
      )}

      {mainTab === 'study' && (
        <JambStudySection
          initialSubjectId={targetedSubjectId}
          initialSubTab={targetedStudySubTab}
          onStartPractice={handleLaunchPractice}
          bookmarksList={bookmarksList}
          bookmarkedIds={bookmarkedIds}
          onToggleBookmark={handleToggleBookmark}
          downloadedSubjects={downloadedSubjects}
          onDownloadSubject={handleDownloadSubject}
          onDeleteSubjectDownload={handleDeleteSubjectDownload}
          downloadProgress={downloadProgress}
        />
      )}

      {mainTab === 'practice' && (
        <JambPracticeSection
          initialSubjectId={targetedSubjectId}
          onStartPractice={handleLaunchPractice}
        />
      )}

      {mainTab === 'cbt' && (
        <JambCbtSection
          initialSubjects={targetedCbtSubjects.length > 0 ? targetedCbtSubjects : undefined}
          onStartCbt={handleLaunchCbt}
          onNavigateToMySubjects={() => setMainTab('my-subjects')}
          onNavigateToCourseCombination={() => setMainTab('course-combination')}
        />
      )}

      {/* History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <History size={20} className="text-blue-600" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Your JAMB Practice History</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowHistoryModal(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {historyList.length === 0 ? (
              <div className="py-10 text-center space-y-2">
                <p className="font-bold text-slate-700 dark:text-slate-300">No attempts logged yet</p>
                <p className="text-xs text-slate-500">Take a practice drill or CBT mock exam to track your scores.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {historyList.map(attempt => (
                  <div
                    key={attempt.id}
                    className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-slate-900 dark:text-white text-sm">
                          {attempt.subjectName}
                        </span>
                        <span className="text-xs text-slate-400">
                          • {attempt.year === 'all' ? 'Mixed Years' : `JAMB ${attempt.year}`}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        {new Date(attempt.completedAt).toLocaleDateString()} • {Math.floor(attempt.timeSpentSeconds / 60)}m {attempt.timeSpentSeconds % 60}s
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-black text-blue-600 dark:text-blue-400">
                        {attempt.score} / {attempt.totalQuestions}
                      </span>
                      <p className="text-[11px] font-bold text-slate-500">{attempt.percentage}%</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
