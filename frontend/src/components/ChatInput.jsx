import { Send } from "lucide-react";
import { useState } from "react";

const ChatInput = ({ onSend, disabled }) => {
  const [message, setMessage] = useState("");

  const submit = (event) => {
    event.preventDefault();
    if (!message.trim() || disabled) return;
    onSend(message.trim());
    setMessage("");
  };

  return (
    <form onSubmit={submit} className="flex gap-3 border-t border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <input
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        placeholder="Ask about hostel, scholarship, certificates..."
        className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none ring-blue-500 focus:ring-2 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
      />
      <button disabled={disabled} type="submit" className="grid h-12 w-12 place-items-center rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60" aria-label="Send message">
        <Send size={20} />
      </button>
    </form>
  );
};

export default ChatInput;
