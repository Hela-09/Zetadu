export interface UserAiUsageResponse {
  requestsCount: number;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  tutorRequests: number;
  practiceGenerations: number;
  flashcardGenerations: number;
  estimatedCost: number;
  lastUsedAt: number | null;
}

export interface AdminAiStatsResponse {
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

export async function fetchUserAiUsage(token?: string | null): Promise<UserAiUsageResponse> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch('/api/ai-usage/me', { headers });
  if (!res.ok) {
    throw new Error(`Failed to fetch AI usage: ${res.statusText}`);
  }
  return res.json();
}

export async function fetchAdminAiStats(token?: string | null): Promise<AdminAiStatsResponse> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch('/api/ai-usage/admin-stats', { headers });
  if (!res.ok) {
    throw new Error(`Failed to fetch Super Admin AI statistics: ${res.statusText}`);
  }
  return res.json();
}
