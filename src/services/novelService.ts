import { db, cleanFirestoreData } from '../lib/firebase';
import { doc, getDoc, setDoc, getDocs, collection, query, where, deleteDoc, limit } from 'firebase/firestore';
import {
  Novel,
  NovelChapter,
  NovelReadingProgress,
  NovelBookmark,
  NovelQuestionBookmark,
  NovelPracticeAttempt,
  NovelChapterQuestion
} from '../types';
import { NOVELS_COLLECTION } from '../data/novels';
import {
  saveNovelForOffline,
  deleteOfflineNovel,
  isNovelDownloadedOffline,
  getDownloadedNovelsList,
  getOfflineChapter,
  saveOfflineReadingProgress,
  getOfflineReadingProgress,
  getAllOfflineReadingProgressForUser,
  getPendingOfflineReadingProgress,
  markReadingProgressSynced,
  saveOfflineNovelBookmark,
  deleteOfflineNovelBookmark,
  getOfflineBookmarksForUser,
  getPendingOfflineBookmarks,
  markBookmarkSynced,
  saveOfflineQuestionBookmark,
  deleteOfflineQuestionBookmark,
  getOfflineQuestionBookmarksForUser,
  getPendingOfflineQuestionBookmarks,
  markQuestionBookmarkSynced,
  saveOfflinePracticeAttempt,
  getOfflinePracticeHistoryForUser,
  getPendingOfflinePracticeAttempts,
  markPracticeAttemptSynced,
  getAllOfflineChaptersForNovel,
} from './novelOfflineDb';

let isSyncing = false;

// Helper to check network connectivity
export function isOnline(): boolean {
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
}

// -------------------------------------------------------------
// NOVELS CATALOG
// -------------------------------------------------------------

export function getAllNovels(): Novel[] {
  return NOVELS_COLLECTION;
}

export function getNovelById(novelId: string): Novel | undefined {
  return NOVELS_COLLECTION.find((n) => n.id === novelId);
}

export async function getChapterContent(novelId: string, chapterIndex: number): Promise<NovelChapter | null> {
  // Check offline store first if offline or downloaded
  const offlineChap = await getOfflineChapter(novelId, chapterIndex);
  if (offlineChap) {
    return {
      id: offlineChap.id,
      chapterNumber: offlineChap.chapterNumber,
      title: offlineChap.title,
      wordCount: offlineChap.wordCount,
      estimatedMinutes: offlineChap.estimatedMinutes,
      content: offlineChap.content,
      hasFullTextPermission: offlineChap.hasFullTextPermission,
      summary: offlineChap.summary || '',
      importantCharacters: offlineChap.importantCharacters || [],
      importantEvents: offlineChap.importantEvents || [],
      themes: offlineChap.themes || [],
      importantVocabulary: offlineChap.importantVocabulary || [],
      keyPoints: offlineChap.keyPoints || [],
      questions: offlineChap.questions || [],
    };
  }

  // Fallback to in-memory bundle
  const novel = getNovelById(novelId);
  if (novel && novel.chapters[chapterIndex]) {
    return novel.chapters[chapterIndex];
  }

  return null;
}

// -------------------------------------------------------------
// OFFLINE DOWNLOAD MANAGEMENT
// -------------------------------------------------------------

export async function downloadNovel(
  novelId: string,
  onProgress?: (percent: number, currentChapter: number, totalChapters: number) => void
): Promise<boolean> {
  const novel = getNovelById(novelId);
  if (!novel) return false;

  try {
    await saveNovelForOffline(novel, onProgress);
    return true;
  } catch (err) {
    console.error('Failed to download novel for offline:', err);
    return false;
  }
}

export async function removeDownloadedNovel(novelId: string): Promise<boolean> {
  try {
    await deleteOfflineNovel(novelId);
    return true;
  } catch (err) {
    console.error('Failed to remove offline novel:', err);
    return false;
  }
}

