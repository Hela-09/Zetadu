import { jambOfflineDb, DownloadedSubjectMeta } from './jambOfflineDb';
import { jambService, BookmarkedJambQuestion, JambExamAttempt } from './jambService';
import { 
  getDownloadedNovelsList, 
  getAllOfflineReadingProgressForUser, 
  getOfflineBookmarksForUser, 
  getOfflinePracticeHistoryForUser,
  DownloadedNovelMeta 
} from './novelOfflineDb';
import { 
  downloadNovel, 
  removeDownloadedNovel, 
  checkIsNovelOffline 
} from './novelService';
import { Flashcard, FlashcardDeck, NovelReadingProgress, NovelBookmark } from '../types';
import { NOVELS_COLLECTION } from '../data/novels';
import { OFFICIAL_JAMB_SUBJECTS, JambSubject } from '../data/jambSubjects';
import { JAMB_QUESTIONS } from '../data/jambQuestions';

export interface UnfinishedPracticeInfo {
  subject: string;
  subjectId?: string;
  topic?: string;
  level?: string;
  totalQuestions: number;
  answeredCount: number;
  currentQIndex: number;
  timerRemaining: number;
  updatedAt: number;
  isSubmitted: boolean;
}

export interface OfflineNovelItem {
  novelId: string;
  title: string;
  author: string;
  chapterCount: number;
  totalWords: number;
  downloadedAt: number;
  readingProgress?: NovelReadingProgress | null;
}

export interface OfflineHubData {
  continueLearning: {
    type: 'unfinished_practice' | 'novel' | 'study_journey' | 'none';
    title: string;
    subtitle: string;
    actionLabel: string;
    progressPercent?: number;
    metadata?: any;
  } | null;
  downloadedSubjects: DownloadedSubjectMeta[];
  savedFlashcards: {
    totalCards: number;
    totalDecks: number;
    dueTodayCount: number;
    decks: FlashcardDeck[];
  };
  bookmarks: {
    jambBookmarks: BookmarkedJambQuestion[];
    novelBookmarks: NovelBookmark[];
    totalCount: number;
  };
  unfinishedPractice: UnfinishedPracticeInfo | null;
  recentOfflineAttempts: JambExamAttempt[];
  offlineNovels: OfflineNovelItem[];
  studyProgress: {
    level: number;
    xp: number;
    streak: number;
    examReadiness: number;
    offlineAttemptsCount: number;
    chaptersReadCount: number;
  };
  unsyncedCount: number;
}

