import { ArrowRight, Calendar, IndianRupee } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ScholarshipCard = ({ scholarship }) => {
  const navigate = useNavigate();
  const daysLeft = Math.ceil(
    (new Date(scholarship.deadline) - new Date()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div>
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-sm font-bold leading-snug text-slate-900 dark:text-white">
            {scholarship.name}
          </h4>
          <span className={`flex-shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold ${
            daysLeft <= 7
              ? "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400"
              : "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
          }`}>
            {daysLeft > 0 ? `${daysLeft}d left` : "Expired"}
          </span>
        </div>
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
          {scholarship.description}
        </p>
        <div className="mt-3 flex items-center gap-4">
          <div className="flex items-center gap-1 text-sm font-semibold text-green-600 dark:text-green-400">
            <IndianRupee size={14} />
            {scholarship.amount?.toLocaleString("en-IN")}
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <Calendar size={12} />
            {new Date(scholarship.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
          </div>
        </div>
        <p className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-400">
          <span className="font-semibold">Eligibility: </span>{scholarship.eligibility}
        </p>
      </div>
      <button
        onClick={() => navigate("/chat")}
        className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
      >
        Ask Assistant <ArrowRight size={13} />
      </button>
    </div>
  );
};

export default ScholarshipCard;
