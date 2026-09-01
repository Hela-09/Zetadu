const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const flashcardsEndpoint = `
  app.post("/api/generate-flashcards", requireAuth, async (req, res) => {
    try {
      const { text, count } = req.body;
      const ai = getGeminiClient();
      
      const prompt = \`You are an expert AI tutor. Generate \${count || 10} interactive flashcards from the following study notes or lecture transcript. Make the questions concise and the answers clear.

Text:
\${text}\`;

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
`;

if (!code.includes('/api/generate-flashcards')) {
  code = code.replace("app.all('/api/*'", flashcardsEndpoint + "\n  app.all('/api/*'");
  fs.writeFileSync('server.ts', code);
  console.log("Patched server.ts with generate-flashcards endpoint.");
} else {
  console.log("generate-flashcards already exists in server.ts");
}
