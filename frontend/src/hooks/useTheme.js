import { useEffect, useState } from "react";

export const useTheme = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem("campussathi_theme") || "light");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("campussathi_theme", theme);
  }, [theme]);

  return { theme, setTheme, isDark: theme === "dark" };
};
