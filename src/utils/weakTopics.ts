import { db } from '../lib/firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { ALL_SUBJECTS } from '../data/subjects';

export type TopicPerformanceCategory = 'weak' | 'average' | 'strong';

export interface TopicMistakeDetail {
  question: string;
  userAnswer?: string | number;
  correctAnswer?: string | number;
  options?: string[];
  explanation?: string;
}

export interface TopicResultSummary {
  topic: string;
  subject: string;
  subjectId: string;
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  accuracy: number;
  category: TopicPerformanceCategory;
  lastAttempted?: number;
  mistakes?: string[];
  mistakeDetails?: TopicMistakeDetail[];
}

export interface StudentTopicAnalysis {
  weakTopics: TopicResultSummary[];
  averageTopics: TopicResultSummary[];
  strongTopics: TopicResultSummary[];
  allTopics: TopicResultSummary[];
  totalQuestionsAttempted: number;
  totalCorrect: number;
  overallAccuracy: number;
  hasResults: boolean;
}

export function getSubjectIdFromName(subjectName: string): string {
  if (!subjectName) return 'mathematics';
  const clean = subjectName.trim().toLowerCase();
  const matched = ALL_SUBJECTS.find(
    (s) => s.name.toLowerCase() === clean || s.id.toLowerCase() === clean
  );
  if (matched) return matched.id;

  if (clean.includes('math')) return 'mathematics';
  if (clean.includes('english')) return 'english';
  if (clean.includes('physic')) return 'physics';
  if (clean.includes('chem')) return 'chemistry';
  if (clean.includes('bio')) return 'biology';
  if (clean.includes('econ')) return 'economics';
  if (clean.includes('gov')) return 'government';
  if (clean.includes('lit')) return 'literature';
  if (clean.includes('agric')) return 'agric';
  if (clean.includes('civic')) return 'civic';
  if (clean.includes('account')) return 'accounting';
  if (clean.includes('commerce')) return 'commerce';
  if (clean.includes('geog')) return 'geography';
  if (clean.includes('history')) return 'history';
  if (clean.includes('comput')) return 'computer';
  if (clean.includes('data')) return 'data-processing';
  if (clean.includes('business')) return 'business-studies';
  if (clean.includes('french')) return 'french';

  return clean.replace(/[^a-z0-9]/g, '-') || 'mathematics';
}

