const SYSTEM_PROMPT = `You are CampusSathi, an AI campus helpdesk assistant. Answer student campus queries politely in Hindi or English, explain procedures step-by-step, and return concise JSON with answer and detectedLanguage.`;

const detectLanguage = (text, preferredLanguage) => {
  return /[\u0900-\u097F]/.test(text) ? "Hindi" : preferredLanguage || "English";
};

export const generateFallbackAnswer = async (query, preferredLanguage = "English", reason = "Gemini unavailable") => {
  if (!process.env.FEATHERLESS_API_KEY) {
    return {
      answer:
        preferredLanguage === "Hindi"
          ? "Abhi AI service uplabdh nahi hai. Kripya apne college helpdesk se sampark karein ya thodi der baad phir poochhein."
          : "The AI service is unavailable right now. Please contact your college helpdesk or try again shortly.",
      detectedLanguage: detectLanguage(query, preferredLanguage),
      reason
    };
  }

  const response = await fetch("https://api.featherless.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.FEATHERLESS_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: process.env.FEATHERLESS_MODEL || "meta-llama/Meta-Llama-3.1-8B-Instruct",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Preferred language: ${preferredLanguage}\nQuery: ${query}\nReturn only JSON: {"answer":"...","detectedLanguage":"English or Hindi"}`
        }
      ],
      temperature: 0.3
    })
  });

  if (!response.ok) {
    throw new Error(`Featherless request failed with status ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || "{}";
  const parsed = JSON.parse(content.replace(/```json|```/g, "").trim());

  return {
    answer: parsed.answer || "I could not prepare an answer right now.",
    detectedLanguage: parsed.detectedLanguage || detectLanguage(query, preferredLanguage),
    reason
  };
};
