import { ALL_SUBJECTS } from '../data/subjects';
import { SYLLABUS_TOPICS } from '../data/journeyTopics';
import { CURRICULUM_QUESTIONS, CurriculumQuestion } from '../data/curriculumQuestions';
import { db } from '../lib/firebase';
import { collection, query as fsQuery, where, getDocs, limit } from 'firebase/firestore';
import { Flashcard } from '../types';

export type SearchCategory = 'all' | 'subject' | 'topic' | 'flashcard' | 'question';

export interface SearchResultItem {
  id: string;
  type: 'subject' | 'topic' | 'flashcard' | 'question' | 'action';
  title: string;
  subtitle: string;
  badge: string;
  subject?: string;
  subjectId?: string;
  topic?: string;
  explanation?: string;
  details?: any;
  score: number;
}

// In-memory cache for user flashcards and past questions to guarantee instant results
let cachedUserFlashcards: Flashcard[] = [];
let cachedUserQuestions: CurriculumQuestion[] = [];
let lastCachedUserId = '';

/**
 * Preload or refresh user's flashcards and questions for zero-latency instant search
 */
export async function preloadUserSearchData(userId: string): Promise<void> {
  if (!userId) return;
  if (lastCachedUserId === userId && (cachedUserFlashcards.length > 0 || cachedUserQuestions.length > 0)) {
    return;
  }

  lastCachedUserId = userId;

  // 1. Fetch user flashcards
  try {
    const q = fsQuery(collection(db, 'flashcards'), where('uid', '==', userId), limit(60));
    const snap = await getDocs(q);
    const cards: Flashcard[] = [];
    snap.forEach((docSnap) => {
      const data = docSnap.data() as any;
      cards.push({
        id: docSnap.id,
        uid: data.uid,
        subject: data.subject || 'General',
        topic: data.topic || 'General',
        front: data.front || '',
        back: data.back || '',
        explanation: data.explanation || '',
        deckName: data.deckName
      });
    });
    cachedUserFlashcards = cards;
  } catch (err) {
    console.warn('Silent preload flashcards warning:', err);
  }

  // 2. Fetch user's practice questions from learning_data
  try {
    const q = fsQuery(collection(db, 'learning_data'), where('uid', '==', userId), limit(30));
    const snap = await getDocs(q);
    const userQs: CurriculumQuestion[] = [];
    snap.forEach((docSnap) => {
      const data = docSnap.data() as any;
      if (data.answeredQuestions && Array.isArray(data.answeredQuestions)) {
        data.answeredQuestions.forEach((aq: any, idx: number) => {
          if (aq.text || aq.question) {
            userQs.push({
              id: `user-q-${docSnap.id}-${idx}`,
              subject: data.subject || 'General',
              subjectId: data.subjectId || 'mathematics',
              topic: data.topic || data.subject || 'General',
              question: aq.text || aq.question,
              options: aq.options || [],
              correctAnswer: aq.correctAnswer ?? 0,
              explanation: aq.explanation || ''
            });
          }
        });
      }
    });
    cachedUserQuestions = userQs;
  } catch (err) {
    console.warn('Silent preload questions warning:', err);
  }
}

/**
 * Perform instant search across Subjects, Topics, Flashcards, and Practice Questions
 */
