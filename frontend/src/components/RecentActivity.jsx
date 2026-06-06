import { Activity as ActivityIcon, BookOpen, FileText, Globe, MessageSquare } from "lucide-react";

const iconMap = {
  chat: MessageSquare,
  form_upload: FileText,
  language: Globe,
  profile_update: ActivityIcon,
  default: BookOpen
};

const colorMap = {
  chat: "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400",
  form_upload: "bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400",
  language: "bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400",
  profile_update: "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400",
  default: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
};

const RecentActivity = ({ activities }) => {
  if (!activities || activities.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">Recent Activity</h3>
        <div className="mt-6 flex flex-col items-center py-8 text-center text-slate-400">
          <ActivityIcon size={32} className="mb-2 opacity-50" />
          <p className="text-sm">No recent activity yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h3 className="text-base font-bold text-slate-900 dark:text-white">Recent Activity</h3>
      <div className="mt-4 space-y-3">
        {activities.map((activity, index) => {
          const Icon = iconMap[activity.type] || iconMap.default;
          const colorClass = colorMap[activity.type] || colorMap.default;
          return (
            <div key={activity._id || activity.id || index} className="flex items-start gap-3">
              <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${colorClass}`}>
                <Icon size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-700 dark:text-slate-200">{activity.description}</p>
                <p className="mt-0.5 text-xs text-slate-400">
                  {new Date(activity.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric", month: "short", hour: "2-digit", minute: "2-digit"
                  })}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentActivity;
