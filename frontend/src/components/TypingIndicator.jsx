const TypingIndicator = () => (
  <div className="flex items-center gap-2 rounded-2xl rounded-bl-sm bg-slate-100 px-4 py-3 text-slate-500 dark:bg-slate-800 dark:text-slate-300">
    <span className="h-2 w-2 animate-bounce rounded-full bg-blue-500" />
    <span className="h-2 w-2 animate-bounce rounded-full bg-blue-500 [animation-delay:120ms]" />
    <span className="h-2 w-2 animate-bounce rounded-full bg-blue-500 [animation-delay:240ms]" />
  </div>
);

export default TypingIndicator;
