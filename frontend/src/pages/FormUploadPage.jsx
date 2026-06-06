import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/AppLayout.jsx";
import FileUploader from "../components/FileUploader.jsx";
import api from "../services/api.js";

const FormUploadPage = () => {
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
      const { data: uploadData } = await api.post("/forms/upload", body, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      const formId = uploadData.form._id || uploadData.form.id;
      const { data: analyzeData } = await api.post("/forms/analyze", { formId });
      navigate(`/forms/${formId}`, { state: { form: analyzeData.form } });
    } catch (err) {
      setError(err.response?.data?.message || "Could not upload and analyze this form.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-3xl space-y-4">
        <FileUploader title="Upload Administrative Form" onUpload={upload} loading={loading} />
        {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-200">{error}</p>}
      </div>
    </AppLayout>
  );
};

export default FormUploadPage;
