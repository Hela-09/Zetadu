import {
  Novel,
  NovelChapter,
  NovelReadingProgress,
  NovelBookmark,
  NovelQuestionBookmark,
  NovelPracticeAttempt,
  NovelChapterCharacter,
  NovelChapterVocabulary,
  NovelChapterQuestion
} from '../types';

const DB_NAME = 'LearnDean_Novels_OfflineDB';
const DB_VERSION = 2;

export interface DownloadedNovelMeta {
  novelId: string;
  title: string;
  author: string;
  chapterCount: number;
  downloadedAt: number;
  totalWords: number;
}

export interface OfflineStoredChapter {
  id: string; // `${novelId}_${chapterIndex}`
  novelId: string;
  chapterIndex: number;
  chapterNumber: number;
  title: string;
  content: string;
  wordCount: number;
  estimatedMinutes: number;
  hasFullTextPermission?: boolean;
  summary?: string;
  importantCharacters?: NovelChapterCharacter[];
  importantEvents?: string[];
  themes?: string[];
  importantVocabulary?: NovelChapterVocabulary[];
  keyPoints?: string[];
  questions?: NovelChapterQuestion[];
}

export interface StoredReadingProgress extends NovelReadingProgress {
  storageKey: string; // `${uid}_${novelId}`
}

let dbInstance: IDBDatabase | null = null;

export async function getNovelOfflineDb(): Promise<IDBDatabase> {
  if (dbInstance) return dbInstance;

  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported on this device/environment.'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // 1. Downloaded novels registry
      if (!db.objectStoreNames.contains('downloaded_novels')) {
        db.createObjectStore('downloaded_novels', { keyPath: 'novelId' });
      }

      // 2. Offline chapters content store
      if (!db.objectStoreNames.contains('offline_chapters')) {
        const chapterStore = db.createObjectStore('offline_chapters', { keyPath: 'id' });
        chapterStore.createIndex('by_novel', 'novelId', { unique: false });
      }

      // 3. Offline reading progress
      if (!db.objectStoreNames.contains('offline_reading_progress')) {
        const progStore = db.createObjectStore('offline_reading_progress', { keyPath: 'storageKey' });
        progStore.createIndex('by_uid', 'uid', { unique: false });
        progStore.createIndex('by_syncStatus', 'syncStatus', { unique: false });
      }

      // 4. Offline bookmarks
      if (!db.objectStoreNames.contains('offline_bookmarks')) {
        const bmStore = db.createObjectStore('offline_bookmarks', { keyPath: 'id' });
        bmStore.createIndex('by_uid', 'uid', { unique: false });
        bmStore.createIndex('by_novel', 'novelId', { unique: false });
        bmStore.createIndex('by_syncStatus', 'syncStatus', { unique: false });
      }

      // 5. Offline question bookmarks (v2)
      if (!db.objectStoreNames.contains('offline_question_bookmarks')) {
        const qbmStore = db.createObjectStore('offline_question_bookmarks', { keyPath: 'id' });
        qbmStore.createIndex('by_uid', 'uid', { unique: false });
        qbmStore.createIndex('by_novel', 'novelId', { unique: false });
        qbmStore.createIndex('by_chapter', 'chapterIndex', { unique: false });
        qbmStore.createIndex('by_syncStatus', 'syncStatus', { unique: false });
      }

      // 6. Offline practice history (v2)
      if (!db.objectStoreNames.contains('offline_practice_history')) {
        const histStore = db.createObjectStore('offline_practice_history', { keyPath: 'id' });
        histStore.createIndex('by_uid', 'uid', { unique: false });
        histStore.createIndex('by_novel', 'novelId', { unique: false });
        histStore.createIndex('by_syncStatus', 'syncStatus', { unique: false });
      }
    };

    request.onsuccess = (event) => {
      dbInstance = (event.target as IDBOpenDBRequest).result;
      resolve(dbInstance);
    };

    request.onerror = (event) => {
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
}

// -------------------------------------------------------------
// NOVEL DOWNLOAD & OFFLINE CHAPTERS
// -------------------------------------------------------------

export async function isNovelDownloadedOffline(novelId: string): Promise<boolean> {
  try {
    const db = await getNovelOfflineDb();
    return new Promise((resolve) => {
      const tx = db.transaction('downloaded_novels', 'readonly');
      const store = tx.objectStore('downloaded_novels');
      const req = store.get(novelId);
      req.onsuccess = () => resolve(Boolean(req.result));
      req.onerror = () => resolve(false);
    });
  } catch (err) {
    console.warn('Failed to check if novel is downloaded:', err);
    return false;
  }
}