export async function checkIsNovelOffline(novelId: string): Promise<boolean> {
  return isNovelDownloadedOffline(novelId);
}

export async function listAllDownloadedNovels() {
  return getDownloadedNovelsList();
}

// -------------------------------------------------------------
// READING PROGRESS (ONLINE + OFFLINE + AUTOMATIC SYNC)
// -------------------------------------------------------------

interface ProgressCacheRecord {
  chapterIndex: number;
  scrollPercentage: number;
  completedChaptersHash: string;
  percentage: number;
  savedAt: number;
}
const progressWriteCache = new Map<string, ProgressCacheRecord>();

export async function saveReadingProgress(progress: NovelReadingProgress, force = false): Promise<void> {
  if (!progress.uid || !progress.novelId) return;

  const cacheKey = `${progress.uid}_${progress.novelId}`;
  const now = Date.now();
  const completedHash = (progress.completedChapters || []).slice().sort().join(',');

  // Prevent duplicate writes unless explicitly forced
  if (!force) {
    const cached = progressWriteCache.get(cacheKey);
    if (cached) {
      const isSameChapter = cached.chapterIndex === progress.currentChapterIndex;
      const isSameCompleted = cached.completedChaptersHash === completedHash;
      const isSamePercentage = cached.percentage === progress.percentage;
      const isScrollClose = Math.abs(cached.scrollPercentage - progress.scrollPercentage) < 4;
      const isRecent = (now - cached.savedAt) < 5000;

      if (isSameChapter && isSameCompleted && isSamePercentage && isScrollClose && isRecent) {
        // Skip write because state is essentially identical and recent
        return;
      }
    }
  }

  const online = isOnline();
  const progressToStore: NovelReadingProgress = {
    ...progress,
    updatedAt: now,
    syncStatus: online ? 'synced' : 'pending',
  };

  // 1. Always save to local IndexedDB (reliable offline-first fallback)
  await saveOfflineReadingProgress(progressToStore);

  // 2. If online and logged in, sync immediately to Firestore
  if (online && progress.uid && db) {
    try {
      const docRef = doc(db, 'user_reading_progress', `${progress.uid}_${progress.novelId}`);
      const payload: Record<string, any> = {
        uid: progress.uid,
        novelId: progress.novelId,
        novelTitle: progress.novelTitle || '',
        currentChapterIndex: progress.currentChapterIndex || 0,
        currentChapterTitle: progress.currentChapterTitle || '',
        scrollPercentage: progress.scrollPercentage || 0,
        completedChapters: progress.completedChapters || [],
        totalChapters: progress.totalChapters || 1,
        percentage: progress.percentage || 0,
        lastReadAt: progress.lastReadAt || now,
        updatedAt: now,
      };
      if (progress.quizScore) {
        payload.quizScore = cleanFirestoreData(progress.quizScore);
      }
      await setDoc(docRef, cleanFirestoreData(payload), { merge: true });

      // Update write cache on successful write
      progressWriteCache.set(cacheKey, {
        chapterIndex: progress.currentChapterIndex,
        scrollPercentage: progress.scrollPercentage,
        completedChaptersHash: completedHash,
        percentage: progress.percentage,
        savedAt: now,
      });
    } catch (err: any) {
      console.warn('Firestore reading progress save failed (saved locally):', err?.message || err);
      // Mark as pending in local db
      await saveOfflineReadingProgress({ ...progressToStore, syncStatus: 'pending' });
    }
  }
}

export async function getNovelReadingProgress(uid: string, novelId: string): Promise<NovelReadingProgress | null> {
  // Check local first
  const localProg = await getOfflineReadingProgress(uid, novelId);

  // If online, check remote
  if (isOnline() && uid && db) {
    try {
      const docRef = doc(db, 'user_reading_progress', `${uid}_${novelId}`);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const remoteData = snap.data() as NovelReadingProgress;
        // Return whichever is newer
        if (!localProg || (remoteData.updatedAt && remoteData.updatedAt >= (localProg.updatedAt || 0))) {
          // Update local with remote
          await saveOfflineReadingProgress({ ...remoteData, syncStatus: 'synced' });
          return remoteData;
        }
      }
    } catch (err) {
      console.warn('Firestore reading progress fetch failed, falling back to offline:', err);
    }
  }

  return localProg;
}

