import { Bot, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <button
        id="chat-widget-btn"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition hover:scale-105 hover:bg-blue-700"
        aria-label="Open chat"
      >
        <Bot size={24} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="fixed bottom-24 right-6 z-50 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-center justify-between bg-blue-600 px-4 py-3 text-white">
              <div className="flex items-center gap-2">
                <Bot size={18} />
                <span className="font-semibold">CampusSathi Assistant</span>
              </div>
              <button onClick={() => setOpen(false)} className="text-blue-100 hover:text-white" aria-label="Close chat">
                <X size={16} />
              </button>
            </div>
            <div className="p-4">
              <div className="rounded-xl bg-blue-50 p-3 text-sm text-slate-700 dark:bg-blue-950/40 dark:text-slate-200">
                Hi there! I can help you with scholarships, forms, college notices, and more.
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                {["Scholarships", "Fee refund", "Hostel queries", "Exam schedule"].map((q) => (
                  <button
                    key={q}
                    onClick={() => {
                      setOpen(false);
                      navigate("/chat");
                    }}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-left font-medium text-slate-700 hover:border-blue-300 hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  >
                    {q}
                  </button>
                ))}
              </div>
              <button
                onClick={() => {
                  setOpen(false);
                  navigate("/chat");
                }}
                className="mt-4 w-full rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Open Full Chat
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ChatWidget;