export async function getDownloadedNovelsList(): Promise<DownloadedNovelMeta[]> {
  try {
    const db = await getNovelOfflineDb();
    return new Promise((resolve) => {
      const tx = db.transaction('downloaded_novels', 'readonly');
      const store = tx.objectStore('downloaded_novels');
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    });
  } catch (err) {
    console.warn('Failed to get downloaded novels list:', err);
    return [];
  }
}

export async function saveNovelForOffline(
  novel: Novel,
  onProgress?: (progressPercent: number, chapterIndex: number, total: number) => void
): Promise<void> {
  const db = await getNovelOfflineDb();

  const totalChapters = novel.chapters.length;
  let totalWords = 0;

  // Save each chapter
  for (let i = 0; i < totalChapters; i++) {
    const chap = novel.chapters[i];
    totalWords += chap.wordCount || 0;

    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction('offline_chapters', 'readwrite');
      const store = tx.objectStore('offline_chapters');
      const storedItem: OfflineStoredChapter = {
        id: `${novel.id}_${i}`,
        novelId: novel.id,
        chapterIndex: i,
        chapterNumber: chap.chapterNumber,
        title: chap.title,
        content: chap.content,
        wordCount: chap.wordCount,
        estimatedMinutes: chap.estimatedMinutes,
        hasFullTextPermission: chap.hasFullTextPermission,
        summary: chap.summary,
        importantCharacters: chap.importantCharacters,
        importantEvents: chap.importantEvents,
        themes: chap.themes,
        importantVocabulary: chap.importantVocabulary,
        keyPoints: chap.keyPoints,
        questions: chap.questions,
      };
      const req = store.put(storedItem);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });

    if (onProgress) {
      const pct = Math.round(((i + 1) / totalChapters) * 100);
      onProgress(pct, i + 1, totalChapters);
    }
  }

  // Save downloaded novel meta
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction('downloaded_novels', 'readwrite');
    const store = tx.objectStore('downloaded_novels');
    const meta: DownloadedNovelMeta = {
      novelId: novel.id,
      title: novel.title,
      author: novel.author,
      chapterCount: totalChapters,
      downloadedAt: Date.now(),
      totalWords,
    };
    const req = store.put(meta);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function deleteOfflineNovel(novelId: string): Promise<void> {
  const db = await getNovelOfflineDb();

  // 1. Delete chapters
  await new Promise<void>((resolve) => {
    const tx = db.transaction('offline_chapters', 'readwrite');
    const store = tx.objectStore('offline_chapters');
    const index = store.index('by_novel');
    const req = index.openCursor(IDBKeyRange.only(novelId));

    req.onsuccess = (e) => {
      const cursor = (e.target as IDBRequest).result as IDBCursorWithValue;
      if (cursor) {
        cursor.delete();
        cursor.continue();
      } else {
        resolve();
      }
    };
    req.onerror = () => resolve();
  });

  // 2. Delete meta
  await new Promise<void>((resolve) => {
    const tx = db.transaction('downloaded_novels', 'readwrite');
    const store = tx.objectStore('downloaded_novels');
    const req = store.delete(novelId);
    req.onsuccess = () => resolve();
    req.onerror = () => resolve();
  });
}

