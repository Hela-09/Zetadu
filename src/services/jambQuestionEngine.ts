import { db, auth, cleanFirestoreData } from '../lib/firebase';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  limit,
  updateDoc,
  increment,
  writeBatch
} from 'firebase/firestore';
import { generateQuestionFingerprint, validateQuestionPayload } from '../utils/jambFingerprint';
import { JAMB_QUESTIONS, JAMB_SUBJECTS, JambQuestion } from '../data/jambQuestions';
import { NOVELS_COLLECTION } from '../data/novels';
import { JAMB_SYLLABUS_DATA } from '../data/jambSyllabus';

export type JambQuestionDifficulty = 'easy' | 'medium' | 'hard';
export type JambQuestionSourceType = 'past_question' | 'curriculum_derived' | 'ai_generated';
export type JambQuestionStatus = 'active' | 'flagged' | 'archived';

export interface JambQuestionDoc {
  questionId: string;
  subjectId: string;
  topicId: string;
  topicName?: string;
  subjectName?: string;
  question: string;
  passage?: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: JambQuestionDifficulty;
  sourceType: JambQuestionSourceType;
  isAIgenerated: boolean;
  status: JambQuestionStatus;
  fingerprint: string;
  timesUsed: number;
  year?: number | string;
  questionNumber?: number;
  createdAt: number;
  updatedAt: number;
}

export interface JambNovelQuestionDoc {
  questionId: string;
  novelId: string;
  chapterId: string;
  chapterIndex?: number;
  chapterTitle?: string;
  novelTitle?: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: JambQuestionDifficulty;
  sourceType: JambQuestionSourceType;
  isAIgenerated: boolean;
  status: JambQuestionStatus;
  fingerprint: string;
  timesUsed: number;
  createdAt: number;
  updatedAt: number;
}

export interface UserQuestionHistoryDoc {
  questionId: string;
  userId: string;
  subjectId?: string;
  topicId?: string;
  novelId?: string;
  chapterId?: string;
  selectedOption?: number;
  isCorrect?: boolean;
  timeSpentSeconds?: number;
  seenAt: number;
  answeredAt?: number;
  lastSessionId: string;
  attemptsCount: number;
}

export interface UnifiedPracticeSessionDoc {
  sessionId: string;
  userId: string;
  mode: 'jamb_practice' | 'jamb_cbt' | 'jamb_study' | 'novel_practice';
  subjectId: string;
  subjectName: string;
  topicId?: string;
  topicName?: string;
  novelId?: string;
  chapterId?: string;
  questionIds: string[];
  questions: (JambQuestionDoc | JambNovelQuestionDoc)[];
  totalQuestions: number;
  currentIndex: number;
  answers: Record<string | number, number>;
  status: 'active' | 'completed' | 'abandoned';
  score?: number;
  startedAt: number;
  updatedAt: number;
  completedAt?: number;
}

export interface CreatePracticeSessionOptions {
  userId?: string;
  mode: 'jamb_practice' | 'jamb_cbt' | 'jamb_study' | 'novel_practice';
  subjectId?: string;
  subjectName?: string;
  topicId?: string;
  topicName?: string;
  subjects?: string[]; // Multi-subject CBT support
  novelId?: string;
  novelTitle?: string;
  chapterId?: string;
  chapterTitle?: string;
  chapterIndex?: number;
  count?: number; // Capped at 100
  ordering?: 'random' | 'sequential';
  difficulty?: JambQuestionDifficulty;
  year?: number | string | 'all';
}

const LOCAL_SEEN_KEY = 'learndean_seen_questions';
let hasSeededFirestore = false;