export function searchZetaduSync(searchTerm: string, activeFilter: SearchCategory = 'all'): {
  results: SearchResultItem[];
  counts: {
    all: number;
    subject: number;
    topic: number;
    flashcard: number;
    question: number;
  };
} {
  const clean = searchTerm.trim().toLowerCase();
  const counts = { all: 0, subject: 0, topic: 0, flashcard: 0, question: 0 };

  if (!clean || clean.length < 1) {
    return { results: [], counts };
  }

  const results: SearchResultItem[] = [];

  // Helper scoring
  const calculateScore = (targetText: string, search: string): number => {
    const norm = targetText.toLowerCase();
    if (norm === search) return 100;
    if (norm.startsWith(search)) return 80;
    const wordBoundaryMatch = new RegExp(`\\b${search}`, 'i').test(norm);
    if (wordBoundaryMatch) return 60;
    if (norm.includes(search)) return 40;
    return 0;
  };

  // 1. Search Subjects
  ALL_SUBJECTS.forEach((subj) => {
    const nameScore = calculateScore(subj.name, clean);
    const catScore = calculateScore(subj.category, clean);
    const maxScore = Math.max(nameScore, catScore > 0 ? catScore - 10 : 0);

    if (maxScore > 0) {
      counts.subject++;
      counts.all++;
      if (activeFilter === 'all' || activeFilter === 'subject') {
        results.push({
          id: `subj-${subj.id}`,
          type: 'subject',
          title: subj.name,
          subtitle: `Subject • Category: ${subj.category}`,
          badge: 'Subject',
          subject: subj.name,
          subjectId: subj.id,
          score: maxScore + 10 // Subjects get a slight relevance boost
        });
      }
    }
  });

  // 2. Search Topics
  Object.entries(SYLLABUS_TOPICS).forEach(([subjKey, topicsList]) => {
    const parentSubj = ALL_SUBJECTS.find((s) => s.id === subjKey);
    const subjName = parentSubj ? parentSubj.name : subjKey.toUpperCase();

    topicsList.forEach((topicName, idx) => {
      const topicScore = calculateScore(topicName, clean);
      const subjMatchScore = calculateScore(subjName, clean);
      const combinedScore = Math.max(topicScore, subjMatchScore > 0 ? 30 : 0);

      if (combinedScore > 0) {
        counts.topic++;
        counts.all++;
        if (activeFilter === 'all' || activeFilter === 'topic') {
          results.push({
            id: `topic-${subjKey}-${idx}`,
            type: 'topic',
            title: topicName,
            subtitle: `Topic in ${subjName}`,
            badge: 'Topic',
            subject: subjName,
            subjectId: subjKey,
            topic: topicName,
            score: combinedScore
          });
        }
      }
    });
  });

  // 3. Search Flashcards (cached user flashcards + sample flashcards)
  // Ensure we also include default flashcards if user hasn't made any yet
  const allFlashcards: Flashcard[] = [...cachedUserFlashcards];
  if (allFlashcards.length === 0) {
    allFlashcards.push(
      {
        id: 'fc-def-1',
        uid: 'sample',
        subject: 'Mathematics',
        topic: 'Quadratic Equations',
        front: 'Quadratic Formula standard form',
        back: 'x = (-b ± √(b² - 4ac)) / (2a)',
        explanation: 'Used to find the roots of ax² + bx + c = 0.'
      },
      {
        id: 'fc-def-2',
        uid: 'sample',
        subject: 'Physics',
        topic: 'Newton\'s Laws',
        front: 'Newton\'s First Law of Motion',
        back: 'An object remains at rest or in uniform motion unless acted upon by a net external force.',
        explanation: 'Also known as the Law of Inertia.'
      },
      {
        id: 'fc-def-3',
        uid: 'sample',
        subject: 'Biology',
        topic: 'Photosynthesis',
        front: 'Chemical equation for photosynthesis',
        back: '6CO₂ + 6H₂O + Light → C₆H₁₂O₆ + 6O₂',
        explanation: 'Occurs in the chloroplasts of plant cells.'
      },
      {
        id: 'fc-def-4',
        uid: 'sample',
        subject: 'Chemistry',
        topic: 'Acids, Bases & Salts',
        front: 'Definition of an Arrhenius Acid',
        back: 'A substance that produces hydrogen ions (H⁺) when dissolved in water.',
        explanation: 'Contrasted with Arrhenius bases which produce OH⁻ ions.'
      },
      {
        id: 'fc-def-5',
        uid: 'sample',
        subject: 'English Language',
        topic: 'Concord',
        front: 'Concord rule for "either...or"',
        back: 'The verb agrees with the closer subject to the verb (proximity rule).',
        explanation: 'Example: Either the boy or his friends are coming.'
      }
    );
  }

  allFlashcards.forEach((card) => {
    const frontScore = calculateScore(card.front, clean);
    const backScore = calculateScore(card.back, clean);
    const topicScore = calculateScore(card.topic, clean);
    const subjScore = calculateScore(card.subject, clean);
    const maxScore = Math.max(frontScore, backScore, topicScore > 0 ? 35 : 0, subjScore > 0 ? 25 : 0);

    if (maxScore > 0) {
      counts.flashcard++;
      counts.all++;
      if (activeFilter === 'all' || activeFilter === 'flashcard') {
        const previewBack = card.back.length > 70 ? card.back.substring(0, 67) + '...' : card.back;
        results.push({
          id: `card-${card.id}`,
          type: 'flashcard',
          title: card.front,
          subtitle: `${card.subject} • ${card.topic} — ${previewBack}`,
          badge: 'Flashcard',
          subject: card.subject,
          topic: card.topic,
          details: card,
          score: maxScore
        });
      }
    }
  });

  // 4. Search Practice Questions (Curriculum Questions + User Answered Questions)
  const combinedQuestions: CurriculumQuestion[] = [
    ...CURRICULUM_QUESTIONS,
    ...cachedUserQuestions
  ];

  // Deduplicate questions by text
  const seenQuestions = new Set<string>();
  const uniqueQuestions: CurriculumQuestion[] = [];
  combinedQuestions.forEach((q) => {
    const qKey = (q.question || '').toLowerCase().trim();
    if (!seenQuestions.has(qKey)) {
      seenQuestions.add(qKey);
      uniqueQuestions.push(q);
    }
  });

  uniqueQuestions.forEach((q) => {
    const qScore = calculateScore(q.question, clean);
    const topicScore = calculateScore(q.topic, clean);
    const subjScore = calculateScore(q.subject, clean);
    const explScore = q.explanation ? calculateScore(q.explanation, clean) * 0.8 : 0;
    const maxScore = Math.max(qScore, topicScore > 0 ? 40 : 0, subjScore > 0 ? 25 : 0, explScore);

    if (maxScore > 0) {
      counts.question++;
      counts.all++;
      if (activeFilter === 'all' || activeFilter === 'question') {
        results.push({
          id: `q-${q.id}`,
          type: 'question',
          title: q.question,
          subtitle: `${q.subject} • ${q.topic}`,
          badge: 'Practice Question',
          subject: q.subject,
          subjectId: q.subjectId,
          topic: q.topic,
          explanation: q.explanation,
          details: q,
          score: maxScore
        });
      }
    }
  });

  // 5. Special Feature & Tool Actions (e.g. Upload Notes, School Updates)
  const schoolTerms = ['school', 'university', 'unilag', 'post-utme', 'post utme', 'utme', 'admission', 'cut-off', 'admissions', 'ui', 'oau', 'uniben', 'futa', 'abu', 'unn', 'deadline', 'caps'];
  const isSchoolMatch = schoolTerms.some(term => clean.includes(term) || term.includes(clean));
  if (isSchoolMatch && (activeFilter === 'all')) {
    counts.all++;
    results.unshift({
      id: 'action-school-updates',
      type: 'action',
      title: 'School Updates & Post-UTME Tracker',
      subtitle: 'Track admissions, Post-UTME screening, cut-off marks, and deadlines for your schools',
      badge: 'Feature',
      score: 125
    });
  }

  const uploadActionTerms = ['upload', 'notes', 'study notes', 'summarize', 'summary', 'explain', 'flashcard generator', 'note'];
  const isUploadMatch = uploadActionTerms.some(term => clean.includes(term) || term.includes(clean));
  if (isUploadMatch && (activeFilter === 'all')) {
    counts.all++;
    results.unshift({
      id: 'action-upload-notes',
      type: 'action',
      title: 'Upload Notes & AI Study Studio',
      subtitle: 'Summarize, explain, make flashcards & quizzes from your study notes',
      badge: 'Feature',
      score: 120
    });
  }

  // Sort results by score descending
  results.sort((a, b) => b.score - a.score);

  // Return top 25 results to keep interface nimble and instant
  return {
    results: results.slice(0, 25),
    counts
  };
}
