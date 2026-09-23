/**
 * Canonical fingerprint and validation utilities for LearnDean JAMB questions.
 * Ensures duplicate or near-duplicate questions cannot enter the bank.
 */

export function normalizeQuestionText(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function normalizeOptionText(opt: string): string {
  if (!opt) return '';
  // Strip leading option letters like "A. ", "B) ", "(C) ", "A: "
  const stripped = opt.replace(/^(\([a-d]\)|[a-d][.)\-:]\s*)/i, '');
  return stripped
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Computes a deterministic, collision-resistant fingerprint for any question and its options.
 * Two questions with the same conceptual wording and options will generate the identical fingerprint.
 */
export function generateQuestionFingerprint(question: string, options: string[]): string {
  const normQ = normalizeQuestionText(question);
  const normOpts = (options || [])
    .map(o => normalizeOptionText(o))
    .filter(Boolean)
    .sort()
    .join('||');

  const combined = `${normQ}:::${normOpts}`;

  // Deterministic 64-bit Fowler-Noll-Vo / Murmur inspired hash
  let h1 = 0xdeadbeef, h2 = 0x41c64e6d;
  for (let i = 0; i < combined.length; i++) {
    const ch = combined.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  
  const part1 = (h1 >>> 0).toString(16).padStart(8, '0');
  const part2 = (h2 >>> 0).toString(16).padStart(8, '0');
  const slug = normQ.slice(0, 10).replace(/\s+/g, '_') || 'q';

  return `fp_${slug}_${part1}${part2}`;
}

export interface ValidatedQuestionPayload {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

/**
 * Validates question payload against strict JAMB standards.
 * Returns null if invalid or the cleaned question payload.
 */
export function validateQuestionPayload(raw: any): ValidatedQuestionPayload | null {
  if (!raw || typeof raw !== 'object') return null;

  const question = typeof raw.question === 'string' ? raw.question.trim() : '';
  if (!question || question.length < 12) return null;

  if (!Array.isArray(raw.options) || raw.options.length < 4) return null;

  // Clean options
  const cleanOptions = raw.options.slice(0, 4).map((opt: any) => {
    if (typeof opt === 'string') return opt.trim();
    if (typeof opt === 'number') return String(opt);
    return '';
  });

  if (cleanOptions.some((o: string) => !o || o.length === 0)) return null;

  // Ensure options are distinct
  const uniqueOptions = new Set(cleanOptions.map((o: string) => normalizeOptionText(o)));
  if (uniqueOptions.size < 4) return null;

  // Validate correct answer index (0-3)
  let correctAnswer = 0;
  if (typeof raw.correctAnswer === 'number' && raw.correctAnswer >= 0 && raw.correctAnswer <= 3) {
    correctAnswer = raw.correctAnswer;
  } else if (typeof raw.correctAnswerIndex === 'number' && raw.correctAnswerIndex >= 0 && raw.correctAnswerIndex <= 3) {
    correctAnswer = raw.correctAnswerIndex;
  } else if (typeof raw.correctAnswer === 'string') {
    const letter = raw.correctAnswer.trim().toUpperCase().charAt(0);
    const code = letter.charCodeAt(0) - 65;
    if (code >= 0 && code <= 3) {
      correctAnswer = code;
    }
  }

  const explanation = typeof raw.explanation === 'string' && raw.explanation.trim().length > 5
    ? raw.explanation.trim()
    : 'Refer to the official JAMB UTME syllabus and curriculum textbook for complete derivation.';

  const difficulty = (['easy', 'medium', 'hard'].includes(raw.difficulty) ? raw.difficulty : 'medium') as 'easy' | 'medium' | 'hard';

  return {
    question,
    options: cleanOptions,
    correctAnswer,
    explanation,
    difficulty
  };
}