class JambQuestionEngine {
  /**
   * Converts static curated questions to canonical JambQuestionDoc with deterministic fingerprints.
   */
  private getCuratedSubjectQuestions(subjectId?: string, topicId?: string): JambQuestionDoc[] {
    const list: JambQuestionDoc[] = [];
    const targetSub = subjectId?.toLowerCase();

    for (const raw of JAMB_QUESTIONS) {
      if (targetSub && raw.subject.toLowerCase() !== targetSub) {
        continue;
      }
      if (topicId && topicId !== 'all' && topicId !== 'All Topics') {
        const normFilterTopic = topicId.toLowerCase();
        const normQTopic = (raw.topic || '').toLowerCase();
        if (!normQTopic.includes(normFilterTopic) && !normFilterTopic.includes(normQTopic)) {
          continue;
        }
      }

      const options = raw.options || [];
      const fingerprint = generateQuestionFingerprint(raw.question, options);

      list.push({
        questionId: raw.id,
        subjectId: raw.subject.toLowerCase(),
        subjectName: raw.subjectName || raw.subject,
        topicId: (raw.topic || 'General').toLowerCase().replace(/\s+/g, '_'),
        topicName: raw.topic || 'General',
        question: raw.question,
        passage: raw.passage,
        options,
        correctAnswer: raw.correctAnswer,
        explanation: raw.explanation || 'Refer to the official JAMB syllabus for full derivation.',
        difficulty: 'medium',
        sourceType: 'past_question', // Authentic past questions
        isAIgenerated: false,
        status: 'active',
        fingerprint,
        timesUsed: 0,
        year: raw.year,
        questionNumber: raw.questionNumber,
        createdAt: 1704067200000,
        updatedAt: 1704067200000
      });
    }

    return list;
  }

  /**
   * Converts static curated novel questions to canonical JambNovelQuestionDoc.
   */
  private getCuratedNovelQuestions(novelId?: string, chapterIndex?: number): JambNovelQuestionDoc[] {
    const list: JambNovelQuestionDoc[] = [];

    for (const novel of NOVELS_COLLECTION) {
      if (novelId && novel.id !== novelId) continue;

      novel.chapters.forEach((chap, cIdx) => {
        if (chapterIndex !== undefined && chapterIndex !== -1 && cIdx !== chapterIndex) {
          return;
        }

        const chapQuestions = chap.questions || [];
        chapQuestions.forEach((q) => {
          const fingerprint = generateQuestionFingerprint(q.question, q.options);
          list.push({
            questionId: q.id,
            novelId: novel.id,
            novelTitle: novel.title,
            chapterId: chap.id || `chap_${cIdx}`,
            chapterIndex: cIdx,
            chapterTitle: chap.title || `Chapter ${cIdx + 1}`,
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation || 'Refer to novel chapter text for details.',
            difficulty: (q.difficulty as any) || 'medium',
            sourceType: 'curriculum_derived',
            isAIgenerated: false,
            status: 'active',
            fingerprint,
            timesUsed: 0,
            createdAt: 1704067200000,
            updatedAt: 1704067200000
          });
        });
      });

      // Also check novel general practice questions
      if (novel.practiceQuestions && (chapterIndex === undefined || chapterIndex === -1)) {
        novel.practiceQuestions.forEach((pq, pIdx) => {
          const fingerprint = generateQuestionFingerprint(pq.question, pq.options);
          list.push({
            questionId: pq.id,
            novelId: novel.id,
            novelTitle: novel.title,
            chapterId: `general_${pIdx}`,
            chapterIndex: 0,
            chapterTitle: 'General Novel Revision',
            question: pq.question,
            options: pq.options,
            correctAnswer: pq.correctAnswer,
            explanation: pq.explanation || 'Refer to novel synopsis and themes.',
            difficulty: 'medium',
            sourceType: 'curriculum_derived',
            isAIgenerated: false,
            status: 'active',
            fingerprint,
            timesUsed: 0,
            createdAt: 1704067200000,
            updatedAt: 1704067200000
          });
        });
      }
    }

    return list;
  }

  /**
   * Lazily seeds initial syllabus subjects, topics, and authentic past questions to Firestore.
   */
  public async seedInitialBankIfEmpty(): Promise<void> {
    if (hasSeededFirestore) return;
    if (typeof navigator !== 'undefined' && !navigator.onLine) return;
    if (!auth.currentUser) return;

    try {
      hasSeededFirestore = true;
      // Check if jambSubjects exists
      const testSnap = await getDocs(query(collection(db, 'jambSubjects'), limit(1)));
      if (!testSnap.empty) return;

      const batch = writeBatch(db);

      // 1. Seed subjects
      for (const subj of JAMB_SUBJECTS) {
        const subRef = doc(db, 'jambSubjects', subj.id);
        const syllabus = JAMB_SYLLABUS_DATA[subj.id];
        batch.set(subRef, {
          subjectId: subj.id,
          name: subj.name,
          code: subj.code,
          category: subj.category,
          hasCalculator: !!subj.hasCalculator,
          topicCount: syllabus?.topics?.length || 0,
          questionCount: 0,
          createdAt: Date.now(),
          updatedAt: Date.now()
        }, { merge: true });

        // Seed topics
        if (syllabus?.topics) {
          syllabus.topics.slice(0, 10).forEach((top, tIdx) => {
            const topRef = doc(db, 'jambTopics', `${subj.id}_${top.id}`);
            batch.set(topRef, {
              topicId: `${subj.id}_${top.id}`,
              subjectId: subj.id,
              name: top.name,
              order: tIdx + 1,
              questionCount: 0,
              createdAt: Date.now(),
              updatedAt: Date.now()
            }, { merge: true });
          });
        }
      }

      await batch.commit();
    } catch (e) {
      console.warn('Initial Firestore seed check notice:', e);
    }
  }

