import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import AppLayout from "../components/AppLayout.jsx";
import ChatInput from "../components/ChatInput.jsx";
import ChatWindow from "../components/ChatWindow.jsx";
import api from "../services/api.js";

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/chat/history").then(({ data }) => setMessages(data.messages || [])).catch(() => setMessages([]));
  }, []);

  const send = async (content) => {
    const userMessage = { role: "user", content, timestamp: new Date().toISOString() };
    setMessages((current) => [...current, userMessage]);
    setLoading(true);
    try {
      const { data } = await api.post("/chat", { message: content });
      setMessages(data.messages);
    } catch (error) {
      console.warn("Chat request failed:", error.message);
      setMessages((current) => [
        ...current,
        { role: "assistant", content: "CampusSathi could not answer right now. Please try again shortly.", timestamp: new Date().toISOString() }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = async () => {
    await api.delete("/chat/history");
    setMessages([]);
  };

  return (
    <AppLayout>
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 border-b border-slate-200 p-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-300">AI Multilingual Helpdesk</p>
            <h1 className="mt-1 text-2xl font-black">CampusSathi Chatbot</h1>
          </div>
          <button onClick={clearHistory} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
            <Trash2 size={17} /> Clear
          </button>
        </div>
        <ChatWindow messages={messages} loading={loading} />
        <ChatInput onSend={send} disabled={loading} />
      </section>
    </AppLayout>
  );
};

export default ChatPage;
