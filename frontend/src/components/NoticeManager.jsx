import { FileText, Plus } from "lucide-react";
import { useState } from "react";
import api from "../services/api.js";

const NoticeManager = () => {
  const [form, setForm] = useState({ title: "", originalText: "", deadlines: "", eligibility: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: "", type: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.originalText.trim()) return;
    setLoading(true);
    setMsg({ text: "", type: "" });
    try {
      await api.post("/admin/notices", form);
      setMsg({ text: "Notice published successfully!", type: "success" });
      setForm({ title: "", originalText: "", deadlines: "", eligibility: "" });
    } catch (err) {
      setMsg({ text: err.response?.data?.message || "Failed to publish notice.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900/60">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
          <FileText size={16} /> Publish New Notice
        </h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Notice Title"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
          <textarea
            value={form.originalText}
            onChange={(e) => setForm({ ...form, originalText: e.target.value })}
            placeholder="Notice content / body text"
            rows={4}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white resize-none"
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              value={form.deadlines}
              onChange={(e) => setForm({ ...form, deadlines: e.target.value })}
              placeholder="Deadline (e.g. Dec 31, 2025)"
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
            <input
              value={form.eligibility}
              onChange={(e) => setForm({ ...form, eligibility: e.target.value })}
              placeholder="Eligibility criteria"
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            <Plus size={15} /> {loading ? "Publishing…" : "Publish Notice"}
          </button>
        </form>
        {msg.text && (
          <p className={`mt-2 text-xs font-medium ${msg.type === "success" ? "text-green-600 dark:text-green-400" : "text-red-500"}`}>
            {msg.text}
          </p>
        )}
      </div>
      <p className="text-center text-sm text-slate-400">
        To view and manage all notices, visit the{" "}
        <a href="/notices" className="text-blue-600 underline dark:text-blue-400">Notice Summarizer</a>.
      </p>
    </div>
  );
};

export default NoticeManager;
