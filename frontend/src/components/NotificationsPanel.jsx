import NotificationCard from "./NotificationCard.jsx";

const NotificationsPanel = ({ notifications = [], onMarkRead, title = "Notifications" }) => {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h2>
        <span className="rounded-full bg-slate-100 px-3 py-0.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          {notifications.length}
        </span>
      </div>
      <div className="mt-4 space-y-3">
        {notifications.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
            No notifications yet.
          </p>
        ) : (
          notifications.map((notification) => (
            <NotificationCard
              key={notification._id || notification.id}
              notification={notification}
              onMarkRead={onMarkRead}
            />
          ))
        )}
      </div>
    </section>
  );
};

export default NotificationsPanel;
