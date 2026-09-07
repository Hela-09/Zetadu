import { Flashcard, StudyJourneyQuestion } from '../types';

/**
 * Generates or supplements topic flashcards to reach exactly `count` cards.
 */
export function generateTopicFlashcards(
  subject: string,
  topic: string,
  level: string,
  count: number,
  existingCards: Flashcard[],
  uid: string
): Flashcard[] {
  const cards: Flashcard[] = [...existingCards];

  const templates = [
    {
      front: `What is the core definition of ${topic} in ${subject}?`,
      back: `It refers to the fundamental principles, classifications, and standard properties governing ${topic} in the ${level} syllabus.`,
      explanation: `Mastering this definition is critical for foundational examination questions in ${subject}.`,
      difficulty: 'Easy'
    },
    {
      front: `Which primary governing formula, law, or rule applies to ${topic}?`,
      back: `Standard relationships directly link primary variables while explicitly specifying the boundary conditions under which the relationship holds.`,
      explanation: `Always identify all given values and verify unit consistency before applying this rule.`,
      difficulty: 'Medium'
    },
    {
      front: `What is a common examiner trap or misconception in ${topic}?`,
      back: `Failing to check boundary constraints, confounding inverse with direct variations, or misapplying sign conventions.`,
      explanation: `Careful condition verification and unit checks prevent this high-frequency student mistake.`,
      difficulty: 'Hard'
    },
    {
      front: `How is ${topic} demonstrated or verified experimentally/analytically?`,
      back: `Through controlled variable isolation, systematic substitutions, and testing extreme or boundary test cases.`,
      explanation: `Proofs and practical investigations in ${subject} require strict variable isolation.`,
      difficulty: 'Medium'
    },
    {
      front: `What is a major practical or real-world application of ${topic}?`,
      back: `It is widely utilized across engineering, economics, technological systems, and environmental analysis to predict outcomes accurately.`,
      explanation: `Curriculum exams regularly assess the contextual practical significance of ${topic}.`,
      difficulty: 'Easy'
    },
    {
      front: `Under what conditions do the standard rules of ${topic} change or break down?`,
      back: `Under critical boundary thresholds, zero division/singularity, or when non-ideal real-world factors perturb constant conditions.`,
      explanation: `Examiners test boundary restrictions to evaluate deep conceptual understanding beyond rote memorization.`,
      difficulty: 'Hard'
    },
    {
      front: `How do you distinguish between ${topic} and closely related concepts?`,
      back: `By contrasting their specific dimensions, operational constraints, governing equations, and independent factors.`,
      explanation: `Comparative analysis sharpens precision on multiple-choice questions.`,
      difficulty: 'Medium'
    },
    {
      front: `What is the first step in solving complex multi-step problems on ${topic}?`,
      back: `Clearly state given parameters, identify target unknowns, and select the appropriate theoretical relation before calculating.`,
      explanation: `Structured problem decomposition prevents computational errors under exam time pressure.`,
      difficulty: 'Medium'
    },
    {
      front: `What essential vocabulary and standard units are associated with ${topic}?`,
      back: `Curriculum-specific terminology, standard SI units, and definitive mathematical/symbolic notations.`,
      explanation: `Using accurate terminology guarantees full marks on WAEC, JAMB, and national assessments.`,
      difficulty: 'Easy'
    },
    {
      front: `How can you verify that a calculated solution in ${topic} is correct?`,
      back: `By reverse substitution, dimensional unit verification, and evaluating physical/logical plausibility.`,
      explanation: `Self-checking Derivations improves examination accuracy and exam confidence.`,
      difficulty: 'Medium'
    }
  ];

  let i = 0;
  while (cards.length < count) {
    const t = templates[i % templates.length];
    const cycle = Math.floor(i / templates.length) + 1;
    const cardId = `gen_card_${Date.now()}_${cards.length}_${Math.random().toString(36).substr(2, 5)}`;

    cards.push({
      id: cardId,
      uid,
      subject,
      topic,
      deckName: `${subject}: ${topic}`,
      front: cycle > 1 ? `${t.front} (Study Check ${cycle})` : t.front,
      back: t.back,
      explanation: t.explanation,
      difficulty: t.difficulty as any,
      rating: 'Good',
      reviews: 0,
      lastReviewed: Date.now(),
      nextReview: Date.now() + 86400000,
      bookmarked: false,
      createdAt: Date.now()
    });
    i++;
  }

  return cards.slice(0, count);
}

/**
 * Generates or supplements practice questions to reach exactly `count` questions.
 */