  /**
   * Retrieves the set of question IDs that the user has already seen.
   */
  public async getUserSeenQuestionIds(userId?: string): Promise<Set<string>> {
    const seenIds = new Set<string>();

    // 1. Read from localStorage for immediate offline lookups
    try {
      const raw = localStorage.getItem(LOCAL_SEEN_KEY);
      if (raw) {
        const list = JSON.parse(raw);
        if (Array.isArray(list)) {
          list.forEach(id => seenIds.add(id));
        }
      }
    } catch {}

    // 2. Read from Firestore userQuestionHistory/{userId}/questions if logged in and online
    const activeUid = userId || auth.currentUser?.uid;
    const isOnline = typeof navigator !== 'undefined' && navigator.onLine;

    if (activeUid && isOnline) {
      try {
        const historyCol = collection(db, 'userQuestionHistory', activeUid, 'questions');
        const snap = await getDocs(query(historyCol, limit(500)));
        snap.forEach(d => seenIds.add(d.id));
      } catch (err) {
        console.warn('Could not read userQuestionHistory from Firestore:', err);
      }
    }

    return seenIds;
  }

  /**
   * Tracks that the user has been presented with questions in a session.
   */
  public async recordQuestionsSeen(
    userId: string,
    sessionId: string,
    questions: (JambQuestionDoc | JambNovelQuestionDoc)[]
  ): Promise<void> {
    const now = Date.now();

    // 1. Update localStorage cache
    try {
      const raw = localStorage.getItem(LOCAL_SEEN_KEY);
      const existing: string[] = raw ? JSON.parse(raw) : [];
      const set = new Set(existing);
      questions.forEach(q => {
        if (q?.questionId) set.add(q.questionId);
      });
      localStorage.setItem(LOCAL_SEEN_KEY, JSON.stringify(Array.from(set).slice(-1000)));
    } catch {}

    // 2. Persist to Firestore: userQuestionHistory/{userId}/questions/{questionId}
    const isOnline = typeof navigator !== 'undefined' && navigator.onLine;
    if (userId && isOnline && questions.length > 0) {
      try {
        const batch = writeBatch(db);
        for (const q of questions) {
          if (!q?.questionId) continue;
          const docRef = doc(db, 'userQuestionHistory', userId, 'questions', q.questionId);
          const isNovelQ = 'novelId' in q || 'chapterId' in q;
          const historyRecord: Record<string, any> = {
            questionId: q.questionId,
            userId,
            seenAt: now,
            lastSessionId: sessionId,
            attemptsCount: 0
          };
          if (isNovelQ) {
            const novelQ = q as JambNovelQuestionDoc;
            if (novelQ.novelId) historyRecord.novelId = novelQ.novelId;
            if (novelQ.chapterId) historyRecord.chapterId = novelQ.chapterId;
          } else {
            const subjectQ = q as JambQuestionDoc;
            if (subjectQ.subjectId) historyRecord.subjectId = subjectQ.subjectId;
            if (subjectQ.topicId) historyRecord.topicId = subjectQ.topicId;
          }
          batch.set(docRef, cleanFirestoreData(historyRecord), { merge: true });
        }
        await batch.commit();
      } catch (e) {
        console.warn('Failed recording seen questions in Firestore:', e);
      }
    }
  }

