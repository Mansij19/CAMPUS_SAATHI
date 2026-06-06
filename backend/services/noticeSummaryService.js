import { GoogleGenerativeAI } from "@google/generative-ai";

const parseJsonResponse = (text) => {
  const cleaned = text.replace(/```json|```/g, "").trim();
  const jsonStart = cleaned.indexOf("{");
  const jsonEnd = cleaned.lastIndexOf("}");
  const jsonText = jsonStart >= 0 && jsonEnd >= 0 ? cleaned.slice(jsonStart, jsonEnd + 1) : cleaned;
  return JSON.parse(jsonText);
};

const fallbackNoticeSummary = (text, preferredLanguage = "English") => ({
  language: preferredLanguage,
  keyHighlights: [
    "Read the notice carefully for department, semester, date, and submission instructions.",
    "Check whether the notice applies to your course or year."
  ],
  shortSummary: "This notice has been uploaded successfully. Configure GEMINI_API_KEY to generate a richer AI summary from the extracted text.",
  deadlines: [],
  eligibility: ["Students mentioned in the notice or matching the course/year criteria"],
  requiredActions: ["Review the notice", "Note important dates", "Contact the relevant office if details are unclear"],
  importantDates: [],
  originalTextStatus: text.includes("requires GEMINI_API_KEY") ? "OCR text is incomplete" : "OCR text available"
});

export const summarizeNoticeWithGemini = async (originalText, preferredLanguage = "English") => {
  if (!process.env.GEMINI_API_KEY) {
    return fallbackNoticeSummary(originalText, preferredLanguage);
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || "gemini-1.5-flash"
    });

    const prompt = `You are CampusSathi's Notice & Circular Summarizer.
Summarize this college notice for students in ${preferredLanguage}.

Return only valid JSON:
{
  "language": "English or Hindi",
  "shortSummary": "brief summary",
  "keyHighlights": ["important highlights"],
  "deadlines": [{ "label": "what is due", "date": "date if available", "time": "time if available" }],
  "eligibility": ["who this notice applies to"],
  "requiredActions": ["what students must do"],
  "importantDates": [{ "label": "event", "date": "date" }]
}

Notice text:
${originalText}`;

    const result = await model.generateContent(prompt);
    return parseJsonResponse(result.response.text());
  } catch (error) {
    console.warn(`Notice summary provider unavailable: ${error.message}`);
    return fallbackNoticeSummary(originalText, preferredLanguage);
  }
};
