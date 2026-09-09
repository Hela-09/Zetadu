import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Layers,
  PenTool,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  MessageSquare,
  Sparkles,
  Award,
  Clock,
  ChevronRight,
  RefreshCw,
  Plus,
  Zap,
  BookmarkPlus,
  Play,
  FileCheck,
  Search
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { ViewType, Flashcard, StudyJourneyState, StudyJourneyQuestion, StudyJourneyLearnData } from '../types';
import { ALL_SUBJECTS } from '../data/subjects';
import { EDUCATION_LEVELS, EXAM_TYPES_BY_LEVEL, SYLLABUS_TOPICS } from '../data/journeyTopics';
import {
  saveStudyJourney,
  loadStudyJourney,
  clearStudyJourney,
  calculateTopicMastery,
  convertMistakesToFlashcards
} from '../lib/studyJourneyService';
import { generateTopicFlashcards, generateTopicQuestions } from '../utils/studyJourneyContent';
import FlashcardStudyScreen from './flashcards/FlashcardStudyScreen';
import { collection, getDocs, query, where, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface StudyJourneyProps {
  setView: (view: ViewType) => void;
}

export default function StudyJourney({ setView }: StudyJourneyProps) {
  const { user } = useAuth();

  // Selection Phase States
  const [selectedLevel, setSelectedLevel] = useState<string>('Secondary');
  const [selectedExam, setSelectedExam] = useState<string>('WAEC / WASSCE');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('mathematics');
  const [subjectSearchQuery, setSubjectSearchQuery] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<string>('Quadratic Equations & Functions');
  const [customTopicInput, setCustomTopicInput] = useState<string>('');
  const [isCustomTopic, setIsCustomTopic] = useState<boolean>(false);
  const [flashcardCount, setFlashcardCount] = useState<number>(10);
  const [practiceCount, setPracticeCount] = useState<number>(10);

  // Active Journey State
  const [journey, setJourney] = useState<StudyJourneyState | null>(null);
  const [hasSavedJourneyPrompt, setHasSavedJourneyPrompt] = useState<boolean>(false);
  const [savedJourneyCandidate, setSavedJourneyCandidate] = useState<StudyJourneyState | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Step 2: Flashcards
  const [journeyFlashcards, setJourneyFlashcards] = useState<Flashcard[]>([]);

  // Step 3 & Step 5: Practice & Retest State
  const [practiceQuestions, setPracticeQuestions] = useState<StudyJourneyQuestion[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [practiceTimeRemaining, setPracticeTimeRemaining] = useState<number>(600); // 10 minutes
  const [isPracticeSubmitted, setIsPracticeSubmitted] = useState<boolean>(false);

  // Step 4: Mistakes Review State
  const [mistakeFilter, setMistakeFilter] = useState<'all' | 'mistakes_only'>('mistakes_only');
  const [convertedMistakesToast, setConvertedMistakesToast] = useState<string | null>(null);

  // Step 5: Retest State
  const [retestQuestions, setRetestQuestions] = useState<StudyJourneyQuestion[]>([]);
  const [currentRetestIdx, setCurrentRetestIdx] = useState<number>(0);
  const [selectedRetestAnswers, setSelectedRetestAnswers] = useState<Record<number, number>>({});
  const [retestTimeRemaining, setRetestTimeRemaining] = useState<number>(300); // 5 minutes

  // Available subjects filtered by curriculum and search query
  const availableSubjects = useMemo(() => {
    let list = ALL_SUBJECTS;
    if (selectedLevel === 'Primary') {
      const primaryIds = [
        'mathematics', 'english', 'basic-science', 'basic-technology', 'social-studies',
        'civic', 'computer', 'phe', 'crs', 'irs', 'cca', 'agric', 'home-economics'
      ];
      list = ALL_SUBJECTS.filter((s) => primaryIds.includes(s.id));
    } else if (selectedLevel === 'Secondary' && (selectedExam.includes('Junior') || selectedExam.includes('BECE'))) {
      const jssIds = [
        'mathematics', 'english', 'basic-science', 'basic-technology', 'social-studies',
        'civic', 'computer', 'phe', 'crs', 'irs', 'cca', 'agric', 'home-economics',
        'business-studies', 'french', 'yoruba', 'igbo', 'hausa'
      ];
      list = ALL_SUBJECTS.filter((s) => jssIds.includes(s.id));
    }
    if (subjectSearchQuery.trim()) {
      const q = subjectSearchQuery.trim().toLowerCase();
      list = list.filter((s) => s.name.toLowerCase().includes(q));
    }
    return list;
  }, [selectedLevel, selectedExam, subjectSearchQuery]);

  // Load existing journey on mount
  useEffect(() => {
    async function checkExistingJourney() {
      if (!user) {
        setIsLoading(false);
        return;
      }
      try {
        const saved = await loadStudyJourney(user.uid);
        if (saved && saved.status === 'in_progress') {
          setSavedJourneyCandidate(saved);
          setHasSavedJourneyPrompt(true);
          if (saved.flashcardTargetCount) {
            setFlashcardCount(saved.flashcardTargetCount);
          }
          if (saved.practiceTargetCount) {
            setPracticeCount(saved.practiceTargetCount);
          }
        }
      } catch (e) {
        console.warn('Error loading journey:', e);
      } finally {
        setIsLoading(false);
      }
    }
    checkExistingJourney();

    // Check pre-selected subject from Subjects library
    const preselected = localStorage.getItem('zetadu_journey_preselect_subject');
    if (preselected) {
      localStorage.removeItem('zetadu_journey_preselect_subject');
      const found = ALL_SUBJECTS.find(s => s.name.toLowerCase() === preselected.toLowerCase() || s.id === preselected.toLowerCase());
      if (found) {
        setSelectedSubjectId(found.id);
      }
    }
  }, [user]);

  // Sync exam types when education level changes
  useEffect(() => {
    const availableExams = EXAM_TYPES_BY_LEVEL[selectedLevel] || [];
    if (availableExams.length > 0 && !availableExams.includes(selectedExam)) {
      setSelectedExam(availableExams[0]);
    }
  }, [selectedLevel]);

  // Keep selected subject valid when level/exam changes
  useEffect(() => {
    if (!subjectSearchQuery.trim() && availableSubjects.length > 0) {
      const exists = availableSubjects.some((s) => s.id === selectedSubjectId);
      if (!exists) {
        setSelectedSubjectId(availableSubjects[0].id);
      }
    }
  }, [selectedLevel, selectedExam, availableSubjects, selectedSubjectId, subjectSearchQuery]);

  // Sync default topic when subject changes
  useEffect(() => {
    const topics = SYLLABUS_TOPICS[selectedSubjectId] || [];
    if (topics.length > 0 && !isCustomTopic) {
      setSelectedTopic(topics[0]);
    }
  }, [selectedSubjectId]);

  // Practice Timer
  useEffect(() => {
    if (!journey) return;
    let interval: any = null;

    if (journey.step === 3 && !isPracticeSubmitted && practiceQuestions.length > 0) {
      interval = setInterval(() => {
        setPracticeTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else if (journey.step === 5 && retestQuestions.length > 0) {
      interval = setInterval(() => {
        setRetestTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [journey?.step, isPracticeSubmitted, practiceQuestions.length, retestQuestions.length]);

  // Start a fresh Study Journey
  const handleStartJourney = async () => {
    if (!user) return;
    const finalTopic = isCustomTopic && customTopicInput.trim() ? customTopicInput.trim() : selectedTopic;
    const subjectObj = ALL_SUBJECTS.find((s) => s.id === selectedSubjectId) || ALL_SUBJECTS[0];

    setIsGenerating(true);

    try {
      // Step 1: Request or generate learn data
      let token = '';
      try {
        token = await user.getIdToken();
      } catch (err) {}

      let learnData: StudyJourneyLearnData = {
        mainConcept: `Foundational overview of ${finalTopic} within ${subjectObj.name}. This unit emphasizes the core principles, standard definitions, and essential analytical tools required for ${selectedExam}.`,
        importantPoints: [
          `Key principle: Understanding the structural relationship between core concepts in ${finalTopic}.`,
          `Essential rule: Applying standard formulas, conditions, and logical axioms.`,
          `Common misconception: Differentiating between closely related terms and boundary conditions.`,
          `Exam strategy: Highlighting step-by-step working and precision in final derivations.`
        ],
        keyExamples: [
          `Worked Example 1: Direct application of the foundational formula to solve standard exam problems.`,
          `Worked Example 2: Real-world analytical scenario demonstrating why this concept operates as modeled.`
        ]
      };

      try {
        const res = await fetch('/api/learn-topic', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify({
            subject: subjectObj.name,
            topic: finalTopic,
            educationLevel: selectedLevel,
            examType: selectedExam
          })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.learnData) {
            learnData = data.learnData;
          }
        }
      } catch (err) {
        console.warn('Learn topic endpoint error, using curated guide:', err);
      }

      const initialJourney: StudyJourneyState = {
        id: `journey_${Date.now()}`,
        uid: user.uid,
        educationLevel: selectedLevel,
        examType: selectedExam,
        subject: subjectObj.name,
        subjectId: subjectObj.id,
        topic: finalTopic,
        step: 1,
        learnData,
        flashcardTargetCount: flashcardCount,
        practiceTargetCount: practiceCount,
        flashcardsStudied: 0,
        flashcardsTotal: flashcardCount,
        status: 'in_progress',
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      setJourney(initialJourney);
      await saveStudyJourney(user.uid, initialJourney);
    } catch (e) {
      console.error('Failed to start journey:', e);
    } finally {
      setIsGenerating(false);
    }
  };

  // Resume existing journey
  const handleResumeSavedJourney = () => {
    if (savedJourneyCandidate) {
      setJourney(savedJourneyCandidate);
      setHasSavedJourneyPrompt(false);
      if (savedJourneyCandidate.flashcardTargetCount) {
        setFlashcardCount(savedJourneyCandidate.flashcardTargetCount);
      }
      if (savedJourneyCandidate.practiceTargetCount) {
        setPracticeCount(savedJourneyCandidate.practiceTargetCount);
      }

      // Hydrate state if step was practice or retest
      if (savedJourneyCandidate.step === 3 && savedJourneyCandidate.practiceResults?.questions) {
        setPracticeQuestions(savedJourneyCandidate.practiceResults.questions);
      } else if (savedJourneyCandidate.step === 5 && savedJourneyCandidate.retestResults?.questions) {
        setRetestQuestions(savedJourneyCandidate.retestResults.questions);
      }
    }
  };

  // Discard saved journey and start fresh
  const handleStartOver = async () => {
    if (user) {
      await clearStudyJourney(user.uid);
    }
    setJourney(null);
    setSavedJourneyCandidate(null);
    setHasSavedJourneyPrompt(false);
  };

  // Transition between steps and auto-save
  const advanceToStep = async (nextStep: 1 | 2 | 3 | 4 | 5 | 6, patch: Partial<StudyJourneyState> = {}) => {
    if (!journey || !user) return;

    const updated: StudyJourneyState = {
      ...journey,
      ...patch,
      step: nextStep,
      updatedAt: Date.now()
    };

    setJourney(updated);
    await saveStudyJourney(user.uid, updated);
  };

  // -------------------------------------------------------------
  // STEP 2: FLASHCARDS LOADING & FLOW
  // -------------------------------------------------------------
  const handleContinueToFlashcards = async () => {
    if (!journey || !user) return;
    setIsGenerating(true);

    try {
      const targetCardCount = journey.flashcardTargetCount || flashcardCount || 10;

      // 1. Check if user already has flashcards for this subject/topic
      let cards: Flashcard[] = [];
      try {
        const snap = await getDocs(
          query(
            collection(db, 'flashcards'),
            where('uid', '==', user.uid),
            where('subject', '==', journey.subject)
          )
        );
        snap.forEach((doc) => {
          const d = doc.data() as any;
          if (!journey.topic || d.topic?.toLowerCase() === journey.topic.toLowerCase() || d.topic === journey.subject) {
            cards.push({ id: doc.id, ...d });
          }
        });
      } catch (err) {
        console.warn('Error fetching existing flashcards:', err);
      }

      // 2. If fewer than targetCardCount exist, generate structured cards for this topic
      if (cards.length < targetCardCount) {
        let token = '';
        try {
          token = await user.getIdToken();
        } catch (e) {}

        try {
          const genRes = await fetch('/api/generate-flashcards-structured', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
            body: JSON.stringify({
              subject: journey.subject,
              topic: journey.topic,
              level: journey.educationLevel,
              count: targetCardCount
            })
          });

          if (genRes.ok) {
            const data = await genRes.json();
            if (data.flashcards && Array.isArray(data.flashcards)) {
              for (const fc of data.flashcards) {
                const newCard: Flashcard = {
                  id: `gen_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
                  uid: user.uid,
                  subject: journey.subject,
                  topic: journey.topic,
                  deckName: `${journey.subject}: ${journey.topic}`,
                  front: fc.front || 'Key Concept',
                  back: fc.back || 'Definition and analysis',
                  explanation: fc.explanation,
                  difficulty: 'Medium',
                  rating: 'Good',
                  reviews: 0,
                  lastReviewed: Date.now(),
                  nextReview: Date.now() + 86400000,
                  bookmarked: false,
                  createdAt: Date.now()
                };
                cards.push(newCard);
                // Save to Firestore asynchronously
                try {
                  await addDoc(collection(db, 'flashcards'), newCard);
                } catch (e) {}
              }
            }
          }
        } catch (e) {
          console.warn('AI card generation failed, using curated default cards:', e);
        }
      }

      // 3. If still fewer than targetCardCount, supplement with high-yield syllabus cards
      if (cards.length < targetCardCount) {
        cards = generateTopicFlashcards(
          journey.subject,
          journey.topic,
          journey.educationLevel,
          targetCardCount,
          cards,
          user.uid
        );
      }

      cards = cards.slice(0, targetCardCount);

      setJourneyFlashcards(cards);
      await advanceToStep(2, {
        flashcardsTotal: targetCardCount,
        flashcardsStudied: 0
      });
    } catch (err) {
      console.error('Failed to transition to flashcards:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Step 2 Rate card handler
  const handleRateFlashcard = async (cardId: string, rating: 'Again' | 'Hard' | 'Good' | 'Easy') => {
    if (!journey || !user) return;
    const newStudiedCount = Math.min(journey.flashcardsTotal || journeyFlashcards.length, (journey.flashcardsStudied || 0) + 1);
    const updated = {
      ...journey,
      flashcardsStudied: newStudiedCount,
      updatedAt: Date.now()
    };
    setJourney(updated);
    await saveStudyJourney(user.uid, updated);
  };

  const handleToggleFlashcardBookmark = async (cardId: string) => {
    // Bookmark handled in standard screen
  };

  // -------------------------------------------------------------
  // STEP 3: PRACTICE LOADING & EXECUTION
  // -------------------------------------------------------------
  const handleContinueToPractice = async () => {
    if (!journey || !user) return;
    setIsGenerating(true);

    try {
      const targetPracticeCount = journey.practiceTargetCount || practiceCount || 10;
      let token = '';
      try {
        token = await user.getIdToken();
      } catch (e) {}

      let questions: StudyJourneyQuestion[] = [];

      try {
        const res = await fetch('/api/generate-questions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify({
            subject: journey.subject,
            topic: journey.topic,
            difficulty: 'Medium',
            amount: targetPracticeCount,
            educationLevel: journey.educationLevel,
            country: 'Nigeria',
            practiceMode: 'Topic Practice'
          })
        });

        if (res.ok) {
          const data = await res.json();
          if (data.questions && Array.isArray(data.questions)) {
            questions = data.questions.map((q: any) => ({
              question: q.question,
              options: q.options || ['Option A', 'Option B', 'Option C', 'Option D'],
              correctAnswer: typeof q.correctAnswer === 'number' ? q.correctAnswer : 0,
              explanation: q.explanation || 'Refer to the core topic laws and properties.'
            }));
          }
        }
      } catch (e) {
        console.warn('Practice generation endpoint error:', e);
      }

      // Ensure exactly targetPracticeCount questions are present
      if (questions.length < targetPracticeCount) {
        questions = generateTopicQuestions(
          journey.subject,
          journey.topic,
          journey.educationLevel,
          journey.examType,
          targetPracticeCount,
          questions
        );
      }

      questions = questions.slice(0, targetPracticeCount);

      setPracticeQuestions(questions);
      setSelectedAnswers({});
      setCurrentQuestionIdx(0);
      setIsPracticeSubmitted(false);
      setPracticeTimeRemaining(Math.max(300, targetPracticeCount * 60));

      await advanceToStep(3);
    } catch (err) {
      console.error('Failed to prepare practice session:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Submit Practice Session & Transition to Step 4 (Review Mistakes)
  const handleSubmitPractice = async () => {
    if (!journey || !user || practiceQuestions.length === 0) return;

    let correctCount = 0;
    const answeredList: StudyJourneyQuestion[] = practiceQuestions.map((q, idx) => {
      const userAns = selectedAnswers[idx];
      const isCorrect = userAns !== undefined && userAns === q.correctAnswer;
      if (isCorrect) correctCount++;
      return {
        ...q,
        userAnswer: userAns,
        isCorrect
      };
    });

    const incorrectCount = practiceQuestions.length - correctCount;
    const accuracyPct = Math.round((correctCount / practiceQuestions.length) * 100);
    const mistakes = answeredList.filter((q) => !q.isCorrect);

    const practiceResults = {
      total: practiceQuestions.length,
      correct: correctCount,
      incorrect: incorrectCount,
      accuracy: accuracyPct,
      questions: answeredList,
      mistakes
    };

    setIsPracticeSubmitted(true);
    await advanceToStep(4, {
      practiceResults
    });
  };

  // -------------------------------------------------------------
  // STEP 4: REVIEW MISTAKES ACTIONS
  // -------------------------------------------------------------
  const handleTurnMistakesIntoFlashcards = async () => {
    if (!journey || !user || !journey.practiceResults?.mistakes) return;

    try {
      const count = await convertMistakesToFlashcards(
        user.uid,
        journey.subject,
        journey.topic,
        journey.practiceResults.mistakes
      );
      setConvertedMistakesToast(`Created ${count} new flashcards from your mistakes!`);
      setTimeout(() => setConvertedMistakesToast(null), 4000);
    } catch (e) {
      console.error('Failed to convert mistakes into flashcards:', e);
    }
  };

  const handleAskAITutorAboutTopic = (customQuestion?: string) => {
    if (!journey) return;
    const promptText = customQuestion || `I'm studying the topic "${journey.topic}" in ${journey.subject} for ${journey.examType}. Can you explain the core concepts and help me understand where students usually make mistakes?`;
    localStorage.setItem('zetadu_target_subject', journey.subject);
    localStorage.setItem('zetadu_tutor_initial_query', promptText);
    setView('tutor');
  };

  // -------------------------------------------------------------
  // STEP 5: RETEST LOADING & SUBMISSION
  // -------------------------------------------------------------
  const handleStartRetest = async () => {
    if (!journey || !user) return;
    setIsGenerating(true);

    try {
      let token = '';
      try {
        token = await user.getIdToken();
      } catch (e) {}

      let newQuestions: StudyJourneyQuestion[] = [];

      try {
        const res = await fetch('/api/generate-questions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify({
            subject: journey.subject,
            topic: journey.topic,
            difficulty: 'Medium',
            amount: 5,
            educationLevel: journey.educationLevel,
            practiceMode: 'Exam Simulation'
          })
        });

        if (res.ok) {
          const data = await res.json();
          if (data.questions && Array.isArray(data.questions)) {
            newQuestions = data.questions.map((q: any) => ({
              question: q.question,
              options: q.options || ['Option A', 'Option B', 'Option C', 'Option D'],
              correctAnswer: typeof q.correctAnswer === 'number' ? q.correctAnswer : 0,
              explanation: q.explanation || 'Verified through standard exam criteria.'
            }));
          }
        }
      } catch (e) {
        console.warn('Retest generation failed, using alternate questions:', e);
      }

      if (newQuestions.length === 0) {
        newQuestions = [
          {
            question: `Retest Question 1: How does an understanding of ${journey.topic} assist in advanced problem solving?`,
            options: [
              'It provides the prerequisite theorems and derivation patterns.',
              'It replaces the need for any formulas.',
              'It has no relevance to advanced questions.',
              'It is only useful in trivial cases.'
            ],
            correctAnswer: 0,
            explanation: 'Mastering prerequisite theorems allows students to tackle composite, multi-step exam questions with confidence.'
          },
          {
            question: `Retest Question 2: In ${journey.topic}, what is the impact of changing the primary variable?`,
            options: [
              'It causes a predictable, mathematical transformation in accordance with the topic rules.',
              'It produces unpredictable, chaotic behavior.',
              'The outcome remains unchanged under all circumstances.',
              'The equation becomes immediately undefined.'
            ],
            correctAnswer: 0,
            explanation: 'Systematic variable modification follows established proportional laws.'
          },
          {
            question: `Retest Question 3: Which strategy effectively avoids errors in ${journey.topic}?`,
            options: [
              'Double checking steps and using alternative cross-verification methods',
              'Skipping steps and guessing options',
              'Ignoring negative signs',
              'Leaving calculations incomplete'
            ],
            correctAnswer: 0,
            explanation: 'Cross-verification guarantees that algebraic and conceptual mistakes are caught before submission.'
          },
          {
            question: `Retest Question 4: Under standard ${journey.examType} regulations, how is work on ${journey.topic} scored?`,
            options: [
              'For both accurate intermediate method and correct final evaluation',
              'Solely on lucky guessing',
              'Only if answered in under 5 seconds',
              'Randomly by examiners'
            ],
            correctAnswer: 0,
            explanation: 'Mark schemes award method marks (M) and accuracy marks (A) for methodical working.'
          },
          {
            question: `Retest Question 5: What is the conclusive takeaway from this study journey on ${journey.topic}?`,
            options: [
              'Consistent practice with flashcards, questions, and mistake review cements retention.',
              'Cramming once without review is sufficient.',
              'Mistakes cannot be improved through review.',
              'Exam questions never repeat key concepts.'
            ],
            correctAnswer: 0,
            explanation: 'Active recall and spaced review form the scientific foundation of topic mastery.'
          }
        ];
      }

      setRetestQuestions(newQuestions);
      setSelectedRetestAnswers({});
      setCurrentRetestIdx(0);
      setRetestTimeRemaining(300);

      await advanceToStep(5);
    } catch (err) {
      console.error('Failed to initiate retest:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Submit Retest & Move to Step 6: Results
  const handleSubmitRetest = async () => {
    if (!journey || !user || retestQuestions.length === 0) return;

    let correctCount = 0;
    const answeredRetest: StudyJourneyQuestion[] = retestQuestions.map((q, idx) => {
      const userAns = selectedRetestAnswers[idx];
      const isCorrect = userAns !== undefined && userAns === q.correctAnswer;
      if (isCorrect) correctCount++;
      return {
        ...q,
        userAnswer: userAns,
        isCorrect
      };
    });

    const retestAccuracy = Math.round((correctCount / retestQuestions.length) * 100);

    const retestResults = {
      total: retestQuestions.length,
      correct: correctCount,
      accuracy: retestAccuracy,
      questions: answeredRetest
    };

    // Compute final topic mastery from real data
    const practiceAccuracy = journey.practiceResults?.accuracy || 0;
    const flashcardsStudied = journey.flashcardsStudied || 0;
    const flashcardsTotal = journey.flashcardsTotal || 1;

    const topicMastery = calculateTopicMastery(
      practiceAccuracy,
      retestAccuracy,
      flashcardsStudied,
      flashcardsTotal
    );

    await advanceToStep(6, {
      retestResults,
      topicMastery,
      status: 'completed'
    });
  };

  // -------------------------------------------------------------
  // RENDER HELPERS
  // -------------------------------------------------------------
  const availableTopics = SYLLABUS_TOPICS[selectedSubjectId] || [
    'General Principles & Definitions',
    'Core Theorems & Analysis',
    'Practical Exam Applications',
    'Problem Solving & Past Questions'
  ];

  const currentSubjectObj = ALL_SUBJECTS.find((s) => s.id === (journey ? journey.subjectId : selectedSubjectId)) || ALL_SUBJECTS[0];

  // -------------------------------------------------------------
  // VIEW: PROMPT TO CONTINUE OR START OVER
  // -------------------------------------------------------------
  if (hasSavedJourneyPrompt && savedJourneyCandidate) {
    return (
      <div className="w-full max-w-2xl mx-auto py-12 px-4">
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border-2 border-blue-500/30 shadow-xl text-center relative overflow-hidden">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center mb-6 shadow-sm">
            <Compass size={36} />
          </div>

          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
            Continue your Study Journey?
          </h2>

          <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base mb-6 max-w-md mx-auto">
            You have an unfinished Study Journey in progress for:
          </p>

          <div className="bg-slate-50 dark:bg-slate-900/60 rounded-2xl p-5 mb-8 text-left border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                {savedJourneyCandidate.subject}
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-bold">
                Step {savedJourneyCandidate.step} of 6
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
              {savedJourneyCandidate.topic}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {savedJourneyCandidate.educationLevel} • {savedJourneyCandidate.examType}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
            <button
              id="study-journey-continue-btn"
              onClick={handleResumeSavedJourney}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>Continue Journey</span>
              <ArrowRight size={18} />
            </button>
            <button
              id="study-journey-start-over-btn"
              onClick={handleStartOver}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold transition-all"
            >
              Start Over
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW: INITIAL SELECTION SCREEN (Choose Level -> Exam -> Subject -> Topic)
  // -------------------------------------------------------------
  if (!journey) {
    return (
      <div className="w-full max-w-5xl mx-auto pb-16 px-4">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest mb-2">
              <Compass size={16} />
              <span>Personalized Learning Engine</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Study Journey
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base mt-1">
              Connect Learn, Flashcards, Practice, Mistakes Review, and Retest into one guided mastery path.
            </p>
          </div>
          <button
            onClick={() => setView('home')}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors self-start md:self-auto"
          >
            <ArrowLeft size={16} />
            <span>Dashboard</span>
          </button>
        </div>

        {/* Selection Steps Card */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-8">
          {/* 1. Education Level */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">1</span>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Select Education Level</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {EDUCATION_LEVELS.map((level) => (
                <button
                  key={level.id}
                  onClick={() => setSelectedLevel(level.id)}
                  className={`p-4 rounded-2xl text-left border-2 transition-all cursor-pointer ${
                    selectedLevel === level.id
                      ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-900/20 text-blue-900 dark:text-white'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <div className="font-bold text-base mb-1">{level.label}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{level.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Exam Type */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">2</span>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Select Exam Target</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {(EXAM_TYPES_BY_LEVEL[selectedLevel] || []).map((exam) => (
                <button
                  key={exam}
                  onClick={() => setSelectedExam(exam)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                    selectedExam === exam
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {exam}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Subject Selection with Search */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">3</span>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Select Subject</h2>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {availableSubjects.length} {availableSubjects.length === 1 ? 'subject' : 'subjects'}
              </span>
            </div>

            {/* Subject Search Bar */}
            <div className="relative mb-3">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search size={18} />
              </div>
              <input
                type="text"
                value={subjectSearchQuery}
                onChange={(e) => setSubjectSearchQuery(e.target.value)}
                placeholder="Search subjects..."
                aria-label="Search subjects"
                className="w-full pl-10 pr-12 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
              {subjectSearchQuery && (
                <button
                  type="button"
                  onClick={() => setSubjectSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Subject List / Grid */}
            {availableSubjects.length === 0 ? (
              <div className="py-8 px-4 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30">
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                  No subjects found
                </p>
                <button
                  type="button"
                  onClick={() => setSubjectSearchQuery('')}
                  className="mt-2 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  Clear search to view all subjects
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 max-h-72 overflow-y-auto pr-1">
                {availableSubjects.map((sub) => {
                  const isSelected = selectedSubjectId === sub.id;
                  return (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => {
                        setSelectedSubjectId(sub.id);
                        setIsCustomTopic(false);
                      }}
                      className={`p-3 rounded-xl text-left border transition-all flex items-center gap-2.5 cursor-pointer ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-900 dark:text-white font-bold ring-2 ring-blue-500/30'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300 text-sm bg-white dark:bg-slate-800'
                      }`}
                    >
                      <span className={`w-3 h-3 rounded-full shrink-0 ${sub.color || 'bg-blue-500'}`} />
                      <span className="break-words leading-snug whitespace-normal flex-1">{sub.name}</span>
                      {isSelected && <CheckCircle2 size={16} className="text-blue-600 dark:text-blue-400 shrink-0 ml-auto" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* 4. Topic */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">4</span>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Select Topic</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsCustomTopic(!isCustomTopic)}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                {isCustomTopic ? 'Choose from syllabus list' : '+ Enter custom topic'}
              </button>
            </div>

            {isCustomTopic ? (
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  value={customTopicInput}
                  onChange={(e) => setCustomTopicInput(e.target.value)}
                  placeholder="e.g. Simultaneous Linear Equations, Redox Reactions..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none"
                  autoFocus
                />
                <p className="text-xs text-slate-500">
                  Type any chapter, sub-topic, or curriculum unit you wish to master.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                {availableTopics.map((topicName) => (
                  <button
                    key={topicName}
                    type="button"
                    onClick={() => setSelectedTopic(topicName)}
                    className={`p-3 rounded-xl text-left border transition-all flex items-center justify-between gap-2 cursor-pointer ${
                      selectedTopic === topicName
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-900 dark:text-white font-bold'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-700 dark:text-slate-300 text-sm'
                    }`}
                  >
                    <span className="truncate">{topicName}</span>
                    {selectedTopic === topicName && <CheckCircle2 size={16} className="text-blue-600 shrink-0" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 5. Flashcards to Study */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">5</span>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Flashcards to Study</h2>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">({flashcardCount} cards)</span>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {[5, 10, 20, 30, 50].map((num) => (
                <button
                  key={num}
                  id={`flashcard-count-${num}`}
                  type="button"
                  onClick={() => setFlashcardCount(num)}
                  className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                    flashcardCount === num
                      ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-400/50'
                      : 'bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 border border-transparent'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* 6. Practice Questions to Answer */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">6</span>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Practice Questions to Answer</h2>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">({practiceCount} questions)</span>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {[5, 10, 20, 30, 50, 100].map((num) => (
                <button
                  key={num}
                  id={`practice-count-${num}`}
                  type="button"
                  onClick={() => setPracticeCount(num)}
                  className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                    practiceCount === num
                      ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-400/50'
                      : 'bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 border border-transparent'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Launch Action */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500 dark:text-slate-400 space-y-0.5">
              <div>
                Selected: <strong className="text-slate-800 dark:text-white">{currentSubjectObj.name}</strong> •{' '}
                <strong className="text-slate-800 dark:text-white">
                  {isCustomTopic ? customTopicInput || 'Custom Topic' : selectedTopic}
                </strong>
              </div>
              <div className="text-slate-600 dark:text-slate-300 font-medium">
                Scope: <span className="text-blue-600 dark:text-blue-400 font-bold">{flashcardCount} flashcards</span> •{' '}
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">{practiceCount} practice questions</span>
              </div>
            </div>

            <button
              id="start-study-journey-btn"
              onClick={handleStartJourney}
              disabled={isGenerating || (isCustomTopic && !customTopicInput.trim())}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <RefreshCw size={18} className="animate-spin" />
                  <span>Preparing Your Journey...</span>
                </>
              ) : (
                <>
                  <span>Begin Study Journey</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // ACTIVE JOURNEY HEADER & STEPPER BAR
  // -------------------------------------------------------------
  const STEPS = [
    { num: 1, label: 'Learn', icon: BookOpen },
    { num: 2, label: 'Flashcards', icon: Layers },
    { num: 3, label: 'Practice', icon: PenTool },
    { num: 4, label: 'Mistakes', icon: AlertTriangle },
    { num: 5, label: 'Retest', icon: RotateCcw },
    { num: 6, label: 'Results', icon: Award }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto pb-16 px-4">
      {/* Top Banner: Subject & Topic metadata + Leave Journey */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 md:p-5 border border-slate-200 dark:border-slate-700 shadow-sm mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
            <span>{journey.subject}</span>
            <span>•</span>
            <span>{journey.educationLevel}</span>
            <span>•</span>
            <span>{journey.examType}</span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {journey.topic}
          </h1>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={() => setView('home')}
            className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            Save & Exit
          </button>
          <button
            onClick={handleStartOver}
            className="px-3 py-2 text-xs font-bold rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* 6-Step Progress Tracker */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-3 md:p-4 border border-slate-200 dark:border-slate-700 shadow-sm mb-6 md:mb-8 overflow-x-auto no-scrollbar">
        <div className="flex items-center justify-between min-w-[520px] md:min-w-0 px-1 py-1">
          {STEPS.map((stepItem, idx) => {
            const isDone = journey.step > stepItem.num;
            const isCurrent = journey.step === stepItem.num;
            const IconComponent = stepItem.icon;

            return (
              <React.Fragment key={stepItem.num}>
                <div className="flex flex-col items-center gap-1.5 shrink-0">
                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-bold text-xs transition-all ${
                      isDone
                        ? 'bg-emerald-500 text-white shadow-sm'
                        : isCurrent
                        ? 'bg-blue-600 text-white shadow-md ring-4 ring-blue-500/20'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    {isDone ? <CheckCircle2 size={18} /> : <IconComponent size={17} />}
                  </div>
                  <span
                    className={`text-[11px] sm:text-xs font-bold whitespace-nowrap ${
                      isCurrent
                        ? 'text-blue-600 dark:text-blue-400'
                        : isDone
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-slate-400'
                    }`}
                  >
                    {stepItem.num}. {stepItem.label}
                  </span>
                </div>
                {idx < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-1.5 sm:mx-2 min-w-[20px] rounded-full transition-all ${
                      journey.step > stepItem.num ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* STEP 1: LEARN                                                 */}
      {/* ------------------------------------------------------------- */}
      {journey.step === 1 && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-900/40 text-blue-600">
                  <BookOpen size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Step 1 — Topic Overview</h2>
                  <p className="text-xs text-slate-500">Read the foundational summary before testing your recall.</p>
                </div>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
                Core Concept
              </span>
            </div>

            {/* Main Concept */}
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-5 border border-slate-100 dark:border-slate-700">
              <h3 className="text-sm font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
                Main Concept
              </h3>
              <p className="text-slate-700 dark:text-slate-200 text-base leading-relaxed">
                {journey.learnData?.mainConcept}
              </p>
            </div>

            {/* Important Points */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
                <Sparkles size={16} className="text-amber-500" />
                <span>Important Points to Remember</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {journey.learnData?.importantPoints.map((pt, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-700/60 flex items-start gap-3"
                  >
                    <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{pt}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Examples */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
                <Zap size={16} className="text-emerald-500" />
                <span>Key Examples & Demonstrations</span>
              </h3>
              <div className="space-y-3">
                {journey.learnData?.keyExamples.map((ex, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40"
                  >
                    <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">{ex}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons: Ask AI Tutor & Continue to Flashcards */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                id="journey-ask-tutor-btn"
                onClick={() => handleAskAITutorAboutTopic()}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl border-2 border-emerald-500/50 hover:border-emerald-500 text-emerald-700 dark:text-emerald-400 font-bold transition-all flex items-center justify-center gap-2 cursor-pointer hover:bg-emerald-50/50"
              >
                <MessageSquare size={18} />
                <span>Ask AI Tutor</span>
              </button>

              <button
                id="journey-continue-to-flashcards-btn"
                onClick={handleContinueToFlashcards}
                disabled={isGenerating}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw size={18} className="animate-spin" />
                    <span>Loading Flashcards...</span>
                  </>
                ) : (
                  <>
                    <span>Continue to Flashcards</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* STEP 2: FLASHCARDS (Using FlashcardStudyScreen)                 */}
      {/* ------------------------------------------------------------- */}
      {journey.step === 2 && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm text-slate-500">
              Study the flashcards for <strong className="text-slate-800 dark:text-white">{journey.topic}</strong>.
            </div>
            <button
              onClick={handleContinueToPractice}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>Skip directly to Practice</span>
              <ChevronRight size={14} />
            </button>
          </div>

          {journeyFlashcards.length > 0 ? (
            <FlashcardStudyScreen
              deckName={`${journey.subject}: ${journey.topic}`}
              subject={journey.subject}
              topic={journey.topic}
              cards={journeyFlashcards}
              onExit={() => advanceToStep(1)}
              onRateCard={handleRateFlashcard}
              onToggleBookmark={handleToggleFlashcardBookmark}
              onContinueToPractice={handleContinueToPractice}
            />
          ) : (
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 text-center border border-slate-200 dark:border-slate-700">
              <p className="text-slate-500 mb-4">No flashcards loaded for this topic.</p>
              <button
                onClick={handleContinueToPractice}
                className="px-6 py-3 rounded-xl bg-blue-600 text-white font-bold"
              >
                Continue to Practice
              </button>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* STEP 3: PRACTICE                                              */}
      {/* ------------------------------------------------------------- */}
      {journey.step === 3 && (
        <div className="space-y-6">
          {practiceQuestions.length > 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
              {/* Question Navigation & Timer Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700 pb-4">
                <div>
                  <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
                    Question {currentQuestionIdx + 1} of {practiceQuestions.length}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Adaptive Topic Assessment
                  </h3>
                </div>

                <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 px-4 py-2 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300">
                  <Clock size={16} />
                  <span>
                    {Math.floor(practiceTimeRemaining / 60)}:
                    {(practiceTimeRemaining % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              </div>

              {/* Question Number Pills */}
              <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto pr-1">
                {practiceQuestions.map((_, idx) => {
                  const isAnswered = selectedAnswers[idx] !== undefined;
                  const isCurrent = currentQuestionIdx === idx;

                  return (
                    <button
                      key={idx}
                      onClick={() => setCurrentQuestionIdx(idx)}
                      className={`w-9 h-9 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-400'
                          : isAnswered
                          ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Active Question Box */}
              <div className="py-2">
                <p className="text-lg md:text-xl font-bold text-slate-900 dark:text-white leading-relaxed mb-6">
                  {practiceQuestions[currentQuestionIdx]?.question}
                </p>

                {/* Answer Options */}
                <div className="space-y-3">
                  {practiceQuestions[currentQuestionIdx]?.options.map((opt, oIdx) => {
                    const optionLetter = String.fromCharCode(65 + oIdx);
                    const isSelected = selectedAnswers[currentQuestionIdx] === oIdx;

                    return (
                      <button
                        key={oIdx}
                        onClick={() => {
                          setSelectedAnswers({
                            ...selectedAnswers,
                            [currentQuestionIdx]: oIdx
                          });
                        }}
                        className={`w-full p-4 rounded-2xl border-2 text-left transition-all flex items-center gap-4 cursor-pointer ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-900/30 shadow-sm'
                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800'
                        }`}
                      >
                        <span
                          className={`w-8 h-8 rounded-xl font-bold text-sm flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {optionLetter}
                        </span>
                        <span
                          className={`text-base leading-relaxed ${
                            isSelected
                              ? 'font-bold text-blue-950 dark:text-white'
                              : 'text-slate-800 dark:text-slate-200'
                          }`}
                        >
                          {opt}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Nav: Prev, Next & Submit */}
              <div className="pt-6 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between gap-4">
                <button
                  onClick={() => setCurrentQuestionIdx((p) => Math.max(0, p - 1))}
                  disabled={currentQuestionIdx === 0}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold disabled:opacity-40"
                >
                  Previous
                </button>

                {currentQuestionIdx < practiceQuestions.length - 1 ? (
                  <button
                    onClick={() => setCurrentQuestionIdx((p) => Math.min(practiceQuestions.length - 1, p + 1))}
                    className="px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold"
                  >
                    Next Question
                  </button>
                ) : (
                  <button
                    id="submit-practice-quiz-btn"
                    onClick={handleSubmitPractice}
                    className="px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md cursor-pointer flex items-center gap-2"
                  >
                    <FileCheck size={18} />
                    <span>Submit Practice</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* STEP 4: REVIEW MISTAKES                                       */}
      {/* ------------------------------------------------------------- */}
      {journey.step === 4 && (
        <div className="space-y-6">
          {/* Practice Performance Banner */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Step 4 — Review & Diagnostic
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                  Practice Assessment Results
                </h2>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-center px-4 py-2 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                  <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                    {journey.practiceResults?.correct || 0}
                  </div>
                  <div className="text-xs font-bold text-slate-500">Correct</div>
                </div>

                <div className="text-center px-4 py-2 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800">
                  <div className="text-2xl font-black text-rose-600 dark:text-rose-400">
                    {journey.practiceResults?.incorrect || 0}
                  </div>
                  <div className="text-xs font-bold text-slate-500">Incorrect</div>
                </div>

                <div className="text-center px-4 py-2 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
                  <div className="text-2xl font-black text-blue-600 dark:text-blue-400">
                    {journey.practiceResults?.accuracy || 0}%
                  </div>
                  <div className="text-xs font-bold text-slate-500">Accuracy</div>
                </div>
              </div>
            </div>

            {/* Notification Toast for Flashcards */}
            {convertedMistakesToast && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-sm font-bold flex items-center gap-3">
                <CheckCircle2 size={20} className="shrink-0" />
                <span>{convertedMistakesToast}</span>
              </div>
            )}

            {/* Required Action Buttons if mistakes exist */}
            {(journey.practiceResults?.mistakes?.length || 0) > 0 ? (
              <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 mb-6 space-y-3">
                <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-sm">
                  <AlertTriangle size={18} />
                  <span>
                    You made {journey.practiceResults?.mistakes?.length} mistake
                    {(journey.practiceResults?.mistakes?.length || 0) > 1 ? 's' : ''}. Use these targeted tools:
                  </span>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    id="journey-review-mistakes-filter-btn"
                    onClick={() => setMistakeFilter(mistakeFilter === 'mistakes_only' ? 'all' : 'mistakes_only')}
                    className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 font-bold text-xs hover:bg-amber-100 transition-colors shadow-sm flex items-center gap-2"
                  >
                    <AlertTriangle size={16} />
                    <span>{mistakeFilter === 'mistakes_only' ? 'Show All Questions' : 'Review My Mistakes'}</span>
                  </button>

                  <button
                    id="journey-ask-tutor-mistakes-btn"
                    onClick={() =>
                      handleAskAITutorAboutTopic(
                        `I just completed a practice session on "${journey.topic}" and got ${journey.practiceResults?.incorrect} questions wrong. Can you explain the common misconceptions on this topic?`
                      )
                    }
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-sm flex items-center gap-2"
                  >
                    <MessageSquare size={16} />
                    <span>Ask AI Tutor</span>
                  </button>

                  <button
                    id="journey-convert-mistakes-flashcards-btn"
                    onClick={handleTurnMistakesIntoFlashcards}
                    className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-sm flex items-center gap-2"
                  >
                    <BookmarkPlus size={16} />
                    <span>Turn Mistakes Into Flashcards</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 mb-6 text-emerald-800 dark:text-emerald-300 text-sm font-bold flex items-center gap-2">
                <CheckCircle2 size={18} />
                <span>Outstanding! You achieved 100% accuracy on this topic practice.</span>
              </div>
            )}

            {/* List of Questions with Detailed Explanations */}
            <div className="space-y-4">
              {(
                (mistakeFilter === 'mistakes_only' && (journey.practiceResults?.mistakes?.length || 0) > 0)
                  ? journey.practiceResults?.mistakes
                  : journey.practiceResults?.questions
              )?.map((q, idx) => {
                const isCorrect = q.isCorrect;

                return (
                  <div
                    key={idx}
                    className={`p-5 rounded-2xl border ${
                      isCorrect
                        ? 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/20'
                        : 'border-rose-200 dark:border-rose-900/60 bg-rose-50/20'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <h4 className="font-bold text-slate-900 dark:text-white text-base">
                        {idx + 1}. {q.question}
                      </h4>
                      {isCorrect ? (
                        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold text-xs shrink-0">
                          <CheckCircle2 size={16} />
                          <span>Correct</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400 font-bold text-xs shrink-0">
                          <XCircle size={16} />
                          <span>Incorrect</span>
                        </span>
                      )}
                    </div>

                    {/* Options Breakdown */}
                    <div className="space-y-2 mb-3">
                      {q.options.map((opt, optIdx) => {
                        const isUserChoice = q.userAnswer === optIdx;
                        const isCorrectOption = q.correctAnswer === optIdx;

                        return (
                          <div
                            key={optIdx}
                            className={`p-3 rounded-xl text-sm flex items-center justify-between ${
                              isCorrectOption
                                ? 'bg-emerald-100/70 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 font-bold'
                                : isUserChoice
                                ? 'bg-rose-100/70 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200 line-through'
                                : 'text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            <span>
                              {String.fromCharCode(65 + optIdx)}. {opt}
                            </span>
                            {isCorrectOption && (
                              <span className="text-xs font-bold uppercase text-emerald-700 dark:text-emerald-400">
                                Correct Answer
                              </span>
                            )}
                            {isUserChoice && !isCorrectOption && (
                              <span className="text-xs font-bold uppercase text-rose-700 dark:text-rose-400">
                                Your Choice
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation Box */}
                    <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-700/50 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      <strong className="text-slate-900 dark:text-white">Explanation: </strong>
                      {q.explanation}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Action: Continue to Retest */}
            <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-700 flex items-center justify-end">
              <button
                id="journey-continue-to-retest-btn"
                onClick={handleStartRetest}
                disabled={isGenerating}
                className="px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw size={18} className="animate-spin" />
                    <span>Loading Retest...</span>
                  </>
                ) : (
                  <>
                    <span>Continue to Retest</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* STEP 5: RETEST                                                */}
      {/* ------------------------------------------------------------- */}
      {journey.step === 5 && (
        <div className="space-y-6">
          {retestQuestions.length > 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700 pb-4">
                <div>
                  <div className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">
                    Step 5 — Topic Retest ({currentRetestIdx + 1}/{retestQuestions.length})
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Mastery Verification Test
                  </h3>
                </div>

                <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 px-4 py-2 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300">
                  <Clock size={16} />
                  <span>
                    {Math.floor(retestTimeRemaining / 60)}:
                    {(retestTimeRemaining % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              </div>

              {/* Question Pills */}
              <div className="flex flex-wrap gap-2">
                {retestQuestions.map((_, idx) => {
                  const isAnswered = selectedRetestAnswers[idx] !== undefined;
                  const isCurrent = currentRetestIdx === idx;

                  return (
                    <button
                      key={idx}
                      onClick={() => setCurrentRetestIdx(idx)}
                      className={`w-9 h-9 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-amber-600 text-white shadow-md ring-2 ring-amber-400'
                          : isAnswered
                          ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Question Body */}
              <div className="py-2">
                <p className="text-lg md:text-xl font-bold text-slate-900 dark:text-white leading-relaxed mb-6">
                  {retestQuestions[currentRetestIdx]?.question}
                </p>

                <div className="space-y-3">
                  {retestQuestions[currentRetestIdx]?.options.map((opt, oIdx) => {
                    const optionLetter = String.fromCharCode(65 + oIdx);
                    const isSelected = selectedRetestAnswers[currentRetestIdx] === oIdx;

                    return (
                      <button
                        key={oIdx}
                        onClick={() => {
                          setSelectedRetestAnswers({
                            ...selectedRetestAnswers,
                            [currentRetestIdx]: oIdx
                          });
                        }}
                        className={`w-full p-4 rounded-2xl border-2 text-left transition-all flex items-center gap-4 cursor-pointer ${
                          isSelected
                            ? 'border-amber-600 bg-amber-50/80 dark:bg-amber-950/40 shadow-sm'
                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 bg-white dark:bg-slate-800'
                        }`}
                      >
                        <span
                          className={`w-8 h-8 rounded-xl font-bold text-sm flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'bg-amber-600 text-white'
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {optionLetter}
                        </span>
                        <span
                          className={`text-base leading-relaxed ${
                            isSelected
                              ? 'font-bold text-amber-950 dark:text-white'
                              : 'text-slate-800 dark:text-slate-200'
                          }`}
                        >
                          {opt}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Footer */}
              <div className="pt-6 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between gap-4">
                <button
                  onClick={() => setCurrentRetestIdx((p) => Math.max(0, p - 1))}
                  disabled={currentRetestIdx === 0}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold disabled:opacity-40"
                >
                  Previous
                </button>

                {currentRetestIdx < retestQuestions.length - 1 ? (
                  <button
                    onClick={() => setCurrentRetestIdx((p) => Math.min(retestQuestions.length - 1, p + 1))}
                    className="px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold"
                  >
                    Next Question
                  </button>
                ) : (
                  <button
                    id="submit-retest-btn"
                    onClick={handleSubmitRetest}
                    className="px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md cursor-pointer flex items-center gap-2"
                  >
                    <CheckCircle2 size={18} />
                    <span>Submit Retest & View Results</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* STEP 6: RESULTS (Topic Mastery Based on Real Performance)      */}
      {/* ------------------------------------------------------------- */}
      {journey.step === 6 && (
        <div className="space-y-8">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-10 border border-slate-200 dark:border-slate-700 shadow-xl text-center relative overflow-hidden">
            <div className="w-20 h-20 rounded-3xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center mb-6 shadow-inner">
              <Award size={44} />
            </div>

            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
              Study Journey Completed
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mt-1 mb-2">
              Topic Mastery: {journey.topicMastery}%
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base max-w-lg mx-auto mb-8">
              Based on your actual performance across flashcards, practice assessment, and retest verification.
            </p>

            {/* 4 Real Metric Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {/* 1. Flashcards completed */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-center">
                <div className="text-2xl md:text-3xl font-black text-blue-600 dark:text-blue-400">
                  {journey.flashcardsStudied || 0}
                </div>
                <div className="text-xs font-bold text-slate-500 mt-1">Flashcards Completed</div>
              </div>

              {/* 2. Practice accuracy */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-center">
                <div className="text-2xl md:text-3xl font-black text-emerald-600 dark:text-emerald-400">
                  {journey.practiceResults?.accuracy || 0}%
                </div>
                <div className="text-xs font-bold text-slate-500 mt-1">Practice Accuracy</div>
              </div>

              {/* 3. Number of mistakes */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-center">
                <div className="text-2xl md:text-3xl font-black text-rose-600 dark:text-rose-400">
                  {journey.practiceResults?.incorrect || 0}
                </div>
                <div className="text-xs font-bold text-slate-500 mt-1">Number of Mistakes</div>
              </div>

              {/* 4. Retest accuracy */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-center">
                <div className="text-2xl md:text-3xl font-black text-purple-600 dark:text-purple-400">
                  {journey.retestResults?.accuracy || 0}%
                </div>
                <div className="text-xs font-bold text-slate-500 mt-1">Retest Accuracy</div>
              </div>
            </div>

            {/* Performance Diagnosis Feedback */}
            <div className="p-5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-left mb-8">
              <h4 className="font-bold text-sm text-blue-900 dark:text-blue-200 mb-1 flex items-center gap-2">
                <Sparkles size={16} />
                <span>Performance Diagnosis</span>
              </h4>
              <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {(journey.topicMastery || 0) >= 80
                  ? `Exceptional grasp of ${journey.topic}! You showed high retention in your retest and strong accuracy throughout the journey.`
                  : (journey.topicMastery || 0) >= 60
                  ? `Solid foundation in ${journey.topic}. You improved on key misconceptions during the retest. Periodic flashcard review will solidify this into complete mastery.`
                  : `Developing proficiency in ${journey.topic}. We recommend continuing to review your mistakes deck and doing another practice run.`}
              </p>
            </div>

            {/* Final Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                id="journey-finish-complete-btn"
                onClick={handleStartOver}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Start Another Topic</span>
                <ArrowRight size={18} />
              </button>

              <button
                onClick={() => advanceToStep(4)}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold transition-all"
              >
                Review Mistakes Again
              </button>

              <button
                onClick={() => setView('home')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 transition-all"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
