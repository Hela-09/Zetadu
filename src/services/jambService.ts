import { db, auth } from '../lib/firebase';
import { collection, doc, setDoc, getDoc, getDocs, query, where, orderBy, limit, deleteDoc } from 'firebase/firestore';
import { JambQuestion, getJambQuestionsByFilter } from '../data/jambQuestions';
import { jambOfflineDb, DownloadedSubjectMeta, StoredOfflineAttempt, StoredOfflineBookmark } from './jambOfflineDb';

export interface JambExamAttempt {
  id: string;
  uid: string;
  subject: string;
  subjectName: string;
  year: number | 'all';
  score: number;
  totalQuestions: number;
  percentage: number;
  timeSpentSeconds: number;
  completedAt: number;
  answers: Record<string, number>; // questionId -> chosen option index
  questions: JambQuestion[];
  syncStatus?: 'pending' | 'synced';
  syncedAt?: number | null;
}

export interface BookmarkedJambQuestion {
  questionId: string;
  subject: string;
  savedAt: number;
  question: JambQuestion;
  syncStatus?: 'pending' | 'synced';
  syncedAt?: number | null;
}

const LOCAL_STORAGE_HISTORY_KEY = 'learndean_jamb_history';
const LOCAL_STORAGE_BOOKMARKS_KEY = 'learndean_jamb_bookmarks';

// Concurrency lock to strictly prevent duplicate syncing
let isSyncInProgress = false;

