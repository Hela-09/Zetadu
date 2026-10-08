import { Question } from '../components/Quiz';
import { GlobalSubject } from '../data/globalEducationCurricula';
import { JAMB_QUESTIONS } from '../data/jambQuestions';
import { CURRICULUM_QUESTIONS } from '../data/curriculumQuestions';
import { 
  filterQuestionsBySubjectStrict, 
  canonicalSubjectKey, 
  getCanonicalSubjectDisplayName 
} from './jambSubjectMatcher';

export interface SubjectQuestionRequest {
  subjectName: string;
  subjectId: string;
  questionCount: number;
}

export interface SubjectAvailabilityReport {
  subjectName: string;
  subjectId: string;
  canonicalKey: string;
  requestedCount: number;
  availableCount: number;
  isShortfall: boolean;
}

/**
 * Checks the exact number of authentic questions available for each requested subject.
 * Never counts or substitutes questions from other subjects.
 */
export function checkSubjectsAvailability(
  requests: SubjectQuestionRequest[],
  curriculumSubjects: GlobalSubject[] = []
): SubjectAvailabilityReport[] {
  return requests.map(req => {
    const canonicalKey = canonicalSubjectKey(req.subjectName || req.subjectId);
    const displayName = getCanonicalSubjectDisplayName(canonicalKey);

    // Count in JAMB question bank
    const jambCount = filterQuestionsBySubjectStrict(JAMB_QUESTIONS, canonicalKey).length;

    // Count in Curriculum topics
    const matchedCurriculumSub = curriculumSubjects.find(
      s => canonicalSubjectKey(s.name) === canonicalKey || canonicalSubjectKey(s.id) === canonicalKey
    );
    let topicCount = 0;
    if (matchedCurriculumSub?.officialTopics) {
      matchedCurriculumSub.officialTopics.forEach(t => {
        topicCount += t.practiceQuestions?.length || 0;
      });
    }

    const availableCount = Math.max(jambCount, topicCount > 0 ? (jambCount + topicCount) : jambCount);
    const requested = req.questionCount || 20;

    return {
      subjectName: displayName,
      subjectId: canonicalKey,
      canonicalKey,
      requestedCount: requested,
      availableCount,
      isShortfall: availableCount < requested
    };
  });
}

/**
 * Builds a clean, ordered array of authentic practice questions for single or multi-subject practice.
 * Strictly guarantees that each question belongs ONLY to the requested subject.
 * NEVER substitutes questions from another subject.
 * NEVER duplicates/cycles questions to artificially inflate count.
 */
export function buildPracticeQuestionsForSubjects(
  requests: SubjectQuestionRequest[],
  curriculumSubjects: GlobalSubject[] = []
): Question[] {
  const result: Question[] = [];

  for (const req of requests) {
    if (!req.questionCount || req.questionCount <= 0) continue;

    const targetKey = canonicalSubjectKey(req.subjectName || req.subjectId);
    const targetDisplayName = getCanonicalSubjectDisplayName(targetKey);

    const matchedSub = curriculumSubjects.find(
      s => canonicalSubjectKey(s.name) === targetKey || canonicalSubjectKey(s.id) === targetKey
    );

    const subQuestions: Question[] = [];
    const seenTexts = new Set<string>();

    // 1. Gather all official topic practice questions for this subject
    if (matchedSub && matchedSub.officialTopics) {
      matchedSub.officialTopics.forEach(topic => {
        if (topic.practiceQuestions && topic.practiceQuestions.length > 0) {
          topic.practiceQuestions.forEach((q, qIdx) => {
            const cleanText = q.question.trim().toLowerCase();
            if (seenTexts.has(cleanText)) return;
            seenTexts.add(cleanText);

            subQuestions.push({
              id: q.id || `topic_${targetKey}_${topic.id}_${qIdx}`,
              question: q.question,
              options: q.options,
              correctAnswer: q.correctAnswer,
              correctAnswerIndex: q.correctAnswer,
              explanation: q.explanation || `Refer to the ${targetDisplayName} official syllabus for detailed solution steps.`,
              difficulty: 'medium',
              topic: topic.name,
              subject: targetDisplayName,
              subjectId: targetKey,
              sourceType: 'curated_bank'
            });
          });
        }
      });
    }

    // 2. Add authentic questions from JAMB question bank (strictly isolated by canonical subject)
    const authenticJambPool = filterQuestionsBySubjectStrict(JAMB_QUESTIONS, targetKey);
    // Shuffle authentic pool to provide variety
    const shuffledJamb = [...authenticJambPool].sort(() => Math.random() - 0.5);

    for (const jq of shuffledJamb) {
      if (subQuestions.length >= req.questionCount) break;
      const cleanText = jq.question.trim().toLowerCase();
      if (seenTexts.has(cleanText)) continue;
      seenTexts.add(cleanText);

      subQuestions.push({
        id: jq.id,
        question: jq.passage ? `${jq.passage}\n\n${jq.question}` : jq.question,
        options: jq.options,
        correctAnswer: jq.correctAnswer,
        correctAnswerIndex: jq.correctAnswer,
        explanation: jq.explanation || `Official verified answer and syllabus explanation for ${targetDisplayName}.`,
        difficulty: 'medium',
        topic: jq.topic || `${targetDisplayName} Practice`,
        subject: targetDisplayName,
        subjectId: targetKey,
        year: jq.year,
        questionNumber: jq.questionNumber,
        sourceType: 'official_past_question'
      });
    }

    // 3. If more are needed, check CURRICULUM_QUESTIONS strictly matching this canonical subject
    if (subQuestions.length < req.questionCount) {
      const cPool = CURRICULUM_QUESTIONS.filter(cq => {
        const cqKey = canonicalSubjectKey(cq.subject);
        return cqKey === targetKey;
      });

      for (const cq of cPool) {
        if (subQuestions.length >= req.questionCount) break;
        const cleanText = cq.question.trim().toLowerCase();
        if (seenTexts.has(cleanText)) continue;
        seenTexts.add(cleanText);

        subQuestions.push({
          id: cq.id,
          question: cq.question,
          options: cq.options,
          correctAnswer: cq.correctAnswer,
          correctAnswerIndex: cq.correctAnswer,
          explanation: cq.explanation || `Curriculum explanation for ${targetDisplayName}.`,
          difficulty: 'medium',
          topic: cq.topic || `${targetDisplayName} Core`,
          subject: targetDisplayName,
          subjectId: targetKey,
          sourceType: 'curated_bank'
        });
      }
    }

    // NOTICE: Never cycle or duplicate questions, and NEVER substitute from other subjects!
    // If subQuestions has fewer than req.questionCount, return all available authentic questions.
    const selected = subQuestions.slice(0, req.questionCount);
    selected.forEach((q, idx) => {
      q.subject = targetDisplayName;
      q.subjectId = targetKey;
      q.questionNumber = idx + 1;
    });

    result.push(...selected);
  }

  return result;
}
