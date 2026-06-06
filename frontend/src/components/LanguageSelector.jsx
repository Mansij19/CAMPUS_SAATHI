const LANGUAGES = ["English", "Hindi", "Marathi", "Tamil", "Telugu", "Bengali"];

const LanguageSelector = ({ value, onChange }) => {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Preferred language</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none ring-blue-500 focus:ring-2 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
      >
        {LANGUAGES.map((lang) => (
          <option key={lang}>{lang}</option>
        ))}
      </select>
    </label>
  );
};

export default LanguageSelector;