export async function getAllUserReadingProgress(uid: string): Promise<Record<string, NovelReadingProgress>> {
  const result: Record<string, NovelReadingProgress> = {};

  // Load from local storage
  const localList = await getAllOfflineReadingProgressForUser(uid);
  localList.forEach((p) => {
    result[p.novelId] = p;
  });

  // If online, fetch all from Firestore and merge
  if (isOnline() && uid && db) {
    try {
      const q = query(collection(db, 'user_reading_progress'), where('uid', '==', uid));
      const snap = await getDocs(q);
      snap.forEach((d) => {
        const remote = d.data() as NovelReadingProgress;
        const currentLocal = result[remote.novelId];
        if (!currentLocal || (remote.updatedAt && remote.updatedAt >= (currentLocal.updatedAt || 0))) {
          result[remote.novelId] = remote;
          // save into local db
          saveOfflineReadingProgress({ ...remote, syncStatus: 'synced' }).catch(() => {});
        }
      });
    } catch (err) {
      console.warn('Failed to load reading progress from Firestore, using offline cache:', err);
    }
  }

  return result;
}

// -------------------------------------------------------------
// BOOKMARKS (ONLINE + OFFLINE + SYNC)
// -------------------------------------------------------------

export async function saveBookmark(bookmark: NovelBookmark): Promise<void> {
  const online = isOnline();
  const bookmarkToStore: NovelBookmark = {
    ...bookmark,
    updatedAt: Date.now(),
    syncStatus: online ? 'synced' : 'pending',
  };

  // 1. Save to local IndexedDB
  await saveOfflineNovelBookmark(bookmarkToStore);

  // 2. If online and logged in, sync to Firestore
  if (online && bookmark.uid && db) {
    try {
      const docRef = doc(db, 'novel_bookmarks', bookmark.id);
      const bPayload: Record<string, any> = {
        id: bookmark.id,
        uid: bookmark.uid,
        novelId: bookmark.novelId,
        novelTitle: bookmark.novelTitle || '',
        chapterIndex: bookmark.chapterIndex || 0,
        chapterTitle: bookmark.chapterTitle || '',
        paragraphText: bookmark.paragraphText || '',
        createdAt: bookmark.createdAt || Date.now(),
        updatedAt: Date.now(),
      };
      if (bookmark.note) bPayload.note = bookmark.note;
      await setDoc(docRef, cleanFirestoreData(bPayload), { merge: true });
    } catch (err) {
      console.warn('Firestore bookmark save failed (stored locally):', err);
      await saveOfflineNovelBookmark({ ...bookmarkToStore, syncStatus: 'pending' });
    }
  }
}

export async function deleteBookmark(bookmarkId: string, uid?: string): Promise<void> {
  await deleteOfflineNovelBookmark(bookmarkId);

  if (isOnline() && uid && db) {
    try {
      const docRef = doc(db, 'novel_bookmarks', bookmarkId);
      await deleteDoc(docRef);
    } catch (err) {
      console.warn('Firestore bookmark deletion failed:', err);
    }
  }
}

