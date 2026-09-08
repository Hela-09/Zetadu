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
    const { action, text, attachments, subject, topic, educationLevel, count } = body;

    if (!action) {
      return res.status(400).json({ error: "Missing required field 'action'" });
    }
    if ((!text || text.trim() === '') && (!attachments || attachments.length === 0)) {
      return res.status(400).json({ error: 'Please provide either notes text or an uploaded file/image.' });
    }

    const ai = getGeminiClient();

    const parts: any[] = [];
    if (attachments && Array.isArray(attachments)) {
      for (const att of attachments) {
        if (att.fileUri) {
          parts.push({
            fileData: {
              fileUri: att.fileUri,
              mimeType: att.mimeType || 'image/jpeg'
            }
          });
        }
      }
    }

    if (action === 'summarize') {
      const prompt = `You are an expert academic tutor for secondary and high school exam students (WAEC/JAMB/GCSE/SAT/International).
Thoroughly analyze and summarize the following study notes.

Subject: ${subject || 'General Academic'}
Topic: ${topic || 'Key Concepts'}
Education Level: ${educationLevel || 'Secondary / High School'}

Study Notes:
${text || '(Notes provided in the attached document/image)'}

Formatting & Content Guidelines:
- Format cleanly in readable Markdown.
- DO NOT use raw unrendered LaTeX formatting (like $, $$, \\(, \\), \\[, \\], \\frac, etc.). Convert mathematical expressions and symbols into readable unicode (e.g. ×, ÷, ², ³, ±, √, π, θ, →).
- Structure your summary into:
  1. # 📌 Executive Summary (A clear, 2-3 paragraph overview of the fundamental theme and scope)
  2. ## 🔑 Key Takeaways & Core Concepts (bullet points detailing every critical concept thoroughly)
  3. ## 📐 Important Formulas, Laws & Definitions (vital terms, laws, and equations to memorize)
  4. ## 💡 High-Yield Exam Memory Tips (frequent examiner traps, key test hooks, and mnemonics)`;

      parts.push({ text: prompt });

      let response;
      try {
        response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: [{ role: 'user', parts }]
        });
      } catch (err: any) {
        if (
          err?.status === 503 ||
          err?.message?.includes('503') ||
          err?.status === 'UNAVAILABLE' ||
          err?.error?.code === 503
        ) {
          response = await ai.models.generateContent({
            model: 'gemini-3.1-flash-lite',
            contents: [{ role: 'user', parts }]
          });
        } else {
          throw err;
        }
      }

      return res.status(200).json({ summary: response.text });
    } else if (action === 'explain') {
      const prompt = `You are an engaging, world-class personal tutor. Provide a crystal-clear, deep pedagogical explanation of the concepts in these study notes.

Subject: ${subject || 'General Academic'}
Topic: ${topic || 'Key Concepts'}
Education Level: ${educationLevel || 'Secondary / High School'}

Study Notes:
${text || '(Notes provided in the attached document/image)'}

Formatting & Content Guidelines:
- Format in clean, readable Markdown.
- Convert mathematical expressions to clean unicode symbols without raw LaTeX tags.
- Structure into:
  1. ## 🎯 Core Intuition & The Big Picture (explain what this actually means in simple, memorable language)
  2. ## 🔍 Step-by-Step Breakdown (walk through every process, derivation, or mechanism systematically)
  3. ## 🌍 Real-World Analogies & Practical Applications (provide 2-3 vivid, intuitive real-life analogies)
  4. ## ⚠️ Common Pitfalls & Examiner Traps (highlight common student misconceptions and marks lost)
  5. ## 🧪 Quick Self-Check Challenge (a conceptual question with clear answer breakdown to verify understanding)`;

      parts.push({ text: prompt });

      let response;
      try {
        response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: [{ role: 'user', parts }]
        });
      } catch (err: any) {
        if (
          err?.status === 503 ||
          err?.message?.includes('503') ||
          err?.status === 'UNAVAILABLE' ||
          err?.error?.code === 503
        ) {
          response = await ai.models.generateContent({
            model: 'gemini-3.1-flash-lite',
            contents: [{ role: 'user', parts }]
          });
        } else {
          throw err;
        }
      }

      return res.status(200).json({ explanation: response.text });
    } else if (action === 'flashcards') {
      const prompt = `You are an expert tutor. Generate an array of ${count || 8} interactive flashcards from the provided study notes.
Extract the most critical definitions, formulas, terms, and conceptual questions.

Subject: ${subject || 'General Academic'}
Topic: ${topic || 'Key Concepts'}

Study Notes:
${text || '(Notes provided in the attached document/image)'}

Make questions concise and answers precise and clear.`;

      parts.push({ text: prompt });

      const config = {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              front: { type: Type.STRING, description: 'The concept, question, or term on the front' },
              back: { type: Type.STRING, description: 'The clear answer or definition on the back' },
              explanation: { type: Type.STRING, description: 'A short 1-2 sentence clarification or memory hook' }
            },
            required: ['front', 'back']
          }
        }
      };

      let response;
      try {
        response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: [{ role: 'user', parts }],
          config
        });
      } catch (err: any) {
        if (
          err?.status === 503 ||
          err?.message?.includes('503') ||
          err?.status === 'UNAVAILABLE' ||
          err?.error?.code === 503
        ) {
          response = await ai.models.generateContent({
            model: 'gemini-3.1-flash-lite',
            contents: [{ role: 'user', parts }],
            config
          });
        } else {
          throw err;
        }
      }

      const textRes = response.text;
      if (!textRes) throw new Error('No flashcard data received from Gemini');
      const flashcards = JSON.parse(textRes);
      return res.status(200).json({ flashcards });
    } else if (action === 'questions') {
      const prompt = `You are an expert exam master. Generate an array of ${count || 5} multiple-choice practice questions testing the comprehension and application of these study notes.

Subject: ${subject || 'General Academic'}
Topic: ${topic || 'Key Concepts'}
Education Level: ${educationLevel || 'Secondary / High School'}

Study Notes:
${text || '(Notes provided in the attached document/image)'}

Each question must test an important concept from the notes. Provide 4 distinct options, exactly 1 correct answer (0-indexed integer from 0 to 3), and a detailed explanation showing why the correct answer is right and clarifying misconceptions.`;

      parts.push({ text: prompt });

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
          contents: [{ role: 'user', parts }],
          config
        });
      } catch (err: any) {
        if (
          err?.status === 503 ||
          err?.message?.includes('503') ||
          err?.status === 'UNAVAILABLE' ||
          err?.error?.code === 503
        ) {
          response = await ai.models.generateContent({
            model: 'gemini-3.1-flash-lite',
            contents: [{ role: 'user', parts }],
            config
          });
        } else {
          throw err;
        }
      }

      const textRes = response.text;
      if (!textRes) throw new Error('No questions data received from Gemini');
      const questions = JSON.parse(textRes);
      return res.status(200).json({ questions });
    } else {
      return res.status(400).json({ error: `Unknown action: ${action}` });
    }
  } catch (error: any) {
    const formatted = formatGeminiError(error);
    console.error('Process Notes API Error:', formatted.status, formatted.message);
    return res.status(formatted.status).json({ error: formatted.message });
  }
}
