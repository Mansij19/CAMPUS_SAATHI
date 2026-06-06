import { ArrowRight, Bot, Languages, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white text-slate-950 dark:bg-slate-950 dark:text-white">
      <Navbar />
      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.16),transparent_32%),linear-gradient(135deg,#ffffff_0%,#eff6ff_52%,#dbeafe_100%)] dark:bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.28),transparent_32%),linear-gradient(135deg,#020617_0%,#0f172a_58%,#172554_100%)]" />
          <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/70 px-4 py-2 text-sm font-semibold text-blue-700 dark:border-blue-800 dark:bg-slate-950/60 dark:text-blue-200">
                <Bot size={16} /> AI multilingual campus helpdesk
              </p>
              <h1 className="mt-6 max-w-3xl text-5xl font-black leading-tight tracking-normal sm:text-6xl">
                CampusSathi
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
                A production-ready student support portal for authentication, dashboards, and fast Hindi-English campus query support.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/register" className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-soft hover:bg-blue-700">
                  Start as Student <ArrowRight size={18} />
                </Link>
              </div>
            </div>
            <div className="rounded-3xl border border-white/60 bg-white/75 p-5 shadow-soft backdrop-blur dark:border-slate-700 dark:bg-slate-900/70">
              <div className="rounded-2xl bg-slate-950 p-5 text-white">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">CampusSathi Chat</p>
                  <span className="rounded-full bg-emerald-400/20 px-3 py-1 text-xs text-emerald-200">Online</span>
                </div>
                <div className="mt-6 space-y-4">
                  <div className="max-w-[82%] rounded-2xl rounded-bl-sm bg-slate-800 px-4 py-3 text-sm">How do I apply for hostel accommodation?</div>
                  <div className="ml-auto max-w-[82%] rounded-2xl rounded-br-sm bg-blue-600 px-4 py-3 text-sm">You can apply through the student portal. Keep your ID card, admission proof, and fee receipt ready.</div>
                  <div className="max-w-[82%] rounded-2xl rounded-bl-sm bg-slate-800 px-4 py-3 text-sm">Migration certificate kaise milega?</div>
                </div>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {[
                  { icon: Languages, label: "Hindi + English" },
                  { icon: ShieldCheck, label: "JWT + RBAC" },
                  { icon: Bot, label: "Gemini + fallback" }
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="rounded-2xl bg-white p-4 text-sm font-semibold text-slate-700 shadow-sm dark:bg-slate-800 dark:text-slate-100">
                    <Icon className="mb-3 text-blue-600 dark:text-blue-300" size={22} />
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;
