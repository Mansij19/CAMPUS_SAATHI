import { CheckCircle2, CircleAlert } from "lucide-react";

const FieldExplanationCard = ({ field }) => {
  const Icon = field.mandatory ? CircleAlert : CheckCircle2;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-bold">{field.name}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{field.explanation}</p>
          {field.example && <p className="mt-3 text-xs font-semibold text-slate-500 dark:text-slate-400">Example: {field.example}</p>}
        </div>
        <span className={`shrink-0 rounded-full p-2 ${field.mandatory ? "bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-200" : "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-200"}`}>
          <Icon size={18} />
        </span>
      </div>
    </article>
  );
};

export default FieldExplanationCard;
