import { Question } from '../components/Quiz';
import { GlobalSubject } from '../data/globalEducationCurricula';
import { JAMB_QUESTIONS } from '../data/jambQuestions';
import { CURRICULUM_QUESTIONS } from '../data/curriculumQuestions';

export interface SubjectQuestionRequest {
  subjectName: string;
  subjectId: string;
  questionCount: number;
}

/**
 * Builds a clean, ordered array of authentic practice questions for single or multi-subject practice.
 * Guarantees that each question has its exact `subject` property set to the requested subjectName,
 * enabling Quiz.tsx to generate isolated multi-subject tabs with separate progress and scoring.
 */
export function buildPracticeQuestionsForSubjects(
  requests: SubjectQuestionRequest[],
  curriculumSubjects: GlobalSubject[] = []
): Question[] {
  const result: Question[] = [];

  for (const req of requests) {
    if (!req.questionCount || req.questionCount <= 0) continue;

    const matchedSub = curriculumSubjects.find(
      s => s.name.toLowerCase() === req.subjectName.toLowerCase() || s.id === req.subjectId
    );

    const subQuestions: Question[] = [];

    // 1. Gather all official topic practice questions for this subject
    if (matchedSub && matchedSub.officialTopics) {
      matchedSub.officialTopics.forEach(topic => {
        if (topic.practiceQuestions && topic.practiceQuestions.length > 0) {
          topic.practiceQuestions.forEach((q, qIdx) => {
            subQuestions.push({
              id: q.id || `topic_${matchedSub.id}_${topic.id}_${qIdx}`,
              question: q.question,
              options: q.options,
              correctAnswer: q.correctAnswer,
              correctAnswerIndex: q.correctAnswer,
              explanation: q.explanation || `Refer to the ${matchedSub.name} official syllabus for detailed solution steps.`,
              difficulty: 'medium',
              topic: topic.name,
              subject: req.subjectName,
              subjectId: req.subjectId,
              sourceType: 'curated_bank'
            });
          });
        }
      });
    }

    // 2. If more questions are required, match against JAMB authentic past questions
    if (subQuestions.length < req.questionCount) {
      const norm = req.subjectName.toLowerCase();
      let matchedJambKey = '';

      if (norm.includes('math') || norm.includes('calculus') || norm.includes('algebra') || norm.includes('arithmetic')) {
        matchedJambKey = 'mathematics';
      } else if (norm.includes('english') || norm.includes('reading') || norm.includes('literature') || norm.includes('grammar') || norm.includes('linguag')) {
        matchedJambKey = 'english';
      } else if (norm.includes('physic') || norm.includes('física') || norm.includes('physique')) {
        matchedJambKey = 'physics';
      } else if (norm.includes('chem') || norm.includes('química') || norm.includes('chimie')) {
        matchedJambKey = 'chemistry';
      } else if (norm.includes('biol') || norm.includes('life science') || norm.includes('svt') || norm.includes('natureza')) {
        matchedJambKey = 'biology';
      } else if (norm.includes('econ') || norm.includes('business') || norm.includes('finance')) {
        matchedJambKey = 'economics';
      } else if (norm.includes('gov') || norm.includes('politic') || norm.includes('humanas')) {
        matchedJambKey = 'government';
      } else if (norm.includes('comm') || norm.includes('trade')) {
        matchedJambKey = 'commerce';
      } else if (norm.includes('account') || norm.includes('bookkeeping')) {
        matchedJambKey = 'accounts';
      } else if (norm.includes('agric')) {
        matchedJambKey = 'agriculture';
      } else if (norm.includes('geog')) {
        matchedJambKey = 'geography';
      } else if (norm.includes('hist')) {
        matchedJambKey = 'history';
      } else if (norm.includes('civic') || norm.includes('social studies')) {
        matchedJambKey = 'civic';
      } else if (norm.includes('computer') || norm.includes('ict') || norm.includes('technology')) {
        matchedJambKey = 'computer';
      }

      if (matchedJambKey) {
        const pool = JAMB_QUESTIONS.filter(q => q.subject === matchedJambKey);
        // Deterministic or pseudo-random shuffle to provide fresh questions
        const shuffled = [...pool].sort(() => Math.random() - 0.5);

        for (const jq of shuffled) {
          if (subQuestions.length >= req.questionCount) break;
          // Avoid duplicate question text
          if (!subQuestions.some(sq => sq.question.trim().toLowerCase() === jq.question.trim().toLowerCase())) {
            subQuestions.push({
              id: jq.id,
              question: jq.passage ? `${jq.passage}\n\n${jq.question}` : jq.question,
              options: jq.options,
              correctAnswer: jq.correctAnswer,
              correctAnswerIndex: jq.correctAnswer,
              explanation: jq.explanation || `Official verified answer and syllabus explanation for ${req.subjectName}.`,
              difficulty: 'medium',
              topic: jq.topic || `${req.subjectName} Practice`,
              subject: req.subjectName,
              subjectId: req.subjectId,
              year: jq.year,
              sourceType: 'official_past_question'
            });
          }
        }
      }
    }

    // 3. If still needed, match against CURRICULUM_QUESTIONS
    if (subQuestions.length < req.questionCount) {
      const norm = req.subjectName.toLowerCase();
      const cPool = CURRICULUM_QUESTIONS.filter(
        cq => cq.subject.toLowerCase().includes(norm) || norm.includes(cq.subject.toLowerCase())
      );

      for (const cq of cPool) {
        if (subQuestions.length >= req.questionCount) break;
        if (!subQuestions.some(sq => sq.question.trim().toLowerCase() === cq.question.trim().toLowerCase())) {
          subQuestions.push({
            id: cq.id,
            question: cq.question,
            options: cq.options,
            correctAnswer: cq.correctAnswer,
            correctAnswerIndex: cq.correctAnswer,
            explanation: cq.explanation || `Curriculum explanation for ${req.subjectName}.`,
            difficulty: 'medium',
            topic: cq.topic || `${req.subjectName} Core`,
            subject: req.subjectName,
            subjectId: req.subjectId,
            sourceType: 'curated_bank'
          });
        }
      }
    }

    // 4. Fallback if questions are fewer than requested: loop available questions with unique IDs
    if (subQuestions.length > 0 && subQuestions.length < req.questionCount) {
      const existingLen = subQuestions.length;
      let counter = 0;
      while (subQuestions.length < req.questionCount) {
        const baseQ = subQuestions[counter % existingLen];
        subQuestions.push({
          ...baseQ,
          id: `${baseQ.id}_cycle_${counter}`
        });
        counter++;
      }
    }

    // Slice to exact count and ensure subject name consistency
    const selected = subQuestions.slice(0, req.questionCount);
    selected.forEach((q, idx) => {
      q.subject = req.subjectName;
      q.questionNumber = idx + 1;
    });

    result.push(...selected);
  }

  return result;
}
