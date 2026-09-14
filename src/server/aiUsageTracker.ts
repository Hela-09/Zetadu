import fs from 'fs';
import path from 'path';

export type AiUsageCategory = 'tutor' | 'practice' | 'flashcards';

export interface AiRequestLog {
  id: string;
  uid: string;
  email: string;
  displayName: string;
  category: AiUsageCategory;
  model: string;
  timestamp: number;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  estimatedCost: number;
}

export interface CategoryStat {
  requests: number;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  estimatedCost: number;
}

export interface DailyUsageStat {
  date: string;
  requests: number;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  cost: number;
  tutorRequests: number;
  practiceGenerations: number;
  flashcardGenerations: number;
  byCategory: {
    tutor: CategoryStat;
    practice: CategoryStat;
    flashcards: CategoryStat;
  };
}

export interface UserAiUsageRecord {
  uid: string;
  email: string;
  displayName?: string;
  requestsCount: number;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  tutorRequests: number;
  practiceGenerations: number;
  flashcardGenerations: number;
  estimatedCost: number;
  lastUsedAt: number | null;
  byCategory: {
    tutor: CategoryStat;
    practice: CategoryStat;
    flashcards: CategoryStat;
  };
  dailyStats: Record<string, DailyUsageStat>;
}

export interface SuperAdminAiStats {
  totalRequestsToday: number;
  totalRequestsMonth: number;
  totalTokensUsed: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  estimatedCostToday: number;
  estimatedCostMonth: number;
  totalEstimatedCost: number;
  usagePerUser: Array<{
    uid: string;
    email: string;
    displayName?: string;
    requestsCount: number;
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
    tutorRequests: number;
    practiceGenerations: number;
    flashcardGenerations: number;
    estimatedCost: number;
    lastUsedAt: number | null;
  }>;
  mostActiveUsers: Array<{
    uid: string;
    email: string;
    displayName?: string;
    requestsCount: number;
    totalTokens: number;
    estimatedCost: number;
    lastUsedAt: number | null;
  }>;
  usageByCategory: {
    tutor: CategoryStat;
    practice: CategoryStat;
    flashcards: CategoryStat;
  };
  recentLogs?: AiRequestLog[];
}

interface PersistentAiStore {
  users: Record<string, UserAiUsageRecord>;
  logs: AiRequestLog[];
  categoryTotals: {
    tutor: CategoryStat;
    practice: CategoryStat;
    flashcards: CategoryStat;
  };
}

function createEmptyCategoryStat(): CategoryStat {
  return {
    requests: 0,
    inputTokens: 0,
    outputTokens: 0,
    totalTokens: 0,
    estimatedCost: 0
  };
}

// In-memory store
const usageStore: PersistentAiStore = {
  users: {},
  logs: [],
  categoryTotals: {
    tutor: createEmptyCategoryStat(),
    practice: createEmptyCategoryStat(),
    flashcards: createEmptyCategoryStat()
  }
};

// Request deduplication cache (requestId -> timestamp)
const processedRequestIds = new Map<string, number>();

function cleanProcessedIds() {
  const now = Date.now();
  const maxAge = 15 * 60 * 1000; // 15 minutes
  for (const [key, ts] of processedRequestIds.entries()) {
    if (now - ts > maxAge) {
      processedRequestIds.delete(key);
    }
  }
}

// Storage file paths
const STORAGE_FILE_LOCAL = path.resolve(process.cwd(), 'ai_usage_store.json');
const STORAGE_FILE_TMP = '/tmp/zetadu_ai_usage_store.json';

// Load store on startup
function loadUsageStore() {
  const candidates = [STORAGE_FILE_LOCAL, STORAGE_FILE_TMP];
  for (const filePath of candidates) {
    try {
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          // Check if format is new (has .users) or legacy (object of users)
          if (parsed.users && typeof parsed.users === 'object') {
            usageStore.users = parsed.users;
            usageStore.logs = Array.isArray(parsed.logs) ? parsed.logs : [];
            if (parsed.categoryTotals) {
              usageStore.categoryTotals = {
                tutor: { ...createEmptyCategoryStat(), ...(parsed.categoryTotals.tutor || {}) },
                practice: { ...createEmptyCategoryStat(), ...(parsed.categoryTotals.practice || {}) },
                flashcards: { ...createEmptyCategoryStat(), ...(parsed.categoryTotals.flashcards || {}) }
              };
            }
          } else {
            // Legacy format migration
            usageStore.users = parsed;
          }
          return;
        }
      }
    } catch (err) {
      console.warn('[AI Usage] Error reading storage file:', filePath, err);
    }
  }
}

