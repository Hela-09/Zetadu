import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  collection, query, where, getDocs, doc, setDoc, addDoc, updateDoc, deleteDoc, increment, writeBatch 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { 
  Layers, Plus, Sparkles, Bookmark, ArrowLeft, 
  RotateCcw, CheckCircle, AlertCircle, Play, Edit3, Trash2, Check
} from 'lucide-react';
import { Flashcard, FlashcardDeck } from '../types';
import FlashcardStudyScreen from './flashcards/FlashcardStudyScreen';
import FlashcardDeckList from './flashcards/FlashcardDeckList';

// Helper to normalize any Firestore timestamp representation (number, Timestamp, Date string)
const normalizeTimestamp = (val: any): number | undefined => {
  if (val === null || val === undefined) return undefined;
  if (typeof val === 'number') return val;
  if (typeof val === 'string') {
    const num = Number(val);
    if (!isNaN(num)) return num;
    const parsed = Date.parse(val);
    if (!isNaN(parsed)) return parsed;
  }
  if (typeof val === 'object') {
    if (typeof val.toMillis === 'function') return val.toMillis();
    if (typeof val.toDate === 'function') return val.toDate().getTime();
    if (typeof val.seconds === 'number') {
      return val.seconds * 1000 + (val.nanoseconds ? Math.floor(val.nanoseconds / 1000000) : 0);
    }
    if (typeof val._seconds === 'number') return val._seconds * 1000;
  }
  return undefined;
};

