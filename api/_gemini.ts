import { GoogleGenAI } from "@google/genai";

let geminiClient: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    throw new Error(
      "GEMINI_API_KEY is not configured in Vercel Environment Variables. Please set GEMINI_API_KEY in your Vercel Project Settings (Settings -> Environment Variables) and redeploy."
    );
  }
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({ apiKey });
  }
  return geminiClient;
}

export function formatGeminiError(error: any): { status: number; message: string } {
  const errMsg = error?.message || String(error || '');
  const status = error?.status || error?.error?.code || 500;

  if (errMsg.includes("GEMINI_API_KEY is not configured") || errMsg.includes("API key not valid") || errMsg.includes("API_KEY_INVALID")) {
    return {
      status: 500,
      message: "GEMINI_API_KEY is missing or invalid in Vercel Environment Variables. Please configure GEMINI_API_KEY in Vercel Project Settings (Settings -> Environment Variables) and redeploy."
    };
  }

  const isQuota = status === 429 || 
    errMsg.toLowerCase().includes("quota") || 
    errMsg.toLowerCase().includes("resource_exhausted") || 
    errMsg.toLowerCase().includes("rate limit") ||
    errMsg.toLowerCase().includes("rate_limit");

  if (isQuota) {
    return {
      status: 429,
      message: "The Gemini AI model is currently rate-limited or quota is exceeded. Please verify your GEMINI_API_KEY plan or try again shortly."
    };
  }

  const isOverloaded = status === 503 || 
    errMsg.includes("503") || 
    status === "UNAVAILABLE" || 
    errMsg.toLowerCase().includes("overloaded");

  if (isOverloaded) {
    return {
      status: 503,
      message: "The AI model is currently experiencing high demand. Please try again in a few moments."
    };
  }

  if (status === 400 || errMsg.toLowerCase().includes("invalid_argument")) {
    return {
      status: 400,
      message: `Invalid AI request: ${errMsg}`
    };
  }

  return {
    status: typeof status === 'number' && status >= 400 && status < 600 ? status : 500,
    message: errMsg || "Failed to generate AI response from Gemini."
  };
}

export function setCorsHeaders(res: any) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );
}
