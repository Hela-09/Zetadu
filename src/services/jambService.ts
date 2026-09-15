import { db, auth } from '../lib/firebase';
import { collection, doc, setDoc, getDoc, getDocs, query, where, orderBy, limit, deleteDoc } from 'firebase/firestore';
import { JambQuestion } from '../data/jambQuestions';

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
}

export interface BookmarkedJambQuestion {
  questionId: string;
  subject: string;
  savedAt: number;
  question: JambQuestion;
}

const LOCAL_STORAGE_HISTORY_KEY = 'learndean_jamb_history';
const LOCAL_STORAGE_BOOKMARKS_KEY = 'learndean_jamb_bookmarks';

export const jambService = {
  // 1. SAVE PRACTICE ATTEMPT
  async saveAttempt(attempt: Omit<JambExamAttempt, 'id' | 'uid' | 'completedAt'>): Promise<string> {
    const attemptId = `jamb_attempt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const uid = auth.currentUser?.uid || 'guest';
    const completedAt = Date.now();

    const fullAttempt: JambExamAttempt = {
      ...attempt,
      id: attemptId,
      uid,
      completedAt
    };

    // 1. Local Cache First
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_HISTORY_KEY);
      const list: JambExamAttempt[] = stored ? JSON.parse(stored) : [];
      list.unshift(fullAttempt);
      localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, JSON.stringify(list.slice(0, 50)));
    } catch (e) {
      console.warn('Failed to save attempt to localStorage:', e);
    }

    // 2. Sync to Firestore if authenticated
    if (auth.currentUser) {
      try {
        await setDoc(doc(db, 'jamb_history', attemptId), fullAttempt);
      } catch (e) {
        console.warn('Firestore write failed, using local history cache:', e);
      }
    }

    return attemptId;
  },

  // 2. GET PRACTICE HISTORY
  async getHistory(): Promise<JambExamAttempt[]> {
    const localList: JambExamAttempt[] = (() => {
      try {
        const stored = localStorage.getItem(LOCAL_STORAGE_HISTORY_KEY);
        return stored ? JSON.parse(stored) : [];
      } catch {
        return [];
      }
    })();

    if (!auth.currentUser) {
      return localList;
    }

    try {
      const q = query(
        collection(db, 'jamb_history'),
        where('uid', '==', auth.currentUser.uid),
        orderBy('completedAt', 'desc'),
        limit(30)
      );
      const snapshot = await getDocs(q);
      const remoteList: JambExamAttempt[] = [];
      snapshot.forEach(docSnap => {
        remoteList.push(docSnap.data() as JambExamAttempt);
      });

      if (remoteList.length > 0) {
        // Merge with local list removing duplicates
        const map = new Map<string, JambExamAttempt>();
        remoteList.forEach(item => map.set(item.id, item));
        localList.forEach(item => {
          if (!map.has(item.id)) map.set(item.id, item);
        });
        const merged = Array.from(map.values()).sort((a, b) => b.completedAt - a.completedAt);
        localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, JSON.stringify(merged.slice(0, 50)));
        return merged;
      }
    } catch (e) {
      console.warn('Firestore getHistory failed, falling back to local list:', e);
    }

    return localList;
  },

  // 3. BOOKMARKS
  async toggleBookmark(question: JambQuestion): Promise<boolean> {
    const uid = auth.currentUser?.uid || 'guest';
    const localBookmarks = this.getLocalBookmarks();
    const existingIndex = localBookmarks.findIndex(b => b.questionId === question.id);
    const isNowBookmarked = existingIndex === -1;

    if (isNowBookmarked) {
      localBookmarks.unshift({
        questionId: question.id,
        subject: question.subject,
        savedAt: Date.now(),
        question
      });
    } else {
      localBookmarks.splice(existingIndex, 1);
    }

    // Save local
    localStorage.setItem(LOCAL_STORAGE_BOOKMARKS_KEY, JSON.stringify(localBookmarks));

    // Sync remote if user signed in
    if (auth.currentUser) {
      const bookmarkDocId = `${auth.currentUser.uid}_${question.id}`;
      try {
        if (isNowBookmarked) {
          await setDoc(doc(db, 'jamb_bookmarks', bookmarkDocId), {
            uid: auth.currentUser.uid,
            questionId: question.id,
            subject: question.subject,
            savedAt: Date.now(),
            question
          });
        } else {
          await deleteDoc(doc(db, 'jamb_bookmarks', bookmarkDocId));
        }
      } catch (e) {
        console.warn('Firestore bookmark sync failed, stored locally:', e);
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
    const local = this.getLocalBookmarks();
    if (!auth.currentUser) return local;

    try {
      const q = query(
        collection(db, 'jamb_bookmarks'),
        where('uid', '==', auth.currentUser.uid),
        orderBy('savedAt', 'desc')
      );
      const snap = await getDocs(q);
      const remote: BookmarkedJambQuestion[] = [];
      snap.forEach(d => {
        remote.push(d.data() as BookmarkedJambQuestion);
      });
      if (remote.length > 0) {
        localStorage.setItem(LOCAL_STORAGE_BOOKMARKS_KEY, JSON.stringify(remote));
        return remote;
      }
    } catch (e) {
      console.warn('Firestore getBookmarks failed, using local:', e);
    }

    return local;
  },

  isBookmarked(questionId: string): boolean {
    const local = this.getLocalBookmarks();
    return local.some(b => b.questionId === questionId);
  }
};
