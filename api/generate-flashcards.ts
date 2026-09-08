import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Type } from '@google/genai';
import { getGeminiClient, formatGeminiError, setCorsHeaders } from './_gemini.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { text, count } = body;

    if (!text || text.trim() === '') {
      return res.status(400).json({ error: 'Please provide notes text to generate flashcards.' });
    }

    const ai = getGeminiClient();

    const prompt = `You are an expert AI tutor. Generate ${count || 10} interactive flashcards from the following study notes or lecture transcript. Make the questions concise and the answers clear.

Text:
${text}`;

    const config = {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            front: { type: Type.STRING, description: 'The question or concept on the front of the flashcard' },
            back: { type: Type.STRING, description: 'The answer or definition on the back of the flashcard' }
          },
          required: ['front', 'back']
        }
      }
    };

    let response;
    try {
      response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config
      });
    } catch (err: any) {
      if (
        err?.status === 503 ||
        err?.message?.includes('503') ||
        err?.status === 'UNAVAILABLE' ||
        err?.error?.code === 503
      ) {
        console.warn('Primary model overloaded, falling back to gemini-3.1-flash-lite');
        response = await ai.models.generateContent({
          model: 'gemini-3.1-flash-lite',
          contents: prompt,
          config
        });
      } else {
        throw err;
      }
    }

    const responseText = response.text;
    if (!responseText) throw new Error('No flashcard response received from Gemini');
    const flashcards = JSON.parse(responseText);
    return res.status(200).json({ flashcards });
  } catch (error: any) {
    const formatted = formatGeminiError(error);
    console.error('Generate Flashcards API Error:', formatted.status, formatted.message);
    return res.status(formatted.status).json({ error: formatted.message });
  }
}