export function generateTopicQuestions(
  subject: string,
  topic: string,
  level: string,
  exam: string,
  count: number,
  existingQuestions: StudyJourneyQuestion[]
): StudyJourneyQuestion[] {
  const questions: StudyJourneyQuestion[] = [...existingQuestions];

  const questionTemplates = [
    {
      question: `In ${subject}, what is the foundational characteristic governing ${topic}?`,
      options: [
        `It establishes direct, verifiable relationships between variables under standard conditions.`,
        `It functions completely independently of physical or mathematical laws.`,
        `It applies exclusively to theoretical models with no practical usage.`,
        `It violates standard conservation principles.`
      ],
      correctAnswer: 0,
      explanation: `The foundational characteristic of ${topic} is verified by direct proportional relationship and standard axiomatic rules in ${subject}.`
    },
    {
      question: `Which of the following is essential when analyzing ${topic} for ${exam}?`,
      options: [
        `Omitting intermediate steps to save time`,
        `Identifying given parameters, required variables, and the appropriate governing formula`,
        `Assuming all unknown coefficients equal zero`,
        `Disregarding standard curriculum SI units`
      ],
      correctAnswer: 1,
      explanation: `Proper parameter identification and formula selection ensures accuracy and prevents sign errors.`
    },
    {
      question: `A student makes an error while evaluating ${topic}. What is the most common pitfall?`,
      options: [
        `Writing the final answer clearly with appropriate precision`,
        `Misapplying operational signs, conversion factors, or inverse operations`,
        `Double-checking intermediate calculations`,
        `Stating the correct governing definition`
      ],
      correctAnswer: 1,
      explanation: `Operational sign inversion and bracket distribution errors represent the most frequent examiner-tested misconceptions.`
    },
    {
      question: `How is the principle of ${topic} classified in modern ${subject} curricula?`,
      options: [
        `Core high-yield syllabus requirement for ${exam}`,
        `Optional non-examinable footnote`,
        `Obsolete historical trivia without modern application`,
        `Unverified speculation`
      ],
      correctAnswer: 0,
      explanation: `This topic forms an essential part of the standard WAEC, JAMB, and national assessment syllabi.`
    },
    {
      question: `What is the expected outcome when applying the standard method to solve problems on ${topic}?`,
      options: [
        `A verifiable, reproducible solution with clear logical reasoning`,
        `An indeterminate contradiction`,
        `Arbitrary random numbers`,
        `An unsolvable paradox`
      ],
      correctAnswer: 0,
      explanation: `Standard methods yield clear, repeatable, and rigorously validated outcomes.`
    },
    {
      question: `What distinguishes ${topic} from related concepts in ${subject}?`,
      options: [
        `Its unique defining properties, specific conditions, and measurable parameters`,
        `It has identical formulas to all other units`,
        `It cannot be measured or observed experimentally`,
        `It is solely theoretical with no real-world link`
      ],
      correctAnswer: 0,
      explanation: `Unique operational properties and measurable parameters differentiate ${topic} from other curriculum units.`
    },
    {
      question: `Under what circumstance does the primary relation in ${topic} undergo a fundamental change?`,
      options: [
        `When approaching critical boundary limits or state transitions`,
        `Under any normal room temperature or standard pressure`,
        `Whenever a student uses a pencil instead of a pen`,
        `It never changes regardless of any physical condition`
      ],
      correctAnswer: 0,
      explanation: `Critical boundary limits or transitions alter the governing constraints of the system.`
    },
    {
      question: `Why is unit consistency critical when solving numerical questions in ${topic}?`,
      options: [
        `Incompatible units invalidate mathematical formulas and yield incorrect magnitudes`,
        `Units do not affect the calculated value in ${subject}`,
        `Examiners ignore units when scoring papers`,
        `Units are only required in advanced university research`
      ],
      correctAnswer: 0,
      explanation: `Consistent standard units ensure accurate numerical answers and prevent dimension errors.`
    },
    {
      question: `Which statement best describes the real-world significance of ${topic}?`,
      options: [
        `It enables accurate predictive modeling in practical and technological applications`,
        `It exists solely to make exams difficult for students`,
        `It has been completely superseded by untested alternatives`,
        `It has no measurable connection to practical systems`
      ],
      correctAnswer: 0,
      explanation: `${topic} provides the theoretical framework used across science, industry, and academia.`
    },
    {
      question: `What is the recommended review strategy after encountering a mistake in ${topic}?`,
      options: [
        `Identify the specific misconception, review the core rule, and retest with a similar problem`,
        `Memorize the option letter (e.g. B) for future exams`,
        `Ignore the topic entirely and hope it does not appear`,
        `Skip all future practice tests`
      ],
      correctAnswer: 0,
      explanation: `Deliberate diagnostic review and concept retesting solidifies long-term mastery.`
    }
  ];

  let i = 0;
  while (questions.length < count) {
    const qTemplate = questionTemplates[i % questionTemplates.length];
    const cycle = Math.floor(i / questionTemplates.length) + 1;
    const qNumber = questions.length + 1;

    questions.push({
      question: cycle > 1 ? `[Q${qNumber}] ${qTemplate.question}` : qTemplate.question,
      options: [...qTemplate.options],
      correctAnswer: qTemplate.correctAnswer,
      explanation: qTemplate.explanation
    });
    i++;
  }

  return questions.slice(0, count);
}
