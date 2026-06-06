import { FileText, Trash2, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "../components/AppLayout.jsx";
import api from "../services/api.js";

const recordId = (record) => record?._id || record?.id;

const FormAssistantPage = () => {
  const [forms, setForms] = useState([]);

  const loadForms = () => {
    api.get("/forms/history").then(({ data }) => setForms(data.forms || [])).catch(() => setForms([]));
  };

  useEffect(() => {
    loadForms();
  }, []);

  const remove = async (id) => {
    await api.delete(`/forms/${id}`);
    setForms((current) => current.filter((form) => recordId(form) !== id));
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <section className="rounded-3xl bg-blue-600 p-6 text-white shadow-soft">

          <h1 className="mt-2 text-3xl font-black">Smart Form Assistant</h1>
          <p className="mt-2 max-w-2xl text-blue-50">Upload scholarship, hostel, admission, exam, or certificate forms and get field-wise guidance.</p>
          <Link to="/forms/upload" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 font-semibold text-blue-700 hover:bg-blue-50">
            <Upload size={18} /> Upload form
          </Link>
        </section>
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <FileText className="text-blue-600 dark:text-blue-300" size={22} />
            <h2 className="text-xl font-black">Form History</h2>
          </div>
          <div className="mt-4 grid gap-3">
            {forms.length === 0 && <p className="text-sm text-slate-500 dark:text-slate-400">No forms analyzed yet.</p>}
            {forms.map((form) => {
              const id = recordId(form);
              return (
                <article key={id} className="flex flex-col gap-3 rounded-2xl bg-slate-50 p-4 dark:bg-slate-950 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-bold">{form.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{new Date(form.uploadedAt || form.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <Link className="rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700" to={`/forms/${id}`}>
                      View analysis
                    </Link>
                    <button onClick={() => remove(id)} className="rounded-xl border border-slate-200 px-3 py-2 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
                      <Trash2 size={17} />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </AppLayout>
  );
};

export default FormAssistantPage;
