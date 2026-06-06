import { useState } from "react";
import { Globe2, Loader2 } from "lucide-react";
import api from "../services/api.js";

const LANGUAGES = ["English", "Hindi", "Marathi", "Tamil", "Telugu", "Bengali"];

const TranslationToggle = ({ text, className = "" }) => {
  const [translated, setTranslated] = useState(null);
  const [loading, setLoading] = useState(false);
  const [targetLang, setTargetLang] = useState("Hindi");
  const [showOriginal, setShowOriginal] = useState(false);

  const handleTranslate = async () => {
    if (translated && !showOriginal) {
      setShowOriginal(true);
      return;
    }
    if (showOriginal) {
      setShowOriginal(false);
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post("/translate", { text, targetLanguage: targetLang });
      setTranslated(data.translatedText);
    } catch (error) {
      console.warn("Translation request failed:", error.message);
      setTranslated("Translation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-2">
        <select
          value={targetLang}
          onChange={(e) => { setTargetLang(e.target.value); setTranslated(null); setShowOriginal(false); }}
          className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang}>{lang}</option>
          ))}
        </select>
        <button
          onClick={handleTranslate}
          disabled={loading}
          className="flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 transition hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 disabled:opacity-50"
        >
          {loading ? <Loader2 size={12} className="animate-spin" /> : <Globe2 size={12} />}
          {loading ? "Translating…" : translated && !showOriginal ? "Show Original" : translated ? "Show Original" : `Translate`}
        </button>
      </div>
      {translated && (
        <p className="rounded-lg bg-blue-50 p-3 text-sm text-slate-800 dark:bg-blue-950/30 dark:text-slate-200">
          {showOriginal ? text : translated}
        </p>
      )}
    </div>
  );
};

export default TranslationToggle;
