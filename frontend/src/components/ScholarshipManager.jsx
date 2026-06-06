import { IndianRupee, Plus } from "lucide-react";
import { useState } from "react";
import api from "../services/api.js";

const ScholarshipManager = () => {
  const [scholarships, setScholarships] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", amount: "", deadline: "", eligibility: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: "", type: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.description || !form.amount || !form.deadline || !form.eligibility) {
      setMsg({ text: "All fields are required.", type: "error" });
      return;
    }
    setLoading(true);
    setMsg({ text: "", type: "" });
    try {
      const { data } = await api.post("/admin/scholarships", form);
      setScholarships((prev) => [...prev, data.scholarship]);
      setMsg({ text: "Scholarship added successfully!", type: "success" });
      setForm({ name: "", description: "", amount: "", deadline: "", eligibility: "" });
    } catch (err) {
      setMsg({ text: err.response?.data?.message || "Failed to add scholarship.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900/60">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
          <IndianRupee size={16} /> Add New Scholarship
        </h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Scholarship name"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Description"
            rows={3}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white resize-none"
          />
          <div className="grid gap-3 sm:grid-cols-3">
            <input
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              type="number"
              placeholder="Amount (₹)"
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
            <input
              value={form.deadline}
              onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              type="date"
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
            <input
              value={form.eligibility}
              onChange={(e) => setForm({ ...form, eligibility: e.target.value })}
              placeholder="Eligibility"
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-green-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-50"
          >
            <Plus size={15} /> {loading ? "Adding…" : "Add Scholarship"}
          </button>
        </form>
        {msg.text && (
          <p className={`mt-2 text-xs font-medium ${msg.type === "success" ? "text-green-600 dark:text-green-400" : "text-red-500"}`}>
            {msg.text}
          </p>
        )}
      </div>

      {scholarships.length > 0 && (
        <div className="space-y-3">
          {scholarships.map((s, i) => (
            <div key={s._id || i} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
              <div>
                <p className="font-semibold text-slate-800 dark:text-white">{s.name}</p>
                <p className="text-xs text-slate-400">₹{Number(s.amount).toLocaleString("en-IN")} • {new Date(s.deadline).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ScholarshipManager;