export async function fetchStudentTopicAnalysis(userId: string): Promise<StudentTopicAnalysis> {
  if (!userId) {
    return {
      weakTopics: [],
      averageTopics: [],
      strongTopics: [],
      allTopics: [],
      totalQuestionsAttempted: 0,
      totalCorrect: 0,
      overallAccuracy: 0,
      hasResults: false
    };
  }

  const topicMap: Record<
    string,
    {
      topic: string;
      subject: string;
      total: number;
      correct: number;
      lastAttempted: number;
      mistakes: string[];
      mistakeDetails: TopicMistakeDetail[];
    }
  > = {};

  let totalQuestionsCount = 0;
  let totalCorrectCount = 0;

  // 1. Fetch practice results from `learning_data`
  try {
    const learningDataRef = collection(db, 'learning_data');
    const q = query(learningDataRef, where('uid', '==', userId));
    const snap = await getDocs(q);

    snap.forEach((d) => {
      const data = d.data();
      const fallbackSubject = data.subject || 'General';
      const fallbackTopic = data.topic || fallbackSubject;
      const timestamp = data.updatedAt?.toMillis?.() || data.createdAt?.toMillis?.() || Date.now();

      if (data.answeredQuestions && Array.isArray(data.answeredQuestions) && data.answeredQuestions.length > 0) {
        data.answeredQuestions.forEach((qItem: any) => {
          const tName = (qItem.topic || data.topic || fallbackTopic || fallbackSubject).trim();
          const sName = (data.subject || fallbackSubject).trim();
          const key = `${sName}:::${tName.toLowerCase()}`;

          if (!topicMap[key]) {
            topicMap[key] = {
              topic: tName,
              subject: sName,
              total: 0,
              correct: 0,
              lastAttempted: timestamp,
              mistakes: [],
              mistakeDetails: []
            };
          }

          topicMap[key].total += 1;
          totalQuestionsCount += 1;

          let isCorrect = false;
          const userAns = qItem.userAnswerIndex !== undefined ? qItem.userAnswerIndex : qItem.userAnswer;
          const correctVal = qItem.correctAnswerIndex !== undefined ? qItem.correctAnswerIndex : qItem.correctAnswer;

          if (userAns !== undefined && userAns !== null && userAns !== -1) {
            if (typeof correctVal === 'number' && correctVal === userAns) {
              isCorrect = true;
            } else if (typeof correctVal === 'string') {
              const norm = correctVal.trim().toLowerCase();
              let expectedIdx = -1;
              if (['a', 'b', 'c', 'd'].includes(norm)) {
                expectedIdx = norm.charCodeAt(0) - 97;
              } else if (qItem.options) {
                expectedIdx = qItem.options.findIndex(
                  (opt: any) => typeof opt === 'string' && opt.trim().toLowerCase() === norm
                );
              }
              if (expectedIdx === -1 && !isNaN(Number(norm))) {
                expectedIdx = Number(norm);
              }
              if (expectedIdx === userAns) isCorrect = true;
            }
          }

          if (isCorrect) {
            topicMap[key].correct += 1;
            totalCorrectCount += 1;
          } else {
            if (qItem.question && topicMap[key].mistakes.length < 10) {
              topicMap[key].mistakes.push(qItem.question);
            }
            if (qItem.question && topicMap[key].mistakeDetails.length < 10) {
              topicMap[key].mistakeDetails.push({
                question: qItem.question,
                userAnswer: userAns,
                correctAnswer: correctVal,
                options: qItem.options,
                explanation: qItem.explanation
              });
            }
          }
        });
      } else {
        // Fallback for aggregate records
        const tName = (data.topic || fallbackTopic || fallbackSubject).trim();
        const sName = (data.subject || fallbackSubject).trim();
        const key = `${sName}:::${tName.toLowerCase()}`;
        const qCount = data.totalQuestions || 0;
        const sCount = data.score || 0;

        if (qCount > 0) {
          if (!topicMap[key]) {
            topicMap[key] = {
              topic: tName,
              subject: sName,
              total: 0,
              correct: 0,
              lastAttempted: timestamp,
              mistakes: [],
              mistakeDetails: []
            };
          }

          topicMap[key].total += qCount;
          topicMap[key].correct += sCount;
          totalQuestionsCount += qCount;
          totalCorrectCount += sCount;
        }
      }
    });
  } catch (err) {
    console.warn('Could not query learning_data for weak topics:', err);
  }

  // 2. Fetch results from `study_journeys`
  try {
    const journeySnap = await getDoc(doc(db, 'study_journeys', userId));
    let journeyData: any = null;
    if (journeySnap.exists()) {
      journeyData = journeySnap.data();
    } else {
      const local = localStorage.getItem('zetadu_active_study_journey');
      if (local) {
        journeyData = JSON.parse(local);
      }
    }

    if (journeyData && journeyData.topic && journeyData.subject) {
      const sName = journeyData.subject.trim();
      const tName = journeyData.topic.trim();
      const key = `${sName}:::${tName.toLowerCase()}`;

      // Practice results
      if (journeyData.practiceResults && journeyData.practiceResults.total > 0) {
        const pTotal = journeyData.practiceResults.total || 0;
        const pCorrect = journeyData.practiceResults.correct || 0;

        // If not already counted from learning_data
        if (!topicMap[key] || topicMap[key].total === 0) {
          topicMap[key] = {
            topic: tName,
            subject: sName,
            total: pTotal,
            correct: pCorrect,
            lastAttempted: journeyData.updatedAt || Date.now(),
            mistakes: (journeyData.practiceResults.mistakes || [])
              .map((m: any) => m.question || m)
              .filter(Boolean)
              .slice(0, 5),
            mistakeDetails: (journeyData.practiceResults.mistakes || [])
              .filter((m: any) => m && m.question)
              .slice(0, 5)
              .map((m: any) => ({
                question: m.question,
                userAnswer: m.userAnswer,
                correctAnswer: m.correctAnswer,
                explanation: m.explanation
              }))
          };
          totalQuestionsCount += pTotal;
          totalCorrectCount += pCorrect;
        }
      }
    }
  } catch (err) {
    console.warn('Could not query study_journeys for weak topics:', err);
  }

  // 3. Fallback: check localStorage completed session if Firestore is empty
  if (totalQuestionsCount === 0) {
    try {
      const cached = localStorage.getItem('practice_session');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.isSubmitted && parsed.questions && parsed.questions.length > 0) {
          const sName = parsed.subject || 'Mathematics';
          const tName = parsed.topic || sName;
          const key = `${sName}:::${tName.toLowerCase()}`;

          let correct = 0;
          const localMistakes: string[] = [];
          const localMistakeDetails: TopicMistakeDetail[] = [];

          parsed.questions.forEach((q: any, idx: number) => {
            const userAns = parsed.answers ? parsed.answers[idx] : undefined;
            if (userAns !== undefined && userAns === q.correctAnswer) {
              correct += 1;
            } else {
              if (q.question && localMistakes.length < 10) {
                localMistakes.push(q.question);
                localMistakeDetails.push({
                  question: q.question,
                  userAnswer: userAns,
                  correctAnswer: q.correctAnswer,
                  options: q.options,
                  explanation: q.explanation
                });
              }
            }
          });

          topicMap[key] = {
            topic: tName,
            subject: sName,
            total: parsed.questions.length,
            correct,
            lastAttempted: parsed.updatedAt || Date.now(),
            mistakes: localMistakes,
            mistakeDetails: localMistakeDetails
          };
          totalQuestionsCount += parsed.questions.length;
          totalCorrectCount += correct;
        }
      }
    } catch (e) {}
  }

  // 4. Transform and categorize all topics
  const allSummaries: TopicResultSummary[] = Object.values(topicMap).map((item) => {
    const accuracy = item.total > 0 ? Math.round((item.correct / item.total) * 100) : 0;
    let category: TopicPerformanceCategory;

    // Strict classification:
    // Weak: < 50%
    // Average: 50% - 74%
    // Strong: >= 75%
    if (accuracy < 50) {
      category = 'weak';
    } else if (accuracy < 75) {
      category = 'average';
    } else {
      category = 'strong';
    }

    return {
      topic: item.topic,
      subject: item.subject,
      subjectId: getSubjectIdFromName(item.subject),
      totalQuestions: item.total,
      correctCount: item.correct,
      incorrectCount: Math.max(0, item.total - item.correct),
      accuracy,
      category,
      lastAttempted: item.lastAttempted,
      mistakes: item.mistakes,
      mistakeDetails: item.mistakeDetails
    };
  });

  // Weak topics sorted by lowest accuracy first, then by most questions
  const weakTopics = allSummaries
    .filter((t) => t.category === 'weak')
    .sort((a, b) => a.accuracy - b.accuracy || b.totalQuestions - a.totalQuestions);

  // Average topics sorted by accuracy ascending
  const averageTopics = allSummaries
    .filter((t) => t.category === 'average')
    .sort((a, b) => a.accuracy - b.accuracy);

  // Strong topics sorted by highest accuracy descending
  const strongTopics = allSummaries
    .filter((t) => t.category === 'strong')
    .sort((a, b) => b.accuracy - a.accuracy || b.totalQuestions - a.totalQuestions);

  const overallAccuracy =
    totalQuestionsCount > 0 ? Math.round((totalCorrectCount / totalQuestionsCount) * 100) : 0;

  return {
    weakTopics,
    averageTopics,
    strongTopics,
    allTopics: allSummaries,
    totalQuestionsAttempted: totalQuestionsCount,
    totalCorrect: totalCorrectCount,
    overallAccuracy,
    hasResults: allSummaries.length > 0
  };
}
