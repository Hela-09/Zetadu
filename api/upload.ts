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
    const uploadedAttachments = [];

    for (const file of files) {
      const ext = path.extname(file.originalname);
      const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
      const localPath = path.join('/tmp/uploads', filename);

      fs.renameSync(file.path, localPath);

      let fileUri = null;
      try {
        const fileResponse = await ai.files.upload({ file: localPath, config: { mimeType: file.mimetype } });
        fileUri = fileResponse.uri;
      } catch (err) {
        console.warn('Gemini file upload failed for', file.originalname, err);
      }

      uploadedAttachments.push({
        url: `data:${file.mimetype};base64,${fs.readFileSync(localPath).toString('base64')}`,
        name: file.originalname,
        mimeType: file.mimetype,
        fileUri: fileUri || null
      });
    }

    return res.status(200).json({ attachments: uploadedAttachments });
  } catch (error: any) {
    const formatted = formatGeminiError(error);
    console.error('Upload API Error:', formatted.status, formatted.message);
    return res.status(formatted.status).json({ error: formatted.message });
  }
}
