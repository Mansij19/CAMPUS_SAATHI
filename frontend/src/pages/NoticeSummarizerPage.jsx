import { History, Upload } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppLayout from "../components/AppLayout.jsx";
import NoticeUploader from "../components/NoticeUploader.jsx";
import api from "../services/api.js";

const NoticeSummarizerPage = () => {
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const upload = async ({ file, title }) => {
    setLoading(true);
    setError("");
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("title", title);
      const { data: uploadData } = await api.post("/notices/upload", body, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      const noticeId = uploadData.notice._id || uploadData.notice.id;
      const { data: summaryData } = await api.post("/notices/summarize", { noticeId });
      setNotice(summaryData.notice);
    } catch (err) {
      setError(err.response?.data?.message || "Could not upload and summarize this notice.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <section className="rounded-3xl bg-blue-600 p-6 text-white shadow-soft">
          <p className="text-sm font-semibold text-blue-100">Module 5</p>
          <h1 className="mt-2 text-3xl font-black">Notice & Circular Summarizer</h1>
          <p className="mt-2 max-w-2xl text-blue-50">Turn long notices into key highlights, deadlines, eligibility, and action items.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button onClick={() => navigate("/notices")} className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 font-semibold text-blue-700 hover:bg-blue-50">
              <Upload size={18} /> Upload notice
            </button>
            <Link to="/notices/history" className="inline-flex items-center gap-2 rounded-xl border border-blue-200 px-4 py-3 font-semibold text-white hover:bg-blue-500">
              <History size={18} /> History
            </Link>
          </div>
        </section>
        <NoticeUploader onUpload={upload} loading={loading} />
        {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-200">{error}</p>}
        {notice && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-100">
            Notice summarized. Open history to review all summaries.
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default NoticeSummarizerPage;
