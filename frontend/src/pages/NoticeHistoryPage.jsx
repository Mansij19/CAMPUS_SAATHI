import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import AppLayout from "../components/AppLayout.jsx";
import DeadlineCard from "../components/DeadlineCard.jsx";
import EligibilityCard from "../components/EligibilityCard.jsx";
import SummaryCard from "../components/SummaryCard.jsx";
import api from "../services/api.js";

const recordId = (record) => record?._id || record?.id;

const NoticeHistoryPage = () => {
  const [notices, setNotices] = useState([]);

  const load = () => {
    api
      .get("/notices")
      .then(({ data }) => setNotices(data.notices || []))
      .catch(() => setNotices([]));
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id) => {
    await api.delete(`/notices/${id}`);
    setNotices((current) => current.filter((notice) => recordId(notice) !== id));
  };

  return (
    <AppLayout>
      <div className="space-y-5">
        <div>
          <p className="text-sm font-semibold text-blue-600 dark:text-blue-300">Notice Summarizer</p>
          <h1 className="text-2xl font-black">Notice History</h1>
        </div>
        {notices.length === 0 && (
          <p className="rounded-2xl border border-slate-200 bg-white p-5 text-slate-500 shadow-soft dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
            No notices summarized yet.
          </p>
        )}
        {notices.map((notice) => {
          const id = recordId(notice);
          const deadlines = notice.deadlines?.length ? notice.deadlines : notice.summary?.deadlines || [];

          return (
            <article key={id} className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-black">{notice.title}</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {new Date(notice.createdAt).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => remove(id)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-white dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900"
                >
                  <Trash2 size={17} /> Delete
                </button>
              </div>
              <SummaryCard title={notice.title} summary={notice.summary} />
              <div className="grid gap-4 lg:grid-cols-2">
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
                  <h3 className="text-lg font-black">Deadlines</h3>
                  <div className="mt-4 space-y-3">
                    {deadlines.length > 0 ? (
                      deadlines.map((deadline, index) => {
                        const normalized =
                          typeof deadline === "string"
                            ? { title: "Notice deadline", date: deadline, type: "notice" }
                            : {
                                title: deadline.label || deadline.title || "Notice deadline",
                                date: deadline.date || deadline.deadline,
                                type: "notice"
                              };

                        return <DeadlineCard key={`${id}-deadline-${index}`} deadline={normalized} />;
                      })
                    ) : (
                      <p className="text-sm text-slate-500 dark:text-slate-400">No deadlines were detected for this notice.</p>
                    )}
                  </div>
                </section>
                <EligibilityCard
                  eligibility={notice.eligibility || notice.summary?.eligibility || []}
                  actions={notice.summary?.requiredActions || []}
                />
              </div>
            </article>
          );
        })}
      </div>
    </AppLayout>
  );
};

export default NoticeHistoryPage;
