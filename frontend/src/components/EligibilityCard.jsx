import { UsersRound } from "lucide-react";

const EligibilityCard = ({ eligibility = [], actions = [] }) => (
  <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
    <div className="flex items-center gap-3">
      <UsersRound className="text-emerald-600 dark:text-emerald-300" size={22} />
      <h2 className="text-lg font-black">Eligibility and Actions</h2>
    </div>
    <div className="mt-4 grid gap-4 md:grid-cols-2">
      <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
        {(eligibility.length ? eligibility : ["Eligibility not detected"]).map((item) => (
          <li key={item} className="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-950">{item}</li>
        ))}
      </ul>
      <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
        {(actions.length ? actions : ["Review the original notice"]).map((item) => (
          <li key={item} className="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-950">{item}</li>
        ))}
      </ul>
    </div>
  </section>
);

export default EligibilityCard;
