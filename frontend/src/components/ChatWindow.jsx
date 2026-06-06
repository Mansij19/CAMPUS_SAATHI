import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble.jsx";
import TypingIndicator from "./TypingIndicator.jsx";

const ChatWindow = ({ messages, loading }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="h-[calc(100vh-17rem)] min-h-[420px] overflow-y-auto bg-slate-50 p-4 dark:bg-slate-950">
      <div className="space-y-4">
        {messages.length === 0 && (
          <div className="mx-auto mt-16 max-w-md text-center">
            <p className="text-2xl font-bold">Ask CampusSathi anything</p>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Try: “Scholarship form ki last date kya hai?”</p>
          </div>
        )}
        {messages.map((message, index) => (
          <MessageBubble key={`${message.timestamp}-${index}`} message={message} />
        ))}
        {loading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default ChatWindow;
