import { ClipboardList } from "lucide-react";

const FormSummaryCard = ({ analysis, title }) => (
  <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
    <div className="flex items-center gap-3">
      <ClipboardList className="text-blue-600 dark:text-blue-300" size={22} />
      <div>
        <p className="text-sm font-semibold text-blue-600 dark:text-blue-300">Form Summary</p>
        <h2 className="text-xl font-black">{title}</h2>
      </div>
    </div>
    <p className="mt-4 leading-7 text-slate-700 dark:text-slate-200">{analysis?.summary || "No summary available yet."}</p>
  </section>
);

export default FormSummaryCard;
