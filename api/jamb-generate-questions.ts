import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Type } from '@google/genai';
import { getGeminiClient, formatGeminiError, setCorsHeaders } from './_gemini.js';

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
    const {
      subjectId,
      subjectName,
      topicId,
      topicName,
      novelId,
      novelTitle,
      chapterId,
      chapterTitle,
      chapterIndex,
      difficulty = 'medium',
      amount = 5,
      existingFingerprints = []
    } = body;

    const ai = getGeminiClient();
    const count = Math.min(25, Math.max(1, Number(amount) || 5));
    const isNovel = !!(novelId || novelTitle);

    let prompt = "";
    if (isNovel) {
      prompt = `You are an expert Nigerian examiner and curriculum specialist for the JAMB UTME Use of English examination.
Generate ${count} original, high-quality multiple choice practice questions for the prescribed JAMB novel/text:
Novel Title: ${novelTitle || novelId}
Chapter: ${chapterTitle || (chapterIndex !== undefined ? `Chapter ${Number(chapterIndex) + 1}` : 'Selected Chapter')}
Focus: Deep comprehension of plot points, character actions, motivations, literary devices, themes, dialogue, and context as tested in authentic JAMB UTME examinations.
Difficulty: ${difficulty}

Strict Requirements:
1. Every question must be original and clearly phrased.
2. Provide exactly 4 plausible options (A, B, C, D).
3. Exactly one unequivocally correct answer (0 for option A, 1 for B, 2 for C, 3 for D).
4. Provide a thorough, pedagogically sound explanation referring directly to events in the novel.
5. Do NOT prefix options with letters in the options array.`;
    } else {
      prompt = `You are a senior Nigerian test development specialist for the Joint Admissions and Matriculation Board (JAMB) Unified Tertiary Matriculation Examination (UTME).
Generate ${count} original, high-calibre multiple choice practice questions for:
Subject: ${subjectName || subjectId || 'Use of English'}
Topic: ${topicName || topicId || 'General UTME Revision'}
Difficulty: ${difficulty}

Strict Requirements:
1. Strictly follow the official JAMB UTME syllabus and curriculum specifications for Nigerian secondary schools.
2. Questions must be rigorous, non-trivial, and test conceptual mastery, calculation, or lexis/structure.
3. Provide exactly 4 plausible options (A, B, C, D).
4. Exactly one unequivocally correct answer (0 for option A, 1 for B, 2 for C, 3 for D).
5. Provide a step-by-step, thorough pedagogical explanation.
6. Do NOT prefix options with letters in the options array.`;
    }

    const config = {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctAnswer: { type: Type.INTEGER, description: "0-indexed correct option (0, 1, 2, or 3)" },
            explanation: { type: Type.STRING },
            difficulty: { type: Type.STRING, enum: ["easy", "medium", "hard"] }
          },
          required: ["question", "options", "correctAnswer", "explanation"]
        }
      }
    };

    let response: any = null;
    const modelCandidates = ['gemini-3.6-flash', 'gemini-3.8-flash', 'gemini-3.1-flash-lite'];
    let lastError: any = null;

    for (const m of modelCandidates) {
      try {
        response = await ai.models.generateContent({
          model: m,
          contents: prompt,
          config
        });
        if (response?.text) break;
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${m} failed in api/jamb-generate-questions:`, err?.status || err?.message);
      }
    }

    if (!response || !response.text) {
      throw lastError || new Error("Failed to generate questions from AI service");
    }

    const rawList = JSON.parse(response.text);
    const existingFpSet = new Set<string>(Array.isArray(existingFingerprints) ? existingFingerprints : []);
    const batchFpSet = new Set<string>();
    const validatedQuestions: any[] = [];
    const now = Date.now();

    for (let i = 0; i < rawList.length; i++) {
      const item = rawList[i];
      if (!item || typeof item.question !== 'string' || !Array.isArray(item.options) || item.options.length < 2) {
        continue;
      }

      const fp = (item.question.toLowerCase().replace(/[^a-z0-9]/g, '') + '_' + item.options.slice(0, 4).map((o: any) => String(o).toLowerCase().replace(/[^a-z0-9]/g, '')).sort().join('_')).slice(0, 80);
      if (existingFpSet.has(fp) || batchFpSet.has(fp)) {
        continue;
      }
      batchFpSet.add(fp);

      const questionId = isNovel
        ? `jamb_novel_q_${now}_${Math.random().toString(36).substring(2, 8)}_${i}`
        : `jamb_q_${now}_${Math.random().toString(36).substring(2, 8)}_${i}`;

      const correctAnsIdx = typeof item.correctAnswer === 'number' && item.correctAnswer >= 0 && item.correctAnswer < item.options.length
        ? item.correctAnswer
        : 0;

      if (isNovel) {
        validatedQuestions.push({
          questionId,
          novelId: novelId || 'unknown_novel',
          chapterId: chapterId || `chap_${chapterIndex ?? 0}`,
          chapterIndex: chapterIndex !== undefined ? Number(chapterIndex) : 0,
          chapterTitle: chapterTitle || '',
          novelTitle: novelTitle || '',
          question: item.question.trim(),
          options: item.options.slice(0, 4).map((o: any) => String(o).trim()),
          correctAnswer: correctAnsIdx,
          explanation: item.explanation || 'Refer to the prescribed novel text.',
          difficulty: item.difficulty || difficulty,
          sourceType: 'ai_generated',
          isAIgenerated: true,
          status: 'active',
          fingerprint: fp,
          timesUsed: 0,
          createdAt: now,
          updatedAt: now
        });
      } else {
        validatedQuestions.push({
          questionId,
          subjectId: (subjectId || 'english').toLowerCase(),
          subjectName: subjectName || 'English Language',
          topicId: (topicId || 'general').toLowerCase(),
          topicName: topicName || 'General',
          question: item.question.trim(),
          options: item.options.slice(0, 4).map((o: any) => String(o).trim()),
          correctAnswer: correctAnsIdx,
          explanation: item.explanation || 'Review topic notes and syllabus for full derivation.',
          difficulty: item.difficulty || difficulty,
          sourceType: 'ai_generated',
          isAIgenerated: true,
          status: 'active',
          fingerprint: fp,
          timesUsed: 0,
          createdAt: now,
          updatedAt: now
        });
      }
    }

    return res.status(200).json({
      questions: validatedQuestions,
      count: validatedQuestions.length,
      duplicatesFiltered: rawList.length - validatedQuestions.length
    });
  } catch (error: any) {
    const formatted = formatGeminiError(error);
    console.error('JAMB Question API Error:', formatted.status, formatted.message);
    return res.status(formatted.status).json({ error: formatted.message });
  }
}