  /**
   * Tracks an answered question in userQuestionHistory.
   */
  public async recordQuestionAnswer(
    userId: string,
    sessionId: string,
    questionId: string,
    selectedOption: number,
    isCorrect: boolean,
    timeSpentSeconds: number = 0,
    meta?: { subjectId?: string; topicId?: string; novelId?: string; chapterId?: string }
  ): Promise<void> {
    const isOnline = typeof navigator !== 'undefined' && navigator.onLine;
    if (!userId || !isOnline || !questionId) return;

    try {
      const docRef = doc(db, 'userQuestionHistory', userId, 'questions', questionId);
      const answerPayload: Record<string, any> = {
        questionId,
        userId,
        selectedOption: typeof selectedOption === 'number' ? selectedOption : -1,
        isCorrect: Boolean(isCorrect),
        timeSpentSeconds: Math.max(0, timeSpentSeconds || 0),
        answeredAt: Date.now(),
        lastSessionId: sessionId || 'active_session',
        attemptsCount: increment(1)
      };
      if (meta?.subjectId) answerPayload.subjectId = meta.subjectId;
      if (meta?.topicId) answerPayload.topicId = meta.topicId;
      if (meta?.novelId) answerPayload.novelId = meta.novelId;
      if (meta?.chapterId) answerPayload.chapterId = meta.chapterId;

      await setDoc(docRef, cleanFirestoreData(answerPayload), { merge: true });
    } catch (e) {
      console.warn('Failed recording question answer in userQuestionHistory:', e);
    }
  }

  /**
   * Queries existing Firestore questions for a subject or novel.
   */
  private async queryFirestoreBank(
    options: CreatePracticeSessionOptions
  ): Promise<(JambQuestionDoc | JambNovelQuestionDoc)[]> {
    const isOnline = typeof navigator !== 'undefined' && navigator.onLine;
    if (!isOnline) return [];

    try {
      if (options.mode === 'novel_practice' || options.novelId) {
        const colRef = collection(db, 'jambNovelQuestions');
        let q;
        if (options.novelId && options.chapterId) {
          q = query(colRef, where('novelId', '==', options.novelId), where('chapterId', '==', options.chapterId), where('status', '==', 'active'), limit(200));
        } else if (options.novelId) {
          q = query(colRef, where('novelId', '==', options.novelId), where('status', '==', 'active'), limit(200));
        } else {
          q = query(colRef, where('status', '==', 'active'), limit(200));
        }
        const snap = await getDocs(q);
        return snap.docs.map(d => d.data() as JambNovelQuestionDoc);
      } else {
        const targetSub = (options.subjectId || options.subjects?.[0] || 'english').toLowerCase();
        const colRef = collection(db, 'jambQuestions');
        let q = query(colRef, where('subjectId', '==', targetSub), where('status', '==', 'active'), limit(300));
        if (options.topicId && options.topicId !== 'all' && options.topicId !== 'All Topics') {
          q = query(colRef, where('subjectId', '==', targetSub), where('topicId', '==', options.topicId.toLowerCase().replace(/\s+/g, '_')), where('status', '==', 'active'), limit(200));
        }
        const snap = await getDocs(q);
        return snap.docs.map(d => d.data() as JambQuestionDoc);
      }
    } catch (err) {
      console.warn('Firestore question bank query warning:', err);
      return [];
    }
  }

