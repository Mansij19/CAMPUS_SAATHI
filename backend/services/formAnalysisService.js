import { GoogleGenerativeAI } from "@google/generative-ai";

const parseJsonResponse = (text) => {
  const cleaned = text.replace(/```json|```/g, "").trim();
  const jsonStart = cleaned.indexOf("{");
  const jsonEnd = cleaned.lastIndexOf("}");
  const jsonText = jsonStart >= 0 && jsonEnd >= 0 ? cleaned.slice(jsonStart, jsonEnd + 1) : cleaned;
  return JSON.parse(jsonText);
};

const fallbackFormAnalysis = (text, preferredLanguage = "English") => ({
  language: preferredLanguage,
  summary: "This uploaded administrative form needs the student's personal, academic, and supporting document details before submission.",
  fields: [
    {
      name: "Student name",
      explanation: "Write your full name exactly as it appears in college records.",
      mandatory: true,
      example: "Mansi Jain"
    },
    {
      name: "Enrollment or roll number",
      explanation: "Use the official student ID assigned by the college.",
      mandatory: true,
      example: "College roll number"
    },
    {
      name: "Contact details",
      explanation: "Provide a working mobile number and email for updates.",
      mandatory: true,
      example: "Phone and email"
    }
  ],
  requiredDocuments: ["Identity proof", "Recent photograph", "College ID or enrollment proof"],
  missingInformation: text.includes("requires GEMINI_API_KEY")
    ? ["OCR text is incomplete because GEMINI_API_KEY is not configured"]
    : [],
  completionSteps: [
    "Read the form title and confirm it matches your requirement.",
    "Fill mandatory personal and academic fields first.",
    "Attach all required documents before submission.",
    "Review dates, signatures, and declaration sections.",
    "Submit the form to the correct office or portal before the deadline."
  ],
  recommendations: ["Keep photocopies or scanned copies of the submitted form and documents."]
});

export const analyzeFormWithGemini = async (extractedText, preferredLanguage = "English") => {
  if (!process.env.GEMINI_API_KEY) {
    return fallbackFormAnalysis(extractedText, preferredLanguage);
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || "gemini-1.5-flash"
    });

    const prompt = `You are CampusSathi's Smart Form Assistant.
Analyze this administrative form text for an Indian college student.
Support the student's preferred language: ${preferredLanguage}.

Return only valid JSON:
{
  "language": "English or Hindi",
  "summary": "simple summary",
  "fields": [
    { "name": "field label", "explanation": "simple student-friendly explanation", "mandatory": true, "example": "optional example" }
  ],
  "requiredDocuments": ["documents"],
  "missingInformation": ["missing or unclear information from the uploaded form"],
  "completionSteps": ["step-by-step instructions"],
  "recommendations": ["practical AI recommendations"]
}

Form text:
${extractedText}`;

    const result = await model.generateContent(prompt);
    return parseJsonResponse(result.response.text());
  } catch (error) {
    console.warn(`Form analysis provider unavailable: ${error.message}`);
    return fallbackFormAnalysis(extractedText, preferredLanguage);
  }
};