export async function getUserBookmarks(uid: string, novelId?: string): Promise<NovelBookmark[]> {
  const localList = await getOfflineBookmarksForUser(uid, novelId);
  const bookmarkMap = new Map<string, NovelBookmark>();

  localList.forEach((bm) => bookmarkMap.set(bm.id, bm));

  if (isOnline() && uid && db) {
    try {
      let q = query(collection(db, 'novel_bookmarks'), where('uid', '==', uid));
      if (novelId) {
        q = query(collection(db, 'novel_bookmarks'), where('uid', '==', uid), where('novelId', '==', novelId));
      }
      const snap = await getDocs(q);
      snap.forEach((d) => {
        const remote = d.data() as NovelBookmark;
        bookmarkMap.set(remote.id, remote);
        saveOfflineNovelBookmark({ ...remote, syncStatus: 'synced' }).catch(() => {});
      });
    } catch (err) {
      console.warn('Failed to load bookmarks from Firestore, using offline cache:', err);
    }
  }

  const merged = Array.from(bookmarkMap.values());
  merged.sort((a, b) => b.createdAt - a.createdAt);
  return merged;
}

// -------------------------------------------------------------
// AUTOMATIC SYNC MANAGER
// -------------------------------------------------------------

export async function syncPendingNovelData(uid: string): Promise<{ syncedProgress: number; syncedBookmarks: number }> {
  if (isSyncing || !isOnline() || !uid || !db) {
    return { syncedProgress: 0, syncedBookmarks: 0 };
  }

  isSyncing = true;
  let syncedProgress = 0;
  let syncedBookmarks = 0;

  try {
    // 1. Sync pending reading progress
    const pendingProg = await getPendingOfflineReadingProgress(uid);
    for (const prog of pendingProg) {
      try {
        const docRef = doc(db, 'user_reading_progress', `${prog.uid}_${prog.novelId}`);
        const pPayload: Record<string, any> = {
          uid: prog.uid,
          novelId: prog.novelId,
          novelTitle: prog.novelTitle || '',
          currentChapterIndex: prog.currentChapterIndex || 0,
          currentChapterTitle: prog.currentChapterTitle || '',
          scrollPercentage: prog.scrollPercentage || 0,
          completedChapters: prog.completedChapters || [],
          totalChapters: prog.totalChapters || 1,
          percentage: prog.percentage || 0,
          lastReadAt: prog.lastReadAt || Date.now(),
          updatedAt: prog.updatedAt || Date.now(),
        };
        if (prog.quizScore) pPayload.quizScore = cleanFirestoreData(prog.quizScore);
        await setDoc(docRef, cleanFirestoreData(pPayload), { merge: true });

        await markReadingProgressSynced(prog.uid, prog.novelId);
        syncedProgress++;
      } catch (err) {
        console.warn(`Failed syncing reading progress for ${prog.novelId}:`, err);
      }
    }

    // 2. Sync pending bookmarks
    const pendingBM = await getPendingOfflineBookmarks(uid);
    for (const bm of pendingBM) {
      try {
        const docRef = doc(db, 'novel_bookmarks', bm.id);
        const bPayload: Record<string, any> = {
          id: bm.id,
          uid: bm.uid,
          novelId: bm.novelId,
          novelTitle: bm.novelTitle || '',
          chapterIndex: bm.chapterIndex || 0,
          chapterTitle: bm.chapterTitle || '',
          paragraphText: bm.paragraphText || '',
          createdAt: bm.createdAt || Date.now(),
          updatedAt: bm.updatedAt || Date.now(),
        };
        if (bm.note) bPayload.note = bm.note;
        await setDoc(docRef, cleanFirestoreData(bPayload), { merge: true });

        await markBookmarkSynced(bm.id);
        syncedBookmarks++;
      } catch (err) {
        console.warn(`Failed syncing bookmark ${bm.id}:`, err);
      }
    }

    // 3. Sync pending practice attempts
    const pendingAttempts = await getPendingOfflinePracticeAttempts(uid);
    for (const attempt of pendingAttempts) {
      try {
        const docRef = doc(db, 'novel_practice_history', attempt.id);
        await setDoc(docRef, cleanFirestoreData({
          ...attempt,
          syncStatus: 'synced',
        }), { merge: true });

        await markPracticeAttemptSynced(attempt.id);
      } catch (err) {
        console.warn(`Failed syncing practice attempt ${attempt.id}:`, err);
      }
    }
  } catch (err) {
    console.error('Error during offline novel data sync:', err);
  } finally {
    isSyncing = false;
  }

  return { syncedProgress, syncedBookmarks };
}

