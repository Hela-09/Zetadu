import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Type } from '@google/genai';
import { getGeminiClient, formatGeminiError, setCorsHeaders } from './_gemini';

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
    const { subject, topic, difficulty, amount, educationLevel, country, practiceMode } = body;

    const ai = getGeminiClient();

    let modeInstruction = '';
    if (practiceMode === 'Exam Simulation') {
      modeInstruction = 'Make the questions strictly formatted and styled like a real exam. Focus on testing deep understanding.';
    } else if (practiceMode === 'Mistake Practice') {
      modeInstruction = 'Focus heavily on common misconceptions and tricky edge cases where students frequently make mistakes.';
    } else if (practiceMode === 'Random Practice') {
      modeInstruction = 'Mix topics across the entire subject randomly, ensuring a wide breadth of concepts.';
    } else if (practiceMode === 'Topic Practice') {
      modeInstruction = `Focus exclusively on the specific topic: ${topic}.`;
    }

    const prompt = `Generate ${amount || 5} practice questions for a student.
Subject: ${subject || 'General Science'}
Topic: ${topic || 'Key Principles'}
Difficulty: ${difficulty || 'Medium'}
Education Level: ${educationLevel || 'General'}
Country/Curriculum: ${country || 'International'}
Practice Mode: ${practiceMode || 'Custom Practice'}
${modeInstruction}

Each question must be a multiple choice question with 4 options, one correct answer, and an explanation.`;

    const config = {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctAnswer: { type: Type.INTEGER, description: '0-indexed correct option' },
            explanation: { type: Type.STRING }
          },
          required: ['question', 'options', 'correctAnswer', 'explanation']
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

    const text = response.text;
    if (!text) throw new Error('No text generated from Gemini');
    const questions = JSON.parse(text);
    return res.status(200).json({ questions });
  } catch (error: any) {
    const formatted = formatGeminiError(error);
    console.error('Generate Questions API Error:', formatted.status, formatted.message);
    return res.status(formatted.status).json({ error: formatted.message });
  }
}
