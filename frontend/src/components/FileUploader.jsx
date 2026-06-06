import { FileUp, Loader2, Upload } from "lucide-react";
import { useState } from "react";

const FileUploader = ({ title, accept = "application/pdf,image/*", onUpload, loading }) => {
  const [file, setFile] = useState(null);
  const [documentTitle, setDocumentTitle] = useState("");

  const submit = (event) => {
    event.preventDefault();
    if (!file || loading) return;
    onUpload({ file, title: documentTitle || file.name });
  };

  return (
    <form onSubmit={submit} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300">
          <FileUp size={22} />
        </span>
        <div>
          <h2 className="text-xl font-black">{title}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">PDF, JPG, PNG, or WEBP up to 8 MB</p>
        </div>
      </div>
      <div className="mt-5 grid gap-4">
        <input
          className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none ring-blue-500 focus:ring-2 dark:border-slate-700 dark:bg-slate-950"
          placeholder="Document title"
          value={documentTitle}
          onChange={(event) => setDocumentTitle(event.target.value)}
        />
        <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center hover:border-blue-400 dark:border-slate-700 dark:bg-slate-950">
          <Upload className="text-blue-600 dark:text-blue-300" size={28} />
          <span className="mt-3 text-sm font-semibold">{file ? file.name : "Choose a form or notice file"}</span>
          <span className="mt-1 text-xs text-slate-500 dark:text-slate-400">Click to browse from your device</span>
          <input
            type="file"
            className="hidden"
            accept={accept}
            onChange={(event) => setFile(event.target.files?.[0] || null)}
            required
          />
        </label>
      </div>
      <button
        disabled={!file || loading}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
      >
        {loading ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
        {loading ? "Processing..." : "Upload and analyze"}
      </button>
    </form>
  );
};

export default FileUploader;
