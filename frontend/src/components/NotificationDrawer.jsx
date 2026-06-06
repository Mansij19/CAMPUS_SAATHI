import { X } from "lucide-react";
import NotificationCard from "./NotificationCard.jsx";

const NotificationDrawer = ({ open, onClose, notifications, onMarkRead }) => {
  return (
    <>
      {open && (
        <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      )}

      <div
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 dark:bg-slate-900 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Notifications</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400"
            aria-label="Close notifications"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-3 text-2xl font-bold text-slate-400">No alerts</div>
              <p className="font-semibold text-slate-700 dark:text-slate-200">All caught up!</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">No notifications at the moment.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <NotificationCard
                  key={notification._id || notification.id}
                  notification={notification}
                  onMarkRead={onMarkRead}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationDrawer;