// -------------------------------------------------------------
// PRACTICE ATTEMPTS & SCORE HISTORY
// -------------------------------------------------------------

export async function savePracticeAttempt(attempt: NovelPracticeAttempt): Promise<void> {
  const online = isOnline();
  const attemptToStore: NovelPracticeAttempt = {
    ...attempt,
    syncStatus: online ? 'synced' : 'pending',
  };

  // 1. Always save to local IndexedDB (reliable offline capability)
  await saveOfflinePracticeAttempt(attemptToStore);

  // 2. If online and logged in, sync to Firestore
  if (online && attempt.uid && db) {
    try {
      const docRef = doc(db, 'novel_practice_history', attempt.id);
      const payload: Record<string, any> = {
        id: attempt.id,
        uid: attempt.uid,
        novelId: attempt.novelId,
        novelTitle: attempt.novelTitle || '',
        totalQuestions: attempt.totalQuestions || 0,
        correctAnswers: attempt.correctAnswers || 0,
        scorePercentage: attempt.scorePercentage || 0,
        timeSpentSeconds: attempt.timeSpentSeconds || 0,
        timestamp: attempt.timestamp || Date.now(),
        syncStatus: 'synced',
      };
      if (attempt.chapterTitle) payload.chapterTitle = attempt.chapterTitle;
      if (typeof attempt.chapterIndex === 'number') payload.chapterIndex = attempt.chapterIndex;
      if (attempt.mode) payload.mode = attempt.mode;
      if (attempt.scope) payload.scope = attempt.scope;
      if (attempt.selectedChapterIndices) payload.selectedChapterIndices = attempt.selectedChapterIndices;
      if (attempt.weakChapters) payload.weakChapters = attempt.weakChapters;
      if (attempt.completedChapterIndices) payload.completedChapterIndices = attempt.completedChapterIndices;

      await setDoc(docRef, cleanFirestoreData(payload), { merge: true });
    } catch (err) {
      console.warn('Firestore practice attempt save failed (persisted locally):', err);
      await saveOfflinePracticeAttempt({ ...attemptToStore, syncStatus: 'pending' });
    }
  }
}

export async function getUserPracticeHistory(uid: string, novelId?: string): Promise<NovelPracticeAttempt[]> {
  const localList = await getOfflinePracticeHistoryForUser(uid, novelId);
  const attemptsMap = new Map<string, NovelPracticeAttempt>();

  localList.forEach((att) => attemptsMap.set(att.id, att));

  if (isOnline() && uid && db) {
    try {
      let q = query(collection(db, 'novel_practice_history'), where('uid', '==', uid));
      if (novelId) {
        q = query(collection(db, 'novel_practice_history'), where('uid', '==', uid), where('novelId', '==', novelId));
      }
      const snap = await getDocs(q);
      snap.forEach((d) => {
        const remote = d.data() as NovelPracticeAttempt;
        attemptsMap.set(remote.id, remote);
        saveOfflinePracticeAttempt({ ...remote, syncStatus: 'synced' }).catch(() => {});
      });
    } catch (err) {
      console.warn('Failed to load practice history from Firestore, using offline cache:', err);
    }
  }

  const merged = Array.from(attemptsMap.values());
  merged.sort((a, b) => b.timestamp - a.timestamp);
  return merged;
}

// -------------------------------------------------------------
// QUESTIONS RETRIEVAL & AGGREGATION (ONLINE + OFFLINE)
// -------------------------------------------------------------

