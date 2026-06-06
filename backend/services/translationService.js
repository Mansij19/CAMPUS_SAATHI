import { GoogleGenerativeAI } from "@google/generative-ai";

const TRANSLATION_PROMPT = `You are a professional multilingual translation assistant.
Translate the provided text to the target language exactly, preserving the tone and meaning.
Return ONLY the raw translated string. Do not add markdown, quotes, explanations, or JSON wrappers.

Target Language: `;

export const translateText = async (text, targetLanguage) => {
  if (!text || !text.trim()) return "";
  if (!targetLanguage || targetLanguage.toLowerCase() === "english") {
    // Basic heuristics: if it is already english, return.
    // However, to keep it simple, if target language is English we can just try to translate if there is non-english character, or return directly.
  }

  // Primary: Gemini Pro
  if (process.env.GEMINI_API_KEY) {
    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({
        model: process.env.GEMINI_MODEL || "gemini-1.5-flash"
      });

      const prompt = `${TRANSLATION_PROMPT}${targetLanguage}\n\nText to translate:\n${text}`;
      const result = await model.generateContent(prompt);
      const responseText = result.response.text()?.trim();
      if (responseText) return responseText;
    } catch (error) {
      console.warn("Gemini translation failed, trying Featherless fallback:", error.message);
    }
  }

  // Fallback: Featherless
  if (process.env.FEATHERLESS_API_KEY) {
    try {
      const response = await fetch("https://api.featherless.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.FEATHERLESS_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: process.env.FEATHERLESS_MODEL || "meta-llama/Meta-Llama-3.1-8B-Instruct",
          messages: [
            {
              role: "system",
              content: `You are a translation assistant. Translate the text exactly into ${targetLanguage}. Return ONLY the translated string, no explanations, no wrappers.`
            },
            {
              role: "user",
              content: text
            }
          ],
          temperature: 0.1
        })
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content?.trim();
        if (content) return content;
      }
    } catch (error) {
      console.error("Featherless translation fallback failed:", error.message);
    }
  }

  // Last resort: return original text
  return text;
};
