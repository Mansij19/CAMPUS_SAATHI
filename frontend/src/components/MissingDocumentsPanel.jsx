import { FileWarning } from "lucide-react";

const MissingDocumentsPanel = ({ title = "Required Documents", documents = [], missing = [] }) => (
  <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
    <div className="flex items-center gap-3">
      <FileWarning className="text-amber-600 dark:text-amber-300" size={22} />
      <h2 className="text-lg font-black">{title}</h2>
    </div>
    <div className="mt-4 grid gap-4 md:grid-cols-2">
      <div>
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Documents</p>
        <ul className="mt-2 space-y-2 text-sm text-slate-700 dark:text-slate-200">
          {(documents.length ? documents : ["No documents detected"]).map((item) => (
            <li key={item} className="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-950">{item}</li>
          ))}
        </ul>
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Missing or unclear</p>
        <ul className="mt-2 space-y-2 text-sm text-slate-700 dark:text-slate-200">
          {(missing.length ? missing : ["Nothing critical detected"]).map((item) => (
            <li key={item} className="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-950">{item}</li>
          ))}
        </ul>
      </div>
    </div>
  </section>
);

export default MissingDocumentsPanel;
