import { Sparkles } from "lucide-react";

const AIRecommendationsPanel = ({ steps = [], recommendations = [], title = "AI Recommendations" }) => (
  <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
    <div className="flex items-center gap-3">
      <Sparkles className="text-blue-600 dark:text-blue-300" size={22} />
      <h2 className="text-lg font-black">{title}</h2>
    </div>
    <div className="mt-4 grid gap-4 md:grid-cols-2">
      <ol className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
        {(steps.length ? steps : ["Upload a document to generate completion steps."]).map((item, index) => (
          <li key={item} className="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-950">
            <span className="mr-2 font-bold text-blue-600 dark:text-blue-300">{index + 1}.</span>
            {item}
          </li>
        ))}
      </ol>
      <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
        {(recommendations.length ? recommendations : ["No extra recommendations yet."]).map((item) => (
          <li key={item} className="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-950">{item}</li>
        ))}
      </ul>
    </div>
  </section>
);

export default AIRecommendationsPanel;
