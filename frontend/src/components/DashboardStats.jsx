const DashboardStats = ({ stats }) => {
  if (!stats?.length) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {stats.map((stat) => (
        <section key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-200">
              <stat.icon size={20} />
            </span>
          </div>
          <p className="mt-4 text-3xl font-bold">{stat.value}</p>
          {stat.note && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{stat.note}</p>}
        </section>
      ))}
    </div>
  );
};

export default DashboardStats;