export async function getNovelPracticeQuestions(
  novel: Novel,
  selectedChapterIndices?: number[]
): Promise<NovelChapterQuestion[]> {
  const collectedQuestions: NovelChapterQuestion[] = [];
  const seenIds = new Set<string>();

  // Check if offline chapters are available
  let chaptersToSearch = novel.chapters;
  const isOffline = await isNovelDownloadedOffline(novel.id);
  if (isOffline) {
    const offlineChapters = await getAllOfflineChaptersForNovel(novel.id);
    if (offlineChapters.length > 0) {
      chaptersToSearch = offlineChapters as any;
    }
  }

  // Filter chapters if specified
  const targetChapters = selectedChapterIndices && selectedChapterIndices.length > 0
    ? chaptersToSearch.filter((_, idx) => selectedChapterIndices.includes(idx))
    : chaptersToSearch;

  // 1. Collect questions defined directly on chapters
  targetChapters.forEach((chap, idx) => {
    const chapterIndex = (chap as any).chapterIndex !== undefined ? (chap as any).chapterIndex : idx;
    if (chap.questions && chap.questions.length > 0) {
      chap.questions.forEach((q) => {
        if (!seenIds.has(q.id)) {
          seenIds.add(q.id);
          collectedQuestions.push({
            ...q,
            novelId: (q as any).novelId || novel.id,
            chapterIndex,
            chapterNumber: chap.chapterNumber || chapterIndex + 1,
            chapterTitle: chap.title || `Chapter ${chapterIndex + 1}`,
          });
        }
      });
    }
  });

  // 2. If no chapter-specific filter or if all chapters are selected, also add novel-level practice questions
  if (!selectedChapterIndices || selectedChapterIndices.length === 0 || selectedChapterIndices.length === chaptersToSearch.length) {
    if (novel.practiceQuestions && novel.practiceQuestions.length > 0) {
      novel.practiceQuestions.forEach((pq, pqIdx) => {
        if (!seenIds.has(pq.id)) {
          seenIds.add(pq.id);
          collectedQuestions.push({
            id: pq.id,
            novelId: novel.id,
            chapterIndex: pqIdx % Math.max(1, novel.chapters.length),
            chapterNumber: (pqIdx % Math.max(1, novel.chapters.length)) + 1,
            chapterTitle: novel.chapters[pqIdx % Math.max(1, novel.chapters.length)]?.title || 'General Novel Comprehension',
            question: pq.question,
            options: pq.options,
            correctAnswer: pq.correctAnswer,
            explanation: pq.explanation,
            difficulty: 'medium',
            topic: pq.topic || 'General UTME Revision',
            year: pq.year || 'Authentic JAMB UTME',
          });
        }
      });
    }
  }

  // 3. Query centralized Firestore jambNovelQuestions if online
  if (isOnline() && db) {
    try {
      const nqQuery = query(collection(db, 'jambNovelQuestions'), where('novelId', '==', novel.id), limit(50));
      const nqSnap = await getDocs(nqQuery);
      nqSnap.forEach(d => {
        const data = d.data();
        const qId = data.questionId || d.id;
        if (!seenIds.has(qId)) {
          seenIds.add(qId);
          collectedQuestions.push({
            id: qId,
            novelId: novel.id,
            chapterIndex: data.chapterIndex ?? 0,
            chapterNumber: (data.chapterIndex ?? 0) + 1,
            chapterTitle: data.chapterTitle || 'Novel Comprehension',
            question: data.question,
            options: data.options,
            correctAnswer: data.correctAnswer,
            explanation: data.explanation || '',
            difficulty: data.difficulty || 'medium',
            topic: data.topic || 'Novel Practice',
            year: data.year || 'Authentic JAMB UTME',
            isAIgenerated: data.isAIgenerated ?? false
          });
        }
      });
    } catch (e) {
      console.warn("Could not query jambNovelQuestions from Firestore:", e);
    }
  }

  return collectedQuestions;
}

// Attach auto-sync listener when browser transitions to online
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    // Trigger custom event so any active component can notify user or refresh
    window.dispatchEvent(new CustomEvent('learndean-novel-online-sync'));
  });
}

