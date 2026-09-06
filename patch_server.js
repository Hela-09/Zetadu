const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// Replace gemini-3.6-flash with gemini-2.5-flash
code = code.replace(/gemini-3\.6-flash/g, 'gemini-2.5-flash');
// Replace gemini-3.1-flash-lite with gemini-1.5-flash
code = code.replace(/gemini-3\.1-flash-lite/g, 'gemini-1.5-flash');

// Update /api/chat to handle streaming
const chatApiRegex = /app\.post\("\/api\/chat", requireAuth, async \(req, res\) => \{[\s\S]*?res\.json\(\{ text: response\.text \}\);[\s\S]*?\} catch \(error: any\) \{[\s\S]*?\}\n  \}\);/;

const streamImplementation = `app.post("/api/chat", requireAuth, async (req, res) => {
    try {
      const { message, history, context, stream } = req.body;
      const ai = getGeminiClient();
      
      const contents = history ? history.map((msg: any) => {
        const parts: any[] = [];
        if (msg.attachments) {
          msg.attachments.forEach((att: any) => {
            if (att.fileUri) parts.push({ fileData: { fileUri: att.fileUri, mimeType: att.mimeType } });
          });
        }
        parts.push({ text: msg.text || ' ' });
        return { role: msg.role === 'user' ? 'user' : 'model', parts };
      }) : [];
      
      const newParts: any[] = [];
      if (req.body.attachments) {
        req.body.attachments.forEach((att: any) => {
          if (att.fileUri) newParts.push({ fileData: { fileUri: att.fileUri, mimeType: att.mimeType } });
        });
      }
      newParts.push({ text: message || ' ' });
      contents.push({ role: 'user', parts: newParts });

      const tonePrompt = context?.tone === 'Strict' ? 'Be strict and concise.' : 'Be encouraging and friendly.';
      const systemInstruction = \`You are EduCore AI Tutor. \${tonePrompt}
Level: \${context?.educationLevel || 'Secondary'}. Country: \${context?.country || 'International'}.
-- IMPORTANT FORMATTING RULES:
  - DO NOT use raw LaTeX formatting (like $, $$, \\(, \\), \\[, \\], \\frac{}, \\times, \\sin, \\cos, \\theta, ^, _, backslashes) UNLESS the user explicitly asks for LaTeX or raw mathematical notation.
  - Convert mathematical expressions into readable plain text/unicode (e.g. use "3 × 10⁸ m/s" instead of "$3 \\times 10^8$ m/s", "n₁ × sin(θ₁) = n₂ × sin(θ₂)" instead of "n_1 \\sin(\\theta_1) = n_2 \\sin(\\theta_2)", "n = c ÷ v" instead of "n = \\frac{c}{v}", "θ" instead of "\\theta").
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
Always prioritize accuracy, completeness, and clarity. Analyze the entire image before producing your answer.\`;

      if (stream) {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        
        let resultStream;
        try {
          resultStream = await ai.models.generateContentStream({
            model: 'gemini-2.5-flash',
            contents: contents,
            config: { systemInstruction: systemInstruction }
          });
        } catch (err: any) {
          if (err?.status === 503 || err?.message?.includes("503") || err?.status === "UNAVAILABLE" || err?.error?.code === 503) {
            console.warn("2.5-flash overloaded, falling back to 1.5-flash");
            resultStream = await ai.models.generateContentStream({
              model: 'gemini-1.5-flash',
              contents: contents,
              config: { systemInstruction: systemInstruction }
            });
          } else {
            throw err;
          }
        }
        
        for await (const chunk of resultStream) {
          if (chunk.text) {
             res.write(\`data: \${JSON.stringify({ text: chunk.text })}\\n\\n\`);
          }
        }
        res.write('data: [DONE]\\n\\n');
        res.end();
      } else {
        let response;
        try {
          response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: contents,
            config: { systemInstruction: systemInstruction }
          });
        } catch (err: any) {
          if (err?.status === 503 || err?.message?.includes("503") || err?.status === "UNAVAILABLE" || err?.error?.code === 503) {
            console.warn("2.5-flash overloaded, falling back to 1.5-flash");
            response = await ai.models.generateContent({
              model: 'gemini-1.5-flash',
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
      console.error("Chat API Error:", error);
      if (!res.headersSent) {
         if (error?.status === 503 || error?.message?.includes("503") || error?.status === "UNAVAILABLE" || error?.error?.code === 503 || error?.status === 429 || error?.message?.toLowerCase().includes("quota") || error?.message?.toLowerCase().includes("resource_exhausted")) {
            res.status(503).json({ error: "The AI model is currently experiencing high demand. Please try again in a few moments." });
         } else {
            res.status(500).json({ error: "Failed to generate chat response" });
         }
      } else {
         res.write(\`data: \${JSON.stringify({ error: "Stream interrupted" })}\\n\\n\`);
         res.end();
      }
    }
  });`;

code = code.replace(chatApiRegex, streamImplementation);

fs.writeFileSync('server.ts', code);
