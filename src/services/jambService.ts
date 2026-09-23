import { db, auth } from '../lib/firebase';
import { collection, doc, setDoc, getDoc, getDocs, query, where, orderBy, limit, deleteDoc } from 'firebase/firestore';
import { JambQuestion, getJambQuestionsByFilter, JAMB_SUBJECTS } from '../data/jambQuestions';
import { jambOfflineDb, DownloadedSubjectMeta, StoredOfflineAttempt, StoredOfflineBookmark, OfflinePracticeOptions } from './jambOfflineDb';
import { jambQuestionEngine } from './jambQuestionEngine';

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
const LOCAL_STORAGE_SUBJECTS_KEY = 'learndean_user_jamb_subjects';
const LOCAL_STORAGE_PENDING_SUBJECTS_KEY = 'learndean_user_jamb_subjects_pending';

// Concurrency lock to strictly prevent duplicate syncing
let isSyncInProgress = false;

export const jambService = {
  // 0. USER JAMB SUBJECTS (MY JAMB SUBJECTS)
  getUserJambSubjects(): string[] {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_SUBJECTS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // English Language is always compulsory and first
          const nonEnglish = Array.from(new Set(parsed.filter(s => s !== 'English Language' && s !== 'english')));
          const subjects = ['English Language', ...nonEnglish.slice(0, 3)];
          
          // Backfill to standard 4 subjects if needed
          const defaults = ['Mathematics', 'Physics', 'Chemistry', 'Biology'];
          for (const d of defaults) {
            if (subjects.length >= 4) break;
            if (!subjects.includes(d)) subjects.push(d);
          }
          return subjects;
        }
      }
    } catch {}
    return ['English Language', 'Mathematics', 'Physics', 'Chemistry'];
  },

  async saveUserJambSubjects(subjects: string[]): Promise<string[]> {
    const nonEnglish = Array.from(new Set(subjects.filter(s => s !== 'English Language' && s !== 'english')));
    const validSubjects = ['English Language', ...nonEnglish.slice(0, 3)];

    const defaults = ['Mathematics', 'Physics', 'Chemistry', 'Biology'];
    for (const d of defaults) {
      if (validSubjects.length >= 4) break;
      if (!validSubjects.includes(d)) validSubjects.push(d);
    }

    // 1. Save to local storage for instant offline retrieval and guaranteed fallback
    try {
      localStorage.setItem(LOCAL_STORAGE_SUBJECTS_KEY, JSON.stringify(validSubjects));
    } catch (e) {
      console.warn('Failed to save jamb subjects to localStorage:', e);
    }

    // 2. Mark pending sync by default until confirmed written to remote
    try {
      localStorage.setItem(LOCAL_STORAGE_PENDING_SUBJECTS_KEY, 'true');
    } catch {}

    // 3. Sync to Firestore using authenticated UID if online & signed in
    const isOnline = typeof navigator !== 'undefined' && navigator.onLine;
    if (isOnline && auth.currentUser) {
      try {
        const userUid = auth.currentUser.uid;
        await setDoc(doc(db, 'user_jamb_profile', userUid), {
          uid: userUid,
          selectedSubjects: validSubjects,
          updatedAt: Date.now(),
          syncStatus: 'synced'
        }, { merge: true });
        
        // Clear pending flag once remote write completes
        try {
          localStorage.removeItem(LOCAL_STORAGE_PENDING_SUBJECTS_KEY);
        } catch {}
      } catch (err) {
        console.warn('Could not sync jamb subjects to Firestore right now; queued for offline sync:', err);
      }
    }

    // Trigger local event so other components update synchronously
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('learndean-jamb-subjects-changed', {
        detail: { subjects: validSubjects }
      }));
    }

    return validSubjects;
  },

  async loadRemoteUserJambSubjects(): Promise<string[] | null> {
    const localFallback = this.getUserJambSubjects();

    if (!auth.currentUser) {
      return localFallback;
    }

    const isOnline = typeof navigator !== 'undefined' && navigator.onLine;
    if (!isOnline) {
      return localFallback;
    }

    const userUid = auth.currentUser.uid;

    try {
      // If there are pending changes saved while offline, sync them up first
      const hasPendingSync = typeof localStorage !== 'undefined' && localStorage.getItem(LOCAL_STORAGE_PENDING_SUBJECTS_KEY) === 'true';
      if (hasPendingSync) {
        await setDoc(doc(db, 'user_jamb_profile', userUid), {
          uid: userUid,
          selectedSubjects: localFallback,
          updatedAt: Date.now(),
          syncStatus: 'synced'
        }, { merge: true });
        localStorage.removeItem(LOCAL_STORAGE_PENDING_SUBJECTS_KEY);
        return localFallback;
      }

      // Fetch user's owned document from Firestore
      const snap = await getDoc(doc(db, 'user_jamb_profile', userUid));
      if (snap.exists()) {
        const data = snap.data();
        if (data.selectedSubjects && Array.isArray(data.selectedSubjects) && data.selectedSubjects.length > 0) {
          const nonEnglish = Array.from(new Set(data.selectedSubjects.filter((s: string) => s !== 'English Language' && s !== 'english')));
          const validSubjects = ['English Language', ...nonEnglish.slice(0, 3)];
          
          const defaults = ['Mathematics', 'Physics', 'Chemistry', 'Biology'];
          for (const d of defaults) {
            if (validSubjects.length >= 4) break;
            if (!validSubjects.includes(d)) validSubjects.push(d);
          }

          localStorage.setItem(LOCAL_STORAGE_SUBJECTS_KEY, JSON.stringify(validSubjects));
          localStorage.removeItem(LOCAL_STORAGE_PENDING_SUBJECTS_KEY);

          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('learndean-jamb-subjects-changed', {
              detail: { subjects: validSubjects }
            }));
          }

          return validSubjects;
        }
      } else {
        // Document does not exist yet on remote: initialize with current user selection
        await setDoc(doc(db, 'user_jamb_profile', userUid), {
          uid: userUid,
          selectedSubjects: localFallback,
          updatedAt: Date.now(),
          syncStatus: 'synced'
        }, { merge: true });
        localStorage.removeItem(LOCAL_STORAGE_PENDING_SUBJECTS_KEY);
        return localFallback;
      }
    } catch (e) {
      console.warn('Could not fetch remote user jamb subjects, using local cache:', e);
      return localFallback;
    }

    return localFallback;
  },

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
    subject: string,
    year?: number | 'all',
    count: number = 20
  ): Promise<{ questions: JambQuestion[]; isOfflineSource: boolean }> {
    const res = await jambOfflineDb.getOfflinePracticeQuestions({
      subject,
      year,
      count,
      order: 'random'
    });
    if (res.questions.length > 0) {
      return { questions: res.questions, isOfflineSource: res.isOfflineSource };
    }

    const isOnline = typeof navigator !== 'undefined' && navigator.onLine;
    if (!isOnline) {
      throw new Error(`Subject "${subject}" has no downloaded questions for offline practice. Please connect to the internet to get questions.`);
    }

    const memoryQuestions = getJambQuestionsByFilter(subject, year, count);
    return { questions: memoryQuestions, isOfflineSource: false };
  },

  /**
   * Primary practice question loader:
   * Prioritizes unanswered downloaded questions first, never duplicates in a session,
   * respects order (random/sequential), auto-replenishes online if pool is short,
   * and signals if question pool is insufficient offline.
   */
  async getPracticeQuestions(options: OfflinePracticeOptions): Promise<{
    questions: any[];
    totalAvailable: number;
    unansweredCount: number;
    isPoolLow: boolean;
    isOfflineSource: boolean;
    isPoolInsufficient?: boolean;
    shortfall?: number;
    requestedCount?: number;
    shortfallBySubject?: Record<string, number>;
    sessionId?: string;
  }> {
    const targetCount = Math.min(100, options.count || 20);
    const uid = auth.currentUser?.uid;

    try {
      const session = await jambQuestionEngine.createPracticeSession({
        userId: uid,
        mode: (options.subjects && options.subjects.length > 1) ? 'jamb_cbt' : 'jamb_practice',
        subjectId: options.subject,
        subjects: options.subjects,
        topicId: options.topic,
        year: options.year,
        count: targetCount,
        ordering: options.order || 'random'
      });

      const mapped = session.questions.map((q, idx) => jambQuestionEngine.toLegacyQuestion(q, idx));
      const finalMapped = mapped.slice(0, targetCount);
      const isPoolInsufficient = finalMapped.length < targetCount;

      return {
        questions: finalMapped,
        totalAvailable: session.questions.length,
        unansweredCount: session.questions.length,
        isPoolLow: isPoolInsufficient,
        isOfflineSource: false,
        isPoolInsufficient,
        shortfall: Math.max(0, targetCount - finalMapped.length),
        requestedCount: targetCount,
        sessionId: session.session.sessionId
      };
    } catch (e) {
      console.warn("Unified engine fallback to offline cache:", e);
      let result = await jambOfflineDb.getOfflinePracticeQuestions(options);
      const mapped = result.questions.map((q, idx) => ({
        id: q.id,
        question: q.passage ? `${q.passage}\n\n${q.question}` : q.question,
        options: q.options,
        correctAnswerIndex: q.correctAnswer,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation || 'Review topic notes and syllabus for full derivation.',
        difficulty: 'Medium',
        topic: q.topic || 'General',
        subject: q.subjectName || q.subject,
        subjectId: q.subject,
        year: q.year,
        questionNumber: q.questionNumber || (idx + 1),
        isAIgenerated: (q as any).isAIgenerated ?? false,
        sourceType: (q as any).sourceType || 'official_past_question'
      }));
      const finalMapped = mapped.slice(0, targetCount);
      return {
        questions: finalMapped,
        totalAvailable: result.totalAvailable,
        unansweredCount: result.unansweredCount,
        isPoolLow: result.isPoolLow || finalMapped.length < targetCount,
        isOfflineSource: true,
        isPoolInsufficient: finalMapped.length < targetCount,
        shortfall: Math.max(0, targetCount - finalMapped.length),
        requestedCount: targetCount,
        shortfallBySubject: result.shortfallBySubject
      };
    }
  },

  /**
   * Generates additional JAMB-style questions using AI and adds them to the offline and Firestore bank.
   * Uses fingerprint deduplication to guarantee no duplicates or near-duplicates.
   */
  async generateAndDownloadMoreQuestions(
    subjectId: string,
    topic: string = 'General',
    amount: number = 5
  ): Promise<{ addedCount: number; duplicatesSkipped: number; totalOfflineCount: number }> {
    const isOnline = typeof navigator !== 'undefined' && navigator.onLine;
    if (!isOnline) {
      throw new Error('Connect to the internet to get more questions.');
    }

    const targetMeta = JAMB_SUBJECTS.find(s => s.id === subjectId || s.name.toLowerCase() === subjectId.toLowerCase());
    const subjectName = targetMeta?.name || subjectId;
    const cleanSubjId = targetMeta?.id || subjectId.toLowerCase();

    // Use unified engine to generate, validate, fingerprint deduplicate, and persist to Firestore
    const savedQuestions = await jambQuestionEngine.generateAndSaveOriginalQuestions({
      subjectId: cleanSubjId,
      subjectName,
      topicId: topic && topic !== 'All Topics' ? topic.toLowerCase().replace(/\s+/g, '_') : 'general',
      topicName: topic && topic !== 'All Topics' ? topic : 'General',
      count: Math.min(20, Math.max(1, amount)),
      existingFingerprints: []
    });

    const legacyQuestions = savedQuestions.map((q, idx) => jambQuestionEngine.toLegacyQuestion(q, idx));

    // Add to offline IndexedDB store as well
    const offlineResult = await jambOfflineDb.addQuestionsToOfflineBank(cleanSubjId, legacyQuestions);
    return offlineResult;
  },

  // 5. UNFINISHED PRACTICE SESSIONS (LOCAL + INDEXEDDB PERSISTENCE)
  async saveActiveSession(session: any): Promise<void> {
    await jambOfflineDb.saveActiveSession(session);
  },

  async getActiveSession(): Promise<any | null> {
    return await jambOfflineDb.getActiveSession();
  },

  async clearActiveSession(): Promise<void> {
    await jambOfflineDb.clearActiveSession();
  },

  // 6. AUTOMATIC BACKGROUND SYNC TO FIREBASE (PREVENTS DUPLICATE SYNCING VIA MUTEX LOCK)
  async syncPendingData(): Promise<{ syncedAttempts: number; syncedBookmarks: number; syncedSubjects: number }> {
    // Guard 1: Concurrency mutex lock to prevent duplicate syncing
    if (isSyncInProgress) {
      return { syncedAttempts: 0, syncedBookmarks: 0, syncedSubjects: 0 };
    }

    // Guard 2: Network check
    const isOnline = typeof navigator !== 'undefined' && navigator.onLine;
    if (!isOnline) {
      return { syncedAttempts: 0, syncedBookmarks: 0, syncedSubjects: 0 };
    }

    // Guard 3: User authentication check
    if (!auth.currentUser) {
      return { syncedAttempts: 0, syncedBookmarks: 0, syncedSubjects: 0 };
    }

    isSyncInProgress = true;
    let syncedAttemptsCount = 0;
    let syncedBookmarksCount = 0;
    let syncedSubjectsCount = 0;

    try {
      const userUid = auth.currentUser.uid;

      // 0. Sync pending JAMB subject profile if changed while offline
      const hasPendingSubjects = typeof localStorage !== 'undefined' && localStorage.getItem(LOCAL_STORAGE_PENDING_SUBJECTS_KEY) === 'true';
      if (hasPendingSubjects) {
        try {
          const localSubjects = this.getUserJambSubjects();
          await setDoc(doc(db, 'user_jamb_profile', userUid), {
            uid: userUid,
            selectedSubjects: localSubjects,
            updatedAt: Date.now(),
            syncStatus: 'synced'
          }, { merge: true });
          localStorage.removeItem(LOCAL_STORAGE_PENDING_SUBJECTS_KEY);
          syncedSubjectsCount++;
        } catch (err) {
          console.warn('Failed to sync pending JAMB subjects to Firestore:', err);
        }
      }

      // 1. Fetch pending attempts from IndexedDB
      const pendingAttempts = await jambOfflineDb.getPendingAttempts();

      for (const attempt of pendingAttempts) {
        try {
          const remoteDoc: JambExamAttempt = {
            ...attempt,
            uid: userUid,
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
          const bookmarkDocId = `${userUid}_${b.questionId}`;
          await setDoc(doc(db, 'jamb_bookmarks', bookmarkDocId), {
            uid: userUid,
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

      if (syncedAttemptsCount > 0 || syncedBookmarksCount > 0 || syncedSubjectsCount > 0) {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('learndean-jamb-synced', {
            detail: { attempts: syncedAttemptsCount, bookmarks: syncedBookmarksCount, subjects: syncedSubjectsCount }
          }));
        }
      }
    } finally {
      isSyncInProgress = false;
    }

    return { syncedAttempts: syncedAttemptsCount, syncedBookmarks: syncedBookmarksCount, syncedSubjects: syncedSubjectsCount };
  },

  /**
   * Check if there are unsynced records awaiting internet connection
   */
  async getUnsyncedCount(): Promise<number> {
    try {
      const pendingAttempts = await jambOfflineDb.getPendingAttempts();
      const pendingBookmarks = await jambOfflineDb.getPendingBookmarks();
      const hasPendingSubjects = typeof localStorage !== 'undefined' && localStorage.getItem(LOCAL_STORAGE_PENDING_SUBJECTS_KEY) === 'true' ? 1 : 0;
      return pendingAttempts.length + pendingBookmarks.length + hasPendingSubjects;
    } catch {
      return 0;
    }
  },

  /**
   * Check for pack updates when online and sync
   */
  async checkForPackUpdates(onProgress?: (status: string) => void) {
    return jambOfflineDb.checkAndUpdateOfflinePack(onProgress);
  },

  /**
   * Download the complete JAMB Offline Pack
   */
  async downloadJambOfflinePack(onProgress?: (percent: number, stepText: string, current: number, total: number) => void) {
    return jambOfflineDb.downloadJambOfflinePack(onProgress);
  },

  /**
   * Get installed pack metadata
   */
  async getInstalledPackMeta() {
    return jambOfflineDb.getInstalledPackMeta();
  }
};

// Automatic online event sync listener
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    jambService.syncPendingData().then(() => {
      jambOfflineDb.isPackInstalled().then(installed => {
        if (installed) {
          jambOfflineDb.checkAndUpdateOfflinePack().catch(() => {});
        }
      });
    }).catch(() => {});
  });
}
