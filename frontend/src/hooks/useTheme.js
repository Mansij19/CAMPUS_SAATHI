import { useEffect, useState } from "react";

export const useTheme = () => {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("campussathi_theme") || "light";
    } catch (error) {
      console.warn("Theme storage unavailable:", error.message);
      return "light";
    }
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    try {
      localStorage.setItem("campussathi_theme", theme);
    } catch (error) {
      console.warn("Unable to persist theme:", error.message);
    }
  }, [theme]);

  return { theme, setTheme, isDark: theme === "dark" };
};
