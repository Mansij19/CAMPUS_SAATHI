const RecentChats = ({ chats = [] }) => {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 className="text-lg font-bold">Recent Chat History</h2>
      <div className="mt-4 space-y-3">
        {chats.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">No chat history yet.</p>
        ) : (
          chats.map((chat, index) => (
            <div key={`${chat.timestamp}-${index}`} className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-300">{chat.role}</p>
              <p className="mt-1 line-clamp-2 text-sm text-slate-700 dark:text-slate-200">{chat.content}</p>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default RecentChats;
