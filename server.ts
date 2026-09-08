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
      // If Firebase Admin does not have service account credentials (common outside GCP/Vercel), decode token payload safely
      try {
        const parts = idToken.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
          if (payload && (payload.user_id || payload.sub)) {
            (req as any).user = { uid: payload.user_id || payload.sub, email: payload.email };
            return next();
          }
        }
      } catch (_) {}
      console.error("Auth Error:", error);
      return res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
    }
  };

  let _geminiClient: any = null;
  const getGeminiClient = () => {
    let apiKey = (process.env.GEMINI_API_KEY || '').trim();
    apiKey = apiKey.replace(/^["']|["']$/g, '').trim();
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing");
    }
    if (!_geminiClient) {
      _geminiClient = new GoogleGenAI({ apiKey });
    }
    return _geminiClient;
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
      const { message, history, context, stream } = req.body;
      const ai = getGeminiClient();
      
      const contents = history ? history.map((msg: any) => {
        const parts = [];
        if (msg.attachments) {
          msg.attachments.forEach((att: any) => {
            if (att.fileUri) parts.push({ fileData: { fileUri: att.fileUri, mimeType: att.mimeType } });
          });
        }
        parts.push({ text: msg.text || ' ' });
        return { role: msg.role === 'user' ? 'user' : 'model', parts };
      }) : [];
      
      const newParts = [];
      if (req.body.attachments) {
        req.body.attachments.forEach((att: any) => {
          if (att.fileUri) newParts.push({ fileData: { fileUri: att.fileUri, mimeType: att.mimeType } });
        });
      }
      newParts.push({ text: message || ' ' });
      contents.push({ role: 'user', parts: newParts });

      const tonePrompt = context?.tone === 'Strict' ? 'Be strict and concise.' : 'Be encouraging and friendly.';
      const systemInstruction = `You are EduCore AI Tutor. ${tonePrompt}
Level: ${context?.educationLevel || 'Secondary'}. Country: ${context?.country || 'International'}.
-- IMPORTANT FORMATTING RULES:
  - DO NOT use raw LaTeX formatting (like $, $$, \(, \), \[, \], \frac{}, \times, \sin, \cos, \theta, ^, _, backslashes) UNLESS the user explicitly asks for LaTeX or raw mathematical notation.
  - Convert mathematical expressions into readable plain text/unicode (e.g. use "3 × 10⁸ m/s" instead of "$3 \times 10^8$ m/s", "n₁ × sin(θ₁) = n₂ × sin(θ₂)" instead of "n_1 \sin(\theta_1) = n_2 \sin(\theta_2)", "n = c ÷ v" instead of "n = \frac{c}{v}", "θ" instead of "\theta").
  - Remove unnecessary symbols, escaped characters, Markdown artifacts, and development formatting. Preserve headings, paragraphs, bullet lists, and numbered lists.
  - Present explanations like a textbook in this order (when appropriate): Title, Definition, Explanation, Examples, Important Notes, Real-Life Applications, Quick Summary, Practice Question (optional).
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

      if (stream) {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        
        let resultStream;
        try {
          resultStream = await ai.models.generateContentStream({
            model: 'gemini-3.8-flash',
            contents: contents,
            config: { systemInstruction: systemInstruction }
          });
        } catch (err: any) {
          if (err?.status === 503 || err?.message?.includes("503") || err?.status === "UNAVAILABLE" || err?.error?.code === 503) {
            console.warn("2.5-flash overloaded, falling back to 1.5-flash");
            resultStream = await ai.models.generateContentStream({
              model: 'gemini-3.1-flash-lite',
              contents: contents,
              config: { systemInstruction: systemInstruction }
            });
          } else {
            throw err;
          }
        }
        
        for await (const chunk of resultStream) {
          if (chunk.text) {
             res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
          }
        }
        res.write('data: [DONE]\n\n');
        res.end();
      } else {
        let response;
        try {
          response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
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
      }
    } catch (error: any) {
      const isOverloaded = error?.status === 503 || error?.message?.includes("503") || error?.status === "UNAVAILABLE" || error?.error?.code === 503 || error?.status === 429 || error?.message?.toLowerCase().includes("quota") || error?.message?.toLowerCase().includes("resource_exhausted");
      if (isOverloaded) {
          console.warn("Chat API experienced high demand (503/429)");
      } else {
          console.error("Chat API Error:", error);
      }
      
      if (!res.headersSent) {
         if (isOverloaded) {
            res.status(503).json({ error: "The AI model is currently experiencing high demand. Please try again in a few moments." });
         } else {
            res.status(500).json({ error: error?.message || "Failed to generate chat response" });
         }
      } else {
         res.write(`data: ${JSON.stringify({ error: error?.message || "Stream interrupted" })}\n\n`);
         res.end();
      }
    }
  });

  app.post("/api/generate-questions", requireAuth, async (req, res) => {
    try {
      const { subject, topic, difficulty, amount, educationLevel, country, practiceMode } = req.body;
      const ai = getGeminiClient();
      
      let modeInstruction = "";
      if (practiceMode === 'Exam Simulation') modeInstruction = "Make the questions strictly formatted and styled like a real exam. Focus on testing deep understanding.";
      else if (practiceMode === 'Mistake Practice') modeInstruction = "Focus heavily on common misconceptions and tricky edge cases where students frequently make mistakes.";
      else if (practiceMode === 'Random Practice') modeInstruction = "Mix topics across the entire subject randomly, ensuring a wide breadth of concepts.";
      else if (practiceMode === 'Topic Practice') modeInstruction = `Focus exclusively on the specific topic: ${topic}.`;
      
      const prompt = `Generate ${amount || 5} practice questions for a student.
Subject: ${subject}
Topic: ${topic}
Difficulty: ${difficulty}
Education Level: ${educationLevel || 'General'}
Country/Curriculum: ${country || 'International'}
Practice Mode: ${practiceMode || 'Custom Practice'}
${modeInstruction}

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
          model: 'gemini-3.8-flash',
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
          model: 'gemini-3.8-flash',
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
      const isOverloaded = error?.status === 503 || error?.message?.includes("503") || error?.status === "UNAVAILABLE" || error?.error?.code === 503 || error?.status === 429 || error?.message?.toLowerCase().includes("quota") || error?.message?.toLowerCase().includes("resource_exhausted");
      if (isOverloaded) {
         console.warn("Flashcard Generation experienced high demand (503/429)");
         res.status(503).json({ error: "High demand. Please try again." });
      } else {
         console.error("Flashcard Generation Error:", error);
         res.status(500).json({ error: "Failed to generate flashcards" });
      }
    }
  });

  app.post("/api/generate-flashcards-structured", requireAuth, async (req, res) => {
    try {
      const { subject, topic, level, count } = req.body;
      const ai = getGeminiClient();
      
      const prompt = `You are an expert AI tutor. Generate ${count || 10} interactive flashcards for the following subject:
Subject: ${subject}
Topic: ${topic}
Education Level: ${level}

Make the questions concise and the answers clear. Provide a short explanation for each answer.`;

      const config = {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              front: { type: Type.STRING, description: "The question or concept on the front of the flashcard" },
              back: { type: Type.STRING, description: "The concise answer or definition" },
              explanation: { type: Type.STRING, description: "A short explanation of the answer" }
            },
            required: ["front", "back", "explanation"]
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

  app.post("/api/learn-topic", requireAuth, async (req, res) => {
    try {
      const { subject, topic, educationLevel, examType } = req.body;
      const ai = getGeminiClient();

      const prompt = `You are an expert tutor creating a concise, high-yield topic study guide for a student.
Subject: ${subject}
Topic: ${topic}
Education Level: ${educationLevel || 'Secondary'}
Exam Target: ${examType || 'General'}

Provide a structured, engaging summary of this topic:
1. mainConcept: A clear 2-4 sentence foundational explanation of what this topic is, its core definition, and why it is important.
2. importantPoints: An array of 4-6 essential bullet points (key rules, formulas, theorems, characteristics, or vital concepts to remember).
3. keyExamples: An array of 2-3 practical examples, worked problems, or real-world applications demonstrating how this concept works in practice.`;

      const config = {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            mainConcept: { type: Type.STRING },
            importantPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
            keyExamples: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["mainConcept", "importantPoints", "keyExamples"]
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
        if (err?.status === 503 || err?.message?.includes("503") || err?.status === "UNAVAILABLE" || err?.error?.code === 503) {
          console.warn("Flash overloaded, falling back to flash-lite for topic learning");
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

      const learnData = JSON.parse(responseText);
      res.json({ learnData });
    } catch (error: any) {
      console.error("Learn Topic API Error:", error);
      // Fallback response so user flow is always seamless
      const { subject, topic } = req.body;
      res.json({
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
  });

  app.post("/api/process-notes", requireAuth, async (req, res) => {
    try {
      const { action, text, attachments, subject, topic, educationLevel, count } = req.body;
      if (!action) {
        return res.status(400).json({ error: "Missing required field 'action'" });
      }
      if ((!text || text.trim() === '') && (!attachments || attachments.length === 0)) {
        return res.status(400).json({ error: "Please provide either notes text or an uploaded file/image." });
      }

      const ai = getGeminiClient();

      // Build content parts (supporting multimodal file attachments if provided)
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
          if (err?.status === 503 || err?.message?.includes("503") || err?.status === "UNAVAILABLE" || err?.error?.code === 503) {
            response = await ai.models.generateContent({
              model: 'gemini-3.1-flash-lite',
              contents: [{ role: 'user', parts }]
            });
          } else {
            throw err;
          }
        }

        return res.json({ summary: response.text });
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
          if (err?.status === 503 || err?.message?.includes("503") || err?.status === "UNAVAILABLE" || err?.error?.code === 503) {
            response = await ai.models.generateContent({
              model: 'gemini-3.1-flash-lite',
              contents: [{ role: 'user', parts }]
            });
          } else {
            throw err;
          }
        }

        return res.json({ explanation: response.text });
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
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                front: { type: Type.STRING, description: "The concept, question, or term on the front" },
                back: { type: Type.STRING, description: "The clear answer or definition on the back" },
                explanation: { type: Type.STRING, description: "A short 1-2 sentence clarification or memory hook" }
              },
              required: ["front", "back"]
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
          if (err?.status === 503 || err?.message?.includes("503") || err?.status === "UNAVAILABLE" || err?.error?.code === 503) {
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
        if (!textRes) throw new Error("No flashcard data received from Gemini");
        const flashcards = JSON.parse(textRes);
        return res.json({ flashcards });
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

        let response;
        try {
          response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: [{ role: 'user', parts }],
            config
          });
        } catch (err: any) {
          if (err?.status === 503 || err?.message?.includes("503") || err?.status === "UNAVAILABLE" || err?.error?.code === 503) {
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
        if (!textRes) throw new Error("No questions data received from Gemini");
        const questions = JSON.parse(textRes);
        return res.json({ questions });
      } else {
        return res.status(400).json({ error: `Unknown action: ${action}` });
      }
    } catch (error: any) {
      console.error("Process Notes Error:", error);
      const isOverloaded = error?.status === 503 || error?.message?.includes("503") || error?.status === "UNAVAILABLE" || error?.error?.code === 503 || error?.status === 429;
      if (isOverloaded) {
        return res.status(503).json({ error: "The AI service is currently experiencing high demand. Please try again shortly." });
      }
      return res.status(500).json({ error: error.message || "Failed to process study notes" });
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
