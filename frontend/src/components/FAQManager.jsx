import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../services/api.js";

const FAQManager = () => {
  const [faqs, setFaqs] = useState([]);
  const [form, setForm] = useState({ question: "", answer: "", category: "General" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    setFaqs([]);
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.question.trim() || !form.answer.trim()) return;
    setLoading(true);
    setMsg("");
    try {
      const { data } = await api.post("/admin/faqs", form);
      setFaqs((prev) => [...prev, data.faq]);
      setForm({ question: "", answer: "", category: "General" });
      setMsg("FAQ added successfully!");
    } catch (err) {
      setMsg(err.response?.data?.message || "Failed to add FAQ.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Form */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900/60">
        <h3 className="mb-4 text-sm font-bold text-slate-700 dark:text-slate-300">Add New FAQ</h3>
        <form onSubmit={handleAdd} className="space-y-3">
          <input
            value={form.question}
            onChange={(e) => setForm({ ...form, question: e.target.value })}
            placeholder="Question"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
          <textarea
            value={form.answer}
            onChange={(e) => setForm({ ...form, answer: e.target.value })}
            placeholder="Answer"
            rows={3}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white resize-none"
          />
          <div className="flex items-center gap-3">
            <input
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              placeholder="Category (e.g. Library)"
              className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
            >
              <Plus size={15} /> {loading ? "Adding…" : "Add FAQ"}
            </button>
          </div>
        </form>
        {msg && <p className="mt-2 text-xs text-green-600 dark:text-green-400">{msg}</p>}
      </div>

      {/* FAQ List */}
      {faqs.length > 0 ? (
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={faq._id || faq.id || i} className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="mb-1 inline-block rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-900/40 dark:text-blue-400">
                    {faq.category || "General"}
                  </span>
                  <p className="text-sm font-bold text-slate-800 dark:text-white">{faq.question}</p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-sm text-slate-400">No FAQs yet. Add one above.</p>
      )}
    </div>
  );
};

export default FAQManager;
