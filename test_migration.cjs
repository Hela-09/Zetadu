const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const oldChat = `      let response;
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

      res.json({ text: response.text });`;

const newChat = `      let response;
      try {
        response = await ai.interactions.create({
          model: 'gemini-3.6-flash',
          // Note: the interactions API takes 'input' instead of 'contents' for simple cases, but wait.
          // Wait, for history, interactions API uses previous_interaction_id, or if we pass raw contents it's different.
        });
      } catch (err: any) {
      }
`;
