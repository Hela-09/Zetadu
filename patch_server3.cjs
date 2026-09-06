const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
  /const getGeminiClient = \(\) => \{[\s\S]*?return new GoogleGenAI\(\{ apiKey: process\.env\.GEMINI_API_KEY \}\);\n  \};/,
  \`let _geminiClient;
  const getGeminiClient = () => {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY environment variable is missing");
    }
    if (!_geminiClient) {
      _geminiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
    return _geminiClient;
  };\`
);

fs.writeFileSync('server.ts', code);
