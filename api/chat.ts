import type { VercelRequest, VercelResponse } from '@vercel/node';
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
    const { message, history, context, attachments, stream = true } = body;

    const ai = getGeminiClient();

    // Map conversation history
    const contents: any[] = history && Array.isArray(history)
      ? history.map((msg: any) => {
          const parts: any[] = [];
          if (msg.attachments && Array.isArray(msg.attachments)) {
            msg.attachments.forEach((att: any) => {
              if (att.fileUri) {
                parts.push({ fileData: { fileUri: att.fileUri, mimeType: att.mimeType || 'image/jpeg' } });
              }
            });
          }
          parts.push({ text: msg.text || ' ' });
          return { role: msg.role === 'user' ? 'user' : 'model', parts };
        })
      : [];

    // Append new user message and attachments
    const newParts: any[] = [];
    if (attachments && Array.isArray(attachments)) {
      attachments.forEach((att: any) => {
        if (att.fileUri) {
          newParts.push({ fileData: { fileUri: att.fileUri, mimeType: att.mimeType || 'image/jpeg' } });
        }
      });
    }
    newParts.push({ text: message || ' ' });
    contents.push({ role: 'user', parts: newParts });

    const tonePrompt = context?.tone === 'Strict' ? 'Be strict and concise.' : 'Be encouraging and friendly.';
    const systemInstruction = `You are EduCore AI Tutor on Zetadu. ${tonePrompt}
Level: ${context?.educationLevel || 'Secondary'}. Country: ${context?.country || 'International'}.
-- IMPORTANT FORMATTING RULES:
  - DO NOT use raw LaTeX formatting (like $, $$, \\(, \\), \\[, \\], \\frac{}, \\times, \\sin, \\cos, \\theta, ^, _, backslashes) UNLESS the user explicitly asks for LaTeX or raw mathematical notation.
  - Convert mathematical expressions into readable plain text/unicode (e.g. use "3 × 10⁸ m/s" instead of "$3 \\times 10^8$ m/s", "n₁ × sin(θ₁) = n₂ × sin(θ₂)" instead of "n_1 \\sin(\\theta_1) = n_2 \\sin(\\theta_2)", "n = c ÷ v" instead of "n = \\frac{c}{v}", "θ" instead of "\\theta").
  - Remove unnecessary symbols, escaped characters, Markdown artifacts, and development formatting. Preserve headings, paragraphs, bullet lists, and numbered lists.
  - Present explanations like a textbook in this order (when appropriate): Title, Definition, Explanation, Examples, Important Notes, Real-Life Applications, Quick Summary, Practice Question (optional).
You are an advanced multimodal AI tutor with image understanding capabilities.
When a user provides an image or document, thoroughly extract key information, solve problems step by step, and explain difficult concepts clearly and accurately.
Always prioritize accuracy, completeness, and clarity.`;

    if (stream) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache, no-transform');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('X-Accel-Buffering', 'no');
      if (typeof (res as any).flushHeaders === 'function') {
        (res as any).flushHeaders();
      }

      let resultStream;
      try {
        resultStream = await ai.models.generateContentStream({
          model: 'gemini-3.8-flash',
          contents,
          config: { systemInstruction }
        });
      } catch (err: any) {
        if (
          err?.status === 503 ||
          err?.message?.includes('503') ||
          err?.status === 'UNAVAILABLE' ||
          err?.error?.code === 503
        ) {
          console.warn('Primary model overloaded, falling back to gemini-3.1-flash-lite');
          resultStream = await ai.models.generateContentStream({
            model: 'gemini-3.1-flash-lite',
            contents,
            config: { systemInstruction }
          });
        } else {
          throw err;
        }
      }

      for await (const chunk of resultStream) {
        if (chunk.text) {
          res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
          if (typeof (res as any).flush === 'function') {
            (res as any).flush();
          }
        }
      }

      res.write('data: [DONE]\n\n');
      return res.end();
    } else {
      let response;
      try {
        response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents,
          config: { systemInstruction }
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
            contents,
            config: { systemInstruction }
          });
        } else {
          throw err;
        }
      }

      return res.status(200).json({ text: response.text || '' });
    }
  } catch (error: any) {
    const formatted = formatGeminiError(error);
    console.error('Vercel Chat API Error:', formatted.status, formatted.message);

    if (res.headersSent) {
      res.write(`data: ${JSON.stringify({ error: formatted.message })}\n\n`);
      return res.end();
    } else {
      return res.status(formatted.status).json({ error: formatted.message });
    }
  }
}
