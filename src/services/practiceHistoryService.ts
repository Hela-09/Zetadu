import { db, auth, cleanFirestoreData } from '../lib/firebase';
import { collection, addDoc, getDocs, query, where, orderBy, limit, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { Question } from '../components/Quiz';

export interface PracticeHistorySession {
  id: string;
  uid?: string;
  subject: string;
  subjectName?: string;
  topic?: string;
  difficulty?: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  timeUsedSeconds: number;
  completedAt: number;
  answeredQuestions: (Question & { userAnswerIndex?: number | null })[];
  questions?: (Question & { userAnswerIndex?: number | null })[];
  answers: Record<number | string, number>;
  examType?: 'JAMB' | 'WAEC' | 'General';
  syncStatus?: 'pending' | 'synced';
}

export type SavedPracticeSession = PracticeHistorySession;

const LOCAL_STORAGE_PRACTICE_HISTORY_KEY = 'learndean_practice_history';

export const practiceHistoryService = {
  getLocalHistory(): PracticeHistorySession[] {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_PRACTICE_HISTORY_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.warn('Failed to parse local practice history:', e);
      return [];
    }
  },

  saveLocalHistory(list: PracticeHistorySession[]): void {
    try {
      localStorage.setItem(LOCAL_STORAGE_PRACTICE_HISTORY_KEY, JSON.stringify(list.slice(0, 60)));
    } catch (e) {
      console.warn('Failed to save practice history to localStorage:', e);
    }
  },

  async saveSession(session: Omit<PracticeHistorySession, 'id' | 'completedAt'> & { id?: string; completedAt?: number }): Promise<string> {
    const sessionId = session.id || `practice-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const completedAt = session.completedAt || Date.now();

    const fullSession: PracticeHistorySession = {
      ...session,
      id: sessionId,
      completedAt,
      syncStatus: 'pending'
    };

    // 1. Immediately cache to local storage
    const current = this.getLocalHistory();
    const existingIdx = current.findIndex(s => s.id === sessionId);
    if (existingIdx >= 0) {
      current[existingIdx] = fullSession;
    } else {
      current.unshift(fullSession);
    }
    this.saveLocalHistory(current);

    // 2. Persist to Firestore learning_data if online and user is authenticated
    const isOnline = typeof navigator !== 'undefined' && navigator.onLine;
    const currentUser = auth.currentUser;

    if (isOnline && currentUser) {
      try {
        const firestoreData: Record<string, any> = {
          uid: currentUser.uid,
          subject: fullSession.subject || 'general',
          subjectName: fullSession.subjectName || fullSession.subject || 'General Practice',
          topic: fullSession.topic || 'General',
          difficulty: fullSession.difficulty || 'Medium',
          score: typeof fullSession.score === 'number' ? fullSession.score : 0,
          totalQuestions: typeof fullSession.totalQuestions === 'number' ? fullSession.totalQuestions : 0,
          answeredQuestionsCount: Object.keys(fullSession.answers || {}).length,
          percentage: typeof fullSession.percentage === 'number' ? fullSession.percentage : 0,
          timeUsedSeconds: typeof fullSession.timeUsedSeconds === 'number' ? fullSession.timeUsedSeconds : 0,
          answeredQuestions: (fullSession.answeredQuestions || []).map(q => cleanFirestoreData(q)),
          answers: fullSession.answers || {},
          examType: fullSession.examType || 'General',
          updatedAt: serverTimestamp(),
          completedAt: fullSession.completedAt || Date.now()
        };

        const docRef = await addDoc(collection(db, 'learning_data'), cleanFirestoreData(firestoreData));
        fullSession.id = docRef.id;
        fullSession.syncStatus = 'synced';
        
        // Update local record with Firestore ID
        current[0] = fullSession;
        this.saveLocalHistory(current);
      } catch (err) {
        console.warn('Failed to save practice session to Firestore, kept locally:', err);
      }
    }

    return fullSession.id;
  },

  async getHistory(userId?: string): Promise<PracticeHistorySession[]> {
    const localList = this.getLocalHistory();
    const mergedMap = new Map<string, PracticeHistorySession>();
    
    localList.forEach(item => mergedMap.set(item.id, item));

    const isOnline = typeof navigator !== 'undefined' && navigator.onLine;
    const targetUid = userId || auth.currentUser?.uid;

    if (isOnline && targetUid) {
      try {
        // Query recent learning_data documents for target user
        const q = query(
          collection(db, 'learning_data'),
          where('uid', '==', targetUid),
          orderBy('updatedAt', 'desc'),
          limit(50)
        );
        const snapshot = await getDocs(q);

        snapshot.forEach(docSnap => {
          const data = docSnap.data();
          const completedAtTime = data.completedAt || 
            (data.updatedAt?.toMillis ? data.updatedAt.toMillis() : 
            (data.updatedAt?.seconds ? data.updatedAt.seconds * 1000 : Date.now()));

          // Reconstruct questions & answers
          const rawAnsweredQuestions: any[] = data.answeredQuestions || [];
          const reconstructedAnswers: Record<number, number> = {};

          rawAnsweredQuestions.forEach((q, idx) => {
            if (q.userAnswerIndex !== undefined && q.userAnswerIndex !== null) {
              reconstructedAnswers[idx] = q.userAnswerIndex;
            }
          });

          // If explicit answers object was stored, merge it
          if (data.answers && typeof data.answers === 'object') {
            Object.entries(data.answers).forEach(([k, v]) => {
              const numKey = Number(k);
              if (!isNaN(numKey) && typeof v === 'number') {
                reconstructedAnswers[numKey] = v;
              }
            });
          }

          const session: PracticeHistorySession = {
            id: docSnap.id,
            uid: data.uid,
            subject: data.subject || 'General Practice',
            subjectName: data.subjectName || data.subject || 'General Practice',
            topic: data.topic || 'General',
            difficulty: data.difficulty || 'Medium',
            score: typeof data.score === 'number' ? data.score : 0,
            totalQuestions: typeof data.totalQuestions === 'number' ? data.totalQuestions : rawAnsweredQuestions.length,
            percentage: typeof data.percentage === 'number' ? data.percentage : 
              (rawAnsweredQuestions.length > 0 ? Math.round(((data.score || 0) / rawAnsweredQuestions.length) * 100) : 0),
            timeUsedSeconds: typeof data.timeUsedSeconds === 'number' ? data.timeUsedSeconds : 0,
            completedAt: completedAtTime,
            answeredQuestions: rawAnsweredQuestions,
            answers: reconstructedAnswers,
            examType: data.examType || 'General',
            syncStatus: 'synced'
          };

          mergedMap.set(session.id, session);
        });

        const merged = Array.from(mergedMap.values()).sort((a, b) => b.completedAt - a.completedAt);
        this.saveLocalHistory(merged);
        return merged;
      } catch (err) {
        console.warn('Failed to query Firestore learning_data for practice history, using local:', err);
      }
    }

    return Array.from(mergedMap.values()).sort((a, b) => b.completedAt - a.completedAt);
  },

  async deleteSession(id: string): Promise<void> {
    // 1. Remove from local storage
    const current = this.getLocalHistory().filter(s => s.id !== id);
    this.saveLocalHistory(current);

    // 2. Remove from Firestore if online and valid ID
    const isOnline = typeof navigator !== 'undefined' && navigator.onLine;
    if (isOnline && auth.currentUser) {
      try {
        await deleteDoc(doc(db, 'learning_data', id));
      } catch (e) {
        console.warn('Failed to delete learning_data doc from Firestore:', e);
      }
    }
  }
};
