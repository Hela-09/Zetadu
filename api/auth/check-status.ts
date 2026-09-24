import type { VercelRequest, VercelResponse } from '@vercel/node';
import { setCorsHeaders } from '../_gemini.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res);
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    return res.status(200).json({ disabled: false });
  } catch (error: any) {
    return res.status(200).json({ disabled: false });
  }
}
