import { JambQuestion, JAMB_QUESTIONS, JAMB_SUBJECTS } from '../data/jambQuestions';
import { JambExamAttempt, BookmarkedJambQuestion } from './jambService';

export interface DownloadedSubjectMeta {
  subjectId: string;
  name: string;
  code: string;
  questionCount: number;
  years: number[];
  downloadedAt: number;
  sizeKb: number;
}

export interface StoredOfflineAttempt extends JambExamAttempt {
  syncStatus: 'pending' | 'synced';
  syncedAt?: number | null;
}

export interface StoredOfflineBookmark extends BookmarkedJambQuestion {
  syncStatus: 'pending' | 'synced';
  syncedAt?: number | null;
}

const DB_NAME = 'LearnDean_JAMB_OfflineDB';
const DB_VERSION = 1;

class JambOfflineDatabase {
  private dbPromise: Promise<IDBDatabase> | null = null;

  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'indexedDB' in window;
  }

  private getDb(): Promise<IDBDatabase> {
    if (!this.isSupported()) {
      return Promise.reject(new Error('IndexedDB is not supported in this browser environment.'));
    }

    if (this.dbPromise) {
      return this.dbPromise;
    }

    this.dbPromise = new Promise((resolve, reject) => {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // 1. Downloaded subjects metadata store
        if (!db.objectStoreNames.contains('downloaded_subjects')) {
          db.createObjectStore('downloaded_subjects', { keyPath: 'subjectId' });
        }

        // 2. Offline questions store (contains questions, options, answers, explanations)
        if (!db.objectStoreNames.contains('offline_questions')) {
          const qStore = db.createObjectStore('offline_questions', { keyPath: 'id' });
          qStore.createIndex('by_subject', 'subject', { unique: false });
          qStore.createIndex('by_year', 'year', { unique: false });
          qStore.createIndex('by_subject_year', ['subject', 'year'], { unique: false });
        }

        // 3. Offline exam attempts store
        if (!db.objectStoreNames.contains('offline_attempts')) {
          const aStore = db.createObjectStore('offline_attempts', { keyPath: 'id' });
          aStore.createIndex('by_syncStatus', 'syncStatus', { unique: false });
          aStore.createIndex('by_completedAt', 'completedAt', { unique: false });
          aStore.createIndex('by_uid', 'uid', { unique: false });
        }

        // 4. Offline bookmarks store
        if (!db.objectStoreNames.contains('offline_bookmarks')) {
          const bStore = db.createObjectStore('offline_bookmarks', { keyPath: 'questionId' });
          bStore.createIndex('by_syncStatus', 'syncStatus', { unique: false });
          bStore.createIndex('by_subject', 'subject', { unique: false });
        }
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error || new Error('Failed to open LearnDean IndexedDB'));
      };
    });

    return this.dbPromise;
  }

  // -------------------------------------------------------------
  // SUBJECT DOWNLOAD MANAGEMENT
  // -------------------------------------------------------------

  /**
   * Check if a specific JAMB subject is downloaded offline
   */
  async isSubjectDownloaded(subjectId: string): Promise<boolean> {
    try {
      const db = await this.getDb();
      return new Promise((resolve) => {
        const tx = db.transaction('downloaded_subjects', 'readonly');
        const store = tx.objectStore('downloaded_subjects');
        const req = store.get(subjectId);
        req.onsuccess = () => resolve(Boolean(req.result));
        req.onerror = () => resolve(false);
      });
    } catch {
      return false;
    }
  }

  /**
   * Get list of all currently downloaded subjects
   */
  async getDownloadedSubjects(): Promise<DownloadedSubjectMeta[]> {
    try {
      const db = await this.getDb();
      return new Promise((resolve) => {
        const tx = db.transaction('downloaded_subjects', 'readonly');
        const store = tx.objectStore('downloaded_subjects');
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve([]);
      });
    } catch {
      return [];
    }
  }

  /**
   * Download a subject's questions, answers, and explanations into IndexedDB
   * Provides real-time step progress callback.
   */
  async downloadSubject(
    subjectId: string,
    onProgress?: (percent: number, current: number, total: number) => void
  ): Promise<{ success: boolean; count: number }> {
    const questions = JAMB_QUESTIONS.filter(q => q.subject === subjectId);
    if (questions.length === 0) {
      throw new Error(`No questions available to download for subject: ${subjectId}`);
    }

    const subjectMeta = JAMB_SUBJECTS.find(s => s.id === subjectId);
    const db = await this.getDb();

    // Calculate years available
    const yearsSet = new Set<number>();
    questions.forEach(q => yearsSet.add(q.year));
    const years = Array.from(yearsSet).sort();

    // Approximate size in KB (JSON stringified)
    const rawJson = JSON.stringify(questions);
    const sizeKb = Math.round(new Blob([rawJson]).size / 1024);

    const total = questions.length;
    let storedCount = 0;

    // Report initial progress
    if (onProgress) onProgress(5, 0, total);

    // Save in batches or one transaction while tracking progress
    const tx = db.transaction(['offline_questions', 'downloaded_subjects'], 'readwrite');
    const qStore = tx.objectStore('offline_questions');
    const subStore = tx.objectStore('downloaded_subjects');

    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error || new Error('Download transaction failed'));

      // Put questions
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        qStore.put(q);
        storedCount++;
        const pct = Math.min(95, Math.round(10 + (storedCount / total) * 85));
        if (onProgress) {
          onProgress(pct, storedCount, total);
        }
      }

      // Put subject metadata
      const meta: DownloadedSubjectMeta = {
        subjectId,
        name: subjectMeta?.name || subjectId,
        code: subjectMeta?.code || subjectId.toUpperCase().slice(0, 3),
        questionCount: total,
        years,
        downloadedAt: Date.now(),
        sizeKb: Math.max(12, sizeKb)
      };
      subStore.put(meta);
    });

    if (onProgress) onProgress(100, total, total);

    return { success: true, count: total };
  }

  /**
   * Delete a downloaded subject from IndexedDB to free space
   */
  async deleteDownloadedSubject(subjectId: string): Promise<void> {
    const db = await this.getDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(['offline_questions', 'downloaded_subjects'], 'readwrite');
      const qStore = tx.objectStore('offline_questions');
      const subStore = tx.objectStore('downloaded_subjects');

      const index = qStore.index('by_subject');
      const req = index.getAllKeys(subjectId);

      req.onsuccess = () => {
        const keys = req.result;
        keys.forEach(key => qStore.delete(key));
        subStore.delete(subjectId);
      };

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error || new Error('Failed to delete subject'));
    });
  }

  /**
   * Get offline questions for CBT practice
   */
  async getOfflineQuestions(
    subjectId: string,
    year?: number | 'all',
    count: number = 20
  ): Promise<JambQuestion[]> {
    const db = await this.getDb();

    const questions: JambQuestion[] = await new Promise((resolve) => {
      const tx = db.transaction('offline_questions', 'readonly');
      const store = tx.objectStore('offline_questions');
      const index = store.index('by_subject');
      const req = index.getAll(subjectId);

      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    });

    if (questions.length === 0) {
      return [];
    }

    let filtered = questions;
    if (year && year !== 'all') {
      const yearFiltered = filtered.filter(q => q.year === year);
      if (yearFiltered.length > 0) {
        filtered = yearFiltered;
      }
    }

    // Shuffle
    const shuffled = [...filtered].sort(() => 0.5 - Math.random());

    // If count exceeds existing questions for that specific year, supplement from the subject pool
    if (shuffled.length < count) {
      const extraPool = [...questions];
      while (shuffled.length < count && extraPool.length > 0) {
        const pick = extraPool[Math.floor(Math.random() * extraPool.length)];
        shuffled.push({
          ...pick,
          id: `${pick.id}-offline-var-${shuffled.length + 1}`
        });
      }
    }

    return shuffled.slice(0, count);
  }

  // -------------------------------------------------------------
  // OFFLINE PRACTICE ATTEMPTS MANAGEMENT
  // -------------------------------------------------------------

  async saveAttempt(attempt: JambExamAttempt, syncStatus: 'pending' | 'synced' = 'pending'): Promise<void> {
    const db = await this.getDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('offline_attempts', 'readwrite');
      const store = tx.objectStore('offline_attempts');
      const record: StoredOfflineAttempt = {
        ...attempt,
        syncStatus,
        syncedAt: syncStatus === 'synced' ? Date.now() : null
      };
      const req = store.put(record);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  async getAllAttempts(): Promise<StoredOfflineAttempt[]> {
    try {
      const db = await this.getDb();
      return new Promise((resolve) => {
        const tx = db.transaction('offline_attempts', 'readonly');
        const store = tx.objectStore('offline_attempts');
        const index = store.index('by_completedAt');
        const req = index.getAll();
        req.onsuccess = () => {
          const list = (req.result || []) as StoredOfflineAttempt[];
          // Sort descending by completion time
          resolve(list.sort((a, b) => b.completedAt - a.completedAt));
        };
        req.onerror = () => resolve([]);
      });
    } catch {
      return [];
    }
  }

  async getPendingAttempts(): Promise<StoredOfflineAttempt[]> {
    try {
      const db = await this.getDb();
      return new Promise((resolve) => {
        const tx = db.transaction('offline_attempts', 'readonly');
        const store = tx.objectStore('offline_attempts');
        const index = store.index('by_syncStatus');
        const req = index.getAll('pending');
        req.onsuccess = () => resolve((req.result || []) as StoredOfflineAttempt[]);
        req.onerror = () => resolve([]);
      });
    } catch {
      return [];
    }
  }

  async markAttemptSynced(attemptId: string): Promise<void> {
    const db = await this.getDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('offline_attempts', 'readwrite');
      const store = tx.objectStore('offline_attempts');
      const getReq = store.get(attemptId);

      getReq.onsuccess = () => {
        if (getReq.result) {
          const updated: StoredOfflineAttempt = {
            ...getReq.result,
            syncStatus: 'synced',
            syncedAt: Date.now()
          };
          store.put(updated);
        }
      };

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  // -------------------------------------------------------------
  // OFFLINE BOOKMARKS MANAGEMENT
  // -------------------------------------------------------------

  async saveBookmark(bookmark: BookmarkedJambQuestion, syncStatus: 'pending' | 'synced' = 'pending'): Promise<void> {
    const db = await this.getDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('offline_bookmarks', 'readwrite');
      const store = tx.objectStore('offline_bookmarks');
      const record: StoredOfflineBookmark = {
        ...bookmark,
        syncStatus,
        syncedAt: syncStatus === 'synced' ? Date.now() : null
      };
      const req = store.put(record);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  async removeBookmark(questionId: string): Promise<void> {
    const db = await this.getDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('offline_bookmarks', 'readwrite');
      const store = tx.objectStore('offline_bookmarks');
      const req = store.delete(questionId);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  async getAllBookmarks(): Promise<StoredOfflineBookmark[]> {
    try {
      const db = await this.getDb();
      return new Promise((resolve) => {
        const tx = db.transaction('offline_bookmarks', 'readonly');
        const store = tx.objectStore('offline_bookmarks');
        const req = store.getAll();
        req.onsuccess = () => {
          const list = (req.result || []) as StoredOfflineBookmark[];
          resolve(list.sort((a, b) => b.savedAt - a.savedAt));
        };
        req.onerror = () => resolve([]);
      });
    } catch {
      return [];
    }
  }

  async getPendingBookmarks(): Promise<StoredOfflineBookmark[]> {
    try {
      const db = await this.getDb();
      return new Promise((resolve) => {
        const tx = db.transaction('offline_bookmarks', 'readonly');
        const store = tx.objectStore('offline_bookmarks');
        const index = store.index('by_syncStatus');
        const req = index.getAll('pending');
        req.onsuccess = () => resolve((req.result || []) as StoredOfflineBookmark[]);
        req.onerror = () => resolve([]);
      });
    } catch {
      return [];
    }
  }

  async markBookmarkSynced(questionId: string): Promise<void> {
    const db = await this.getDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('offline_bookmarks', 'readwrite');
      const store = tx.objectStore('offline_bookmarks');
      const getReq = store.get(questionId);

      getReq.onsuccess = () => {
        if (getReq.result) {
          const updated: StoredOfflineBookmark = {
            ...getReq.result,
            syncStatus: 'synced',
            syncedAt: Date.now()
          };
          store.put(updated);
        }
      };

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }
}

export const jambOfflineDb = new JambOfflineDatabase();
