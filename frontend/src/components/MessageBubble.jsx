import TranslationToggle from "./TranslationToggle.jsx";

const MessageBubble = ({ message }) => {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[82%] space-y-2 rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm ${isUser ? "rounded-br-sm bg-blue-600 text-white" : "rounded-bl-sm bg-white text-slate-800 dark:bg-slate-800 dark:text-slate-100"}`}>
        <div>{message.content}</div>
        {!isUser && message.content && <TranslationToggle text={message.content} className="pt-1" />}
      </div>
    </div>
  );
};

export default MessageBubble;
