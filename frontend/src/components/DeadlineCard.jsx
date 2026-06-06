import { Calendar, Clock } from "lucide-react";

const typeStyles = {
  scholarship: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
  notice: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  exam: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400"
};

const DeadlineCard = ({ deadline }) => {
  if (!deadline?.date) {
    return (
      <div className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-900 dark:bg-slate-900">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
          <Calendar size={18} className="text-slate-500 dark:text-slate-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="truncate text-sm font-semibold text-slate-800 dark:text-white">{deadline?.title || "Upcoming deadline"}</p>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Date unavailable</p>
        </div>
      </div>
    );
  }

  const daysLeft = Math.ceil(
    (new Date(deadline.date) - new Date()) / (1000 * 60 * 60 * 24)
  );

  const urgency =
    daysLeft <= 3 ? "border-red-300 dark:border-red-800" :
    daysLeft <= 7 ? "border-amber-300 dark:border-amber-700" :
    "border-slate-200 dark:border-slate-700";

  return (
    <div className={`flex items-start gap-4 rounded-xl border bg-white p-4 shadow-sm dark:bg-slate-900 ${urgency}`}>
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
        <Calendar size={18} className="text-slate-500 dark:text-slate-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="truncate text-sm font-semibold text-slate-800 dark:text-white">{deadline.title}</p>
        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
          {new Date(deadline.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
        </p>
        <span className={`mt-2 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${typeStyles[deadline.type] || typeStyles.notice}`}>
          {deadline.type}
        </span>
      </div>
      <div className={`flex-shrink-0 flex flex-col items-center rounded-lg px-2.5 py-1.5 ${
        daysLeft <= 3
          ? "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400"
          : daysLeft <= 7
          ? "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400"
          : "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400"
      }`}>
        <Clock size={12} />
        <span className="mt-0.5 text-xs font-bold">{daysLeft}</span>
        <span className="text-[10px]">days</span>
      </div>
    </div>
  );
};

export default DeadlineCard;