export async function getOfflineChapter(novelId: string, chapterIndex: number): Promise<OfflineStoredChapter | null> {
  try {
    const db = await getNovelOfflineDb();
    return new Promise((resolve) => {
      const tx = db.transaction('offline_chapters', 'readonly');
      const store = tx.objectStore('offline_chapters');
      const req = store.get(`${novelId}_${chapterIndex}`);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  } catch (err) {
    console.warn('Failed to load offline chapter:', err);
    return null;
  }
}

// -------------------------------------------------------------
// READING PROGRESS PERSISTENCE
// -------------------------------------------------------------

export async function saveOfflineReadingProgress(progress: NovelReadingProgress): Promise<void> {
  const db = await getNovelOfflineDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('offline_reading_progress', 'readwrite');
    const store = tx.objectStore('offline_reading_progress');
    const item: StoredReadingProgress = {
      ...progress,
      storageKey: `${progress.uid}_${progress.novelId}`,
    };
    const req = store.put(item);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function getOfflineReadingProgress(uid: string, novelId: string): Promise<NovelReadingProgress | null> {
  try {
    const db = await getNovelOfflineDb();
    return new Promise((resolve) => {
      const tx = db.transaction('offline_reading_progress', 'readonly');
      const store = tx.objectStore('offline_reading_progress');
      const req = store.get(`${uid}_${novelId}`);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  } catch (err) {
    return null;
  }
}

export async function getAllOfflineReadingProgressForUser(uid: string): Promise<NovelReadingProgress[]> {
  try {
    const db = await getNovelOfflineDb();
    return new Promise((resolve) => {
      const tx = db.transaction('offline_reading_progress', 'readonly');
      const store = tx.objectStore('offline_reading_progress');
      const index = store.index('by_uid');
      const req = index.getAll(IDBKeyRange.only(uid));
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    });
  } catch (err) {
    return [];
  }
}

export async function getPendingOfflineReadingProgress(uid: string): Promise<StoredReadingProgress[]> {
  try {
    const all = await getAllOfflineReadingProgressForUser(uid);
    return (all as StoredReadingProgress[]).filter((p) => p.syncStatus === 'pending');
  } catch (err) {
    return [];
  }
}

export async function markReadingProgressSynced(uid: string, novelId: string): Promise<void> {
  const db = await getNovelOfflineDb();
  return new Promise((resolve) => {
    const tx = db.transaction('offline_reading_progress', 'readwrite');
    const store = tx.objectStore('offline_reading_progress');
    const key = `${uid}_${novelId}`;
    const req = store.get(key);
    req.onsuccess = () => {
      if (req.result) {
        req.result.syncStatus = 'synced';
        store.put(req.result);
      }
      resolve();
    };
    req.onerror = () => resolve();
  });
}

// -------------------------------------------------------------
// NOVEL BOOKMARKS
// -------------------------------------------------------------

export async function saveOfflineNovelBookmark(bookmark: NovelBookmark): Promise<void> {
  const db = await getNovelOfflineDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('offline_bookmarks', 'readwrite');
    const store = tx.objectStore('offline_bookmarks');
    const req = store.put(bookmark);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function deleteOfflineNovelBookmark(id: string): Promise<void> {
  const db = await getNovelOfflineDb();
  return new Promise((resolve) => {
    const tx = db.transaction('offline_bookmarks', 'readwrite');
    const store = tx.objectStore('offline_bookmarks');
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => resolve();
  });
}

export async function getOfflineBookmarksForUser(uid: string, novelId?: string): Promise<NovelBookmark[]> {
  try {
    const db = await getNovelOfflineDb();
    return new Promise((resolve) => {
      const tx = db.transaction('offline_bookmarks', 'readonly');
      const store = tx.objectStore('offline_bookmarks');
      const index = store.index('by_uid');
      const req = index.getAll(IDBKeyRange.only(uid));
      req.onsuccess = () => {
        let results = (req.result || []) as NovelBookmark[];
        if (novelId) {
          results = results.filter((b) => b.novelId === novelId);
        }
        // sort by newest
        results.sort((a, b) => b.createdAt - a.createdAt);
        resolve(results);
      };
      req.onerror = () => resolve([]);
    });
  } catch (err) {
    return [];
  }
}

export async function getPendingOfflineBookmarks(uid: string): Promise<NovelBookmark[]> {
  try {
    const all = await getOfflineBookmarksForUser(uid);
    return all.filter((b) => b.syncStatus === 'pending');
  } catch (err) {
    return [];
  }
}

export async function markBookmarkSynced(id: string): Promise<void> {
  const db = await getNovelOfflineDb();
  return new Promise((resolve) => {
    const tx = db.transaction('offline_bookmarks', 'readwrite');
    const store = tx.objectStore('offline_bookmarks');
    const req = store.get(id);
    req.onsuccess = () => {
      if (req.result) {
        req.result.syncStatus = 'synced';
        store.put(req.result);
      }
      resolve();
    };
    req.onerror = () => resolve();
  });
}

// -------------------------------------------------------------
// OFFLINE QUESTION BOOKMARKS
// -------------------------------------------------------------

export async function saveOfflineQuestionBookmark(bookmark: NovelQuestionBookmark): Promise<void> {
  const db = await getNovelOfflineDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('offline_question_bookmarks', 'readwrite');
    const store = tx.objectStore('offline_question_bookmarks');
    const req = store.put(bookmark);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function deleteOfflineQuestionBookmark(id: string): Promise<void> {
  const db = await getNovelOfflineDb();
  return new Promise((resolve) => {
    const tx = db.transaction('offline_question_bookmarks', 'readwrite');
    const store = tx.objectStore('offline_question_bookmarks');
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => resolve();
  });
}

export async function getOfflineQuestionBookmarksForUser(
  uid: string,
  novelId?: string,
  chapterIndex?: number
): Promise<NovelQuestionBookmark[]> {
  try {
    const db = await getNovelOfflineDb();
    return new Promise((resolve) => {
      const tx = db.transaction('offline_question_bookmarks', 'readonly');
      const store = tx.objectStore('offline_question_bookmarks');
      const index = store.index('by_uid');
      const req = index.getAll(IDBKeyRange.only(uid));
      req.onsuccess = () => {
        let results = (req.result || []) as NovelQuestionBookmark[];
        if (novelId) {
          results = results.filter((b) => b.novelId === novelId);
        }
        if (chapterIndex !== undefined) {
          results = results.filter((b) => b.chapterIndex === chapterIndex);
        }
        results.sort((a, b) => b.createdAt - a.createdAt);
        resolve(results);
      };
      req.onerror = () => resolve([]);
    });
  } catch (err) {
    return [];
  }
}

export async function getPendingOfflineQuestionBookmarks(uid: string): Promise<NovelQuestionBookmark[]> {
  try {
    const all = await getOfflineQuestionBookmarksForUser(uid);
    return all.filter((b) => b.syncStatus === 'pending');
  } catch (err) {
    return [];
  }
}

export async function markQuestionBookmarkSynced(id: string): Promise<void> {
  const db = await getNovelOfflineDb();
  return new Promise((resolve) => {
    const tx = db.transaction('offline_question_bookmarks', 'readwrite');
    const store = tx.objectStore('offline_question_bookmarks');
    const req = store.get(id);
    req.onsuccess = () => {
      if (req.result) {
        req.result.syncStatus = 'synced';
        store.put(req.result);
      }
      resolve();
    };
    req.onerror = () => resolve();
  });
}

// -------------------------------------------------------------
// OFFLINE PRACTICE ATTEMPTS / HISTORY
// -------------------------------------------------------------

export async function saveOfflinePracticeAttempt(attempt: NovelPracticeAttempt): Promise<void> {
  const db = await getNovelOfflineDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('offline_practice_history', 'readwrite');
    const store = tx.objectStore('offline_practice_history');
    const req = store.put(attempt);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function getOfflinePracticeHistoryForUser(
  uid: string,
  novelId?: string
): Promise<NovelPracticeAttempt[]> {
  try {
    const db = await getNovelOfflineDb();
    return new Promise((resolve) => {
      const tx = db.transaction('offline_practice_history', 'readonly');
      const store = tx.objectStore('offline_practice_history');
      const index = store.index('by_uid');
      const req = index.getAll(IDBKeyRange.only(uid));
      req.onsuccess = () => {
        let results = (req.result || []) as NovelPracticeAttempt[];
        if (novelId) {
          results = results.filter((a) => a.novelId === novelId);
        }
        results.sort((a, b) => b.timestamp - a.timestamp);
        resolve(results);
      };
      req.onerror = () => resolve([]);
    });
  } catch (err) {
    return [];
  }
}

export async function getPendingOfflinePracticeAttempts(uid: string): Promise<NovelPracticeAttempt[]> {
  try {
    const all = await getOfflinePracticeHistoryForUser(uid);
    return all.filter((a) => a.syncStatus === 'pending');
  } catch (err) {
    return [];
  }
}

export async function markPracticeAttemptSynced(id: string): Promise<void> {
  const db = await getNovelOfflineDb();
  return new Promise((resolve) => {
    const tx = db.transaction('offline_practice_history', 'readwrite');
    const store = tx.objectStore('offline_practice_history');
    const req = store.get(id);
    req.onsuccess = () => {
      if (req.result) {
        req.result.syncStatus = 'synced';
        store.put(req.result);
      }
      resolve();
    };
    req.onerror = () => resolve();
  });
}
