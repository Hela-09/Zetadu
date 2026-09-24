import type { VercelRequest, VercelResponse } from '@vercel/node';
import { setCorsHeaders } from '../_gemini.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res);
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  return res.status(200).json({
    requestsCount: 0,
    inputTokens: 0,
    outputTokens: 0,
    totalTokens: 0,
    tutorRequests: 0,
    practiceGenerations: 0,
    flashcardGenerations: 0,
    estimatedCost: 0,
    lastUsedAt: null
  });
}