  /**
   * Generates additional original questions via the backend endpoint,
   * validates them, removes duplicates using the deterministic fingerprint,
   * and saves accepted questions permanently to Firestore.
   */
  public async generateAndSaveOriginalQuestions(
    options: {
      subjectId?: string;
      subjectName?: string;
      topicId?: string;
      topicName?: string;
      novelId?: string;
      novelTitle?: string;
      chapterId?: string;
      chapterTitle?: string;
      chapterIndex?: number;
      difficulty?: JambQuestionDifficulty;
      count: number;
      existingFingerprints: string[];
    }
  ): Promise<(JambQuestionDoc | JambNovelQuestionDoc)[]> {
    const isOnline = typeof navigator !== 'undefined' && navigator.onLine;
    if (!isOnline) return [];

    const token = await auth.currentUser?.getIdToken().catch(() => null);

    const endpointsToTry = [
      '/api/jamb/generate-questions',
      '/api/generate-questions'
    ];

    const payload = {
      subjectId: options.subjectId,
      subjectName: options.subjectName,
      topicId: options.topicId,
      topicName: options.topicName,
      novelId: options.novelId,
      novelTitle: options.novelTitle,
      chapterId: options.chapterId,
      chapterTitle: options.chapterTitle,
      chapterIndex: options.chapterIndex,
      difficulty: options.difficulty || 'medium',
      amount: options.count,
      existingFingerprints: options.existingFingerprints,
      // Fallback keys for generic generate-questions handler
      subject: options.subjectName || options.subjectId,
      topic: options.topicName || options.topicId,
      examType: 'JAMB',
      practiceMode: 'JAMB'
    };

    let data: any = null;
    let lastErrorMsg = 'Failed to communicate with question generation service';

    for (const endpoint of endpointsToTry) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
          body: JSON.stringify(payload)
        });

        const contentType = response.headers.get('content-type') || '';
        const rawText = await response.text();

        // Detect if server returned an HTML fallback page (e.g. 404 rewrite to index.html)
        const isHtml = rawText.trim().startsWith('<') || contentType.includes('text/html');

        if (isHtml) {
          console.warn(`Endpoint ${endpoint} returned HTML instead of JSON. Trying next endpoint...`);
          lastErrorMsg = `Endpoint ${endpoint} returned HTML (SPA fallback). Endpoint not deployed.`;
          continue;
        }

        let parsed: any = null;
        try {
          parsed = JSON.parse(rawText);
        } catch (_) {
          lastErrorMsg = `Invalid JSON response from ${endpoint}: ${rawText.slice(0, 100)}`;
          continue;
        }

        if (!response.ok) {
          lastErrorMsg = parsed?.error || `Server error (${response.status}) from ${endpoint}`;
          // If the server explicitly rejected with 503 or 429 quota, don't keep retrying other endpoints endlessly
          if (response.status === 503 || response.status === 429) {
            throw new Error(lastErrorMsg);
          }
          continue;
        }

        if (parsed && Array.isArray(parsed.questions)) {
          data = parsed;
          break;
        }
      } catch (err: any) {
        if (err.message && (err.message.includes('busy') || err.message.includes('quota') || err.message.includes('rate-limited') || err.message.includes('high demand'))) {
          throw err;
        }
        lastErrorMsg = err?.message || lastErrorMsg;
      }
    }

    if (!data || !Array.isArray(data.questions)) {
      throw new Error(lastErrorMsg);
    }

    const candidateList: (JambQuestionDoc | JambNovelQuestionDoc)[] = data.questions || [];

    const acceptedQuestions: (JambQuestionDoc | JambNovelQuestionDoc)[] = [];
    const isNovel = !!options.novelId;

    // Validate and save accepted questions permanently to Firestore
    for (const q of candidateList) {
      const validated = validateQuestionPayload(q);
      if (!validated) continue;

      const fp = generateQuestionFingerprint(validated.question, validated.options);
      if (options.existingFingerprints.includes(fp)) continue;

      // Assign required fields
      const acceptedDoc = {
        ...q,
        question: validated.question,
        options: validated.options,
        correctAnswer: validated.correctAnswer,
        explanation: validated.explanation,
        difficulty: validated.difficulty || 'medium',
        fingerprint: fp,
        isAIgenerated: true,
        sourceType: 'ai_generated' as JambQuestionSourceType, // Explicit: do not label as official JAMB past question
        status: 'active' as JambQuestionStatus,
        timesUsed: 0,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      acceptedQuestions.push(acceptedDoc);

      // Save permanently to Firestore
      try {
        const collectionName = isNovel ? 'jambNovelQuestions' : 'jambQuestions';
        await setDoc(doc(db, collectionName, acceptedDoc.questionId), cleanFirestoreData(acceptedDoc));

        // Update stats
        const bankId = isNovel ? `novel_${options.novelId}` : `subject_${options.subjectId || 'general'}`;
        await setDoc(doc(db, 'questionBankStats', bankId), cleanFirestoreData({
          bankId,
          totalQuestions: increment(1),
          aiGeneratedCount: increment(1),
          updatedAt: Date.now()
        }), { merge: true });
      } catch (saveErr) {
        console.warn('Could not persist accepted question to Firestore right now:', saveErr);
      }
    }

    // Record generation audit log
    if (auth.currentUser && candidateList.length > 0) {
      try {
        const genId = `gen_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        const genDoc: Record<string, any> = {
          generationId: genId,
          requestedBy: auth.currentUser.uid,
          countRequested: options.count,
          countGenerated: acceptedQuestions.length,
          status: acceptedQuestions.length >= options.count ? 'success' : 'partial',
          createdAt: Date.now()
        };
        if (options.subjectId) genDoc.subjectId = options.subjectId;
        if (options.topicId) genDoc.topicId = options.topicId;
        if (options.novelId) genDoc.novelId = options.novelId;
        if (options.chapterId) genDoc.chapterId = options.chapterId;

        await setDoc(doc(db, 'questionGeneration', genId), cleanFirestoreData(genDoc));
      } catch {}
    }

    return acceptedQuestions;
  }

  /**
   * Main Question Engine API: Creates a practice session adhering to all 8 criteria:
   * 1. Prefer questions the user has never seen.
   * 2. Filter by subject/topic/novel/chapter when selected.
   * 3. Never repeat a question while unused questions are available.
   * 4. If the available bank is too small, generate additional ORIGINAL questions.
   * 5. Validate the generated questions.
   * 6. Remove duplicates using the fingerprint.
   * 7. Save accepted questions permanently to Firestore.
   * 8. Then use them in the practice session.
   * Max count is capped at 100 for normal practice.
   */
  public async createPracticeSession(
    options: CreatePracticeSessionOptions
  ): Promise<{
    session: UnifiedPracticeSessionDoc;
    questions: (JambQuestionDoc | JambNovelQuestionDoc)[];
    unseenCount: number;
    generatedCount: number;
  }> {
    await this.seedInitialBankIfEmpty().catch(() => {});

    // Requirement: Keep the maximum number selected by the user at 100 for normal practice
    const targetCount = Math.min(100, Math.max(1, Number(options.count) || 20));
    const activeUserId = options.userId || auth.currentUser?.uid || 'guest_user';
    const isNovelMode = options.mode === 'novel_practice' || !!options.novelId;

    // Multi-subject support (e.g. JAMB CBT Mock with 4 subjects)
    const targetSubjects = options.subjects && options.subjects.length > 0
      ? options.subjects
      : [options.subjectId || 'english'];

    const perSubjectTarget = Math.max(1, Math.floor(targetCount / targetSubjects.length));

    // 1. Get seen question IDs for this user
    const seenIds = await this.getUserSeenQuestionIds(activeUserId);

    let finalSelectedQuestions: (JambQuestionDoc | JambNovelQuestionDoc)[] = [];
    const usedFingerprints = new Set<string>();
    let totalGenerated = 0;

    for (let sIdx = 0; sIdx < targetSubjects.length; sIdx++) {
      const currentSubjectRaw = targetSubjects[sIdx];
      const currentSubjectId = currentSubjectRaw.toLowerCase().replace(/\s+/g, '_');
      const neededForSubject = sIdx === targetSubjects.length - 1
        ? targetCount - finalSelectedQuestions.length
        : perSubjectTarget;

      if (neededForSubject <= 0) break;

      // 2. Fetch candidate questions from Firestore bank
      const remoteCandidates = await this.queryFirestoreBank({
        ...options,
        subjectId: currentSubjectId
      });

      // 3. Fallback/combine with curated authentic questions
      const curatedCandidates = isNovelMode
        ? this.getCuratedNovelQuestions(options.novelId, options.chapterIndex)
        : this.getCuratedSubjectQuestions(currentSubjectId, options.topicId);

      const allCandidatesMap = new Map<string, JambQuestionDoc | JambNovelQuestionDoc>();
      for (const q of curatedCandidates) allCandidatesMap.set(q.questionId, q);
      for (const q of remoteCandidates) allCandidatesMap.set(q.questionId, q);

      const candidateList = Array.from(allCandidatesMap.values());

      // Filter by year if specified
      const filteredByYear = options.year && options.year !== 'all'
        ? candidateList.filter(q => String((q as JambQuestionDoc).year) === String(options.year))
        : candidateList;

      const filteredPool = filteredByYear.length > 0 ? filteredByYear : candidateList;

      // Filter out candidates already chosen in this session or with duplicate fingerprints
      const availableUnique = filteredPool.filter(q => {
        if (!q.fingerprint) q.fingerprint = generateQuestionFingerprint(q.question, q.options);
        return !usedFingerprints.has(q.fingerprint);
      });

      // 4. Partition by unseen vs seen: Prefer questions the user has never seen
      const unseenQuestions = availableUnique.filter(q => !seenIds.has(q.questionId));
      const seenQuestions = availableUnique.filter(q => seenIds.has(q.questionId));

      let subjectSelected: (JambQuestionDoc | JambNovelQuestionDoc)[] = [];

      // Add unseen questions first
      if (options.ordering === 'random') {
        unseenQuestions.sort(() => 0.5 - Math.random());
      }
      subjectSelected.push(...unseenQuestions.slice(0, neededForSubject));

      // 5. If the available bank is too small, generate additional ORIGINAL questions
      const remainingNeeded = neededForSubject - subjectSelected.length;
      if (remainingNeeded > 0 && typeof navigator !== 'undefined' && navigator.onLine) {
        try {
          const existingFps = Array.from(usedFingerprints).concat(
            availableUnique.map(q => q.fingerprint).filter(Boolean)
          );

          const generated = await this.generateAndSaveOriginalQuestions({
            subjectId: currentSubjectId,
            subjectName: currentSubjectRaw,
            topicId: options.topicId,
            topicName: options.topicName,
            novelId: options.novelId,
            novelTitle: options.novelTitle,
            chapterId: options.chapterId,
            chapterTitle: options.chapterTitle,
            chapterIndex: options.chapterIndex,
            difficulty: options.difficulty || 'medium',
            count: remainingNeeded,
            existingFingerprints: existingFps
          });

          totalGenerated += generated.length;
          for (const gq of generated) {
            if (subjectSelected.length < neededForSubject && !usedFingerprints.has(gq.fingerprint)) {
              subjectSelected.push(gq);
              usedFingerprints.add(gq.fingerprint);
            }
          }
        } catch (genErr) {
          console.warn('AI question auto-replenishment attempt notification:', genErr);
        }
      }

      // 6. Never repeat a question while unused questions are available.
      // If still short, fallback to previously seen questions (oldest seen or lowest attempts first)
      if (subjectSelected.length < neededForSubject && seenQuestions.length > 0) {
        seenQuestions.sort((a, b) => a.timesUsed - b.timesUsed);
        const backfill = seenQuestions.slice(0, neededForSubject - subjectSelected.length);
        subjectSelected.push(...backfill);
      }

      // Register used fingerprints
      subjectSelected.forEach(q => {
        if (q.fingerprint) usedFingerprints.add(q.fingerprint);
      });

      finalSelectedQuestions.push(...subjectSelected);
    }

    // Shuffle if random order requested
    if (options.ordering === 'random') {
      finalSelectedQuestions.sort(() => 0.5 - Math.random());
    }

    const sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const now = Date.now();

    // Correctly resolve subjectId and subjectName so it is NEVER undefined
    let resolvedSubjectId: string = 'general';
    let resolvedSubjectName: string = 'General Practice';

    if (options.subjectId) {
      resolvedSubjectId = options.subjectId;
      const matched = JAMB_SUBJECTS.find(
        s => s.id === options.subjectId || s.name.toLowerCase() === options.subjectId?.toLowerCase()
      );
      resolvedSubjectName = options.subjectName || matched?.name || options.subjectId;
    } else if (options.subjectName) {
      resolvedSubjectName = options.subjectName;
      const matched = JAMB_SUBJECTS.find(
        s => s.name.toLowerCase() === options.subjectName?.toLowerCase() || s.id === options.subjectName?.toLowerCase()
      );
      resolvedSubjectId = matched?.id || options.subjectName.toLowerCase().replace(/\s+/g, '_');
    } else if (options.subjects && options.subjects.length > 1) {
      resolvedSubjectId = 'jamb_cbt';
      resolvedSubjectName = 'JAMB CBT Multi-Subject Mock';
    } else if (isNovelMode || options.novelId) {
      resolvedSubjectId = options.novelId || 'novel_study';
      const novelObj = options.novelId ? NOVELS_COLLECTION.find(n => n.id === options.novelId) : null;
      resolvedSubjectName = options.novelTitle || novelObj?.title || 'Prescribed Novel Study';
    } else if (finalSelectedQuestions.length > 0) {
      const firstQ = finalSelectedQuestions[0];
      if ('subjectId' in firstQ && firstQ.subjectId) {
        resolvedSubjectId = firstQ.subjectId;
        resolvedSubjectName = (firstQ as any).subjectName || firstQ.subjectId;
      } else if ('novelId' in firstQ && (firstQ as any).novelId) {
        resolvedSubjectId = (firstQ as any).novelId;
        resolvedSubjectName = (firstQ as any).novelTitle || 'Prescribed Novel Study';
      }
    }

    const session: UnifiedPracticeSessionDoc = {
      sessionId,
      userId: activeUserId,
      mode: options.mode,
      subjectId: resolvedSubjectId,
      subjectName: resolvedSubjectName,
      questionIds: finalSelectedQuestions.map(q => q.questionId),
      questions: finalSelectedQuestions,
      totalQuestions: finalSelectedQuestions.length,
      currentIndex: 0,
      answers: {},
      status: 'active',
      startedAt: now,
      updatedAt: now
    };

    if (options.topicId) session.topicId = options.topicId;
    if (options.topicName) session.topicName = options.topicName;
    if (options.novelId) session.novelId = options.novelId;
    if (options.chapterId) session.chapterId = options.chapterId;

    // Increment timesUsed on selected questions in Firestore
    if (typeof navigator !== 'undefined' && navigator.onLine) {
      try {
        for (const q of finalSelectedQuestions) {
          const colName = isNovelMode ? 'jambNovelQuestions' : 'jambQuestions';
          updateDoc(doc(db, colName, q.questionId), {
            timesUsed: increment(1),
            updatedAt: now
          }).catch(() => {});
        }
      } catch {}
    }

    // Track every question as seen in userQuestionHistory
    if (activeUserId && activeUserId !== 'guest_user') {
      this.recordQuestionsSeen(activeUserId, sessionId, finalSelectedQuestions).catch(() => {});
    }

    // Persist practiceSession to Firestore
    if (activeUserId && activeUserId !== 'guest_user' && typeof navigator !== 'undefined' && navigator.onLine) {
      try {
        await setDoc(doc(db, 'practiceSessions', sessionId), cleanFirestoreData(session));
      } catch (err) {
        console.warn('Practice session firestore save notice:', err);
      }
    }

    // Calculate unseen count
    const unseenCount = finalSelectedQuestions.filter(q => !seenIds.has(q.questionId)).length;

    return {
      session,
      questions: finalSelectedQuestions,
      unseenCount,
      generatedCount: totalGenerated
    };
  }

  /**
   * Updates an active practice session in Firestore.
   */
  public async updateSessionProgress(
    sessionId: string,
    updates: Partial<UnifiedPracticeSessionDoc>
  ): Promise<void> {
    if (typeof navigator !== 'undefined' && !navigator.onLine) return;
    if (!auth.currentUser) return;

    try {
      const sanitizedUpdates = cleanFirestoreData({
        ...updates,
        updatedAt: Date.now()
      });
      await updateDoc(doc(db, 'practiceSessions', sessionId), sanitizedUpdates);
    } catch (e) {
      console.warn('Session progress update notice:', e);
    }
  }

  /**
   * Adapts a canonical doc to the legacy Question interface used by LearnDean's Practice Center components.
   */
  public toLegacyQuestion(q: JambQuestionDoc | JambNovelQuestionDoc, index: number = 0): any {
    const isNovelQ = 'novelId' in q || 'chapterId' in q;
    const subjectQ = q as JambQuestionDoc;
    const novelQ = q as JambNovelQuestionDoc;

    const legacyQ: Record<string, any> = {
      id: q.questionId,
      questionId: q.questionId,
      question: subjectQ.passage ? `${subjectQ.passage}\n\n${q.question}` : q.question,
      options: q.options || [],
      correctAnswer: q.correctAnswer,
      correctAnswerIndex: q.correctAnswer,
      explanation: q.explanation || 'Refer to official syllabus and curriculum guide.',
      difficulty: q.difficulty || 'medium',
      sourceType: q.sourceType || 'past_question',
      isAIgenerated: !!q.isAIgenerated,
      fingerprint: q.fingerprint,
      topic: isNovelQ ? (novelQ.chapterTitle || 'Novel Study') : (subjectQ.topicName || 'General'),
      subject: isNovelQ ? (novelQ.novelTitle || 'Prescribed Novel') : (subjectQ.subjectName || 'JAMB'),
      subjectId: isNovelQ ? (novelQ.novelId || 'novel') : (subjectQ.subjectId || 'general'),
      subjectName: isNovelQ ? (novelQ.novelTitle || 'Prescribed Novel') : (subjectQ.subjectName || 'JAMB'),
      status: q.status || 'active'
    };

    if (isNovelQ) {
      if (novelQ.novelId) legacyQ.novelId = novelQ.novelId;
      if (novelQ.chapterId) legacyQ.chapterId = novelQ.chapterId;
      if (typeof novelQ.chapterIndex === 'number') legacyQ.chapterIndex = novelQ.chapterIndex;
    } else {
      if (subjectQ.year) legacyQ.year = subjectQ.year;
      if (subjectQ.questionNumber) legacyQ.questionNumber = subjectQ.questionNumber;
      else legacyQ.questionNumber = index + 1;
    }

    return legacyQ;
  }
}

export const jambQuestionEngine = new JambQuestionEngine();
