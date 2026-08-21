const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const oldChatBlock = `      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: contents,
        config: {
            systemInstruction: systemInstruction
        }
      });

      res.json({ text: response.text });
    } catch (error) {
      console.error("Chat API Error:", error);
      res.status(500).json({ error: "Failed to generate chat response" });
    }`;

const newChatBlock = `      let response;
      try {
        response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: contents,
          config: { systemInstruction: systemInstruction }
        });
      } catch (err: any) {
        if (err?.status === 503) {
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
    } catch (error: any) {
      if (error?.status === 503) {
         res.status(503).json({ error: "The AI model is currently experiencing high demand. Please try again in a few moments." });
      } else {
         console.error("Chat API Error:", error);
         res.status(500).json({ error: "Failed to generate chat response" });
      }
    }`;

code = code.replace(oldChatBlock, newChatBlock);


const oldGenBlock = `      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
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
        }
      });

      const text = response.text;
      if (!text) throw new Error("No text from Gemini");
      const questions = JSON.parse(text);
      res.json({ questions });
    } catch (error) {
      console.error("Generation API Error:", error);
      res.status(500).json({ error: "Failed to generate questions" });
    }`;

const newGenBlock = `      let response;
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
          model: 'gemini-2.5-flash',
          contents: prompt,
          config
        });
      } catch (err: any) {
        if (err?.status === 503) {
          console.warn("2.5-flash overloaded, falling back to 1.5-flash");
          response = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
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
      if (error?.status === 503) {
         res.status(503).json({ error: "High demand. Please try again." });
      } else {
         console.error("Generation API Error:", error);
         res.status(500).json({ error: "Failed to generate questions" });
      }
    }`;

code = code.replace(oldGenBlock, newGenBlock);

fs.writeFileSync('server.ts', code);
