import { CheckCircle } from "lucide-react";

const NotificationCard = ({ notification, onMarkRead }) => {
  const isUnread = notification.status === "unread";
  const id = notification._id || notification.id;

  return (
    <div
      className={`relative rounded-xl border p-4 transition-all ${
        isUnread
          ? "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/40"
          : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800"
      }`}
    >
      {isUnread && (
        <span className="absolute right-4 top-4 h-2.5 w-2.5 rounded-full bg-blue-500" />
      )}
      <p className="pr-6 text-sm font-semibold text-slate-800 dark:text-white">{notification.title}</p>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{notification.message}</p>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-slate-400">
          {new Date(notification.createdAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
          })}
        </span>
        {isUnread && (
          <button
            onClick={() => onMarkRead(id)}
            className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            <CheckCircle size={13} />
            Mark as read
          </button>
        )}
      </div>
    </div>
  );
};

export default NotificationCard;
