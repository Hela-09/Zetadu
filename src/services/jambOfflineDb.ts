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

export interface OfflinePracticeOptions {
  subjects?: string[]; // for multi-subject CBT
  subject?: string;
  topic?: string;
  year?: number | 'all';
  count?: number;
  order?: 'random' | 'sequential';
}

export interface OfflinePracticeResult {
  questions: JambQuestion[];
  totalAvailable: number;
  unansweredCount: number;
  isPoolLow: boolean;
  isOfflineSource: boolean;
  shortfallBySubject?: Record<string, number>;
  totalShortfall?: number;
  targetCount?: number;
}

const DB_NAME = 'LearnDean_JAMB_OfflineDB';
const DB_VERSION = 2;

export function normalizeQuestionText(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

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
        let qStore: IDBObjectStore;
        if (!db.objectStoreNames.contains('offline_questions')) {
          qStore = db.createObjectStore('offline_questions', { keyPath: 'id' });
          qStore.createIndex('by_subject', 'subject', { unique: false });
          qStore.createIndex('by_year', 'year', { unique: false });
          qStore.createIndex('by_subject_year', ['subject', 'year'], { unique: false });
          qStore.createIndex('by_topic', 'topic', { unique: false });
        } else {
          qStore = (event.target as IDBOpenDBRequest).transaction!.objectStore('offline_questions');
          if (!qStore.indexNames.contains('by_topic')) {
            qStore.createIndex('by_topic', 'topic', { unique: false });
          }
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

        // 5. Unfinished practice sessions store
        if (!db.objectStoreNames.contains('offline_sessions')) {
          const sStore = db.createObjectStore('offline_sessions', { keyPath: 'id' });
          sStore.createIndex('by_updatedAt', 'updatedAt', { unique: false });
        }

        // 6. Answered questions store for tracking history & prioritizing unanswered
        if (!db.objectStoreNames.contains('answered_questions')) {
          const ansStore = db.createObjectStore('answered_questions', { keyPath: 'questionId' });
          ansStore.createIndex('by_subject', 'subject', { unique: false });
          ansStore.createIndex('by_answeredAt', 'answeredAt', { unique: false });
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
  // SUBJECT DOWNLOAD & OFFLINE QUESTION BANK MANAGEMENT
  // -------------------------------------------------------------

  /**
   * Check if a specific JAMB subject is downloaded offline
   */
  async isSubjectDownloaded(subjectId: string): Promise<boolean> {
    try {
      const db = await this.getDb();
      const normId = subjectId.toLowerCase().trim();
      return new Promise((resolve) => {
        const tx = db.transaction('downloaded_subjects', 'readonly');
        const store = tx.objectStore('downloaded_subjects');
        const req = store.get(normId);
        req.onsuccess = () => {
          if (req.result) {
            resolve(true);
          } else {
            // Check by name
            const allReq = store.getAll();
            allReq.onsuccess = () => {
              const list = allReq.result || [];
              const found = list.some(s => 
                s.subjectId.toLowerCase() === normId || 
                s.name.toLowerCase() === normId ||
                s.code.toLowerCase() === normId
              );
              resolve(found);
            };
            allReq.onerror = () => resolve(false);
          }
        };
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
   * Download a subject's questions, answers, and explanations into IndexedDB.
   * Merges bundled questions without wiping newly generated ones.
   */
  async downloadSubject(
    subjectId: string,
    onProgress?: (percent: number, current: number, total: number) => void
  ): Promise<{ success: boolean; count: number }> {
    const normSubId = subjectId.toLowerCase().trim();
    const questions = JAMB_QUESTIONS.filter(q => 
      q.subject.toLowerCase() === normSubId ||
      q.subjectName.toLowerCase() === normSubId ||
      q.id.toLowerCase().includes(normSubId)
    );

    if (questions.length === 0) {
      throw new Error(`No questions available to download for subject: ${subjectId}`);
    }

    const subjectMeta = JAMB_SUBJECTS.find(s => 
      s.id.toLowerCase() === normSubId || 
      s.name.toLowerCase() === normSubId
    );

    const db = await this.getDb();

    // 1. Fetch existing questions to prevent duplicates and preserve AI generated questions
    const existingList: JambQuestion[] = await new Promise((resolve) => {
      const tx = db.transaction('offline_questions', 'readonly');
      const store = tx.objectStore('offline_questions');
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    });

    const existingIds = new Set<string>();
    const existingTexts = new Set<string>();
    existingList.forEach(q => {
      existingIds.add(q.id);
      existingTexts.add(normalizeQuestionText(q.question));
    });

    const total = questions.length;
    let storedCount = 0;

    if (onProgress) onProgress(5, 0, total);

    const tx = db.transaction(['offline_questions', 'downloaded_subjects'], 'readwrite');
    const qStore = tx.objectStore('offline_questions');
    const subStore = tx.objectStore('downloaded_subjects');

    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error || new Error('Download transaction failed'));

      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        const textKey = normalizeQuestionText(q.question);
        if (!existingIds.has(q.id) && !existingTexts.has(textKey)) {
          qStore.put(q);
          existingIds.add(q.id);
          existingTexts.add(textKey);
        } else {
          // Update existing with complete question data
          qStore.put(q);
        }
        storedCount++;
        const pct = Math.min(95, Math.round(10 + (storedCount / total) * 85));
        if (onProgress) {
          onProgress(pct, storedCount, total);
        }
      }

      // Calculate all years and count for this subject
      const allSubjectQuestions = existingList.filter(q => 
        q.subject.toLowerCase() === normSubId ||
        q.subjectName.toLowerCase() === normSubId
      );
      const combinedCount = Math.max(total, allSubjectQuestions.length);
      const yearsSet = new Set<number>();
      questions.forEach(q => yearsSet.add(q.year));
      allSubjectQuestions.forEach(q => yearsSet.add(q.year));
      const years = Array.from(yearsSet).sort();

      const rawJson = JSON.stringify(questions);
      const sizeKb = Math.max(16, Math.round(new Blob([rawJson]).size / 1024));

      const meta: DownloadedSubjectMeta = {
        subjectId: normSubId,
        name: subjectMeta?.name || subjectId,
        code: subjectMeta?.code || subjectId.toUpperCase().slice(0, 3),
        questionCount: combinedCount,
        years,
        downloadedAt: Date.now(),
        sizeKb
      };
      subStore.put(meta);
    });

    if (onProgress) onProgress(100, total, total);

    return { success: true, count: total };
  }

  /**
   * Adds newly generated questions to the offline question bank.
   * Strictly prevents duplicate questions by checking both normalized question text and IDs.
   */
  async addQuestionsToOfflineBank(
    subjectId: string,
    newQuestions: JambQuestion[]
  ): Promise<{ addedCount: number; duplicatesSkipped: number; totalOfflineCount: number }> {
    if (!newQuestions || newQuestions.length === 0) {
      return { addedCount: 0, duplicatesSkipped: 0, totalOfflineCount: 0 };
    }

    const normSubId = subjectId.toLowerCase().trim();
    const db = await this.getDb();

    // 1. Fetch all existing questions in IndexedDB
    const existing: JambQuestion[] = await new Promise((resolve) => {
      const tx = db.transaction('offline_questions', 'readonly');
      const store = tx.objectStore('offline_questions');
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    });

    const existingSignatures = new Set<string>();
    existing.forEach(q => {
      if (q.id) existingSignatures.add(q.id);
      const textSig = normalizeQuestionText(q.question);
      if (textSig) existingSignatures.add(textSig);
    });

    // Also include bundled questions in duplicate signature check
    JAMB_QUESTIONS.forEach(q => {
      if (q.id) existingSignatures.add(q.id);
      const textSig = normalizeQuestionText(q.question);
      if (textSig) existingSignatures.add(textSig);
    });

    const uniqueToAdd: JambQuestion[] = [];
    let duplicatesSkipped = 0;

    for (const q of newQuestions) {
      const textSig = normalizeQuestionText(q.question);
      if (!textSig || existingSignatures.has(textSig) || (q.id && existingSignatures.has(q.id))) {
        duplicatesSkipped++;
        continue;
      }

      existingSignatures.add(textSig);
      const uniqueId = q.id && !existingSignatures.has(q.id)
        ? q.id
        : `jamb_${normSubId}_ai_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      
      existingSignatures.add(uniqueId);

      uniqueToAdd.push({
        ...q,
        id: uniqueId,
        subject: normSubId,
        subjectName: q.subjectName || subjectId
      });
    }

    if (uniqueToAdd.length === 0) {
      const currentSubjectQuestions = existing.filter(q => 
        q.subject.toLowerCase() === normSubId || 
        q.subjectName?.toLowerCase() === normSubId
      );
      return { 
        addedCount: 0, 
        duplicatesSkipped, 
        totalOfflineCount: currentSubjectQuestions.length 
      };
    }

    // 2. Put unique questions into IndexedDB and update subject metadata
    const tx = db.transaction(['offline_questions', 'downloaded_subjects'], 'readwrite');
    const qStore = tx.objectStore('offline_questions');
    const subStore = tx.objectStore('downloaded_subjects');

    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);

      uniqueToAdd.forEach(q => qStore.put(q));

      // Get or create downloaded_subjects record
      const metaReq = subStore.get(normSubId);
      metaReq.onsuccess = () => {
        const existingMeta = metaReq.result as DownloadedSubjectMeta | undefined;
        const subjectMeta = JAMB_SUBJECTS.find(s => 
          s.id.toLowerCase() === normSubId || 
          s.name.toLowerCase() === normSubId
        );
        const prevCount = existingMeta ? existingMeta.questionCount : 0;
        const newTotal = prevCount + uniqueToAdd.length;

        const updatedMeta: DownloadedSubjectMeta = {
          subjectId: normSubId,
          name: existingMeta?.name || subjectMeta?.name || subjectId,
          code: existingMeta?.code || subjectMeta?.code || normSubId.slice(0, 3).toUpperCase(),
          questionCount: newTotal,
          years: existingMeta?.years || [2024],
          downloadedAt: Date.now(),
          sizeKb: (existingMeta?.sizeKb || 20) + Math.max(4, Math.round(uniqueToAdd.length * 0.8))
        };
        subStore.put(updatedMeta);
      };
    });

    const totalOfflineCount = existing.filter(q => 
      q.subject.toLowerCase() === normSubId || 
      q.subjectName?.toLowerCase() === normSubId
    ).length + uniqueToAdd.length;

    return {
      addedCount: uniqueToAdd.length,
      duplicatesSkipped,
      totalOfflineCount
    };
  }

  /**
   * Delete a downloaded subject from IndexedDB to free space
   */
  async deleteDownloadedSubject(subjectId: string): Promise<void> {
    const normId = subjectId.toLowerCase().trim();
    const db = await this.getDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(['offline_questions', 'downloaded_subjects'], 'readwrite');
      const qStore = tx.objectStore('offline_questions');
      const subStore = tx.objectStore('downloaded_subjects');

      const index = qStore.index('by_subject');
      const req = index.getAllKeys(normId);

      req.onsuccess = () => {
        const keys = req.result;
        keys.forEach(key => qStore.delete(key));
        subStore.delete(normId);
      };

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error || new Error('Failed to delete subject'));
    });
  }

  // -------------------------------------------------------------
  // ANSWERED QUESTIONS TRACKING
  // -------------------------------------------------------------

  async markQuestionsAnswered(questionIds: string[], subject?: string): Promise<void> {
    if (!questionIds || questionIds.length === 0) return;
    try {
      const db = await this.getDb();
      const tx = db.transaction('answered_questions', 'readwrite');
      const store = tx.objectStore('answered_questions');
      const now = Date.now();
      for (const qid of questionIds) {
        if (qid) {
          store.put({ questionId: qid, subject: subject || 'general', answeredAt: now });
        }
      }
    } catch (e) {
      console.warn('Failed to mark questions as answered in IndexedDB:', e);
    }
  }

  async getAnsweredQuestionIds(): Promise<Set<string>> {
    const set = new Set<string>();
    try {
      const db = await this.getDb();
      const tx = db.transaction('answered_questions', 'readonly');
      const store = tx.objectStore('answered_questions');
      const req = store.getAllKeys();
      await new Promise<void>((resolve) => {
        req.onsuccess = () => {
          (req.result || []).forEach(k => set.add(String(k)));
          resolve();
        };
        req.onerror = () => resolve();
      });
    } catch {}

    // Also include answered question IDs from recorded offline attempts
    try {
      const attempts = await this.getAllAttempts();
      for (const att of attempts) {
        if (att.answers) {
          Object.keys(att.answers).forEach(qid => set.add(qid));
        }
        if (Array.isArray(att.questions)) {
          att.questions.forEach(q => {
            if (att.answers && att.answers[q.id] !== undefined) {
              set.add(q.id);
              set.add(normalizeQuestionText(q.question));
            }
          });
        }
      }
    } catch {}

    // Also check localStorage
    try {
      const raw = localStorage.getItem('learndean_jamb_history');
      if (raw) {
        const list = JSON.parse(raw);
        if (Array.isArray(list)) {
          for (const item of list) {
            if (item.answers) {
              Object.keys(item.answers).forEach(qid => set.add(qid));
            }
          }
        }
      }
    } catch {}

    return set;
  }

  // -------------------------------------------------------------
  // PRACTICE QUESTION RETRIEVAL (OFFLINE-FIRST, STRICT DEDUP, UNANSWERED FIRST)
  // -------------------------------------------------------------

  /**
   * Retrieves questions for practice.
   * Guarantees:
   * 1. Never shows the same question twice in a session.
   * 2. Uses unanswered downloaded questions first.
   * 3. Pulls from IndexedDB offline questions and bundled questions so nothing is lost.
   * 4. Detects when the question pool is low to prompt the user to connect online.
   */
  async getOfflinePracticeQuestions(options: OfflinePracticeOptions): Promise<OfflinePracticeResult> {
    const { subjects, subject, topic, year, count = 20, order = 'random' } = options;
    const db = await this.getDb();

    // 1. Fetch all questions from IndexedDB
    const allDbQuestions: JambQuestion[] = await new Promise((resolve) => {
      const tx = db.transaction('offline_questions', 'readonly');
      const store = tx.objectStore('offline_questions');
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    });

    // 2. Fetch answered question IDs and signatures
    const answeredIds = await this.getAnsweredQuestionIds();

    // Track all question IDs and text signatures used in this session to guarantee zero duplicates
    const sessionUsedIds = new Set<string>();
    const sessionUsedSignatures = new Set<string>();

    const shortfallBySubject: Record<string, number> = {};
    let totalShortfall = 0;

    // Multi-subject CBT Mode (e.g. 4 subjects)
    if (subjects && subjects.length > 0) {
      const numSubs = subjects.length;
      const baseCount = Math.floor(count / numSubs);
      const remainder = count % numSubs;

      const combinedSelected: JambQuestion[] = [];
      let totalPoolAvailable = 0;
      let totalUnansweredCount = 0;
      let anyPoolLow = false;

      for (let idx = 0; idx < numSubs; idx++) {
        const sub = subjects[idx];
        const targetForSubject = baseCount + (idx < remainder ? 1 : 0);
        const normSub = sub.toLowerCase().trim();
        
        // Gather all candidates for this subject from DB and bundled questions
        const candidateMap = new Map<string, JambQuestion>();

        // 1. IndexedDB questions
        allDbQuestions.forEach(q => {
          if (
            q.subject.toLowerCase() === normSub ||
            q.subjectName?.toLowerCase() === normSub ||
            q.id.toLowerCase().includes(normSub)
          ) {
            const sig = normalizeQuestionText(q.question);
            if (!candidateMap.has(sig)) candidateMap.set(sig, q);
          }
        });

        // 2. Bundled questions
        JAMB_QUESTIONS.forEach(q => {
          if (
            q.subject.toLowerCase() === normSub ||
            q.subjectName.toLowerCase() === normSub ||
            q.id.toLowerCase().includes(normSub)
          ) {
            const sig = normalizeQuestionText(q.question);
            if (!candidateMap.has(sig)) candidateMap.set(sig, q);
          }
        });

        const allCandidates = Array.from(candidateMap.values());
        totalPoolAvailable += allCandidates.length;

        // Partition by requested filters (year and topic)
        const filterMatching: JambQuestion[] = [];
        const otherValid: JambQuestion[] = [];

        for (const q of allCandidates) {
          const matchYear = !year || year === 'all' || q.year === year;
          const matchTopic = !topic || topic === 'All Topics' || topic === 'General' || 
            (q.topic && q.topic.toLowerCase().includes(topic.toLowerCase()));

          if (matchYear && matchTopic) {
            filterMatching.push(q);
          } else {
            otherValid.push(q);
          }
        }

        // Sub-partition into unanswered and answered
        const filterUnanswered: JambQuestion[] = [];
        const filterAnswered: JambQuestion[] = [];
        const otherUnanswered: JambQuestion[] = [];
        const otherAnswered: JambQuestion[] = [];

        for (const q of filterMatching) {
          const sig = normalizeQuestionText(q.question);
          if (answeredIds.has(q.id) || answeredIds.has(sig)) {
            filterAnswered.push(q);
          } else {
            filterUnanswered.push(q);
          }
        }

        for (const q of otherValid) {
          const sig = normalizeQuestionText(q.question);
          if (answeredIds.has(q.id) || answeredIds.has(sig)) {
            otherAnswered.push(q);
          } else {
            otherUnanswered.push(q);
          }
        }

        totalUnansweredCount += (filterUnanswered.length + otherUnanswered.length);

        if (allCandidates.length < targetForSubject || (filterUnanswered.length + otherUnanswered.length) < Math.min(targetForSubject, 5)) {
          anyPoolLow = true;
        }

        // Ordering function
        const sortFn = (a: JambQuestion, b: JambQuestion) => {
          if (order === 'random') return 0.5 - Math.random();
          return (a.questionNumber || 0) - (b.questionNumber || 0);
        };

        filterUnanswered.sort(sortFn);
        filterAnswered.sort(sortFn);
        otherUnanswered.sort(sortFn);
        otherAnswered.sort(sortFn);

        // Priority selection:
        // 1. Filter-matching Unanswered
        // 2. Filter-matching Answered
        // 3. Backfill with Other Unanswered from same subject
        // 4. Backfill with Other Answered from same subject
        const subSelected: JambQuestion[] = [];
        const candidatePipelines = [filterUnanswered, filterAnswered, otherUnanswered, otherAnswered];

        for (const pipeline of candidatePipelines) {
          if (subSelected.length >= targetForSubject) break;
          for (const q of pipeline) {
            if (subSelected.length >= targetForSubject) break;
            const sig = normalizeQuestionText(q.question);
            if (!sessionUsedIds.has(q.id) && !sessionUsedSignatures.has(sig)) {
              subSelected.push(q);
              sessionUsedIds.add(q.id);
              sessionUsedSignatures.add(sig);
            }
          }
        }

        // Record shortfall if any for this subject
        if (subSelected.length < targetForSubject) {
          const needed = targetForSubject - subSelected.length;
          shortfallBySubject[sub] = needed;
          totalShortfall += needed;
        }

        combinedSelected.push(...subSelected);
      }

      // If combinedSelected is still under target count, backfill from unused questions across all selected subjects
      if (combinedSelected.length < count) {
        for (const sub of subjects) {
          if (combinedSelected.length >= count) break;
          const normSub = sub.toLowerCase().trim();
          
          const availableExtras: JambQuestion[] = [];
          allDbQuestions.forEach(q => {
            if (
              (q.subject.toLowerCase() === normSub || q.subjectName?.toLowerCase() === normSub || q.id.toLowerCase().includes(normSub)) &&
              !sessionUsedIds.has(q.id) &&
              !sessionUsedSignatures.has(normalizeQuestionText(q.question))
            ) {
              availableExtras.push(q);
            }
          });
          JAMB_QUESTIONS.forEach(q => {
            if (
              (q.subject.toLowerCase() === normSub || q.subjectName.toLowerCase() === normSub || q.id.toLowerCase().includes(normSub)) &&
              !sessionUsedIds.has(q.id) &&
              !sessionUsedSignatures.has(normalizeQuestionText(q.question))
            ) {
              availableExtras.push(q);
            }
          });

          if (order === 'random') {
            availableExtras.sort(() => 0.5 - Math.random());
          }

          for (const q of availableExtras) {
            if (combinedSelected.length >= count) break;
            const sig = normalizeQuestionText(q.question);
            if (!sessionUsedIds.has(q.id) && !sessionUsedSignatures.has(sig)) {
              combinedSelected.push(q);
              sessionUsedIds.add(q.id);
              sessionUsedSignatures.add(sig);
            }
          }
        }
      }

      const finalCount = Math.min(combinedSelected.length, count);
      const exactQuestions = combinedSelected.slice(0, count);
      const remainingShortfall = Math.max(0, count - exactQuestions.length);

      return {
        questions: exactQuestions,
        totalAvailable: totalPoolAvailable,
        unansweredCount: totalUnansweredCount,
        isPoolLow: anyPoolLow || remainingShortfall > 0,
        isOfflineSource: true,
        shortfallBySubject,
        totalShortfall: remainingShortfall,
        targetCount: count
      };
    }

    // Single Subject Practice Mode
    const targetSubject = (subject || 'english').toLowerCase().trim();
    const candidateMap = new Map<string, JambQuestion>();

    // 1. IndexedDB questions
    allDbQuestions.forEach(q => {
      if (
        q.subject.toLowerCase() === targetSubject ||
        q.subjectName?.toLowerCase() === targetSubject ||
        q.id.toLowerCase().includes(targetSubject)
      ) {
        const sig = normalizeQuestionText(q.question);
        if (!candidateMap.has(sig)) candidateMap.set(sig, q);
      }
    });

    // 2. Bundled questions
    JAMB_QUESTIONS.forEach(q => {
      if (
        q.subject.toLowerCase() === targetSubject ||
        q.subjectName.toLowerCase() === targetSubject ||
        q.id.toLowerCase().includes(targetSubject)
      ) {
        const sig = normalizeQuestionText(q.question);
        if (!candidateMap.has(sig)) candidateMap.set(sig, q);
      }
    });

    const allCandidates = Array.from(candidateMap.values());
    const totalAvailable = allCandidates.length;

    // Partition by filters (topic & year)
    const filterMatching: JambQuestion[] = [];
    const otherValid: JambQuestion[] = [];

    for (const q of allCandidates) {
      const matchYear = !year || year === 'all' || q.year === year;
      const matchTopic = !topic || topic === 'All Topics' || topic === 'General' || 
        (q.topic && q.topic.toLowerCase().includes(topic.toLowerCase()));

      if (matchYear && matchTopic) {
        filterMatching.push(q);
      } else {
        otherValid.push(q);
      }
    }

    // Sub-partition into unanswered and answered
    const filterUnanswered: JambQuestion[] = [];
    const filterAnswered: JambQuestion[] = [];
    const otherUnanswered: JambQuestion[] = [];
    const otherAnswered: JambQuestion[] = [];

    for (const q of filterMatching) {
      const sig = normalizeQuestionText(q.question);
      if (answeredIds.has(q.id) || answeredIds.has(sig)) {
        filterAnswered.push(q);
      } else {
        filterUnanswered.push(q);
      }
    }

    for (const q of otherValid) {
      const sig = normalizeQuestionText(q.question);
      if (answeredIds.has(q.id) || answeredIds.has(sig)) {
        otherAnswered.push(q);
      } else {
        otherUnanswered.push(q);
      }
    }

    const unansweredCount = filterUnanswered.length + otherUnanswered.length;

    // Ordering function
    const sortFn = (a: JambQuestion, b: JambQuestion) => {
      if (order === 'random') return 0.5 - Math.random();
      return (a.questionNumber || 0) - (b.questionNumber || 0);
    };

    filterUnanswered.sort(sortFn);
    filterAnswered.sort(sortFn);
    otherUnanswered.sort(sortFn);
    otherAnswered.sort(sortFn);

    // Priority selection: Unanswered matching -> Answered matching -> Other Unanswered -> Other Answered
    const selected: JambQuestion[] = [];
    const candidatePipelines = [filterUnanswered, filterAnswered, otherUnanswered, otherAnswered];

    for (const pipeline of candidatePipelines) {
      if (selected.length >= count) break;
      for (const q of pipeline) {
        if (selected.length >= count) break;
        const sig = normalizeQuestionText(q.question);
        if (!sessionUsedIds.has(q.id) && !sessionUsedSignatures.has(sig)) {
          selected.push(q);
          sessionUsedIds.add(q.id);
          sessionUsedSignatures.add(sig);
        }
      }
    }

    if (selected.length < count) {
      const needed = count - selected.length;
      shortfallBySubject[targetSubject] = needed;
      totalShortfall = needed;
    }

    const isPoolLow = totalAvailable < count || unansweredCount === 0 || totalShortfall > 0;

    return {
      questions: selected,
      totalAvailable,
      unansweredCount,
      isPoolLow,
      isOfflineSource: true,
      shortfallBySubject,
      totalShortfall,
      targetCount: count
    };
  }

  /**
   * Compatibility wrapper for legacy calls
   */
  async getOfflineQuestions(
    subjectId: string,
    year?: number | 'all',
    count: number = 20
  ): Promise<JambQuestion[]> {
    const res = await this.getOfflinePracticeQuestions({
      subject: subjectId,
      year,
      count,
      order: 'random'
    });
    return res.questions;
  }

  // -------------------------------------------------------------
  // UNFINISHED SESSIONS MANAGEMENT (LOCAL + INDEXEDDB)
  // -------------------------------------------------------------

  async saveActiveSession(session: any): Promise<void> {
    if (!session) return;
    try {
      const db = await this.getDb();
      const tx = db.transaction('offline_sessions', 'readwrite');
      const store = tx.objectStore('offline_sessions');
      store.put({
        id: 'active_jamb_session',
        ...session,
        updatedAt: Date.now()
      });
    } catch (e) {
      console.warn('IndexedDB save session error:', e);
    }

    try {
      localStorage.setItem('practice_session', JSON.stringify(session));
    } catch {}
  }

  async getActiveSession(): Promise<any | null> {
    try {
      const db = await this.getDb();
      const fromDb = await new Promise<any>((resolve) => {
        const tx = db.transaction('offline_sessions', 'readonly');
        const store = tx.objectStore('offline_sessions');
        const req = store.get('active_jamb_session');
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => resolve(null);
      });

      if (fromDb && !fromDb.isSubmitted && Array.isArray(fromDb.questions) && fromDb.questions.length > 0) {
        return fromDb;
      }
    } catch {}

    try {
      const raw = localStorage.getItem('practice_session');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && !parsed.isSubmitted && Array.isArray(parsed.questions) && parsed.questions.length > 0) {
          return parsed;
        }
      }
    } catch {}

    return null;
  }

  async clearActiveSession(): Promise<void> {
    try {
      const db = await this.getDb();
      const tx = db.transaction('offline_sessions', 'readwrite');
      const store = tx.objectStore('offline_sessions');
      store.delete('active_jamb_session');
    } catch {}

    try {
      localStorage.removeItem('practice_session');
    } catch {}
  }

  // -------------------------------------------------------------
  // OFFLINE PRACTICE ATTEMPTS MANAGEMENT
  // -------------------------------------------------------------

  async saveAttempt(attempt: JambExamAttempt, syncStatus: 'pending' | 'synced' = 'pending'): Promise<void> {
    const db = await this.getDb();
    
    // 1. Mark questions in this attempt as answered
    if (Array.isArray(attempt.questions)) {
      const qIds = attempt.questions.map(q => q.id).filter(Boolean);
      await this.markQuestionsAnswered(qIds, attempt.subject);
    } else if (attempt.answers) {
      await this.markQuestionsAnswered(Object.keys(attempt.answers), attempt.subject);
    }

    // 2. Clear unfinished session
    await this.clearActiveSession();

    // 3. Save attempt record
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
