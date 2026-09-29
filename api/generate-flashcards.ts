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
    const { text, subject, topic, level, count } = body;

    const isStructured = !text || (subject && topic);

    if (!isStructured && (!text || text.trim() === '')) {
      return res.status(400).json({ error: 'Please provide notes text or subject/topic to generate flashcards.' });
    }

    const ai = getGeminiClient();
    const flashcardCount = Math.min(25, Math.max(1, Number(count) || 10));

    let prompt = '';
    let config: any;

    if (isStructured) {
      prompt = `You are an expert AI tutor. Generate ${flashcardCount} interactive flashcards for the following subject:
Subject: ${subject || 'General Academic'}
Topic: ${topic || 'Key Concepts'}
Education Level: ${level || 'Secondary'}

Make the questions concise and the answers clear. Provide a short explanation for each answer.`;

      config = {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              front: { type: Type.STRING, description: 'The question or concept on the front of the flashcard' },
              back: { type: Type.STRING, description: 'The concise answer or definition' },
              explanation: { type: Type.STRING, description: 'A short explanation of the answer' }
            },
            required: ['front', 'back', 'explanation']
          }
        }
      };
    } else {
      prompt = `You are an expert AI tutor. Generate ${flashcardCount} interactive flashcards from the following study notes or lecture transcript. Make the questions concise and the answers clear. Provide a short explanation for each answer.

Text:
${text}`;

      config = {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              front: { type: Type.STRING, description: 'The question or concept on the front of the flashcard' },
              back: { type: Type.STRING, description: 'The answer or definition on the back of the flashcard' },
              explanation: { type: Type.STRING, description: 'A short explanation of the answer' }
            },
            required: ['front', 'back']
          }
        }
      };
    }

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

    const responseText = response.text?.trim() || '[]';
    let flashcards = [];
    try {
      flashcards = JSON.parse(responseText);
    } catch (parseErr) {
      const match = responseText.match(/\[\s*\{.*\}\s*\]/s);
      if (match) {
        flashcards = JSON.parse(match[0]);
      } else {
        throw new Error('Could not parse flashcards JSON response');
      }
    }

    return res.status(200).json({ flashcards });
  } catch (error: any) {
    console.error('Error in /api/generate-flashcards:', error);
    const { status, message } = formatGeminiError(error);
    return res.status(status).json({ error: message });
  }
}
