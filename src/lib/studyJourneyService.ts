import { db } from './firebase';
import { doc, getDoc, setDoc, deleteDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { StudyJourneyState, StudyJourneyQuestion } from '../types';

// Helper to remove any undefined fields before saving to Firestore
export function sanitizeDataForFirestore<T>(data: T): T {
  if (data === null || data === undefined) {
    return null as any;
  }
  if (Array.isArray(data)) {
    return data.map(item => sanitizeDataForFirestore(item)) as any;
  }
  if (typeof data === 'object' && !(data instanceof Date)) {
    const cleanObj: Record<string, any> = {};
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        cleanObj[key] = sanitizeDataForFirestore(value);
      }
    }
    return cleanObj as any;
  }
  return data;
}

const LOCAL_STORAGE_KEY = 'zetadu_active_study_journey';

export async function saveStudyJourney(userId: string, journey: StudyJourneyState): Promise<void> {
  if (!userId) return;

  const sanitized = sanitizeDataForFirestore({
    ...journey,
    uid: userId,
    updatedAt: Date.now()
  });

  // Save to local storage for quick sync and offline
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sanitized));
  } catch (err) {
    console.warn('LocalStorage save failed:', err);
  }

  // Save to Firestore under user's UID doc
  try {
    const docRef = doc(db, 'study_journeys', userId);
    await setDoc(docRef, sanitized, { merge: true });
  } catch (err) {
    console.error('Failed to save study journey to Firestore:', err);
  }
}

export async function loadStudyJourney(userId: string): Promise<StudyJourneyState | null> {
  if (!userId) return null;

  // First try Firestore
  try {
    const docRef = doc(db, 'study_journeys', userId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data() as StudyJourneyState;
      // Also update local storage cache
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
      return data;
    }
  } catch (err) {
    console.warn('Could not load study journey from Firestore, falling back to local storage:', err);
  }

  // Fallback to local storage
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as StudyJourneyState;
      if (parsed.uid === userId) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Failed to parse local study journey:', err);
  }

  return null;
}

export async function clearStudyJourney(userId: string): Promise<void> {
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  } catch (err) {}

  if (!userId) return;

  try {
    const docRef = doc(db, 'study_journeys', userId);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn('Could not delete study journey from Firestore:', err);
  }
}

export function calculateTopicMastery(
  practiceAccuracy: number,
  retestAccuracy: number | undefined,
  flashcardsStudied: number,
  flashcardsTotal: number
): number {
  const flashcardRatio = flashcardsTotal > 0 ? Math.min(1, flashcardsStudied / flashcardsTotal) : 1;
  const flashcardScore = flashcardRatio * 100;

  if (typeof retestAccuracy === 'number' && retestAccuracy >= 0) {
    // 40% Practice, 45% Retest, 15% Flashcard repetition
    const mastery = (practiceAccuracy * 0.40) + (retestAccuracy * 0.45) + (flashcardScore * 0.15);
    return Math.min(100, Math.max(0, Math.round(mastery)));
  } else {
    // 75% Practice, 25% Flashcards
    const mastery = (practiceAccuracy * 0.75) + (flashcardScore * 0.25);
    return Math.min(100, Math.max(0, Math.round(mastery)));
  }
}

export async function convertMistakesToFlashcards(
  userId: string,
  subject: string,
  topic: string,
  mistakes: StudyJourneyQuestion[]
): Promise<number> {
  if (!userId || !mistakes || mistakes.length === 0) return 0;

  let addedCount = 0;
  const targetDeckName = `${subject}: ${topic} (Mistakes)`;

  for (const mistake of mistakes) {
    try {
      const correctText = mistake.options[mistake.correctAnswer] || 'Correct answer';
      const userSelectedText = mistake.userAnswer !== undefined && mistake.userAnswer >= 0
        ? mistake.options[mistake.userAnswer]
        : 'Unanswered';

      await addDoc(collection(db, 'flashcards'), {
        uid: userId,
        subject,
        topic,
        deckName: targetDeckName,
        front: mistake.question,
        back: `${correctText}\n\nNote: You previously chose: "${userSelectedText}".\n\nExplanation: ${mistake.explanation}`,
        explanation: mistake.explanation,
        difficulty: 'Hard',
        rating: 'Again',
        reviews: 0,
        lastReviewed: Date.now(),
        nextReview: Date.now(),
        bookmarked: true,
        createdAt: Date.now()
      });
      addedCount++;
    } catch (err) {
      console.warn('Failed to add mistake as flashcard:', err);
    }
  }

  return addedCount;
}
