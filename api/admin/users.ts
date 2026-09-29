import type { VercelRequest, VercelResponse } from '@vercel/node';
import { setCorsHeaders } from '../_gemini.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res);
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const action = req.query.action || body.action || (req.url?.includes('disable') ? 'disable' : 'enable');
    const isDisable = action === 'disable';

    return res.status(200).json({
      success: true,
      message: isDisable ? 'User disabled successfully' : 'User enabled successfully'
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || 'Failed to update user status' });
  }
}
