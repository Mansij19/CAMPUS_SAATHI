import { Link } from "react-router-dom";
import NotificationBell from "./NotificationBell.jsx";

const DashboardHeader = ({
  eyebrow,
  title,
  description,
  actions = [],
  meta = [],
  accent = "from-blue-600 via-blue-700 to-indigo-800",
  trailingContent
}) => {
  return (
    <section className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${accent} p-6 text-white shadow-xl md:p-8`}>
      <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10" />
      <div className="pointer-events-none absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-white/5" />
      <div className="relative flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div className="max-w-3xl">
          {eyebrow && (
            <span className="inline-flex rounded-full bg-white/20 px-3 py-0.5 text-xs font-semibold text-blue-100 backdrop-blur-sm">
              {eyebrow}
            </span>
          )}
          <h1 className="mt-3 text-2xl font-black md:text-3xl">{title}</h1>
          {description && <p className="mt-2 text-sm text-blue-100 md:text-base">{description}</p>}
          {(actions.length > 0 || meta.length > 0) && (
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {actions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.to}
                    to={action.to}
                    className={
                      action.variant === "outline"
                        ? "inline-flex items-center gap-2 rounded-xl border border-white/30 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/10"
                        : "inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-blue-700 shadow transition hover:bg-blue-50"
                    }
                  >
                    {Icon && <Icon size={16} />}
                    {action.label}
                  </Link>
                );
              })}
              {meta.map((item) => (
                <div key={item.label} className="flex items-center gap-1.5 rounded-xl bg-white/20 px-3 py-2 text-xs font-medium backdrop-blur-sm">
                  {item.icon ? <item.icon size={13} /> : null}
                  {item.label}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-col items-start gap-3">
          {trailingContent}
          {!trailingContent && <NotificationBell />}
        </div>
      </div>
    </section>
  );
};

export default DashboardHeader;
