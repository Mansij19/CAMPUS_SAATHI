import { CalendarClock } from "lucide-react";

const DeadlineCard = ({ deadlines = [] }) => (
  <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
    <div className="flex items-center gap-3">
      <CalendarClock className="text-red-600 dark:text-red-300" size={22} />
      <h2 className="text-lg font-black">Important Dates</h2>
    </div>
    <div className="mt-4 space-y-2">
      {(deadlines.length ? deadlines : [{ label: "No deadline detected", date: "Check original notice" }]).map((deadline) => (
        <div key={`${deadline.label}-${deadline.date}`} className="rounded-xl bg-slate-50 px-3 py-2 text-sm dark:bg-slate-950">
          <p className="font-semibold">{deadline.label}</p>
          <p className="text-slate-500 dark:text-slate-400">{[deadline.date, deadline.time].filter(Boolean).join(" ")}</p>
        </div>
      ))}
    </div>
  </section>
);

export default DeadlineCard;