export const jambService = {
  // 1. SAVE PRACTICE ATTEMPT (OFFLINE-FIRST + FIRESTORE SYNC)
  async saveAttempt(attempt: Omit<JambExamAttempt, 'id' | 'uid' | 'completedAt'>): Promise<string> {
    const attemptId = `jamb_attempt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const uid = auth.currentUser?.uid || 'guest';
    const completedAt = Date.now();
    const isOnline = typeof navigator !== 'undefined' && navigator.onLine;

    const fullAttempt: JambExamAttempt = {
      ...attempt,
      id: attemptId,
      uid,
      completedAt,
      syncStatus: 'pending'
    };

    // 1. Store in IndexedDB immediately (always offline-safe and durable)
    try {
      await jambOfflineDb.saveAttempt(fullAttempt, 'pending');
    } catch (e) {
      console.warn('IndexedDB save attempt warning:', e);
    }

    // 2. LocalStorage fast mirror for immediate sync view
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_HISTORY_KEY);
      const list: JambExamAttempt[] = stored ? JSON.parse(stored) : [];
      list.unshift(fullAttempt);
      localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, JSON.stringify(list.slice(0, 50)));
    } catch (e) {
      console.warn('Failed to save attempt to localStorage:', e);
    }

    // 3. Sync immediately to Firestore if online & logged in
    if (isOnline && auth.currentUser) {
      try {
        const firestorePayload = {
          ...fullAttempt,
          uid: auth.currentUser.uid,
          syncStatus: 'synced',
          syncedAt: Date.now()
        };
        await setDoc(doc(db, 'jamb_history', attemptId), firestorePayload);
        // Mark as synced in IndexedDB
        await jambOfflineDb.markAttemptSynced(attemptId);
        fullAttempt.syncStatus = 'synced';
        fullAttempt.syncedAt = firestorePayload.syncedAt;
      } catch (e) {
        console.warn('Firestore direct write failed, saved offline in IndexedDB for auto-sync:', e);
      }
    }

    return attemptId;
  },

  // 2. GET PRACTICE HISTORY (COMBINES INDEXEDDB, FIRESTORE & LOCAL STORAGE)
  async getHistory(): Promise<JambExamAttempt[]> {
    // 1. Read IndexedDB offline store
    let offlineList: JambExamAttempt[] = [];
    try {
      offlineList = await jambOfflineDb.getAllAttempts();
    } catch (e) {
      console.warn('IndexedDB read attempts error:', e);
    }

    // 2. Read localStorage fallback
    const localList: JambExamAttempt[] = (() => {
      try {
        const stored = localStorage.getItem(LOCAL_STORAGE_HISTORY_KEY);
        return stored ? JSON.parse(stored) : [];
      } catch {
        return [];
      }
    })();

    // Merge offline and local lists
    const mergedMap = new Map<string, JambExamAttempt>();
    offlineList.forEach(item => mergedMap.set(item.id, item));
    localList.forEach(item => {
      if (!mergedMap.has(item.id)) mergedMap.set(item.id, item);
    });

    const isOnline = typeof navigator !== 'undefined' && navigator.onLine;
    if (!isOnline || !auth.currentUser) {
      return Array.from(mergedMap.values()).sort((a, b) => b.completedAt - a.completedAt);
    }

    // 3. Online: fetch latest from Firestore and merge
    try {
      const q = query(
        collection(db, 'jamb_history'),
        where('uid', '==', auth.currentUser.uid),
        orderBy('completedAt', 'desc'),
        limit(40)
      );
      const snapshot = await getDocs(q);
      snapshot.forEach(docSnap => {
        const data = docSnap.data() as JambExamAttempt;
        mergedMap.set(data.id, {
          ...data,
          syncStatus: 'synced'
        });
        // Also ensure it's saved in IndexedDB as synced
        jambOfflineDb.saveAttempt({ ...data, syncStatus: 'synced' }, 'synced').catch(() => {});
      });

      const merged = Array.from(mergedMap.values()).sort((a, b) => b.completedAt - a.completedAt);
      try {
        localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, JSON.stringify(merged.slice(0, 50)));
      } catch {}
      return merged;
    } catch (e) {
      console.warn('Firestore getHistory failed, using offline IndexedDB records:', e);
    }

    return Array.from(mergedMap.values()).sort((a, b) => b.completedAt - a.completedAt);
  },

  // 3. BOOKMARKS
  async toggleBookmark(question: JambQuestion): Promise<boolean> {
    const isOnline = typeof navigator !== 'undefined' && navigator.onLine;
    const localBookmarks = this.getLocalBookmarks();
    const existingIndex = localBookmarks.findIndex(b => b.questionId === question.id);
    const isNowBookmarked = existingIndex === -1;

    const bookmarkData: BookmarkedJambQuestion = {
      questionId: question.id,
      subject: question.subject,
      savedAt: Date.now(),
      question,
      syncStatus: 'pending'
    };

    if (isNowBookmarked) {
      localBookmarks.unshift(bookmarkData);
      try {
        await jambOfflineDb.saveBookmark(bookmarkData, 'pending');
      } catch (e) {
        console.warn('IndexedDB saveBookmark warning:', e);
      }
    } else {
      localBookmarks.splice(existingIndex, 1);
      try {
        await jambOfflineDb.removeBookmark(question.id);
      } catch (e) {
        console.warn('IndexedDB removeBookmark warning:', e);
      }
    }

    // Save local cache
    try {
      localStorage.setItem(LOCAL_STORAGE_BOOKMARKS_KEY, JSON.stringify(localBookmarks));
    } catch {}

    // Sync remote if online & authenticated
    if (isOnline && auth.currentUser) {
      const bookmarkDocId = `${auth.currentUser.uid}_${question.id}`;
      try {
        if (isNowBookmarked) {
          await setDoc(doc(db, 'jamb_bookmarks', bookmarkDocId), {
            uid: auth.currentUser.uid,
            questionId: question.id,
            subject: question.subject,
            savedAt: bookmarkData.savedAt,
            question,
            syncStatus: 'synced'
          });
          await jambOfflineDb.markBookmarkSynced(question.id);
        } else {
          await deleteDoc(doc(db, 'jamb_bookmarks', bookmarkDocId));
        }
      } catch (e) {
        console.warn('Firestore bookmark sync failed, stored offline in IndexedDB:', e);
      }
    }

    return isNowBookmarked;
  },

  getLocalBookmarks(): BookmarkedJambQuestion[] {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_BOOKMARKS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  async getBookmarks(): Promise<BookmarkedJambQuestion[]> {
    // 1. IndexedDB offline read
    let offlineBookmarks: BookmarkedJambQuestion[] = [];
    try {
      offlineBookmarks = await jambOfflineDb.getAllBookmarks();
    } catch (e) {
      console.warn('IndexedDB read bookmarks error:', e);
    }

    const local = this.getLocalBookmarks();
    const map = new Map<string, BookmarkedJambQuestion>();
    offlineBookmarks.forEach(b => map.set(b.questionId, b));
    local.forEach(b => {
      if (!map.has(b.questionId)) map.set(b.questionId, b);
    });

    const isOnline = typeof navigator !== 'undefined' && navigator.onLine;
    if (!isOnline || !auth.currentUser) {
      return Array.from(map.values()).sort((a, b) => b.savedAt - a.savedAt);
    }

    try {
      const q = query(
        collection(db, 'jamb_bookmarks'),
        where('uid', '==', auth.currentUser.uid),
        orderBy('savedAt', 'desc')
      );
      const snap = await getDocs(q);
      snap.forEach(d => {
        const item = d.data() as BookmarkedJambQuestion;
        map.set(item.questionId, { ...item, syncStatus: 'synced' });
        jambOfflineDb.saveBookmark({ ...item, syncStatus: 'synced' }, 'synced').catch(() => {});
      });
      const remoteMerged = Array.from(map.values()).sort((a, b) => b.savedAt - a.savedAt);
      localStorage.setItem(LOCAL_STORAGE_BOOKMARKS_KEY, JSON.stringify(remoteMerged));
      return remoteMerged;
    } catch (e) {
      console.warn('Firestore getBookmarks failed, using offline records:', e);
    }

    return Array.from(map.values()).sort((a, b) => b.savedAt - a.savedAt);
  },

  isBookmarked(questionId: string): boolean {
    const local = this.getLocalBookmarks();
    return local.some(b => b.questionId === questionId);
  },

  // 4. QUESTIONS LOADER (AWARE OF OFFLINE STATUS AND INDEXEDDB DOWNLOADS)
  async getQuestionsForExam(
    subject: 'english' | 'mathematics' | 'physics' | 'chemistry' | 'biology',
    year?: number | 'all',
    count: number = 20
  ): Promise<{ questions: JambQuestion[]; isOfflineSource: boolean }> {
    // 1. Check if downloaded in IndexedDB
    const isDownloaded = await jambOfflineDb.isSubjectDownloaded(subject);
    if (isDownloaded) {
      try {
        const offlineQuestions = await jambOfflineDb.getOfflineQuestions(subject, year, count);
        if (offlineQuestions.length > 0) {
          return { questions: offlineQuestions, isOfflineSource: true };
        }
      } catch (e) {
        console.warn('Failed to load from IndexedDB, falling back:', e);
      }
    }

    // 2. If not in IndexedDB, check if we are online or have bundle
    const isOnline = typeof navigator !== 'undefined' && navigator.onLine;
    if (!isOnline && !isDownloaded) {
      throw new Error(`Subject "${subject}" is not downloaded for offline practice. Please connect to the internet to download it.`);
    }

    const memoryQuestions = getJambQuestionsByFilter(subject, year, count);
    return { questions: memoryQuestions, isOfflineSource: false };
  },

  // 5. AUTOMATIC BACKGROUND SYNC TO FIREBASE (PREVENTS DUPLICATE SYNCING VIA MUTEX LOCK)
  async syncPendingData(): Promise<{ syncedAttempts: number; syncedBookmarks: number }> {
    // Guard 1: Concurrency mutex lock to prevent duplicate syncing
    if (isSyncInProgress) {
      return { syncedAttempts: 0, syncedBookmarks: 0 };
    }

    // Guard 2: Network check
    const isOnline = typeof navigator !== 'undefined' && navigator.onLine;
    if (!isOnline) {
      return { syncedAttempts: 0, syncedBookmarks: 0 };
    }

    // Guard 3: User authentication check
    if (!auth.currentUser) {
      return { syncedAttempts: 0, syncedBookmarks: 0 };
    }

    isSyncInProgress = true;
    let syncedAttemptsCount = 0;
    let syncedBookmarksCount = 0;

    try {
      // 1. Fetch pending attempts from IndexedDB
      const pendingAttempts = await jambOfflineDb.getPendingAttempts();

      for (const attempt of pendingAttempts) {
        try {
          const remoteDoc: JambExamAttempt = {
            ...attempt,
            uid: auth.currentUser.uid,
            syncStatus: 'synced',
            syncedAt: Date.now()
          };
          // Write idempotently with merge to Firestore
          await setDoc(doc(db, 'jamb_history', attempt.id), remoteDoc, { merge: true });
          // Mark as synced in IndexedDB
          await jambOfflineDb.markAttemptSynced(attempt.id);
          syncedAttemptsCount++;
        } catch (err) {
          console.warn(`Failed to sync attempt ${attempt.id} to Firestore:`, err);
        }
      }

      // 2. Fetch pending bookmarks from IndexedDB
      const pendingBookmarks = await jambOfflineDb.getPendingBookmarks();

      for (const b of pendingBookmarks) {
        try {
          const bookmarkDocId = `${auth.currentUser.uid}_${b.questionId}`;
          await setDoc(doc(db, 'jamb_bookmarks', bookmarkDocId), {
            uid: auth.currentUser.uid,
            questionId: b.questionId,
            subject: b.subject,
            savedAt: b.savedAt,
            question: b.question,
            syncStatus: 'synced',
            syncedAt: Date.now()
          }, { merge: true });
          await jambOfflineDb.markBookmarkSynced(b.questionId);
          syncedBookmarksCount++;
        } catch (err) {
          console.warn(`Failed to sync bookmark ${b.questionId}:`, err);
        }
      }

      if (syncedAttemptsCount > 0 || syncedBookmarksCount > 0) {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('learndean-jamb-synced', {
            detail: { attempts: syncedAttemptsCount, bookmarks: syncedBookmarksCount }
          }));
        }
      }
    } finally {
      isSyncInProgress = false;
    }

    return { syncedAttempts: syncedAttemptsCount, syncedBookmarks: syncedBookmarksCount };
  },

  /**
   * Check if there are unsynced records awaiting internet connection
   */
  async getUnsyncedCount(): Promise<number> {
    try {
      const pendingAttempts = await jambOfflineDb.getPendingAttempts();
      const pendingBookmarks = await jambOfflineDb.getPendingBookmarks();
      return pendingAttempts.length + pendingBookmarks.length;
    } catch {
      return 0;
    }
  }
};
