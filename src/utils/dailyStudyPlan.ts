import { db, isFirestoreQuotaExhausted } from '../lib/firebase';
import { doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { DailyStudyPlan, DailyStudyTask } from '../types';
import { fetchStudentTopicAnalysis, StudentTopicAnalysis, TopicResultSummary } from './weakTopics';

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getTodayStartTimestamp(): number {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  return start.getTime();
}

/**
 * Calculates how many questions the user answered today across quizzes/journeys
 */
export async function getQuestionsAnsweredToday(userId: string): Promise<number> {
  if (!userId) return 0;
  const todayStr = getTodayDateString();
  const startOfDayMs = getTodayStartTimestamp();

  let countFromFirestore = 0;
  try {
    const q = query(collection(db, 'learning_data'), where('uid', '==', userId));
    const snap = await getDocs(q);
    snap.forEach((d) => {
      const data = d.data();
      const ts =
        data.updatedAt?.toMillis?.() ||
        data.createdAt?.toMillis?.() ||
        (data.timestamp ? new Date(data.timestamp).getTime() : 0);
      if (ts >= startOfDayMs) {
        countFromFirestore += data.totalQuestions || data.answeredQuestions?.length || 0;
      }
    });
  } catch (err) {
    console.warn('Could not query learning_data for today questions:', err);
  }

  // Also check local counter
  let countFromLocal = 0;
  try {
    const local = localStorage.getItem(`zetadu_today_questions_${userId}_${todayStr}`);
    if (local) countFromLocal = parseInt(local, 10) || 0;
  } catch (e) {}

  return Math.max(countFromFirestore, countFromLocal);
}

/**
 * Calculates how many flashcards the user reviewed today
 */
export async function getFlashcardsStudiedToday(userId: string): Promise<number> {
  if (!userId) return 0;
  const todayStr = getTodayDateString();
  const startOfDayMs = getTodayStartTimestamp();

  let countFromFirestore = 0;
  try {
    const q = query(collection(db, 'flashcards'), where('uid', '==', userId));
    const snap = await getDocs(q);
    snap.forEach((d) => {
      const data = d.data();
      if (data.lastReviewed && data.lastReviewed >= startOfDayMs) {
        countFromFirestore += 1;
      }
    });
  } catch (err) {
    console.warn('Could not query flashcards for today reviews:', err);
  }

  let countFromLocal = 0;
  try {
    const local = localStorage.getItem(`zetadu_today_flashcards_${userId}_${todayStr}`);
    if (local) countFromLocal = parseInt(local, 10) || 0;
  } catch (e) {}

  return Math.max(countFromFirestore, countFromLocal);
}

/**
 * Generates initial daily tasks for a user based on their weak topics and today's real progress
 */
export function buildTasksFromAnalysis(
  topicAnalysis: StudentTopicAnalysis,
  realQuestionsToday: number,
  realFlashcardsToday: number,
  mistakesReviewedToday: boolean
): {
  tasks: DailyStudyTask[];
  primaryTopic?: string;
  primarySubject?: string;
  primarySubjectId?: string;
  primaryAccuracy?: number;
} {
  const weak = topicAnalysis.weakTopics;
  const avg = topicAnalysis.averageTopics;

  let targetTopic: TopicResultSummary | undefined = undefined;
  let isWeak = false;

  if (weak.length > 0) {
    targetTopic = weak[0];
    isWeak = true;
  } else if (avg.length > 0) {
    targetTopic = avg[0];
  }

  // 1. Task: Flashcards (target 10)
  const flashcardCurrent = Math.min(10, realFlashcardsToday);
  const flashcardTask: DailyStudyTask = {
    id: 'task-flashcards',
    type: 'flashcards',
    title: 'Study 10 Flashcards',
    description: targetTopic
      ? `Review key terms & formulas for ${targetTopic.topic} (${targetTopic.subject})`
      : 'Review 10 flashcards in your subjects to reinforce memory',
    targetCount: 10,
    currentCount: flashcardCurrent,
    completed: flashcardCurrent >= 10,
    topic: targetTopic?.topic,
    subject: targetTopic?.subject,
    subjectId: targetTopic?.subjectId,
    actionText: 'Study Cards',
    mistakesCount: targetTopic?.incorrectCount || 0
  };

  // 2. Task: Practice Questions (target 20)
  const questionsCurrent = Math.min(20, realQuestionsToday);
  const questionsTask: DailyStudyTask = {
    id: 'task-questions',
    type: 'questions',
    title: 'Answer 20 Practice Questions',
    description: targetTopic
      ? `Master ${targetTopic.topic} (currently at ${targetTopic.accuracy}% accuracy)`
      : 'Answer 20 questions to assess your understanding',
    targetCount: 20,
    currentCount: questionsCurrent,
    completed: questionsCurrent >= 20,
    topic: targetTopic?.topic,
    subject: targetTopic?.subject,
    subjectId: targetTopic?.subjectId,
    actionText: 'Start Practice',
    mistakesCount: targetTopic?.incorrectCount || 0
  };

  // 3. Task: Review Mistakes
  const mistakesCount = targetTopic?.incorrectCount || 0;
  const mistakesTask: DailyStudyTask = {
    id: 'task-review-mistakes',
    type: 'review_mistakes',
    title: 'Review Mistakes',
    description: targetTopic && mistakesCount > 0
      ? `Review ${mistakesCount} missed question${mistakesCount > 1 ? 's' : ''} in ${targetTopic.topic}`
      : targetTopic
      ? `Review past mistakes & explanations in ${targetTopic.topic}`
      : 'Review past mistakes & explanations to prevent repeating errors',
    targetCount: 1,
    currentCount: mistakesReviewedToday ? 1 : 0,
    completed: mistakesReviewedToday,
    topic: targetTopic?.topic,
    subject: targetTopic?.subject,
    subjectId: targetTopic?.subjectId,
    actionText: 'Review Mistakes',
    mistakesCount: mistakesCount
  };

  return {
    tasks: [flashcardTask, questionsTask, mistakesTask],
    primaryTopic: targetTopic?.topic,
    primarySubject: targetTopic?.subject,
    primarySubjectId: targetTopic?.subjectId,
    primaryAccuracy: targetTopic?.accuracy
  };
}

/**
 * Fetch or initialize the Daily Study Plan for today
 */
export async function getDailyStudyPlan(userId: string): Promise<DailyStudyPlan> {
  const todayStr = getTodayDateString();

  if (!userId) {
    const emptyAnalysis: StudentTopicAnalysis = {
      weakTopics: [],
      averageTopics: [],
      strongTopics: [],
      allTopics: [],
      totalQuestionsAttempted: 0,
      totalCorrect: 0,
      overallAccuracy: 0,
      hasResults: false
    };
    const { tasks } = buildTasksFromAnalysis(emptyAnalysis, 0, 0, false);
    return {
      uid: 'guest',
      date: todayStr,
      tasks,
      completedCount: 0,
      totalTasks: tasks.length,
      allCompleted: false,
      updatedAt: Date.now()
    };
  }

  // 1. Fetch real performance diagnostics & today's progress
  const [topicAnalysis, realQuestionsToday, realFlashcardsToday] = await Promise.all([
    fetchStudentTopicAnalysis(userId),
    getQuestionsAnsweredToday(userId),
    getFlashcardsStudiedToday(userId)
  ]);

  let mistakesReviewedToday = false;
  try {
    const localReview = localStorage.getItem(`zetadu_mistakes_reviewed_${userId}_${todayStr}`);
    if (localReview === 'true') mistakesReviewedToday = true;
  } catch (e) {}

  // 2. Try loading stored plan from Firestore
  let storedPlan: DailyStudyPlan | null = null;
  try {
    const planRef = doc(db, 'daily_study_plans', userId);
    const snap = await getDoc(planRef);
    if (snap.exists()) {
      const data = snap.data() as DailyStudyPlan;
      if (data.date === todayStr) {
        storedPlan = data;
      }
    }
  } catch (err) {
    console.warn('Could not read daily_study_plans from Firestore:', err);
  }

  // Fallback to localStorage if Firestore was offline or empty
  if (!storedPlan) {
    try {
      const local = localStorage.getItem(`zetadu_daily_plan_${userId}_${todayStr}`);
      if (local) {
        const parsed = JSON.parse(local);
        if (parsed && parsed.date === todayStr) {
          storedPlan = parsed;
        }
      }
    } catch (e) {}
  }

  // 3. If we don't have a plan for today, generate a fresh one
  if (!storedPlan) {
    const { tasks, primaryTopic, primarySubject, primarySubjectId, primaryAccuracy } =
      buildTasksFromAnalysis(
        topicAnalysis,
        realQuestionsToday,
        realFlashcardsToday,
        mistakesReviewedToday
      );

    const completedCount = tasks.filter((t) => t.completed).length;
    const newPlan: DailyStudyPlan = {
      uid: userId,
      date: todayStr,
      tasks,
      primaryTopic,
      primarySubject,
      primarySubjectId,
      primaryAccuracy,
      completedCount,
      totalTasks: tasks.length,
      allCompleted: completedCount === tasks.length,
      updatedAt: Date.now()
    };

    await saveDailyStudyPlan(newPlan);
    return newPlan;
  }

  // 4. If we DO have a plan for today, synchronize it with the latest real-time progress
  let hasChanges = false;
  const updatedTasks = storedPlan.tasks.map((task) => {
    let current = task.currentCount;
    let completed = task.completed;

    if (task.type === 'questions') {
      const real = Math.min(task.targetCount, realQuestionsToday);
      if (real > current) {
        current = real;
        hasChanges = true;
      }
      if (current >= task.targetCount && !completed) {
        completed = true;
        hasChanges = true;
      }
    } else if (task.type === 'flashcards') {
      const real = Math.min(task.targetCount, realFlashcardsToday);
      if (real > current) {
        current = real;
        hasChanges = true;
      }
      if (current >= task.targetCount && !completed) {
        completed = true;
        hasChanges = true;
      }
    } else if (task.type === 'review_mistakes') {
      if (mistakesReviewedToday && !completed) {
        current = 1;
        completed = true;
        hasChanges = true;
      }
    }

    return {
      ...task,
      currentCount: current,
      completed
    };
  });

  const completedCount = updatedTasks.filter((t) => t.completed).length;
  const updatedPlan: DailyStudyPlan = {
    ...storedPlan,
    tasks: updatedTasks,
    completedCount,
    allCompleted: completedCount === updatedTasks.length,
    updatedAt: Date.now()
  };

  if (hasChanges) {
    await saveDailyStudyPlan(updatedPlan);
  }

  return updatedPlan;
}

/**
 * Persists daily study plan to Firestore and localStorage
 */
export async function saveDailyStudyPlan(plan: DailyStudyPlan): Promise<void> {
  try {
    localStorage.setItem(`zetadu_daily_plan_${plan.uid}_${plan.date}`, JSON.stringify(plan));
  } catch (e) {}

  if (plan.uid && plan.uid !== 'guest' && !isFirestoreQuotaExhausted()) {
    try {
      const planRef = doc(db, 'daily_study_plans', plan.uid);
      await setDoc(planRef, plan, { merge: true });
    } catch (err) {
      console.warn('Could not save daily study plan to Firestore:', err);
    }
  }
}

/**
 * Toggle a task's completed state directly (e.g. checkbox click)
 */
export async function toggleDailyTaskCompleted(
  plan: DailyStudyPlan,
  taskId: string
): Promise<DailyStudyPlan> {
  const updatedTasks = plan.tasks.map((task) => {
    if (task.id === taskId) {
      const nextCompleted = !task.completed;
      return {
        ...task,
        completed: nextCompleted,
        currentCount: nextCompleted ? task.targetCount : 0
      };
    }
    return task;
  });

  const completedCount = updatedTasks.filter((t) => t.completed).length;
  const updatedPlan: DailyStudyPlan = {
    ...plan,
    tasks: updatedTasks,
    completedCount,
    allCompleted: completedCount === updatedTasks.length,
    updatedAt: Date.now()
  };

  // If review mistakes was toggled on, remember locally
  const mistakeTask = updatedTasks.find((t) => t.type === 'review_mistakes');
  if (mistakeTask) {
    try {
      localStorage.setItem(
        `zetadu_mistakes_reviewed_${plan.uid}_${plan.date}`,
        mistakeTask.completed ? 'true' : 'false'
      );
    } catch (e) {}
  }

  await saveDailyStudyPlan(updatedPlan);
  return updatedPlan;
}

/**
 * Mark mistakes as reviewed
 */
export async function markMistakesReviewed(userId: string): Promise<void> {
  const todayStr = getTodayDateString();
  try {
    localStorage.setItem(`zetadu_mistakes_reviewed_${userId}_${todayStr}`, 'true');
  } catch (e) {}

  // Update plan if loaded
  try {
    const plan = await getDailyStudyPlan(userId);
    const updatedTasks = plan.tasks.map((t) => {
      if (t.type === 'review_mistakes') {
        return {
          ...t,
          completed: true,
          currentCount: 1
        };
      }
      return t;
    });

    const completedCount = updatedTasks.filter((t) => t.completed).length;
    await saveDailyStudyPlan({
      ...plan,
      tasks: updatedTasks,
      completedCount,
      allCompleted: completedCount === updatedTasks.length,
      updatedAt: Date.now()
    });
  } catch (e) {}
}
