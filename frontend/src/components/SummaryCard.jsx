import { Newspaper } from "lucide-react";
import TranslationToggle from "./TranslationToggle.jsx";

const SummaryCard = ({ summary, title }) => (
  <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
    <div className="flex items-center gap-3">
      <Newspaper className="text-blue-600 dark:text-blue-300" size={22} />
      <div>
        <p className="text-sm font-semibold text-blue-600 dark:text-blue-300">Notice Summary</p>
        <h2 className="text-xl font-black">{title}</h2>
      </div>
    </div>
    <p className="mt-4 leading-7 text-slate-700 dark:text-slate-200">{summary?.shortSummary || "No summary available yet."}</p>
    {summary?.shortSummary && <TranslationToggle text={summary.shortSummary} className="mt-4" />}
    <div className="mt-4 grid gap-2">
      {(summary?.keyHighlights || []).map((item) => (
        <p key={item} className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700 dark:bg-slate-950 dark:text-slate-200">{item}</p>
      ))}
    </div>
  </section>
);

export default SummaryCard;
