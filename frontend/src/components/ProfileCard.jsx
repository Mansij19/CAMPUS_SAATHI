import { Languages, Mail, Shield, UserRound } from "lucide-react";

const ProfileCard = ({ user }) => {
  if (!user) return null;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-4">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-200">
          <UserRound size={26} />
        </div>
        <div>
          <h2 className="text-lg font-bold">{user.name}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">CampusSathi profile</p>
        </div>
      </div>
      <div className="mt-5 space-y-3 text-sm">
        <p className="flex items-center gap-3 text-slate-600 dark:text-slate-300"><Mail size={17} /> {user.email}</p>
        <p className="flex items-center gap-3 text-slate-600 dark:text-slate-300"><Shield size={17} /> {user.role}</p>
        <p className="flex items-center gap-3 text-slate-600 dark:text-slate-300"><Languages size={17} /> {user.preferredLanguage}</p>
      </div>
    </section>
  );
};

export default ProfileCard;
