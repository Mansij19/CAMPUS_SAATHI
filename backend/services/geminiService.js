import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_PROMPT = `You are CampusSathi, an AI campus helpdesk assistant.

Your responsibilities:
- Answer student queries politely.
- Support Hindi and English.
- Explain college procedures simply.
- Guide students step-by-step.
- If information is unavailable, clearly say so.
- Keep responses concise and student-friendly.

Return only valid JSON in this shape:
{
  "answer": "string",
  "detectedLanguage": "English or Hindi"
}`;

const parseJsonResponse = (text) => {
  const cleaned = text.replace(/```json|```/g, "").trim();
  const jsonStart = cleaned.indexOf("{");
  const jsonEnd = cleaned.lastIndexOf("}");
  const jsonText = jsonStart >= 0 && jsonEnd >= 0 ? cleaned.slice(jsonStart, jsonEnd + 1) : cleaned;
  return JSON.parse(jsonText);
};

export const generateCampusAnswer = async (query, preferredLanguage = "English") => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || "gemini-1.5-flash"
  });

  const prompt = `${SYSTEM_PROMPT}

Student preferred language: ${preferredLanguage}
Student query: ${query}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const parsed = parseJsonResponse(text);

  return {
    answer: parsed.answer || "I could not prepare an answer right now.",
    detectedLanguage: parsed.detectedLanguage || preferredLanguage
  };
};
