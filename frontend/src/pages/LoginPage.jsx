import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const LoginPage = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(form);
      navigate(user.role === "admin" ? "/dashboard/admin" : "/dashboard/student");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login failed because the backend is not reachable. Start the backend and check your local MongoDB connection."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      <Navbar />
      <main className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center px-4 py-10 sm:px-6 lg:grid-cols-2 lg:px-8">
        <section className="hidden pr-10 lg:block">
          <h1 className="text-5xl font-black leading-tight">Welcome back to CampusSathi</h1>
          <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-300">Sign in as a student or admin to access role-specific dashboards and AI helpdesk tools.</p>
        </section>
        <form onSubmit={submit} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <h2 className="text-2xl font-bold">Login</h2>
          <div className="mt-6 space-y-4">
            <input className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none ring-blue-500 focus:ring-2 dark:border-slate-700 dark:bg-slate-950" type="email" placeholder="Email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
            <input className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none ring-blue-500 focus:ring-2 dark:border-slate-700 dark:bg-slate-950" type="password" placeholder="Password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
          </div>
          {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-200">{error}</p>}
          <button disabled={loading} className="mt-6 w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
            {loading ? "Signing in..." : "Sign in"}
          </button>
          <p className="mt-5 text-center text-sm text-slate-500 dark:text-slate-400">
            New student? <Link className="font-semibold text-blue-600 dark:text-blue-300" to="/register">Create account</Link>
          </p>
        </form>
      </main>
    </div>
  );
};

export default LoginPage;