export async function fetchOfflineHubData(uid: string): Promise<OfflineHubData> {
  // 1. Downloaded JAMB subjects
  let downloadedSubjects: DownloadedSubjectMeta[] = [];
  try {
    downloadedSubjects = await jambOfflineDb.getDownloadedSubjects();
  } catch (err) {
    console.warn('Failed to load downloaded subjects:', err);
  }

  // 2. Saved Flashcards from local user cache
  let savedFlashcardsList: Flashcard[] = [];
  try {
    const raw = localStorage.getItem(`learndean_flashcards_cache_${uid}`);
    if (raw) {
      savedFlashcardsList = JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Failed to load cached flashcards:', err);
  }

  // Structure flashcards into decks
  const deckMap: Record<string, {
    id: string;
    name: string;
    subject: string;
    topic: string;
    cards: Flashcard[];
  }> = {};
  const now = Date.now();

  savedFlashcardsList.forEach(card => {
    const deckName = card.deckName || card.subject || 'General Deck';
    const subject = card.subject || 'General';
    const topic = card.topic || 'General Topics';
    const key = `${deckName}:::${topic}`;

    if (!deckMap[key]) {
      deckMap[key] = {
        id: key,
        name: deckName,
        subject: subject,
        topic: topic,
        cards: []
      };
    }
    deckMap[key].cards.push(card);
  });

  const structuredDecks: FlashcardDeck[] = Object.values(deckMap).map(d => {
    const dueToday = d.cards.filter(c => !c.nextReview || c.nextReview <= now).length;
    const bookmarkedCount = d.cards.filter(c => c.bookmarked === true).length;
    return {
      id: d.id,
      name: d.name,
      subject: d.subject,
      topic: d.topic,
      cardCount: d.cards.length,
      dueTodayCount: dueToday,
      bookmarkedCount,
      cards: d.cards
    };
  });

  const totalDueToday = structuredDecks.reduce((acc, d) => acc + d.dueTodayCount, 0);

  // 3. Bookmarks (JAMB questions + Novel chapter quotes)
  let jambBookmarks: BookmarkedJambQuestion[] = [];
  try {
    jambBookmarks = await jambService.getBookmarks();
  } catch (err) {
    console.warn('Failed to load JAMB bookmarks:', err);
  }

  let novelBookmarks: NovelBookmark[] = [];
  try {
    novelBookmarks = await getOfflineBookmarksForUser(uid);
  } catch (err) {
    console.warn('Failed to load novel bookmarks:', err);
  }

  // 4. Unfinished Practice session
  let unfinishedPractice: UnfinishedPracticeInfo | null = null;
  try {
    const rawSession = localStorage.getItem('practice_session');
    if (rawSession) {
      const parsed = JSON.parse(rawSession);
      if (parsed && Array.isArray(parsed.questions) && parsed.questions.length > 0 && !parsed.isSubmitted) {
        const answersCount = Object.keys(parsed.answers || {}).length;
        unfinishedPractice = {
          subject: parsed.subject || 'General Practice',
          subjectId: parsed.subjectId,
          topic: parsed.topic || 'All Topics',
          level: parsed.level,
          totalQuestions: parsed.questions.length,
          answeredCount: answersCount,
          currentQIndex: parsed.currentQIndex || 0,
          timerRemaining: typeof parsed.timerRemaining === 'number' ? parsed.timerRemaining : 1800,
          updatedAt: parsed.updatedAt || Date.now(),
          isSubmitted: false
        };
      }
    }
  } catch (err) {
    console.warn('Failed to load unfinished practice:', err);
  }

  // 5. Offline Novels & Reading Progress
  let offlineNovels: OfflineNovelItem[] = [];
  let userReadingProgressList: NovelReadingProgress[] = [];
  try {
    const downloadedMetaList = await getDownloadedNovelsList();
    userReadingProgressList = await getAllOfflineReadingProgressForUser(uid);

    offlineNovels = downloadedMetaList.map(meta => {
      const prog = userReadingProgressList.find(p => p.novelId === meta.novelId) || null;
      return {
        novelId: meta.novelId,
        title: meta.title,
        author: meta.author,
        chapterCount: meta.chapterCount,
        totalWords: meta.totalWords,
        downloadedAt: meta.downloadedAt,
        readingProgress: prog
      };
    });
  } catch (err) {
    console.warn('Failed to load offline novels:', err);
  }

  // 6. Recent Offline Attempts
  let recentOfflineAttempts: JambExamAttempt[] = [];
  try {
    recentOfflineAttempts = await jambOfflineDb.getAllAttempts();
    recentOfflineAttempts.sort((a, b) => b.completedAt - a.completedAt);
  } catch (err) {
    console.warn('Failed to load offline attempts:', err);
  }

  // 7. Study Progress from caches
  let examReadiness = 0;
  let streak = 0;
  let xp = 0;
  let level = 1;
  try {
    const homeCacheRaw = localStorage.getItem(`zetadu_home_cache_${uid}`);
    if (homeCacheRaw) {
      const homeCache = JSON.parse(homeCacheRaw);
      examReadiness = homeCache.examReadiness || 0;
    }
    const userProfileRaw = localStorage.getItem(`zetadu_user_profile_${uid}`);
    if (userProfileRaw) {
      const p = JSON.parse(userProfileRaw);
      streak = p.streak || 0;
      xp = p.xp || 0;
    }
  } catch (_) {}

  // 8. Unsynced records count
  let unsyncedCount = 0;
  try {
    unsyncedCount = await jambService.getUnsyncedCount();
  } catch (_) {}

  // Determine Continue Learning priority:
  // 1. Unfinished Practice session
  // 2. Active Novel Reading Progress
  // 3. Active Study Journey
  let continueLearning: OfflineHubData['continueLearning'] = null;

  if (unfinishedPractice) {
    const pct = Math.round((unfinishedPractice.answeredCount / unfinishedPractice.totalQuestions) * 100);
    continueLearning = {
      type: 'unfinished_practice',
      title: `${unfinishedPractice.subject} Practice`,
      subtitle: `${unfinishedPractice.topic} • Question ${unfinishedPractice.currentQIndex + 1} of ${unfinishedPractice.totalQuestions}`,
      actionLabel: 'Resume Practice',
      progressPercent: pct,
      metadata: unfinishedPractice
    };
  } else if (offlineNovels.length > 0 && offlineNovels.some(n => n.readingProgress)) {
    const activeNovel = offlineNovels.find(n => n.readingProgress) || offlineNovels[0];
    const prog = activeNovel.readingProgress;
    continueLearning = {
      type: 'novel',
      title: activeNovel.title,
      subtitle: `By ${activeNovel.author} • Chapter ${(prog?.currentChapterIndex ?? 0) + 1} of ${activeNovel.chapterCount}`,
      actionLabel: 'Continue Reading',
      progressPercent: prog?.percentage || 0,
      metadata: { novelId: activeNovel.novelId, chapterIndex: prog?.currentChapterIndex || 0 }
    };
  } else {
    // Check local study journey
    try {
      const jRaw = localStorage.getItem(`zetadu_study_journey_${uid}`);
      if (jRaw) {
        const j = JSON.parse(jRaw);
        if (j && j.status === 'in_progress') {
          continueLearning = {
            type: 'study_journey',
            title: j.topic || 'Study Journey',
            subtitle: `${j.subject || 'Core'} • Step ${j.step || 1} of 6`,
            actionLabel: 'Continue Journey',
            progressPercent: Math.round(((j.step || 1) / 6) * 100),
            metadata: j
          };
        }
      }
    } catch (_) {}
  }

  // Chapters read count
  const chaptersReadCount = userReadingProgressList.reduce((acc, p) => acc + (p.completedChapters?.length || 0), 0);

  return {
    continueLearning,
    downloadedSubjects,
    savedFlashcards: {
      totalCards: savedFlashcardsList.length,
      totalDecks: structuredDecks.length,
      dueTodayCount: totalDueToday,
      decks: structuredDecks
    },
    bookmarks: {
      jambBookmarks,
      novelBookmarks,
      totalCount: jambBookmarks.length + novelBookmarks.length
    },
    unfinishedPractice,
    recentOfflineAttempts: recentOfflineAttempts.slice(0, 5),
    offlineNovels,
    studyProgress: {
      level,
      xp,
      streak,
      examReadiness,
      offlineAttemptsCount: recentOfflineAttempts.length,
      chaptersReadCount
    },
    unsyncedCount
  };
}

/**
 * Downloads a subject for offline use with progress callback
 */
export async function downloadJambSubjectOffline(
  subjectId: string,
  onProgress?: (percent: number, current: number, total: number) => void
): Promise<{ success: boolean; count: number }> {
  return jambOfflineDb.downloadSubject(subjectId, onProgress);
}

/**
 * Deletes a downloaded JAMB subject
 */
export async function removeDownloadedJambSubject(subjectId: string): Promise<void> {
  return jambOfflineDb.deleteDownloadedSubject(subjectId);
}

/**
 * Downloads a literature novel for offline use with progress callback
 */
export async function downloadLiteratureNovelOffline(
  novelId: string,
  onProgress?: (percent: number, currentChapter: number, totalChapters: number) => void
): Promise<boolean> {
  return downloadNovel(novelId, onProgress);
}

/**
 * Removes a downloaded literature novel
 */
export async function removeLiteratureNovelOffline(novelId: string): Promise<void> {
  await removeDownloadedNovel(novelId);
}

/**
 * Caches all flashcards for offline use
 */
export function cacheFlashcardsLocally(uid: string, cards: Flashcard[]): void {
  try {
    localStorage.setItem(`learndean_flashcards_cache_${uid}`, JSON.stringify(cards));
  } catch (err) {
    console.warn('Failed to cache flashcards locally:', err);
  }
}
