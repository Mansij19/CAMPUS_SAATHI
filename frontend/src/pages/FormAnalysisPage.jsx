import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import AIRecommendationsPanel from "../components/AIRecommendationsPanel.jsx";
import AppLayout from "../components/AppLayout.jsx";
import FieldExplanationCard from "../components/FieldExplanationCard.jsx";
import FormSummaryCard from "../components/FormSummaryCard.jsx";
import MissingDocumentsPanel from "../components/MissingDocumentsPanel.jsx";
import api from "../services/api.js";

const recordId = (record) => record?._id || record?.id;

const FormAnalysisPage = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const [form, setForm] = useState(state?.form || null);

  useEffect(() => {
    if (form) return;
    api.get("/forms/history").then(({ data }) => {
      setForm((data.forms || []).find((item) => recordId(item) === id) || null);
    });
  }, [form, id]);

  const analysis = form?.aiAnalysis;

  return (
    <AppLayout>
      {!form ? (
        <p className="rounded-2xl border border-slate-200 bg-white p-5 text-slate-600 shadow-soft dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">Form analysis not found.</p>
      ) : (
        <div className="space-y-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-blue-600 dark:text-blue-300">Smart Form Assistant</p>
              <h1 className="text-2xl font-black">{form.title}</h1>
            </div>
            <Link to="/forms/upload" className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">Analyze another</Link>
          </div>
          <FormSummaryCard analysis={analysis} title={form.title} />
          <section className="grid gap-4 md:grid-cols-2">
            {(analysis?.fields || []).map((field) => (
              <FieldExplanationCard key={field.name} field={field} />
            ))}
          </section>
          <MissingDocumentsPanel documents={analysis?.requiredDocuments || []} missing={analysis?.missingInformation || []} />
          <AIRecommendationsPanel steps={analysis?.completionSteps || []} recommendations={analysis?.recommendations || []} />
        </div>
      )}
    </AppLayout>
  );
};

export default FormAnalysisPage;
