import fs from 'fs';
import path from 'path';

export type AiUsageCategory = 'tutor' | 'practice' | 'flashcards';

export interface DailyUsageStat {
  requests: number;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  cost: number;
  tutorRequests: number;
  practiceGenerations: number;
  flashcardGenerations: number;
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
  lastUsedAt: number;
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
    lastUsedAt: number;
  }>;
  mostActiveUsers: Array<{
    uid: string;
    email: string;
    displayName?: string;
    requestsCount: number;
    totalTokens: number;
    estimatedCost: number;
    lastUsedAt: number;
  }>;
  usageByCategory: {
    tutor: { requests: number; inputTokens: number; outputTokens: number; totalTokens: number; estimatedCost: number };
    practice: { requests: number; inputTokens: number; outputTokens: number; totalTokens: number; estimatedCost: number };
    flashcards: { requests: number; inputTokens: number; outputTokens: number; totalTokens: number; estimatedCost: number };
  };
}

// In-memory store
const usageStore: Record<string, UserAiUsageRecord> = {};

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
          Object.assign(usageStore, parsed);
          return;
        }
      }
    } catch (_) {}
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
  }, 1000);
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
  const inputCost = (inputTokens * 0.10) / 1000000;
  const outputCost = (outputTokens * 0.40) / 1000000;
  return Number((inputCost + outputCost).toFixed(7));
}

export function recordAiUsage(params: {
  uid: string;
  email?: string;
  displayName?: string;
  category: AiUsageCategory;
  inputTokens: number;
  outputTokens: number;
  totalTokens?: number;
}) {
  const { uid, category, inputTokens, outputTokens } = params;
  if (!uid) return;

  const totalTokens = params.totalTokens ?? (inputTokens + outputTokens);
  const cost = calculateGeminiCost(inputTokens, outputTokens);
  const now = Date.now();
  const todayKey = getTodayString();

  if (!usageStore[uid]) {
    usageStore[uid] = {
      uid,
      email: params.email || '',
      displayName: params.displayName || '',
      requestsCount: 0,
      inputTokens: 0,
      outputTokens: 0,
      totalTokens: 0,
      tutorRequests: 0,
      practiceGenerations: 0,
      flashcardGenerations: 0,
      estimatedCost: 0,
      lastUsedAt: now,
      dailyStats: {}
    };
  }

  const record = usageStore[uid];
  if (params.email && !record.email) record.email = params.email;
  if (params.displayName && !record.displayName) record.displayName = params.displayName;

  // Aggregate user totals
  record.requestsCount += 1;
  record.inputTokens += inputTokens;
  record.outputTokens += outputTokens;
  record.totalTokens += totalTokens;
  record.estimatedCost = Number((record.estimatedCost + cost).toFixed(7));
  record.lastUsedAt = now;

  if (category === 'tutor') record.tutorRequests += 1;
  else if (category === 'practice') record.practiceGenerations += 1;
  else if (category === 'flashcards') record.flashcardGenerations += 1;

  // Daily stats breakdown
  if (!record.dailyStats[todayKey]) {
    record.dailyStats[todayKey] = {
      requests: 0,
      inputTokens: 0,
      outputTokens: 0,
      totalTokens: 0,
      cost: 0,
      tutorRequests: 0,
      practiceGenerations: 0,
      flashcardGenerations: 0
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

  persistUsageStore();
}

export function getUserAiUsage(uid: string) {
  if (!uid || !usageStore[uid]) {
    return {
      requestsCount: 0,
      inputTokens: 0,
      outputTokens: 0,
      totalTokens: 0,
      tutorRequests: 0,
      practiceGenerations: 0,
      flashcardGenerations: 0,
      estimatedCost: 0,
      lastUsedAt: null
    };
  }

  const record = usageStore[uid];
  return {
    requestsCount: record.requestsCount,
    inputTokens: record.inputTokens,
    outputTokens: record.outputTokens,
    totalTokens: record.totalTokens,
    tutorRequests: record.tutorRequests,
    practiceGenerations: record.practiceGenerations,
    flashcardGenerations: record.flashcardGenerations,
    estimatedCost: record.estimatedCost,
    lastUsedAt: record.lastUsedAt
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
    tutor: { requests: 0, inputTokens: 0, outputTokens: 0, totalTokens: 0, estimatedCost: 0 },
    practice: { requests: 0, inputTokens: 0, outputTokens: 0, totalTokens: 0, estimatedCost: 0 },
    flashcards: { requests: 0, inputTokens: 0, outputTokens: 0, totalTokens: 0, estimatedCost: 0 }
  };

  const userRecords = Object.values(usageStore);

  for (const u of userRecords) {
    totalTokensUsed += u.totalTokens;
    totalInputTokens += u.inputTokens;
    totalOutputTokens += u.outputTokens;
    totalEstimatedCost += u.estimatedCost;

    // Categories
    usageByCategory.tutor.requests += u.tutorRequests;
    usageByCategory.practice.requests += u.practiceGenerations;
    usageByCategory.flashcards.requests += u.flashcardGenerations;

    for (const [date, daily] of Object.entries(u.dailyStats)) {
      if (date === todayKey) {
        totalRequestsToday += daily.requests;
        estimatedCostToday += daily.cost;
      }
      if (date.startsWith(monthKey)) {
        totalRequestsMonth += daily.requests;
        estimatedCostMonth += daily.cost;
      }

      usageByCategory.tutor.totalTokens += (daily.tutorRequests > 0 ? Math.round(daily.totalTokens * (daily.tutorRequests / Math.max(daily.requests, 1))) : 0);
      usageByCategory.practice.totalTokens += (daily.practiceGenerations > 0 ? Math.round(daily.totalTokens * (daily.practiceGenerations / Math.max(daily.requests, 1))) : 0);
      usageByCategory.flashcards.totalTokens += (daily.flashcardGenerations > 0 ? Math.round(daily.totalTokens * (daily.flashcardGenerations / Math.max(daily.requests, 1))) : 0);

      usageByCategory.tutor.estimatedCost += (daily.tutorRequests > 0 ? Number((daily.cost * (daily.tutorRequests / Math.max(daily.requests, 1))).toFixed(7)) : 0);
      usageByCategory.practice.estimatedCost += (daily.practiceGenerations > 0 ? Number((daily.cost * (daily.practiceGenerations / Math.max(daily.requests, 1))).toFixed(7)) : 0);
      usageByCategory.flashcards.estimatedCost += (daily.flashcardGenerations > 0 ? Number((daily.cost * (daily.flashcardGenerations / Math.max(daily.requests, 1))).toFixed(7)) : 0);
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
    }
  };
}
