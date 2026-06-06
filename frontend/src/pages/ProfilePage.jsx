import { useState } from "react";
import AppLayout from "../components/AppLayout.jsx";
import LanguageSelector from "../components/LanguageSelector.jsx";
import ProfileCard from "../components/ProfileCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({ name: user?.name || "", preferredLanguage: user?.preferredLanguage || "English" });
  const [status, setStatus] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setStatus("");
    await updateProfile(form);
    setStatus("Profile updated successfully");
  };

  return (
    <AppLayout>
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <form onSubmit={submit} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm font-semibold text-blue-600 dark:text-blue-300">Profile Management</p>
          <h1 className="mt-2 text-3xl font-black">Account preferences</h1>
          <div className="mt-6 space-y-4">
            <label className="block">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Full name</span>
              <input className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none ring-blue-500 focus:ring-2 dark:border-slate-700 dark:bg-slate-950" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
            </label>
            <LanguageSelector value={form.preferredLanguage} onChange={(preferredLanguage) => setForm({ ...form, preferredLanguage })} />
          </div>
          {status && <p className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200">{status}</p>}
          <button className="mt-6 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700">Save profile</button>
        </form>
        <ProfileCard user={user} />
      </div>
    </AppLayout>
  );
};

export default ProfilePage;
