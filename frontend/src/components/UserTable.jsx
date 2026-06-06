const UserTable = ({ users }) => {
  if (!users?.length) {
    return (
      <div className="py-12 text-center text-slate-400">No users found.</div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[680px] text-left text-sm">
        <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-900/80 dark:text-slate-400">
          <tr>
            <th className="px-5 py-3">Name</th>
            <th className="px-5 py-3">Email</th>
            <th className="px-5 py-3">Role</th>
            <th className="px-5 py-3">Language</th>
            <th className="px-5 py-3">Joined</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {users.map((user) => (
            <tr key={user._id || user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600 dark:bg-blue-900/40 dark:text-blue-400">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-semibold text-slate-800 dark:text-white">{user.name}</span>
                </div>
              </td>
              <td className="px-5 py-4 text-slate-500 dark:text-slate-400">{user.email}</td>
              <td className="px-5 py-4">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                  user.role === "admin"
                    ? "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400"
                    : "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400"
                }`}>
                  {user.role}
                </span>
              </td>
              <td className="px-5 py-4 text-slate-600 dark:text-slate-300">{user.preferredLanguage || "English"}</td>
              <td className="px-5 py-4 text-slate-400">
                {new Date(user.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
