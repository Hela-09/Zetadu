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
    const { subject, topic, educationLevel, examType } = body;

    const ai = getGeminiClient();

    const prompt = `You are an expert tutor creating a concise, high-yield topic study guide for a student.
Subject: ${subject || 'General'}
Topic: ${topic || 'Core Topic'}
Education Level: ${educationLevel || 'Secondary'}
Exam Target: ${examType || 'General'}

Provide a structured, engaging summary of this topic:
1. mainConcept: A clear 2-4 sentence foundational explanation of what this topic is, its core definition, and why it is important.
2. importantPoints: An array of 4-6 essential bullet points (key rules, formulas, theorems, characteristics, or vital concepts to remember).
3. keyExamples: An array of 2-3 practical examples, worked problems, or real-world applications demonstrating how this concept works in practice.`;

    const config = {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          mainConcept: { type: Type.STRING },
          importantPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
          keyExamples: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ['mainConcept', 'importantPoints', 'keyExamples']
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
    if (!responseText) throw new Error('No learn data generated from Gemini');
    const learnData = JSON.parse(responseText);
    return res.status(200).json({ learnData });
  } catch (error: any) {
    const formatted = formatGeminiError(error);
    console.error('Learn Topic API Error:', formatted.status, formatted.message);

    // Fallback response so user flow is always seamless
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { subject, topic } = body;
    return res.status(200).json({
      learnData: {
        mainConcept: `${topic || 'This topic'} in ${subject || 'this subject'} covers fundamental principles and standard problem-solving methodologies necessary for exam mastery. Understanding core definitions and interrelations forms the foundation for tackling exam questions effectively.`,
        importantPoints: [
          `Understand the primary definition, scope, and foundational laws of ${topic || 'the topic'}.`,
          `Identify standard formulas, conditions, or properties that govern ${topic || 'these problems'}.`,
          `Pay attention to common units, variable relations, and common examiner traps.`,
          `Review past exam questions to identify recurring question formats on ${topic || 'this topic'}.`
        ],
        keyExamples: [
          `Standard Application: Applying foundational principles of ${topic || 'the topic'} to verify direct relationship between variables.`,
          `Worked Problem: Breaking down multi-step exam problems into identification, formula selection, and final simplification.`
        ]
      }
    });
  }
}