export default function Flashcards({ setView }: { setView?: (v: any) => void }) {
  const { user, getToken } = useAuth();
  const [mode, setMode] = useState<'dashboard' | 'create' | 'study' | 'generate' | 'post_generate'>('dashboard');

  const navigateToMode = (newMode: 'dashboard' | 'create' | 'study' | 'generate' | 'post_generate') => {
    setMode(newMode);
  };

  const exitToDashboard = () => {
    setMode('dashboard');
    setActiveDeck(null);
    setStudyCards([]);
  };
  
  // Decks & Cards state
  const [allCards, setAllCards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<'decks' | 'all-cards' | 'due-cards' | 'bookmarked-cards'>('decks');
  const [activeFilter, setActiveFilter] = useState<'all' | 'due' | 'bookmarked'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Derived structured decks from allCards with real-time recalculation
  const decks: FlashcardDeck[] = useMemo(() => {
    const deckMap: Record<string, {
      id: string;
      name: string;
      subject: string;
      topic: string;
      cards: Flashcard[];
    }> = {};

    const now = Date.now();

    allCards.forEach(card => {
      const deckName = card.deckName || card.subject || 'General Deck';
      const subject = card.subject || 'General';
      const topic = card.topic || 'General Topics';
      const key = `${deckName}:::${topic}`;

      if (!deckMap[key]) {
        deckMap[key] = {
          id: key,
          name: deckName,
          subject: subject,
          topic: topic,
          cards: []
        };
      }
      deckMap[key].cards.push(card);
    });

    const structuredDecks: FlashcardDeck[] = Object.values(deckMap).map(d => {
      const dueToday = d.cards.filter(c => !c.nextReview || c.nextReview <= now).length;
      const bookmarkedCount = d.cards.filter(c => c.bookmarked === true).length;
      const latestReview = Math.max(...d.cards.map(c => c.lastReviewed || 0), 0);

      return {
        id: d.id,
        name: d.name,
        subject: d.subject,
        topic: d.topic,
        cardCount: d.cards.length,
        dueTodayCount: dueToday,
        bookmarkedCount,
        cards: d.cards,
        lastReviewed: latestReview > 0 ? latestReview : undefined
      };
    });

    structuredDecks.sort((a, b) => {
      if (b.dueTodayCount !== a.dueTodayCount) {
        return b.dueTodayCount - a.dueTodayCount;
      }
      return (b.lastReviewed || 0) - (a.lastReviewed || 0);
    });

    return structuredDecks;
  }, [allCards]);

  // Active study state
  const [activeDeck, setActiveDeck] = useState<FlashcardDeck | null>(null);
  const [studyCards, setStudyCards] = useState<Flashcard[]>([]);
  const [initialStudyCardIndex, setInitialStudyCardIndex] = useState(0);

  // Manual create state
  const [formData, setFormData] = useState({
    subject: '',
    topic: '',
    front: '',
    back: '',
    explanation: '',
    example: '',
    difficulty: 'Medium'
  });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // AI Generate state
  const [generateData, setGenerateData] = useState({
    subject: '',
    topic: '',
    level: 'High School',
    count: 10
  });
  const [generating, setGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  
  // Post-generate state
  const [generatedDeck, setGeneratedDeck] = useState<FlashcardDeck | null>(null);
  const [generatedCards, setGeneratedCards] = useState<Flashcard[]>([]);
  const [isEditingCards, setIsEditingCards] = useState(false);
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({ front: '', back: '', explanation: '' });
  const [savingCardEdit, setSavingCardEdit] = useState(false);
  const [deletingDeck, setDeletingDeck] = useState(false);

  // Fetch all user flashcards and structure them into decks
  const fetchFlashcards = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      // 1. Fetch user cards
      const cardsRef = collection(db, 'flashcards');
      const qCards = query(cardsRef, where('uid', '==', user.uid));
      const cardsSnap = await getDocs(qCards);
      
      const cardsList: Flashcard[] = [];
      cardsSnap.forEach(docSnap => {
        const data = docSnap.data();

        const rawNextReview = data.nextReviewDate ?? data.nextReview ?? data.next_review ?? data.next_review_date;
        const nextReview = normalizeTimestamp(rawNextReview);

        const rawLastReviewed = data.lastReviewedDate ?? data.lastReviewed ?? data.last_reviewed ?? data.last_reviewed_date ?? data.reviewedAt;
        const lastReviewed = normalizeTimestamp(rawLastReviewed);

        const rawCreatedAt = data.createdAt ?? data.created_at ?? data.createdDate ?? data.timestamp;
        const createdAt = normalizeTimestamp(rawCreatedAt) || Date.now();

        const isBookmarked = Boolean(
          data.bookmarked === true || 
          data.isBookmarked === true || 
          data.bookmarked === 'true' || 
          data.is_bookmarked === true
        );

        cardsList.push({
          id: docSnap.id,
          uid: data.uid || user.uid,
          subject: data.subject || 'General',
          topic: data.topic || 'General Topics',
          deckName: data.deckName || data.subject || 'General Deck',
          deckId: data.deckId,
          front: data.front || '',
          back: data.back || '',
          explanation: data.explanation || '',
          example: data.example || '',
          difficulty: data.difficulty || 'Medium',
          rating: data.rating,
          reviews: typeof data.reviews === 'number' ? data.reviews : 0,
          lastReviewed,
          nextReview,
          bookmarked: isBookmarked,
          createdAt
        });
      });

      setAllCards(cardsList);

      // Fetch decks from flashcard_decks if any exist
      try {
        const decksRef = collection(db, 'flashcard_decks');
        const qDecks = query(decksRef, where('uid', '==', user.uid));
        await getDocs(qDecks);
      } catch (err) {
        console.warn("Could not query flashcard_decks collection:", err);
      }
    } catch (err) {
      console.error("Failed to load flashcard decks:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (mode === 'dashboard') {
      fetchFlashcards();
    }
  }, [mode, fetchFlashcards]);

  // Handle draft flashcard saved by Quiz or Mistake converter
  useEffect(() => {
    const draft = localStorage.getItem('zetadu_draft_flashcard');
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        setFormData(prev => ({
          ...prev,
          subject: parsed.subject || '',
          topic: parsed.topic || '',
          front: parsed.front || '',
          back: parsed.back || '',
          explanation: parsed.explanation || '',
          example: parsed.example || '',
          difficulty: 'Medium'
        }));
        setMode('create');
      } catch (e) {
        console.error("Failed to parse draft flashcard", e);
      }
      localStorage.removeItem('zetadu_draft_flashcard');
    }
  }, []);

  // Handle auto-focus from Weak Topics
  useEffect(() => {
    const targetTopic = localStorage.getItem('zetadu_flashcard_topic');
    const targetSubject = localStorage.getItem('zetadu_target_subject') || '';
    if (!targetTopic || loading) return;

    localStorage.removeItem('zetadu_flashcard_topic');
    const norm = targetTopic.trim().toLowerCase();
    const matchedDeck = decks.find(
      (d) =>
        d.topic.toLowerCase().includes(norm) ||
        norm.includes(d.topic.toLowerCase()) ||
        d.name.toLowerCase().includes(norm)
    );

    if (matchedDeck && matchedDeck.cards.length > 0) {
      handleSelectDeck(matchedDeck);
    } else {
      setGenerateData((prev) => ({
        ...prev,
        topic: targetTopic,
        subject: targetSubject || prev.subject || 'General',
        count: 10
      }));
      setMode('generate');
    }
  }, [decks, loading]);

  // START STUDYING A DECK
  const handleSelectDeck = (deck: FlashcardDeck, filterMode: 'all' | 'due' | 'bookmarked' = 'all') => {
    let cardsToStudy = [...deck.cards];
    const now = Date.now();

    if (filterMode === 'due') {
      const dueCards = deck.cards.filter(c => !c.nextReview || c.nextReview <= now);
      if (dueCards.length > 0) {
        cardsToStudy = dueCards;
      }
    } else if (filterMode === 'bookmarked') {
      const bookmarked = deck.cards.filter(c => c.bookmarked === true);
      if (bookmarked.length > 0) {
        cardsToStudy = bookmarked;
      }
    }

    if (cardsToStudy.length === 0) {
      cardsToStudy = [...deck.cards];
    }

    setActiveDeck(deck);
    setStudyCards(cardsToStudy);
    
    // Jump to specific card if searched
    const targetCardId = localStorage.getItem('zetadu_flashcard_card_id');
    if (targetCardId) {
      localStorage.removeItem('zetadu_flashcard_card_id');
      const foundIdx = cardsToStudy.findIndex(c => c.id === targetCardId);
      if (foundIdx !== -1) {
        setInitialStudyCardIndex(foundIdx);
      } else {
        setInitialStudyCardIndex(0);
      }
    } else {
      setInitialStudyCardIndex(0);
    }

    navigateToMode('study');
  };

  // STUDY CUSTOM LIST OF CARDS (e.g. from Due Today or Bookmarked cards views)
  const handleStudyCustomCards = (cards: Flashcard[], customTitle: string) => {
    if (cards.length === 0) return;
    const now = Date.now();
    const customDeck: FlashcardDeck = {
      id: `custom-${now}`,
      name: customTitle,
      subject: cards[0]?.subject || 'Flashcards',
      topic: customTitle,
      cardCount: cards.length,
      dueTodayCount: cards.filter(c => !c.nextReview || c.nextReview <= now).length,
      bookmarkedCount: cards.filter(c => c.bookmarked === true).length,
      cards: cards
    };
    setActiveDeck(customDeck);
    setStudyCards(cards);
    navigateToMode('study');
  };

  // RATE A CARD
  const handleRateCard = async (cardId: string, rating: 'Again' | 'Hard' | 'Good' | 'Easy') => {
    const now = Date.now();
    let nextReview = now;

    // Spaced repetition intervals
    if (rating === 'Again') {
      nextReview = now + 60 * 1000; // 1 minute
    } else if (rating === 'Hard') {
      nextReview = now + 10 * 60 * 1000; // 10 minutes
    } else if (rating === 'Good') {
      nextReview = now + 24 * 60 * 60 * 1000; // 1 day
    } else if (rating === 'Easy') {
      nextReview = now + 4 * 24 * 60 * 60 * 1000; // 4 days
    }

    try {
      if (user) {
        const todayStr = new Date().toISOString().split('T')[0];
        const localKey = `zetadu_today_flashcards_${user.uid}_${todayStr}`;
        const curr = parseInt(localStorage.getItem(localKey) || '0', 10);
        localStorage.setItem(localKey, String(curr + 1));
      }

      const cardRef = doc(db, 'flashcards', cardId);
      await updateDoc(cardRef, {
        rating: rating,
        reviews: increment(1),
        lastReviewed: now,
        nextReview: nextReview
      });

      // Update in-memory allCards state
      setAllCards(prev => prev.map(c => {
        if (c.id === cardId) {
          return {
            ...c,
            rating,
            reviews: (c.reviews || 0) + 1,
            lastReviewed: now,
            nextReview
          };
        }
        return c;
      }));
    } catch (e) {
      console.error("Failed to save flashcard rating to Firestore:", e);
    }
  };

  // TOGGLE BOOKMARK
  const handleToggleBookmark = async (cardId: string) => {
    const card = allCards.find(c => c.id === cardId);
    if (!card) return;
    const newStatus = !card.bookmarked;

    try {
      const cardRef = doc(db, 'flashcards', cardId);
      await updateDoc(cardRef, {
        bookmarked: newStatus
      });

      // Update in memory
      setAllCards(prev => prev.map(c => c.id === cardId ? { ...c, bookmarked: newStatus } : c));
    } catch (e) {
      console.error("Failed to toggle bookmark in Firestore:", e);
    }
  };

  // EXIT STUDY SESSION
  const handleExitStudy = () => {
    exitToDashboard();
    setActiveDeck(null);
    setStudyCards([]);
  };

  // CREATE MANUAL FLASHCARD
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!formData.subject || !formData.topic || !formData.front || !formData.back) {
      setFormError('Please fill in Subject, Topic, Question, and Answer.');
      return;
    }

    if (!user) {
      setFormError('Please sign in to save flashcards.');
      return;
    }

    setSaving(true);
    try {
      const now = Date.now();
      const cardData = {
        uid: user.uid,
        subject: formData.subject.trim(),
        topic: formData.topic.trim(),
        front: formData.front.trim(),
        back: formData.back.trim(),
        explanation: formData.explanation.trim() || '',
        example: formData.example.trim() || '',
        difficulty: formData.difficulty,
        deckName: formData.subject.trim(),
        createdAt: now,
        lastReviewed: now,
        nextReview: now,
        reviews: 0,
        bookmarked: false
      };

      await addDoc(collection(db, 'flashcards'), cardData);

      // Save/update deck metadata
      try {
        const deckId = `${user.uid}_${formData.subject.trim().replace(/\s+/g, '_').toLowerCase()}`;
        const deckRef = doc(db, 'flashcard_decks', deckId);
        await setDoc(deckRef, {
          uid: user.uid,
          name: formData.subject.trim(),
          updatedAt: now
        }, { merge: true });
      } catch (deckErr) {
        console.warn("Deck metadata sync warning:", deckErr);
      }

      setFormSuccess('Flashcard created successfully!');
      setFormData({
        subject: '',
        topic: '',
        front: '',
        back: '',
        explanation: '',
        example: '',
        difficulty: 'Medium'
      });

      setTimeout(() => {
        setMode('dashboard');
      }, 1200);
    } catch (err: any) {
      setFormError(err.message || 'Failed to save flashcard. Please check permissions.');
    } finally {
      setSaving(false);
    }
  };

  // VALIDATE EVERY SINGLE GENERATED CARD BEFORE SAVING
  const validateFlashcard = (
    card: any, 
    subject: string, 
    topic: string, 
    uid: string
  ): { isValid: boolean; card?: Omit<Flashcard, 'id'> } => {
    if (!card || typeof card !== 'object') {
      return { isValid: false };
    }

    const front = typeof card.front === 'string' ? card.front.trim() : '';
    const back = typeof card.back === 'string' ? card.back.trim() : '';
    const explanation = typeof card.explanation === 'string' ? card.explanation.trim() : '';
    const cleanSubject = typeof subject === 'string' ? subject.trim() : '';
    const cleanTopic = typeof topic === 'string' ? topic.trim() : '';

    // Rigorous validation:
    // Must contain question/front, answer/back, explanation, subject, topic, and user UID
    if (!front || front.length < 2) return { isValid: false };
    if (!back || back.length < 1) return { isValid: false };
    if (!explanation || explanation.length < 2) return { isValid: false };
    if (!cleanSubject || cleanSubject.length < 1) return { isValid: false };
    if (!cleanTopic || cleanTopic.length < 1) return { isValid: false };
    if (!uid) return { isValid: false };

    const now = Date.now();

    return {
      isValid: true,
      card: {
        uid,
        subject: cleanSubject,
        topic: cleanTopic,
        deckName: cleanSubject,
        front,
        back,
        explanation,
        example: typeof card.example === 'string' ? card.example.trim() : '',
        difficulty: 'Medium',
        reviews: 0,
        bookmarked: false,
        createdAt: now,
        lastReviewed: now,
        nextReview: now
      }
    };
  };

  // GENERATE WITH AI & AUTOMATIC SAVE
  const handleGenerateSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    // Prevent duplicate flashcard creation when Generate button is clicked multiple times
    if (generating) return;

    if (!user) {
      setGenerationError("Please sign in to generate flashcards.");
      return;
    }

    const cleanSubject = generateData.subject.trim();
    const cleanTopic = generateData.topic.trim();

    if (!cleanSubject || !cleanTopic) {
      setGenerationError("Please enter both Subject and Topic.");
      return;
    }

    setGenerating(true);
    setGenerationError(null);

    try {
      const token = await getToken();
      const response = await fetch('/api/generate-flashcards-structured', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          subject: cleanSubject,
          topic: cleanTopic,
          level: generateData.level,
          count: generateData.count
        })
      });

      if (!response.ok) {
        throw new Error(`AI generation failed with status ${response.status}`);
      }

      const data = await response.json();
      
      // Check for valid response structure
      if (!data || !Array.isArray(data.flashcards) || data.flashcards.length === 0) {
        throw new Error("No flashcards returned from AI generator. Please try again.");
      }

      // Validate every generated flashcard before saving
      // Do not automatically save incomplete or failed AI responses
      const validatedCardsToSave: Omit<Flashcard, 'id'>[] = [];
      for (const rawCard of data.flashcards) {
        const validation = validateFlashcard(rawCard, cleanSubject, cleanTopic, user.uid);
        if (validation.isValid && validation.card) {
          validatedCardsToSave.push(validation.card);
        }
      }

      if (validatedCardsToSave.length === 0) {
        throw new Error("Generated flashcard responses did not pass complete validation. No incomplete cards were saved.");
      }

      // AUTOMATIC SAVE:
      // Save all validated cards to the logged-in user's Firebase account using writeBatch for high speed and reliability
      const batch = writeBatch(db);
      const savedCards: Flashcard[] = [];
      for (const cardData of validatedCardsToSave) {
        const cardRef = doc(collection(db, 'flashcards'));
        batch.set(cardRef, cardData);
        savedCards.push({
          ...cardData,
          id: cardRef.id
        });
      }
      await batch.commit();

      // Save/update deck metadata in Firebase
      try {
        const deckId = `${user.uid}_${cleanSubject.replace(/\s+/g, '_').toLowerCase()}`;
        const deckRef = doc(db, 'flashcard_decks', deckId);
        await setDoc(deckRef, {
          uid: user.uid,
          name: cleanSubject,
          updatedAt: Date.now()
        }, { merge: true });
      } catch (deckErr) {
        console.warn("Deck metadata sync warning:", deckErr);
      }

      // Automatically construct the study deck object
      const newDeck: FlashcardDeck = {
        id: `${cleanSubject}:::${cleanTopic}`,
        name: cleanSubject,
        subject: cleanSubject,
        topic: cleanTopic,
        cardCount: savedCards.length,
        dueTodayCount: savedCards.length,
        bookmarkedCount: 0,
        cards: savedCards,
        lastReviewed: Date.now()
      };

      // Immediately make the new cards available in memory so they appear in Decks / Flashcards section
      setAllCards(prev => [...prev, ...savedCards]);
      setGeneratedDeck(newDeck);
      setGeneratedCards(savedCards);
      setIsEditingCards(false);
      setEditingCardId(null);
      
      // Move immediately to post-generation display screen
      setMode('post_generate');
    } catch (e: any) {
      console.error("Flashcard generation & save error:", e);
      setGenerationError(e.message || "Failed to generate valid flashcards. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  // EDIT CARD IN POST-GENERATE SCREEN
  const handleStartEditCard = (card: Flashcard) => {
    setEditingCardId(card.id);
    setEditFormData({
      front: card.front,
      back: card.back,
      explanation: card.explanation || ''
    });
  };

  const handleSaveCardEdit = async (cardId: string) => {
    if (!editFormData.front.trim() || !editFormData.back.trim()) {
      alert("Question and Answer cannot be empty.");
      return;
    }

    setSavingCardEdit(true);
    try {
      const cardRef = doc(db, 'flashcards', cardId);
      await updateDoc(cardRef, {
        front: editFormData.front.trim(),
        back: editFormData.back.trim(),
        explanation: editFormData.explanation.trim()
      });

      // Update in generatedCards
      const updatedGenerated = generatedCards.map(c => 
        c.id === cardId 
          ? { ...c, front: editFormData.front.trim(), back: editFormData.back.trim(), explanation: editFormData.explanation.trim() } 
          : c
      );
      setGeneratedCards(updatedGenerated);

      if (generatedDeck) {
        setGeneratedDeck({
          ...generatedDeck,
          cards: updatedGenerated
        });
      }

      // Update in allCards
      setAllCards(prev => prev.map(c => 
        c.id === cardId 
          ? { ...c, front: editFormData.front.trim(), back: editFormData.back.trim(), explanation: editFormData.explanation.trim() } 
          : c
      ));

      setEditingCardId(null);
    } catch (err) {
      console.error("Failed to update card:", err);
      alert("Failed to save changes to card.");
    } finally {
      setSavingCardEdit(false);
    }
  };

  // DELETE DECK IN POST-GENERATE SCREEN
  const handleDeleteGeneratedDeck = async () => {
    if (!user || !generatedDeck || generatedCards.length === 0) return;
    
    const confirmDelete = window.confirm(
      `Are you sure you want to delete this deck and all ${generatedCards.length} generated flashcards?`
    );
    if (!confirmDelete) return;

    setDeletingDeck(true);
    try {
      // Delete each card from Firestore
      for (const card of generatedCards) {
        if (card.id) {
          await deleteDoc(doc(db, 'flashcards', card.id));
        }
      }

      // Remove from memory
      const deletedIds = new Set(generatedCards.map(c => c.id));
      setAllCards(prev => prev.filter(c => !deletedIds.has(c.id)));
      setGeneratedCards([]);
      setGeneratedDeck(null);
      setMode('dashboard');
    } catch (err) {
      console.error("Failed to delete generated deck:", err);
      alert("Failed to delete deck. Please try again.");
    } finally {
      setDeletingDeck(false);
    }
  };

  // 1. STUDY MODE (FOCUSED SESSION)
  if (mode === 'study' && activeDeck && studyCards.length > 0) {
    return (
      <FlashcardStudyScreen
        deckName={activeDeck.name}
        subject={activeDeck.subject}
        topic={activeDeck.topic}
        cards={studyCards}
        initialCardIndex={initialStudyCardIndex}
        onExit={handleExitStudy}
        onRateCard={handleRateCard}
        onToggleBookmark={handleToggleBookmark}
      />
    );
  }

  // 2. GENERATE WITH AI FORM
  if (mode === 'generate') {
    return (
      <div className="w-full max-w-2xl mx-auto pb-28 sm:pb-32 animate-fade-in">
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={exitToDashboard} 
            className="p-2.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 transition-colors shadow-xs cursor-pointer"
            aria-label="Back to decks"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Sparkles className="text-blue-600 dark:text-blue-400" size={24} />
              Generate Flashcards with AI
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Enter any syllabus subject and topic. Flashcards will be generated and automatically saved to your account.
            </p>
          </div>
        </div>

        {generationError && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 rounded-2xl flex items-center gap-3 border border-red-200 dark:border-red-900/50">
            <AlertCircle size={20} className="shrink-0" />
            <p className="font-medium text-sm">{generationError}</p>
          </div>
        )}

        <form onSubmit={handleGenerateSubmit} className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl shadow-xs border border-slate-200/90 dark:border-slate-700/80 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
              Subject *
            </label>
            <input 
              type="text" 
              required 
              disabled={generating}
              value={generateData.subject}
              onChange={e => setGenerateData({ ...generateData, subject: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow disabled:opacity-60"
              placeholder="e.g. Biology, Chemistry, Mathematics"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
              Topic *
            </label>
            <input 
              type="text" 
              required 
              disabled={generating}
              value={generateData.topic}
              onChange={e => setGenerateData({ ...generateData, topic: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow disabled:opacity-60"
              placeholder="e.g. Cell Structure, Periodic Table, Quadratic Equations"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                Education Level
              </label>
              <select 
                disabled={generating}
                value={generateData.level}
                onChange={e => setGenerateData({ ...generateData, level: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-60"
              >
                <option>Secondary / High School</option>
                <option>JAMB / UTME Prep</option>
                <option>WAEC / SSCE</option>
                <option>College / University</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                Number of Cards
              </label>
              <select 
                disabled={generating}
                value={generateData.count}
                onChange={e => setGenerateData({ ...generateData, count: Number(e.target.value) })}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-60"
              >
                <option value={5}>5 Cards</option>
                <option value={10}>10 Cards</option>
                <option value={20}>20 Cards</option>
                <option value={30}>30 Cards</option>
                <option value={50}>50 Cards</option>
                <option value={75}>75 Cards</option>
                <option value={100}>100 Cards</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              disabled={generating}
              onClick={exitToDashboard}
              className="px-6 py-3.5 rounded-xl font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={generating}
              className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-sm hover:shadow-md disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base"
            >
              {generating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Generating & Saving Cards...</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  <span>Generate Flashcards</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // 3. POST-GENERATION DISPLAY SCREEN (IMMEDIATELY DISPLAYED & SAVED)
  if (mode === 'post_generate' && generatedDeck && generatedCards.length > 0) {
    return (
      <div className="w-full max-w-5xl mx-auto pb-28 sm:pb-32 animate-fade-in">
        {/* Header with details & auto-save badge */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={exitToDashboard} 
              className="p-2.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 transition-colors shadow-xs cursor-pointer"
              aria-label="Back to decks"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
                  {generatedDeck.subject}
                </h1>
                <span className="px-2.5 py-0.5 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 rounded-full text-xs font-semibold border border-blue-200 dark:border-blue-800">
                  {generatedDeck.topic}
                </span>
                <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 rounded-full text-xs font-bold border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5 shadow-2xs">
                  <Check size={14} className="stroke-[2.5]" />
                  Saved to Your Decks ({generatedCards.length} cards)
                </span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Cards were validated and saved directly to your account. Ready to study now!
              </p>
            </div>
          </div>

          {/* 4 Action Buttons: Start Studying (MAIN), Edit Cards, Regenerate, Delete Deck */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* 1. START STUDYING (MAIN ACTION) */}
            <button
              onClick={() => {
                setActiveDeck(generatedDeck);
                setStudyCards(generatedCards);
                setMode('study');
              }}
              className="flex items-center gap-2.5 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg text-base cursor-pointer transform active:scale-98"
            >
              <Play size={18} fill="currentColor" />
              <span>Start Studying</span>
            </button>

            {/* 2. EDIT CARDS */}
            <button
              onClick={() => setIsEditingCards(!isEditingCards)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-colors border ${
                isEditingCards
                  ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-800'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <Edit3 size={16} />
              <span>{isEditingCards ? 'Done Editing' : 'Edit Cards'}</span>
            </button>

            {/* 3. REGENERATE */}
            <button
              onClick={() => handleGenerateSubmit()}
              disabled={generating}
              className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl font-semibold text-sm transition-colors disabled:opacity-50"
            >
              <RotateCcw size={16} className={generating ? 'animate-spin' : ''} />
              <span>Regenerate</span>
            </button>

            {/* 4. DELETE DECK */}
            <button
              onClick={handleDeleteGeneratedDeck}
              disabled={deletingDeck}
              className="flex items-center gap-2 px-4 py-3 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/40 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-xl font-semibold text-sm transition-colors disabled:opacity-50"
            >
              <Trash2 size={16} />
              <span>{deletingDeck ? 'Deleting...' : 'Delete Deck'}</span>
            </button>
          </div>
        </div>

        {/* Display all generated flashcards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {generatedCards.map((card, idx) => {
            const isBeingEdited = editingCardId === card.id;

            return (
              <div 
                key={card.id || idx}
                className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col justify-between transition-all hover:border-slate-300 dark:hover:border-slate-600"
              >
                {isBeingEdited ? (
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-700">
                      <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase">
                        Editing Card {idx + 1}
                      </span>
                      <button 
                        onClick={() => setEditingCardId(null)}
                        className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Question</label>
                      <textarea
                        rows={2}
                        value={editFormData.front}
                        onChange={e => setEditFormData({ ...editFormData, front: e.target.value })}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white resize-none focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Answer</label>
                      <textarea
                        rows={2}
                        value={editFormData.back}
                        onChange={e => setEditFormData({ ...editFormData, back: e.target.value })}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white resize-none focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Explanation</label>
                      <textarea
                        rows={2}
                        value={editFormData.explanation}
                        onChange={e => setEditFormData({ ...editFormData, explanation: e.target.value })}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white resize-none focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>

                    <button 
                      onClick={() => handleSaveCardEdit(card.id)}
                      disabled={savingCardEdit}
                      className="w-full py-2 bg-blue-600 text-white rounded-xl font-bold text-xs hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      {savingCardEdit ? (
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Check size={14} />
                      )}
                      Save Card Changes
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                          Card {idx + 1} of {generatedCards.length}
                        </span>
                        {isEditingCards && (
                          <button
                            onClick={() => handleStartEditCard(card)}
                            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                          >
                            <Edit3 size={12} /> Edit
                          </button>
                        )}
                      </div>

                      <div className="space-y-3">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block mb-0.5">
                            Question
                          </span>
                          <p className="font-bold text-slate-800 dark:text-white text-base leading-snug">
                            {card.front}
                          </p>
                        </div>

                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-0.5">
                            Answer
                          </span>
                          <p className="font-semibold text-slate-700 dark:text-slate-200 text-sm leading-snug">
                            {card.back}
                          </p>
                        </div>
                      </div>
                    </div>

                    {card.explanation && (
                      <div className="pt-3 border-t border-slate-100 dark:border-slate-700/70">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-0.5">
                          Explanation
                        </span>
                        <p className="text-xs text-slate-500 dark:text-slate-400 italic leading-relaxed">
                          {card.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // 4. CREATE FLASHCARD FORM
  if (mode === 'create') {
    return (
      <div className="w-full max-w-2xl mx-auto pb-28 sm:pb-32 animate-fade-in">
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={exitToDashboard} 
            className="p-2.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 transition-colors shadow-xs cursor-pointer"
            aria-label="Back to decks"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
              Create Flashcard
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Add a custom card to your revision decks.
            </p>
          </div>
        </div>

        <form onSubmit={handleCreate} className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl shadow-xs border border-slate-200/90 dark:border-slate-700/80 space-y-6">
          {formError && (
            <div className="p-4 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 rounded-xl flex items-center gap-3 border border-red-200 dark:border-red-900/50">
              <AlertCircle size={20} className="shrink-0" />
              <p className="font-medium text-sm">{formError}</p>
            </div>
          )}
          {formSuccess && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center gap-3 border border-emerald-200 dark:border-emerald-900/50">
              <CheckCircle size={20} className="shrink-0" />
              <p className="font-medium text-sm">{formSuccess}</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                Subject *
              </label>
              <input 
                type="text" 
                required
                value={formData.subject}
                onChange={e => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                placeholder="e.g. Biology"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                Topic *
              </label>
              <input 
                type="text" 
                required
                value={formData.topic}
                onChange={e => setFormData({ ...formData, topic: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                placeholder="e.g. Cell Structure"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
              Question (Front) *
            </label>
            <textarea 
              required
              rows={3}
              value={formData.front}
              onChange={e => setFormData({ ...formData, front: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow resize-none"
              placeholder="e.g. What is the powerhouse of the cell?"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
              Answer (Back) *
            </label>
            <textarea 
              required
              rows={3}
              value={formData.back}
              onChange={e => setFormData({ ...formData, back: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow resize-none"
              placeholder="e.g. Mitochondria"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
              Explanation (Optional)
            </label>
            <textarea 
              rows={2}
              value={formData.explanation}
              onChange={e => setFormData({ ...formData, explanation: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow resize-none"
              placeholder="e.g. Mitochondria generate chemical energy in the form of ATP."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
              Example (Optional)
            </label>
            <textarea 
              rows={2}
              value={formData.example}
              onChange={e => setFormData({ ...formData, example: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow resize-none"
              placeholder="e.g. Muscle cells require abundant mitochondria to sustain continuous contraction."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
              Difficulty
            </label>
            <div className="flex gap-3">
              {['Easy', 'Medium', 'Hard'].map(level => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setFormData({ ...formData, difficulty: level })}
                  className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-sm transition-colors border ${
                    formData.difficulty === level 
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-700/80">
            <button 
              type="button" 
              onClick={exitToDashboard}
              className="px-6 py-3 rounded-xl font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={saving}
              className="px-8 py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2 shadow-sm"
            >
              {saving ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <CheckCircle size={18} />
              )}
              Save Flashcard
            </button>
          </div>
        </form>
      </div>
    );
  }

  // 5. DEFAULT DASHBOARD / DECK LIST
  if (loading) {
    return (
      <div className="w-full min-h-[400px] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const totalCardsCount = allCards.length;
  const now = Date.now();
  const totalDueCount = allCards.filter(c => !c.nextReview || c.nextReview <= now).length;
  const totalBookmarkedCount = allCards.filter(c => c.bookmarked === true).length;

  return (
    <FlashcardDeckList
      decks={decks}
      allCards={allCards}
      totalCardsCount={totalCardsCount}
      totalDueCount={totalDueCount}
      totalBookmarkedCount={totalBookmarkedCount}
      activeView={activeView}
      onViewChange={setActiveView}
      activeFilter={activeFilter}
      onFilterChange={setActiveFilter}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      onSelectDeck={handleSelectDeck}
      onToggleBookmark={handleToggleBookmark}
      onStudyCards={handleStudyCustomCards}
      onCreateCard={() => navigateToMode('create')}
      onGenerateAI={() => {
        setGenerationError(null);
        navigateToMode('generate');
      }}
    />
  );
}
