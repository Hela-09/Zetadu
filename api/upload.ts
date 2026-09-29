import type { VercelRequest, VercelResponse } from '@vercel/node';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { getGeminiClient, formatGeminiError, setCorsHeaders } from './_gemini.js';

export const config = {
  api: {
    bodyParser: false,
  },
};

const upload = multer({ dest: '/tmp/uploads/' });

function runMiddleware(req: any, res: any, fn: any) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  try {
    if (!fs.existsSync('/tmp/uploads')) {
      fs.mkdirSync('/tmp/uploads', { recursive: true });
    }

    await runMiddleware(req, res, upload.array('files'));

    const files = (req as any).files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const ai = getGeminiClient();
    const uploadedAttachments: any[] = [];
    const extractedTexts: string[] = [];

    for (const file of files) {
      const ext = path.extname(file.originalname).toLowerCase();
      const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
      const localPath = path.join('/tmp/uploads', filename);

      fs.renameSync(file.path, localPath);

      const fileBuffer = fs.readFileSync(localPath);
      const base64Data = fileBuffer.toString('base64');
      const isImage = file.mimetype.startsWith('image/') || /\.(jpg|jpeg|png|webp)$/i.test(file.originalname);
      const isPdf = file.mimetype === 'application/pdf' || /\.pdf$/i.test(file.originalname);
      const isTextOrMd = file.mimetype.startsWith('text/') || /\.(txt|md)$/i.test(file.originalname);

      let fileUri = null;

      let extractedText = '';
      if (isTextOrMd) {
        extractedText = fileBuffer.toString('utf-8');
      } else if (isImage || isPdf) {
        try {
          const mimeType = isPdf ? 'application/pdf' : (file.mimetype || 'image/jpeg');
          const prompt = isImage
            ? "You are an expert OCR and study assistant. Transcribe and extract all handwritten notes, typed text, headings, formulas, equations, and diagrams text from this image accurately into clean, readable Markdown. Do not add conversational commentary; output only the transcribed notes."
            : "You are an expert document parser. Extract and transcribe all text, notes, equations, and structured study content from this document accurately into clean, readable Markdown. Do not add conversational commentary; output only the extracted notes.";

          let ocrResponse: any = null;
          const modelsToTry = ['gemini-3.8-flash', 'gemini-3.1-flash-lite'];
          for (const model of modelsToTry) {
            try {
              ocrResponse = await ai.models.generateContent({
                model,
                contents: [
                  {
                    role: 'user',
                    parts: [
                      {
                        inlineData: {
                          mimeType,
                          data: base64Data
                        }
                      },
                      { text: prompt }
                    ]
                  }
                ]
              });
              if (ocrResponse?.text) break;
            } catch (err) {
              console.warn(`OCR attempt with model ${model} failed:`, err);
            }
          }
          if (ocrResponse?.text) {
            extractedText = ocrResponse.text.trim();
          }
        } catch (ocrErr) {
          console.warn('OCR extraction error:', ocrErr);
        }
      }

      if (extractedText) {
        extractedTexts.push(extractedText);
      }

      uploadedAttachments.push({
        url: `data:${file.mimetype};base64,${base64Data}`,
        name: file.originalname,
        mimeType: file.mimetype,
        fileUri: fileUri || null,
        extractedText: extractedText || undefined
      });
    }

    return res.status(200).json({
      attachments: uploadedAttachments,
      extractedText: extractedTexts.join('\n\n')
    });
  } catch (error: any) {
    const formatted = formatGeminiError(error);
    console.error('Upload API Error:', formatted.status, formatted.message);
    return res.status(formatted.status).json({ error: formatted.message });
  }
}
