import fs from "fs/promises";
import { GoogleGenerativeAI } from "@google/generative-ai";

const localExtractionHint = (file, title = "Uploaded document") => {
  return [
    `${title}`,
    `File name: ${file.originalname}`,
    "Text extraction requires GEMINI_API_KEY for PDF/image OCR in this local build.",
    "Ask the student to review the uploaded form or notice manually if OCR text is incomplete."
  ].join("\n");
};

export const extractTextFromDocument = async (file, title) => {
  if (!file) {
    throw new Error("A PDF or image file is required");
  }

  if (!process.env.GEMINI_API_KEY) {
    return localExtractionHint(file, title);
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || "gemini-1.5-flash"
    });
    const bytes = await fs.readFile(file.path);

    const result = await model.generateContent([
      {
        text:
          "Extract all readable text from this administrative form or notice. Preserve labels, dates, document requirements, instructions, and section headings. Return plain text only."
      },
      {
        inlineData: {
          mimeType: file.mimetype,
          data: bytes.toString("base64")
        }
      }
    ]);

    return result.response.text().trim() || localExtractionHint(file, title);
  } catch (error) {
    console.warn(`OCR provider unavailable: ${error.message}`);
    return localExtractionHint(file, title);
  }
};
