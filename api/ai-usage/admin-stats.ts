import type { VercelRequest, VercelResponse } from '@vercel/node';
import { setCorsHeaders } from '../_gemini.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res);
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  return res.status(200).json({
    totalRequestsToday: 0,
    totalRequestsMonth: 0,
    totalTokensUsed: 0,
    totalInputTokens: 0,
    totalOutputTokens: 0,
    estimatedCostToday: 0,
    estimatedCostMonth: 0,
    totalEstimatedCost: 0,
    usagePerUser: [],
    mostActiveUsers: [],
    usageByCategory: {
      tutor: { requests: 0, inputTokens: 0, outputTokens: 0, totalTokens: 0, estimatedCost: 0 },
      practice: { requests: 0, inputTokens: 0, outputTokens: 0, totalTokens: 0, estimatedCost: 0 },
      flashcards: { requests: 0, inputTokens: 0, outputTokens: 0, totalTokens: 0, estimatedCost: 0 }
    },
    recentLogs: []
  });
}