// Debounced flush to file
let saveTimeout: NodeJS.Timeout | null = null;
function persistUsageStore() {
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    const data = JSON.stringify(usageStore, null, 2);
    try {
      fs.writeFileSync(STORAGE_FILE_LOCAL, data, 'utf-8');
    } catch (_) {}
    try {
      fs.writeFileSync(STORAGE_FILE_TMP, data, 'utf-8');
    } catch (_) {}
  }, 500);
}

// Initialize on module load
loadUsageStore();

function getTodayString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getCurrentMonthPrefix(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

// Gemini Flash pricing ($0.10 / 1M input tokens, $0.40 / 1M output tokens)
export function calculateGeminiCost(inputTokens: number, outputTokens: number): number {
  const safeIn = Math.max(0, Number(inputTokens) || 0);
  const safeOut = Math.max(0, Number(outputTokens) || 0);
  const inputCost = (safeIn * 0.10) / 1000000;
  const outputCost = (safeOut * 0.40) / 1000000;
  return Number((inputCost + outputCost).toFixed(7));
}

export function recordAiUsage(params: {
  uid: string;
  email?: string;
  displayName?: string;
  category: AiUsageCategory;
  model: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens?: number;
  requestId?: string;
}): AiRequestLog | null {
  const { uid, category, model } = params;
  if (!uid) return null;

  // Deduplication check
  if (params.requestId) {
    cleanProcessedIds();
    if (processedRequestIds.has(params.requestId)) {
      console.warn(`[AI Usage] Duplicate request prevented for requestId: ${params.requestId}`);
      return null;
    }
    processedRequestIds.set(params.requestId, Date.now());
  }

  const inputTokens = Math.max(0, Math.round(Number(params.inputTokens) || 0));
  const outputTokens = Math.max(0, Math.round(Number(params.outputTokens) || 0));
  const totalTokens = Math.max(
    inputTokens + outputTokens,
    Math.round(Number(params.totalTokens) || (inputTokens + outputTokens))
  );
  const cost = calculateGeminiCost(inputTokens, outputTokens);
  const now = Date.now();
  const todayKey = getTodayString();
  const usedModel = model || 'gemini-3.8-flash';
  const email = params.email || '';
  const displayName = params.displayName || (email ? email.split('@')[0] : 'User');

  // 1. Create individual request log
  const logId = params.requestId || `req_${now}_${Math.random().toString(36).substring(2, 9)}`;
  const log: AiRequestLog = {
    id: logId,
    uid,
    email,
    displayName,
    category,
    model: usedModel,
    timestamp: now,
    inputTokens,
    outputTokens,
    totalTokens,
    estimatedCost: cost
  };

  usageStore.logs.unshift(log);
  // Cap logs to the last 5,000 requests to balance detailed auditability and memory
  if (usageStore.logs.length > 5000) {
    usageStore.logs.length = 5000;
  }

  // 2. Update category totals
  if (!usageStore.categoryTotals[category]) {
    usageStore.categoryTotals[category] = createEmptyCategoryStat();
  }
  const catTotal = usageStore.categoryTotals[category];
  catTotal.requests += 1;
  catTotal.inputTokens += inputTokens;
  catTotal.outputTokens += outputTokens;
  catTotal.totalTokens += totalTokens;
  catTotal.estimatedCost = Number((catTotal.estimatedCost + cost).toFixed(7));

  // 3. Initialize user record if not present
  if (!usageStore.users[uid]) {
    usageStore.users[uid] = {
      uid,
      email,
      displayName,
      requestsCount: 0,
      inputTokens: 0,
      outputTokens: 0,
      totalTokens: 0,
      tutorRequests: 0,
      practiceGenerations: 0,
      flashcardGenerations: 0,
      estimatedCost: 0,
      lastUsedAt: now,
      byCategory: {
        tutor: createEmptyCategoryStat(),
        practice: createEmptyCategoryStat(),
        flashcards: createEmptyCategoryStat()
      },
      dailyStats: {}
    };
  }

  const record = usageStore.users[uid];
  if (email && (!record.email || record.email === 'Anonymous')) record.email = email;
  if (displayName && (!record.displayName || record.displayName === 'User')) record.displayName = displayName;

  // Aggregate user lifetime totals
  record.requestsCount += 1;
  record.inputTokens += inputTokens;
  record.outputTokens += outputTokens;
  record.totalTokens += totalTokens;
  record.estimatedCost = Number((record.estimatedCost + cost).toFixed(7));
  record.lastUsedAt = now;

  if (category === 'tutor') record.tutorRequests += 1;
  else if (category === 'practice') record.practiceGenerations += 1;
  else if (category === 'flashcards') record.flashcardGenerations += 1;

  // Update user's category-specific breakdown
  if (!record.byCategory) {
    record.byCategory = {
      tutor: createEmptyCategoryStat(),
      practice: createEmptyCategoryStat(),
      flashcards: createEmptyCategoryStat()
    };
  }
  const userCat = record.byCategory[category];
  userCat.requests += 1;
  userCat.inputTokens += inputTokens;
  userCat.outputTokens += outputTokens;
  userCat.totalTokens += totalTokens;
  userCat.estimatedCost = Number((userCat.estimatedCost + cost).toFixed(7));

  // 4. Update user's daily stats
  if (!record.dailyStats[todayKey]) {
    record.dailyStats[todayKey] = {
      date: todayKey,
      requests: 0,
      inputTokens: 0,
      outputTokens: 0,
      totalTokens: 0,
      cost: 0,
      tutorRequests: 0,
      practiceGenerations: 0,
      flashcardGenerations: 0,
      byCategory: {
        tutor: createEmptyCategoryStat(),
        practice: createEmptyCategoryStat(),
        flashcards: createEmptyCategoryStat()
      }
    };
  }

  const daily = record.dailyStats[todayKey];
  daily.requests += 1;
  daily.inputTokens += inputTokens;
  daily.outputTokens += outputTokens;
  daily.totalTokens += totalTokens;
  daily.cost = Number((daily.cost + cost).toFixed(7));

  if (category === 'tutor') daily.tutorRequests += 1;
  else if (category === 'practice') daily.practiceGenerations += 1;
  else if (category === 'flashcards') daily.flashcardGenerations += 1;

  if (!daily.byCategory) {
    daily.byCategory = {
      tutor: createEmptyCategoryStat(),
      practice: createEmptyCategoryStat(),
      flashcards: createEmptyCategoryStat()
    };
  }
  const dailyCat = daily.byCategory[category];
  dailyCat.requests += 1;
  dailyCat.inputTokens += inputTokens;
  dailyCat.outputTokens += outputTokens;
  dailyCat.totalTokens += totalTokens;
  dailyCat.estimatedCost = Number((dailyCat.estimatedCost + cost).toFixed(7));

  persistUsageStore();
  return log;
}

export function getUserAiUsage(uid: string) {
  if (!uid || !usageStore.users[uid]) {
    return {
      requestsCount: 0,
      inputTokens: 0,
      outputTokens: 0,
      totalTokens: 0,
      tutorRequests: 0,
      practiceGenerations: 0,
      flashcardGenerations: 0,
      estimatedCost: 0,
      lastUsedAt: null,
      byCategory: {
        tutor: createEmptyCategoryStat(),
        practice: createEmptyCategoryStat(),
        flashcards: createEmptyCategoryStat()
      }
    };
  }

  const record = usageStore.users[uid];
  return {
    requestsCount: record.requestsCount,
    inputTokens: record.inputTokens,
    outputTokens: record.outputTokens,
    totalTokens: record.totalTokens,
    tutorRequests: record.tutorRequests,
    practiceGenerations: record.practiceGenerations,
    flashcardGenerations: record.flashcardGenerations,
    estimatedCost: Number(record.estimatedCost.toFixed(6)),
    lastUsedAt: record.lastUsedAt,
    byCategory: record.byCategory || {
      tutor: createEmptyCategoryStat(),
      practice: createEmptyCategoryStat(),
      flashcards: createEmptyCategoryStat()
    }
  };
}

export function getSuperAdminAiStats(): SuperAdminAiStats {
  const todayKey = getTodayString();
  const monthKey = getCurrentMonthPrefix();

  let totalRequestsToday = 0;
  let totalRequestsMonth = 0;
  let totalTokensUsed = 0;
  let totalInputTokens = 0;
  let totalOutputTokens = 0;
  let estimatedCostToday = 0;
  let estimatedCostMonth = 0;
  let totalEstimatedCost = 0;

  const usageByCategory = {
    tutor: createEmptyCategoryStat(),
    practice: createEmptyCategoryStat(),
    flashcards: createEmptyCategoryStat()
  };

  const userRecords = Object.values(usageStore.users);

  for (const u of userRecords) {
    totalTokensUsed += u.totalTokens;
    totalInputTokens += u.inputTokens;
    totalOutputTokens += u.outputTokens;
    totalEstimatedCost += u.estimatedCost;

    // Direct sum of category stats from users
    if (u.byCategory) {
      for (const cat of ['tutor', 'practice', 'flashcards'] as AiUsageCategory[]) {
        const cStat = u.byCategory[cat];
        if (cStat) {
          usageByCategory[cat].requests += cStat.requests;
          usageByCategory[cat].inputTokens += cStat.inputTokens;
          usageByCategory[cat].outputTokens += cStat.outputTokens;
          usageByCategory[cat].totalTokens += cStat.totalTokens;
          usageByCategory[cat].estimatedCost += cStat.estimatedCost;
        }
      }
    } else {
      // Fallback for legacy user records
      usageByCategory.tutor.requests += u.tutorRequests;
      usageByCategory.practice.requests += u.practiceGenerations;
      usageByCategory.flashcards.requests += u.flashcardGenerations;
    }

    // Daily & monthly sums
    for (const [date, daily] of Object.entries(u.dailyStats || {})) {
      if (date === todayKey) {
        totalRequestsToday += daily.requests;
        estimatedCostToday += daily.cost;
      }
      if (date.startsWith(monthKey)) {
        totalRequestsMonth += daily.requests;
        estimatedCostMonth += daily.cost;
      }
    }
  }

  // If category totals are stored at root level and higher (e.g. from direct logs), reconcile
  for (const cat of ['tutor', 'practice', 'flashcards'] as AiUsageCategory[]) {
    const rootCat = usageStore.categoryTotals[cat];
    if (rootCat && rootCat.requests > usageByCategory[cat].requests) {
      usageByCategory[cat] = { ...rootCat };
    }
  }

  const usagePerUser = userRecords.map(u => ({
    uid: u.uid,
    email: u.email || 'Anonymous',
    displayName: u.displayName || (u.email ? u.email.split('@')[0] : 'User'),
    requestsCount: u.requestsCount,
    inputTokens: u.inputTokens,
    outputTokens: u.outputTokens,
    totalTokens: u.totalTokens,
    tutorRequests: u.tutorRequests,
    practiceGenerations: u.practiceGenerations,
    flashcardGenerations: u.flashcardGenerations,
    estimatedCost: Number(u.estimatedCost.toFixed(6)),
    lastUsedAt: u.lastUsedAt
  }));

  const mostActiveUsers = [...usagePerUser]
    .sort((a, b) => b.requestsCount - a.requestsCount || b.totalTokens - a.totalTokens)
    .slice(0, 10);

  return {
    totalRequestsToday,
    totalRequestsMonth,
    totalTokensUsed,
    totalInputTokens,
    totalOutputTokens,
    estimatedCostToday: Number(estimatedCostToday.toFixed(6)),
    estimatedCostMonth: Number(estimatedCostMonth.toFixed(6)),
    totalEstimatedCost: Number(totalEstimatedCost.toFixed(6)),
    usagePerUser,
    mostActiveUsers,
    usageByCategory: {
      tutor: {
        ...usageByCategory.tutor,
        estimatedCost: Number(usageByCategory.tutor.estimatedCost.toFixed(6))
      },
      practice: {
        ...usageByCategory.practice,
        estimatedCost: Number(usageByCategory.practice.estimatedCost.toFixed(6))
      },
      flashcards: {
        ...usageByCategory.flashcards,
        estimatedCost: Number(usageByCategory.flashcards.estimatedCost.toFixed(6))
      }
    },
    recentLogs: usageStore.logs.slice(0, 25)
  };
}
