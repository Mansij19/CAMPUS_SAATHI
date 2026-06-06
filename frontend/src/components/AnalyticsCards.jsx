const AnalyticsCards = ({ cards = [] }) => {
  if (!cards.length) return null;

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.label} className={`flex items-center gap-4 rounded-2xl border border-slate-200/60 ${card.bg} p-5 shadow-sm dark:border-slate-700/50`}>
            <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${card.colorClass} text-white shadow`}>
              <Icon size={20} />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{card.value}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{card.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AnalyticsCards;
