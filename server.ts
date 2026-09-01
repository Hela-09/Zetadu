import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { initializeApp } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
import multer from "multer";
import { getAuth } from "firebase-admin/auth";
import fs from "fs";

// Initialize Firebase Admin
try {
  let projectId = process.env.VITE_FIREBASE_PROJECT_ID || "educore-66491"; // Fallback for preview environment
  let storageBucket = process.env.VITE_FIREBASE_STORAGE_BUCKET || "educore-66491.firebasestorage.app"; // Fallback for preview environment
  try {
     const config = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf-8'));
     projectId = config.projectId || projectId;
     storageBucket = config.storageBucket || storageBucket;
  } catch(e) {}
  
  initializeApp({
    projectId: projectId,
    storageBucket: storageBucket,
  });
} catch (e) {
  console.log("Firebase Admin already initialized or missing credentials");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Authentication Middleware
  const requireAuth = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: "Unauthorized: Missing token" });
    }
    const idToken = authHeader.substring(7).trim();
    if (!idToken) {
      return res.status(401).json({ error: "Unauthorized: Empty token" });
    }
    
    try {
      const decodedToken = await getAuth().verifyIdToken(idToken);
      (req as any).user = decodedToken;
      next();
    } catch (error) {
      console.error("Auth Error:", error);
      return res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
    }
  };

  const getGeminiClient = () => {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY environment variable is missing");
    }
    return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  };

  const upload = multer({ dest: '/tmp/uploads/' });

  app.use('/api/uploads', express.static('/tmp/uploads'));

  app.post("/api/upload", requireAuth, upload.array('files'), async (req, res) => { 
    try {
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        return res.status(400).json({ error: "No files uploaded" });
      }

      const ai = getGeminiClient();
      const uploadedAttachments = [];

      for (const file of files) {
        const ext = path.extname(file.originalname);
        const filename = `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`;
        const localPath = `/tmp/uploads/${filename}`;

        // Rename the file to have the correct extension
        fs.renameSync(file.path, localPath);

        let fileUri = null;
        try {
          const fileResponse = await ai.files.upload({ file: localPath, config: { mimeType: file.mimetype } });
          fileUri = fileResponse.uri;
        } catch (err) {
          console.warn("Gemini upload failed for", file.originalname, err);
        }

        uploadedAttachments.push({
          url: `/api/uploads/${filename}`,
          name: file.originalname,
          mimeType: file.mimetype,
          fileUri: fileUri || null
        });
      }

      res.json({ attachments: uploadedAttachments });
    } catch (error) {
      console.error("Upload API Error:", error);
      res.status(500).json({ error: "Failed to upload files" });
    }
  });

  app.post("/api/chat", requireAuth, async (req, res) => {
    try {
      const { message, history, context } = req.body;
      const ai = getGeminiClient();
      
      const contents = history ? history.map((msg: any) => {
        const parts: any[] = [{ text: msg.text || ' ' }];
        if (msg.attachments) {
          msg.attachments.forEach((att: any) => {
            if (att.fileUri) parts.push({ fileData: { fileUri: att.fileUri, mimeType: att.mimeType } });
          });
        }
        return { role: msg.role === 'user' ? 'user' : 'model', parts };
      }) : [];
      
      const newParts: any[] = [{ text: message || ' ' }];
      if (req.body.attachments) {
        req.body.attachments.forEach((att: any) => {
          if (att.fileUri) newParts.push({ fileData: { fileUri: att.fileUri, mimeType: att.mimeType } });
        });
      }
      contents.push({ role: 'user', parts: newParts });

      const tonePrompt = context?.tone === 'Strict' ? 'Be strict and concise.' : 'Be encouraging and friendly.';
      const systemInstruction = `You are EduCore AI Tutor. ${tonePrompt}
Level: ${context?.educationLevel || 'Secondary'}. Country: ${context?.country || 'International'}.
-- IMPORTANT FORMATTING RULES:
  - DO NOT use raw LaTeX formatting (like $, $$, \\(, \\), \\[, \\], \\frac{}, \\times, \\sin, \\cos, \\theta, ^, _, backslashes) UNLESS the user explicitly asks for LaTeX or raw mathematical notation.
  - Convert mathematical expressions into readable plain text/unicode (e.g. use "3 × 10⁸ m/s" instead of "$3 \\times 10^8$ m/s", "n₁ × sin(θ₁) = n₂ × sin(θ₂)" instead of "n_1 \\sin(\\theta_1) = n_2 \\sin(\\theta_2)", "n = c ÷ v" instead of "n = \\frac{c}{v}", "θ" instead of "\\theta").
  - Remove unnecessary symbols, escaped characters, Markdown artifacts, and development formatting. Preserve headings, paragraphs, bullet lists, and numbered lists.
  - Present explanations like a textbook in this order (when appropriate): Title, Definition, Explanation, Examples, Important Notes, Real-Life Applications, Quick Summary, Practice Question (optional).\n
You are an advanced multimodal AI tutor with full image understanding capabilities.
When a user uploads an image, always analyze it thoroughly before responding.
Your responsibilities include:
* Read printed text accurately (OCR).
* Read handwritten text whenever it is legible.
* Analyze photographs, screenshots, scanned documents, PDFs, whiteboards, and textbook pages.
* Understand tables, charts, graphs, maps, diagrams, equations, formulas, and scientific illustrations.
* Recognize mathematical notation and solve problems step by step.
* Interpret chemistry structures, biology diagrams, physics illustrations, engineering drawings, and computer science flowcharts.
* Understand business documents, invoices, receipts, forms, and spreadsheets.
* Analyze user interface screenshots and explain errors or functionality.
* Identify objects, people, animals, plants, landmarks, and everyday scenes when relevant.
* Extract all useful information from the image before answering.
* If multiple questions appear in the image, answer every question unless the user specifies otherwise.
* Preserve the original meaning of any text found in the image.
* Explain difficult concepts clearly and accurately.
* If the image contains an exam question, provide the correct answer together with a clear explanation.
* If the image contains code, reproduce it accurately and explain or debug it as requested.
* If the image quality is poor, identify the unclear areas and ask only for the specific part that cannot be read instead of rejecting the entire image.
* Never invent or guess unreadable text. Clearly distinguish between what is visible and what is uncertain.
* Respond in the language used by the user unless they request another language.
* Format responses neatly using headings, bullet points, numbered steps, tables, or LaTeX for mathematical expressions when appropriate.
* When the user asks for a summary, summarize only the information visible in the image.
* When the user asks for extracted text, return all readable text while preserving its structure as much as possible.
* If the image contains sensitive or private information, handle it responsibly and only discuss what the user requests.
Always prioritize accuracy, completeness, and clarity. Analyze the entire image before producing your answer.`;

      let response;
      try {
        response = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: contents,
          config: { systemInstruction: systemInstruction }
        });
      } catch (err: any) {
        if (err?.status === 503 || err?.message?.includes("503") || err?.status === "UNAVAILABLE" || err?.error?.code === 503) {
          console.warn("2.5-flash overloaded, falling back to 1.5-flash");
          response = await ai.models.generateContent({
            model: 'gemini-3.1-flash-lite',
            contents: contents,
            config: { systemInstruction: systemInstruction }
          });
        } else {
          throw err;
        }
      }

      res.json({ text: response.text });
    } catch (error: any) {
      if (error?.status === 503 || error?.message?.includes("503") || error?.status === "UNAVAILABLE" || error?.error?.code === 503 || error?.status === 429 || error?.message?.toLowerCase().includes("quota") || error?.message?.toLowerCase().includes("resource_exhausted")) {
         res.status(503).json({ error: "The AI model is currently experiencing high demand. Please try again in a few moments." });
      } else {
         console.error("Chat API Error:", error);
         res.status(500).json({ error: "Failed to generate chat response" });
      }
    }
  });

  app.post("/api/generate-questions", requireAuth, async (req, res) => {
    try {
      const { subject, topic, difficulty, amount, educationLevel, country } = req.body;
      const ai = getGeminiClient();
      
      const prompt = `Generate ${amount || 5} practice questions for a student.
Subject: ${subject}
Topic: ${topic}
Difficulty: ${difficulty}
Education Level: ${educationLevel || 'General'}
Country/Curriculum: ${country || 'International'}
Each question must be a multiple choice question with 4 options, one correct answer, and an explanation.`;

      let response;
      const config = {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              correctAnswer: { type: Type.INTEGER, description: "0-indexed correct option" },
              explanation: { type: Type.STRING }
            },
            required: ["question", "options", "correctAnswer", "explanation"]
          }
        }
      };

      try {
        response = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: prompt,
          config
        });
      } catch (err: any) {
        if (err?.status === 503 || err?.message?.includes("503") || err?.status === "UNAVAILABLE" || err?.error?.code === 503) {
          console.warn("2.5-flash overloaded, falling back to 1.5-flash");
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
      if (!text) throw new Error("No text from Gemini");
      const questions = JSON.parse(text);
      res.json({ questions });
    } catch (error: any) {
      if (error?.status === 503 || error?.message?.includes("503") || error?.status === "UNAVAILABLE" || error?.error?.code === 503 || error?.status === 429 || error?.message?.toLowerCase().includes("quota") || error?.message?.toLowerCase().includes("resource_exhausted")) {
         res.status(503).json({ error: "High demand. Please try again." });
      } else {
         console.error("Generation API Error:", error);
         res.status(500).json({ error: "Failed to generate questions" });
      }
    }
  });


  
  app.post("/api/generate-flashcards", requireAuth, async (req, res) => {
    try {
      const { text, count } = req.body;
      const ai = getGeminiClient();
      
      const prompt = `You are an expert AI tutor. Generate ${count || 10} interactive flashcards from the following study notes or lecture transcript. Make the questions concise and the answers clear.

Text:
${text}`;

      const config = {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              front: { type: Type.STRING, description: "The question or concept on the front of the flashcard" },
              back: { type: Type.STRING, description: "The answer or definition on the back of the flashcard" }
            },
            required: ["front", "back"]
          }
        }
      };

      let response;
      try {
        response = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: prompt,
          config
        });
      } catch (err: any) {
        if (err?.status === 503 || err?.message?.includes("503") || err?.status === "UNAVAILABLE" || err?.error?.code === 503) {
          console.warn("2.5-flash overloaded, falling back to 1.5-flash for flashcards");
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
      if (!responseText) throw new Error("No text from Gemini");
      
      const flashcards = JSON.parse(responseText);
      res.json({ flashcards });
    } catch (error: any) {
      console.error("Flashcard Generation Error:", error);
      res.status(500).json({ error: "Failed to generate flashcards" });
    }
  });

  app.all('/api/*', (req, res) => {
    res.status(404).json({ error: 'API route not found: ' + req.method + ' ' + req.url });
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: { port: 24680 } },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("Express Error:", err);
    res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
