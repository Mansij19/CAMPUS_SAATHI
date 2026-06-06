import { Languages, MessageCircle, UserPen } from "lucide-react";
import { Link } from "react-router-dom";

const actions = [
  { to: "/chat", label: "Ask AI", icon: MessageCircle, note: "Hostel, forms, certificates" },
  { to: "/profile", label: "Language", icon: Languages, note: "Set Hindi or English" },
  { to: "/profile", label: "Profile", icon: UserPen, note: "Update account details" }
];

const QuickActions = () => {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 className="text-lg font-bold">Quick Actions</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
        {actions.map(({ to, label, icon: Icon, note }) => (
          <Link key={label} to={to} className="rounded-xl border border-slate-200 p-4 hover:border-blue-400 hover:bg-blue-50 dark:border-slate-700 dark:hover:border-blue-500 dark:hover:bg-blue-950/50">
            <Icon className="text-blue-600 dark:text-blue-300" size={22} />
            <p className="mt-3 font-semibold">{label}</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{note}</p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default QuickActions;
